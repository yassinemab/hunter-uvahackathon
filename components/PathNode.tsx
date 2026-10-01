import Image from "next/image";
import Link from "next/link";

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
  /** Static hint bubble shown regardless of progress. */
  tooltip?: string;
}) {
  const isFinal = variant === "final";

  return (
    <Link
      href={href}
      className={`forest-node${isActive ? " is-active" : ""}${isCompleted ? " is-completed" : ""}${isFinal ? " is-final" : ""}`}
      aria-label={`${label}${isCompleted ? ", completed" : ""}${isFinal ? ", final challenge" : ""}`}
      aria-current={isActive ? "step" : undefined}
    >
      <span className="forest-island" aria-hidden="true">
        <span className="forest-island-earth" />
        <span className="forest-island-grass" />
        <Image src="/forest/tree.svg" alt="" width={83} height={104} className="forest-node-tree" />
        <span className="forest-node-badge">
          {isCompleted ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : isFinal ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 4h10v4a5 5 0 0 1-10 0V4ZM7 5H4v1a4 4 0 0 0 4 4m9-5h3v1a4 4 0 0 1-4 4m-4 3v4m-3 3h6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m12 12 8-8m-4 0h4v4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </span>
        {tooltip && <span className="forest-node-tooltip">{tooltip}<span>↗</span></span>}
      </span>
      <span className="forest-node-label">{label}</span>
      {isActive && <span className="forest-node-status">Your next hunt</span>}
    </Link>
  );
}
