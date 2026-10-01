import { NextResponse } from "next/server";

import { evaluateAnswer } from "@/lib/llm";
import type { EvaluateRequest, EvaluateResponse } from "@/lib/types";

export async function POST(request: Request) {
  let body: Partial<EvaluateRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { statement, answer, attemptNumber } = body;

  if (
    !statement ||
    typeof statement.statement !== "string" ||
    typeof statement.isCorrect !== "boolean" ||
    !answer ||
    typeof answer.believesCorrect !== "boolean" ||
    typeof answer.explanation !== "string"
  ) {
    return NextResponse.json({ error: "Malformed evaluate request." }, { status: 400 });
  }

  // Older/stale clients may not send attemptNumber — default to 1 rather
  // than rejecting the request outright.
  const result = await evaluateAnswer(statement, answer, typeof attemptNumber === "number" ? attemptNumber : 1);

  const response: EvaluateResponse = result;
  return NextResponse.json(response);
}
