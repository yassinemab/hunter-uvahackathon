import Roadmap from "@/components/Roadmap";
import { finalChallengeChapter, regularChapters } from "@/lib/physics";

export default function Home() {
  return (
    <div className="forest-page flex flex-1 flex-col">
      <Roadmap chapters={regularChapters} finalChapter={finalChallengeChapter} />
    </div>
  );
}
