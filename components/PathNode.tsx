import Link from "next/link";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={3}>
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        d="M12 3.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.2 6.1-.6L12 3.5z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrophyIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        d="M7 4h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M7 5H4v1a4 4 0 0 0 4 4M17 5h3v1a4 4 0 0 1-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13v3M9 20h6M10 20v-3.5a2 2 0 0 1 4 0V20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PathNode({
  href,
  label,
  isCompleted,
  isActive,
  variant = "default",
  tooltip,
}: {
  href: string;
  label: string;
  isCompleted: boolean;
  isActive: boolean;
  variant?: "default" | "final";
  /** Static hint bubble, always shown regardless of progress (e.g. "Jump in here"). */
  tooltip?: string;
}) {
  const isFinal = variant === "final";

  return (
    <Link href={href} className="group flex flex-col items-center gap-2">
      <span
        className={`relative flex items-center justify-center rounded-full border-4 shadow-sm transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0 ${
          isFinal ? "h-20 w-20" : "h-16 w-16"
        } ${
          isCompleted
            ? "border-emerald-200 bg-emerald-500 text-white dark:border-emerald-900"
            : isActive
              ? isFinal
                ? "border-amber-200 bg-amber-500 text-white dark:border-amber-900"
                : "border-brand-200 bg-brand-600 text-white dark:border-brand-900"
              : "border-zinc-200 bg-white text-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-700"
        }`}
      >
        {isCompleted ? <CheckIcon /> : isFinal ? <TrophyIcon filled={isActive} /> : <StarIcon filled={isActive} />}
        {tooltip && (
          <span className="absolute left-full top-1/2 ml-3 flex -translate-y-1/2 items-center">
            <span className="-mr-1.5 h-2 w-2 shrink-0 rotate-45 bg-zinc-900 dark:bg-zinc-50" />
            <span className="whitespace-nowrap rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white shadow-sm dark:bg-zinc-50 dark:text-zinc-900">
              {tooltip}
            </span>
          </span>
        )}
      </span>
      <span
        className={`max-w-[7rem] text-center text-xs font-medium ${
          isCompleted || isActive
            ? "text-zinc-600 dark:text-zinc-300"
            : "text-zinc-400 dark:text-zinc-600"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
