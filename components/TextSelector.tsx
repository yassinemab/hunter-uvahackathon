"use client";

import { useCallback, useState } from "react";

import type { IncorrectSpan } from "@/lib/types";

type Token = { text: string; start: number; end: number; isWord: boolean };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const re = /\S+|\s+/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const value = match[0];
    const start = match.index;
    tokens.push({ text: value, start, end: start + value.length, isWord: !/^\s/.test(value) });
  }
  return tokens;
}

export default function TextSelector({
  text,
  selection,
  onChange,
  disabled = false,
  hintSpan = null,
}: {
  text: string;
  selection: IncorrectSpan | null;
  onChange: (span: IncorrectSpan | null) => void;
  disabled?: boolean;
  /** Wider "the answer is somewhere in here" overlay, shown underneath the selection highlight. */
  hintSpan?: IncorrectSpan | null;
}) {
  const [tokens] = useState(() => tokenize(text));
  const [anchor, setAnchor] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const commit = useCallback(
    (a: number, b: number) => {
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      const start = tokens[lo].start;
      const end = tokens[hi].end;
      if (selection && selection.start === start && selection.end === end) {
        onChange(null);
      } else {
        onChange({ start, end });
      }
    },
    [tokens, selection, onChange]
  );

  const handleMouseDown = (index: number) => {
    if (disabled) return;
    setAnchor(index);
    setDragging(true);
    setHover(index);
  };

  const handleMouseEnter = (index: number) => {
    if (dragging) setHover(index);
  };

  const finishDrag = useCallback(() => {
    if (disabled || anchor === null) return;
    commit(anchor, hover ?? anchor);
    setDragging(false);
    setAnchor(null);
    setHover(null);
  }, [anchor, commit, disabled, hover]);

  const previewLo = dragging && anchor !== null && hover !== null ? Math.min(anchor, hover) : null;
  const previewHi = dragging && anchor !== null && hover !== null ? Math.max(anchor, hover) : null;

  return (
    <div
      className="select-none text-lg leading-relaxed text-zinc-900 dark:text-zinc-50"
      onMouseUp={finishDrag}
      onMouseLeave={() => dragging && finishDrag()}
    >
      {tokens.map((token, i) => {
        if (!token.isWord) {
          return <span key={i}>{token.text}</span>;
        }
        const inCommitted = !!selection && token.start >= selection.start && token.end <= selection.end;
        const inPreview = previewLo !== null && previewHi !== null && i >= previewLo && i <= previewHi;
        const highlighted = inPreview || (inCommitted && !dragging);
        const inHint = !!hintSpan && token.start >= hintSpan.start && token.end <= hintSpan.end;
        return (
          <span
            key={i}
            onMouseDown={() => handleMouseDown(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            className={[
              "rounded px-0.5 transition-colors",
              disabled ? "" : "cursor-pointer",
              highlighted
                ? "bg-rose-200 dark:bg-rose-900/60"
                : inHint
                  ? "bg-amber-100 dark:bg-amber-900/40"
                  : disabled
                    ? ""
                    : "hover:bg-amber-100 dark:hover:bg-amber-900/40",
            ].join(" ")}
          >
            {token.text}
          </span>
        );
      })}
    </div>
  );
}
