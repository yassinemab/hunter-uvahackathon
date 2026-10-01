import { NextResponse } from "next/server";

import { getLevel } from "@/lib/biology";
import { generateStatements } from "@/lib/llm";
import type { GenerateRequest, GenerateResponse } from "@/lib/types";

export async function POST(request: Request) {
  let body: Partial<GenerateRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body.levelId !== "string") {
    return NextResponse.json({ error: "levelId is required." }, { status: 400 });
  }

  const level = getLevel(body.levelId);
  if (!level) {
    return NextResponse.json({ error: "Unknown levelId." }, { status: 404 });
  }

  const statements = await generateStatements(level);

  const response: GenerateResponse = { statements };
  return NextResponse.json(response);
}
