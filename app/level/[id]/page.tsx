import { notFound } from "next/navigation";

import { getLevel } from "@/lib/biology";

import LevelExperience from "./LevelExperience";

export default async function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const level = getLevel(id);

  if (!level) {
    notFound();
  }

  return <LevelExperience level={level} />;
}
