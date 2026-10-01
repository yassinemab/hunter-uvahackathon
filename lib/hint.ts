import type { IncorrectSpan } from "./types";

const CLAUSE_BOUNDARY = /[.,;:]/;

/**
 * Widens an exact mistake span out to the enclosing clause (bounded by the
 * nearest comma/period/semicolon/colon on either side). Used for the manual
 * "show me where" hint button — it should narrow the student's search
 * without just handing them the exact words that are wrong.
 */
export function computeHintSpan(statement: string, span: IncorrectSpan): IncorrectSpan {
  let start = 0;
  for (let i = span.start - 1; i >= 0; i--) {
    if (CLAUSE_BOUNDARY.test(statement[i])) {
      start = i + 1;
      break;
    }
  }
  while (start < span.start && /\s/.test(statement[start])) {
    start += 1;
  }

  let end = statement.length;
  for (let i = span.end; i < statement.length; i++) {
    if (CLAUSE_BOUNDARY.test(statement[i])) {
      end = i;
      break;
    }
  }

  return { start, end };
}
