import Roadmap from "@/components/Roadmap";
import { finalChallengeChapter, regularChapters } from "@/lib/physics";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <Roadmap chapters={regularChapters} finalChapter={finalChallengeChapter} />
    </div>
  );
}
