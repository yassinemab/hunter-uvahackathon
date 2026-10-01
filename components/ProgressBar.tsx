export default function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5" aria-label={`Question ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < current ? "bg-brand-500" : "bg-zinc-200 dark:bg-zinc-800"
          }`}
        />
      ))}
    </div>
  );
}
