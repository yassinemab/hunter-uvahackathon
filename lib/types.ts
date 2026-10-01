// Shared types for Mistake Hunter.
//
// A LearningSet currently maps 1:1 to a hardcoded topic in lib/physics.ts,
// but is shaped so that it can later be produced by parsing an uploaded
// PDF/notes/slides instead.

export type LearningSet = {
  id: string
  title: string
  description: string
  material: string
  /** 1 (easiest) - 8 (hardest). Drives subtlety of generated mistakes. */
  difficulty: number
  /** Number of underlying topics this set draws from (>1 for mixed/final sets). */
  topicCount: number
}

/** A chapter in the roadmap (e.g. "Genetics"), containing an ordered set of levels. */
export type Chapter = {
  id: string
  title: string
  description: string
  /** 1 (easiest) - 8 (hardest). Drives the chapter card's difficulty badge. */
  difficulty: number
  topicCount: number
  levels: LearningSet[]
}

/** A single level, enriched with its parent chapter's context for breadcrumbs/navigation. */
export type LevelWithContext = LearningSet & {
  chapterId: string
  chapterTitle: string
  levelIndex: number
  levelCount: number
}

export type IncorrectSpan = {
  /** Inclusive character index into `statement`, 0-indexed. */
  start: number
  /** Exclusive character index into `statement`, 0-indexed. */
  end: number
}

export type GeneratedStatement = {
  id: string
  statement: string
  isCorrect: boolean
  /** Present only when isCorrect is false. */
  incorrectSpan?: IncorrectSpan
  /** Ground-truth explanation of why the statement is right/wrong. */
  explanation: string
  /** The snippet of study material most relevant to this statement. */
  relevantMaterial: string
}

export type StudentAnswer = {
  believesCorrect: boolean
  selectedSpan?: IncorrectSpan
  selectedText?: string
  explanation: string
}

export type EvaluationResult = {
  correct: boolean
  selectedCorrectPart: boolean
  explanationCorrect: boolean
  feedback: string
  missingKnowledge?: string
}

export type GenerateRequest = {
  levelId: string
}

export type GenerateResponse = {
  statements: GeneratedStatement[]
}

export type EvaluateRequest = {
  statement: GeneratedStatement
  answer: StudentAnswer
  /** Which attempt (1-3) this submission is, for scaling hint specificity. */
  attemptNumber: number
}

export type EvaluateResponse = EvaluationResult
