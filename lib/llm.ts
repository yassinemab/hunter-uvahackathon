import { MAX_ATTEMPTS } from "./constants";
import { getFallbackStatements } from "./fallback";
import type {
  EvaluationResult,
  GeneratedStatement,
  IncorrectSpan,
  LevelWithContext,
  StudentAnswer,
} from "./types";

// All model interaction is isolated to this module. Routes call
// generateStatements() / evaluateAnswer() and never touch the Hugging Face
// API directly. Both functions are guaranteed to resolve (never reject) —
// on any failure (missing token, network error, malformed output) they fall
// back to deterministic content so the demo never gets stuck.

const HF_MODEL = process.env.HF_MODEL || "meta-llama/Llama-3.2-3B-Instruct";
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

type ChatMessage = { role: "system" | "user"; content: string };

async function callModel(messages: ChatMessage[], timeoutMs: number): Promise<string> {
  const token = process.env.HF_TOKEN;
  if (!token) {
    throw new Error("HF_TOKEN is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1200,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HF inference failed with status ${res.status}: ${text.slice(0, 300)}`);
    }

    const data = await res.json();
    const content: unknown = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || content.trim().length === 0) {
      throw new Error("HF inference returned an empty response.");
    }
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

/** Pulls a JSON value out of a model response, tolerating markdown fences and leading/trailing prose. */
function extractJson(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;

  try {
    return JSON.parse(candidate);
  } catch {
    // Fall through to brace/bracket scanning.
  }

  const firstObj = candidate.indexOf("{");
  const firstArr = candidate.indexOf("[");
  const starts = [firstObj, firstArr].filter((i) => i !== -1);
  if (starts.length === 0) {
    throw new Error("No JSON object or array found in model output.");
  }
  const start = Math.min(...starts);
  const isArray = candidate[start] === "[";
  const end = candidate.lastIndexOf(isArray ? "]" : "}");
  if (end === -1 || end <= start) {
    throw new Error("Unbalanced JSON in model output.");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

function difficultyGuidance(difficulty: number): string {
  if (difficulty <= 2) {
    return "The mistake can be fairly clear once you know the material, but should not be absurd or obviously wrong at a glance.";
  }
  if (difficulty <= 5) {
    return "The mistake should be moderately subtle: a single swapped term, location, or direction that a student who skimmed the material could easily miss.";
  }
  return "The mistake must be very subtle: a small but consequential detail (e.g. a swapped number, direction, or location) that only someone with a solid understanding would catch. Avoid anything a surface-level reading would catch.";
}

type RawStatement = {
  statement?: unknown;
  isCorrect?: unknown;
  incorrectText?: unknown;
  explanation?: unknown;
  relevantMaterial?: unknown;
};

function validateStatement(raw: RawStatement): GeneratedStatement {
  if (typeof raw.statement !== "string" || raw.statement.trim().length === 0) {
    throw new Error("Statement missing text.");
  }
  if (typeof raw.isCorrect !== "boolean") {
    throw new Error("Statement missing isCorrect boolean.");
  }
  if (typeof raw.explanation !== "string" || raw.explanation.trim().length === 0) {
    throw new Error("Statement missing explanation.");
  }
  if (typeof raw.relevantMaterial !== "string" || raw.relevantMaterial.trim().length === 0) {
    throw new Error("Statement missing relevantMaterial.");
  }

  let incorrectSpan: IncorrectSpan | undefined;
  if (!raw.isCorrect) {
    if (typeof raw.incorrectText !== "string" || raw.incorrectText.trim().length === 0) {
      throw new Error("Incorrect statement missing incorrectText.");
    }
    const start = raw.statement.indexOf(raw.incorrectText);
    if (start === -1) {
      throw new Error("incorrectText does not appear verbatim in statement.");
    }
    incorrectSpan = { start, end: start + raw.incorrectText.length };
  }

  return {
    id: crypto.randomUUID(),
    statement: raw.statement,
    isCorrect: raw.isCorrect,
    incorrectSpan,
    explanation: raw.explanation,
    relevantMaterial: raw.relevantMaterial,
  };
}

export async function generateStatements(level: LevelWithContext): Promise<GeneratedStatement[]> {
  try {
    const systemPrompt = `You are an exam-writing assistant for a biology learning game called Mistake Hunter, in the "two truths and a lie" format. Students must find the one false statement among three. You MUST respond with ONLY valid JSON, no prose, no markdown fences.`;

    const userPrompt = `Study material (topic: "${level.chapterTitle}", level ${level.levelIndex} of ${level.levelCount}: "${level.title}"):
"""
${level.material}
"""

Write exactly 3 standalone statements about this material, each 1-2 sentences long.

Exactly 2 of the 3 statements must be entirely correct — fully accurate and directly supported by the study material above. Do not introduce any inaccuracy into these, even a minor one.

Exactly 1 of the 3 statements must contain a deliberate factual mistake. CRITICAL rules for this one statement:
- Do not simply paraphrase or reproduce the source material. Start from a real claim in the source and deliberately ALTER one specific detail (e.g. a number, location, direction, cause, or term) so the statement directly CONTRADICTS the study material.
- Exactly one claim in the statement must be wrong. Do not introduce a second error — every other detail in the statement must remain accurate.
- The mistake must be clearly identifiable and directly supported by the source: i.e. the study material must make it unambiguous what the correct fact is.

Difficulty level: ${level.difficulty}/8. ${difficultyGuidance(level.difficulty)}

Before you respond, verify the incorrect statement against the study material:
(1) Is the statement factually wrong according to the source? It must be — not merely different wording.
(2) Is exactly one claim wrong, with everything else in the statement accurate?
(3) Is the correct version of that claim directly stated or clearly supported by the source material?
If any check fails, revise the statement until all three hold.

For each of the 3 statements, respond with an object with these exact fields:
- "statement": the statement text (string)
- "isCorrect": true or false
- "incorrectText": ONLY on the one false statement — the exact substring of "statement" (copied character-for-character) that contains the mistake. Keep it as short as possible while still covering the wrong part (usually a few words). Omit this field entirely on the 2 correct statements.
- "explanation": the ground-truth explanation. On the false statement, explain what's wrong and state the correct fact, quoting or pointing to the source. On correct statements, briefly explain why it's correct.
- "relevantMaterial": the sentence(s) from the study material above that directly support the correct fact, copied or closely paraphrased.

Respond with ONLY a JSON object of the form {"statements": [ ... 3 objects ... ]}. No other text.`;

    const raw = await callModel(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      30000
    );

    const parsed = extractJson(raw) as { statements?: unknown } | unknown[];
    const list: unknown = Array.isArray(parsed) ? parsed : (parsed as { statements?: unknown }).statements;

    if (!Array.isArray(list) || list.length < 3) {
      throw new Error("Model did not return 3 statements.");
    }

    const statements = list.slice(0, 3).map((item) => validateStatement(item as RawStatement));

    const incorrectCount = statements.filter((s) => !s.isCorrect).length;
    if (incorrectCount !== 1) {
      // Must be exactly one false statement per challenge — anything else is a soft failure.
      throw new Error("Model did not return exactly one incorrect statement.");
    }

    return statements;
  } catch {
    // Fallback content is deterministic per chapter (shared across that
    // chapter's levels) rather than per level — it's a reliability net, not
    // the primary content path, so a little repetition across a chapter's
    // 3 levels in the rare all-fallback case is an acceptable trade-off.
    return getFallbackStatements(level.chapterId);
  }
}

function overlapRatio(a?: IncorrectSpan, b?: IncorrectSpan): number {
  if (!a || !b) return 0;
  const start = Math.max(a.start, b.start);
  const end = Math.min(a.end, b.end);
  const intersection = Math.max(0, end - start);
  const union = Math.max(a.end, b.end) - Math.min(a.start, b.start);
  return union === 0 ? 0 : intersection / union;
}

const CORRECT_STATEMENT_HINTS = [
  "Actually, this statement is correct as written. Double-check — are you sure something here is wrong?",
  "Still correct! Re-read it slowly, clause by clause, and compare each detail to what you studied.",
  "This one really is fully accurate. Sometimes there's no mistake to find — trust what you know.",
];

const WRONG_PART_HINTS = [
  "Not quite — the part you selected isn't the issue. Think about which specific claim might be off.",
  "Still not it. Focus on concrete details — a number, a location, a direction — one of them doesn't match the material.",
  "Getting warmer in spirit, but that's not the spot. Go clause by clause and check each detail against what you learned.",
];

const RIGHT_PART_WEAK_EXPLANATION_HINTS = [
  "You're pointing at the right part of the statement — now explain specifically why it's wrong.",
  "You've found the right spot again. Try naming the correct fact it should say instead.",
  "Right part, but your explanation still needs to say what the correct fact actually is.",
];

function fallbackEvaluate(
  statement: GeneratedStatement,
  answer: StudentAnswer,
  overlap: number,
  attemptNumber: number
): EvaluationResult {
  const hasSubstantiveExplanation = answer.explanation.trim().length >= 12;
  const tier = Math.min(Math.max(attemptNumber, 1), MAX_ATTEMPTS) - 1;

  if (statement.isCorrect) {
    const correct = answer.believesCorrect && hasSubstantiveExplanation;
    return {
      correct,
      selectedCorrectPart: answer.believesCorrect,
      explanationCorrect: hasSubstantiveExplanation,
      feedback: correct
        ? "Nice — this statement is indeed correct, and your reasoning holds up."
        : answer.believesCorrect
          ? "You're right that this statement is correct, but try explaining your reasoning in a bit more detail."
          : CORRECT_STATEMENT_HINTS[tier],
      missingKnowledge: undefined,
    };
  }

  const selectedCorrectPart = overlap > 0.2;
  const correct = selectedCorrectPart && hasSubstantiveExplanation;
  return {
    correct,
    selectedCorrectPart,
    explanationCorrect: correct,
    feedback: correct
      ? "Correct — you found the mistake and your explanation makes sense."
      : selectedCorrectPart
        ? RIGHT_PART_WEAK_EXPLANATION_HINTS[tier]
        : WRONG_PART_HINTS[tier],
    missingKnowledge: undefined,
  };
}

type RawEvaluation = {
  correct?: unknown;
  selectedCorrectPart?: unknown;
  explanationCorrect?: unknown;
  feedback?: unknown;
  missingKnowledge?: unknown;
};

function validateEvaluation(raw: RawEvaluation): EvaluationResult {
  if (
    typeof raw.correct !== "boolean" ||
    typeof raw.selectedCorrectPart !== "boolean" ||
    typeof raw.explanationCorrect !== "boolean" ||
    typeof raw.feedback !== "string" ||
    raw.feedback.trim().length === 0
  ) {
    throw new Error("Malformed evaluation object.");
  }
  return {
    correct: raw.correct,
    selectedCorrectPart: raw.selectedCorrectPart,
    explanationCorrect: raw.explanationCorrect,
    feedback: raw.feedback,
    missingKnowledge:
      typeof raw.missingKnowledge === "string" && raw.missingKnowledge.trim().length > 0
        ? raw.missingKnowledge
        : undefined,
  };
}

export async function evaluateAnswer(
  statement: GeneratedStatement,
  answer: StudentAnswer,
  attemptNumber: number
): Promise<EvaluationResult> {
  const overlap = overlapRatio(statement.incorrectSpan, answer.selectedSpan);
  const clampedAttempt = Math.min(Math.max(attemptNumber, 1), MAX_ATTEMPTS);

  try {
    const systemPrompt = `You are a friendly, encouraging biology tutor grading a student's attempt to spot a mistake in an AI-generated statement. You MUST respond with ONLY valid JSON, no prose, no markdown fences. Be forgiving about exact wording — judge whether the student's reasoning demonstrates real understanding, not whether they used the same words as the ground truth.`;

    const userPrompt = `Statement shown to the student: "${statement.statement}"

Ground truth: this statement is ${statement.isCorrect ? "CORRECT (no mistake)." : "INCORRECT."}
${
  !statement.isCorrect && statement.incorrectSpan
    ? `The actual mistake is this part: "${statement.statement.slice(statement.incorrectSpan.start, statement.incorrectSpan.end)}"`
    : ""
}
Ground-truth explanation: "${statement.explanation}"
Relevant study material: "${statement.relevantMaterial}"

Student's answer:
- Believes the statement is correct: ${answer.believesCorrect}
${answer.selectedText ? `- Text the student selected as the mistake: "${answer.selectedText}"` : "- The student did not select any text."}
- Student's explanation: "${answer.explanation}"
- Automatic text-overlap check between student's selection and the actual mistake: ${Math.round(overlap * 100)}% (use this as a hint, not as ground truth — it can be noisy, e.g. because the student selected a few extra words)
- This is attempt ${clampedAttempt} of ${MAX_ATTEMPTS} on this specific statement.

Evaluate the student's answer and respond with ONLY a JSON object with these exact fields:
- "correct": true/false — overall, did the student succeed? They must have both identified the right part of the statement (or correctly said it's fully correct) AND given reasoning that shows real understanding of why.
- "selectedCorrectPart": true/false — did they point at (or correctly affirm) the right thing?
- "explanationCorrect": true/false — does their explanation demonstrate correct understanding, even if worded differently from the ground truth?
- "feedback": 1-3 sentences of feedback in a friendly, encouraging tone, written directly to the student.
  - If correct: confirm what they got right, giving the full ground-truth explanation.
  - If incorrect: give a useful HINT that nudges them in the right direction WITHOUT fully revealing the answer and WITHOUT stating the ground-truth explanation verbatim. Scale how direct the hint is to the attempt number:
    - Attempt 1: a gentle, general nudge toward the right area or concept.
    - Attempt 2: narrow it down — name the *kind* of error (e.g. a swapped number, direction, or location) without naming the specific correct fact.
    - Attempt 3: be quite direct about where to look and what category of detail is wrong, but still stop short of literally stating the correction.
- "missingKnowledge": OPTIONAL. Only include if correct is true AND there's something small and important their explanation didn't mention. 1 short sentence. Omit the field entirely otherwise.

Respond with ONLY the JSON object.`;

    const raw = await callModel(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      20000
    );

    const parsed = extractJson(raw);
    return validateEvaluation(parsed as RawEvaluation);
  } catch {
    return fallbackEvaluate(statement, answer, overlap, clampedAttempt);
  }
}
