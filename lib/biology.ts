import type { Chapter, LearningSet, LevelWithContext } from "./types";

// Hardcoded "Biology 101" course content for the v0 demo.
//
// In a future version, `material` would be produced by parsing an uploaded
// file instead of being written by hand here. Everything downstream
// (generation, evaluation, UI) only depends on the LearningSet shape, so
// swapping the source is a matter of replacing this module.
//
// Each chapter below is built into 3 levels (Foundations / Application /
// Mastery) of increasing difficulty, except the Final Challenge, which is a
// single mixed-topic level since it already draws on every chapter.

type ChapterSeed = {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  topicCount: number;
  material: string;
  /** Stage names for each level in this chapter, in order. */
  levelStages: string[];
};

const topicSeeds: Omit<ChapterSeed, "levelStages">[] = [
  {
    id: "cell-biology",
    title: "Cell Biology",
    description: "The basic unit of life, organelles, and membranes.",
    difficulty: 1,
    topicCount: 1,
    material: `The cell is the basic structural and functional unit of all living organisms. There are two broad categories: prokaryotic cells (bacteria and archaea), which lack a membrane-bound nucleus and internal organelles, and eukaryotic cells (plants, animals, fungi, protists), which have a true nucleus enclosed by a nuclear envelope.

Inside a eukaryotic cell, the nucleus houses the cell's DNA, organized into chromosomes, and is the site of DNA replication and transcription. The mitochondria are the primary site of aerobic respiration, generating most of the cell's ATP through oxidative phosphorylation; they have their own circular DNA and a double membrane. The endoplasmic reticulum (ER) comes in two forms: rough ER, studded with ribosomes, synthesizes and folds proteins destined for secretion or membranes; smooth ER synthesizes lipids and detoxifies certain compounds. The Golgi apparatus modifies, sorts, and packages proteins and lipids received from the ER into vesicles for transport to their destinations. Lysosomes contain digestive enzymes that break down waste, debris, and worn-out organelles. Ribosomes, found free in the cytoplasm or bound to rough ER, are the site of protein synthesis (translation).

The plasma membrane surrounds every cell and is composed of a phospholipid bilayer with embedded proteins, controlling what enters and exits the cell via selective permeability. Plant cells additionally have a rigid cell wall made of cellulose, a large central vacuole for storage and turgor pressure, and chloroplasts, the site of photosynthesis. Animal cells lack a cell wall and chloroplasts.`,
  },
  {
    id: "genetics",
    title: "Genetics",
    description: "DNA, inheritance, meiosis, and Mendelian genetics.",
    difficulty: 2,
    topicCount: 1,
    material: `DNA (deoxyribonucleic acid) is a double-stranded molecule made of nucleotides, each containing a sugar, a phosphate group, and one of four nitrogenous bases: adenine (A), thymine (T), guanine (G), and cytosine (C). Adenine pairs with thymine via two hydrogen bonds, and guanine pairs with cytosine via three hydrogen bonds, giving the double helix its complementary, antiparallel structure.

Genes are segments of DNA that code for proteins or functional RNA molecules. Humans are diploid, carrying two copies of each chromosome (23 pairs, 46 total), one inherited from each parent. Gametes (sperm and egg) are haploid, containing only 23 chromosomes, produced through meiosis, a two-round cell division (meiosis I and meiosis II) that halves the chromosome number and shuffles genetic material via crossing over and independent assortment. During meiosis I, homologous chromosomes pair up and separate during anaphase I, while sister chromatids remain joined; sister chromatids only separate during anaphase II.

Gregor Mendel's experiments with pea plants established the basic laws of inheritance. Alleles are alternative versions of a gene; a dominant allele masks the effect of a recessive allele when both are present in a heterozygous individual. A Punnett square predicts the probability of offspring genotypes from a given cross. Genotype refers to an organism's genetic makeup, while phenotype refers to its observable traits. Mutations are changes in the DNA sequence and are the ultimate source of new genetic variation.`,
  },
  {
    id: "evolution",
    title: "Evolution",
    description: "Natural selection, adaptation, and speciation.",
    difficulty: 3,
    topicCount: 1,
    material: `Evolution is the change in heritable characteristics of populations over successive generations. Charles Darwin proposed natural selection as the primary mechanism: individuals with heritable traits better suited to their environment tend to survive and reproduce more successfully, passing those traits to the next generation. Natural selection acts on existing variation within a population; it does not create new traits on demand, and it acts on populations, not individuals, over many generations.

Variation within a population arises from mutation, recombination during sexual reproduction, and gene flow between populations. Genetic drift is a separate mechanism of evolutionary change caused by random chance, which has a particularly strong effect in small populations and does not require a trait to be beneficial.

An adaptation is a heritable trait that increases an organism's fitness, defined as its relative reproductive success, in a given environment. Convergent evolution occurs when unrelated species independently evolve similar traits because they face similar environmental pressures, such as the wings of bats and birds. Speciation is the process by which one species splits into two or more distinct species, often beginning with reproductive isolation between populations, for example when a geographic barrier like a mountain range or river separates them (allopatric speciation). Over enough generations, accumulated genetic differences can make the populations unable to interbreed even if reunited.`,
  },
  {
    id: "cellular-respiration",
    title: "Cellular Respiration",
    description: "Glycolysis, the Krebs cycle, and the electron transport chain.",
    difficulty: 4,
    topicCount: 1,
    material: `Cellular respiration is the process by which cells break down glucose to produce ATP, the cell's main energy currency. It consists of three main stages: glycolysis, the citric acid cycle (also called the Krebs cycle), and oxidative phosphorylation via the electron transport chain.

Glycolysis occurs in the cytoplasm and does not require oxygen. It splits one molecule of glucose (a six-carbon sugar) into two molecules of pyruvate, yielding a net gain of 2 ATP and 2 NADH per glucose molecule. If oxygen is available, pyruvate is transported into the mitochondrial matrix, converted into acetyl-CoA, and enters the citric acid cycle, which produces additional NADH, FADH2, and a small amount of ATP, while releasing carbon dioxide as a byproduct.

The electron transport chain (ETC) is located in the inner mitochondrial membrane. NADH and FADH2 donate electrons to protein complexes in the ETC, and as electrons move through the chain, energy is released and used to pump hydrogen ions (protons) from the mitochondrial matrix into the intermembrane space, creating an electrochemical gradient. Oxygen serves as the final electron acceptor, combining with electrons and protons to form water; this is why the process is called aerobic respiration. The proton gradient drives ATP synthase, which allows protons to flow back into the matrix and uses that energy to synthesize ATP, a process called chemiosmosis. In total, aerobic respiration of one glucose molecule yields roughly 30-32 ATP, far more than glycolysis alone. In the absence of oxygen, cells instead rely on fermentation, which regenerates NAD+ but produces far less ATP.`,
  },
  {
    id: "photosynthesis",
    title: "Photosynthesis",
    description: "Light reactions, the Calvin cycle, and chloroplast structure.",
    difficulty: 5,
    topicCount: 1,
    material: `Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. It takes place in the chloroplast, an organelle found in plant and algal cells that contains a green pigment called chlorophyll, which absorbs light most strongly in the blue and red wavelengths and reflects green light.

Photosynthesis has two main stages. The light-dependent reactions occur in the thylakoid membranes inside the chloroplast. Here, chlorophyll absorbs light energy, which is used to split water molecules (photolysis), releasing oxygen as a byproduct, and to generate ATP and NADPH. Electrons move through an electron transport chain embedded in the thylakoid membrane, and a proton gradient across the thylakoid membrane drives ATP synthase to produce ATP, similar in principle to the electron transport chain in mitochondria.

The second stage, the Calvin cycle (light-independent reactions), takes place in the stroma, the fluid-filled space surrounding the thylakoids. The Calvin cycle does not directly require light, but depends on the ATP and NADPH produced during the light reactions. It uses carbon dioxide from the atmosphere and, through a series of enzyme-catalyzed steps involving the enzyme RuBisCO, fixes carbon into organic molecules, ultimately producing glyceraldehyde-3-phosphate (G3P), which the plant uses to build glucose and other organic compounds.

The overall equation for photosynthesis is: 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2. Photosynthesis and cellular respiration are complementary processes: respiration consumes the oxygen and glucose that photosynthesis produces, and produces the carbon dioxide and water that photosynthesis consumes.`,
  },
  {
    id: "human-biology",
    title: "Human Biology",
    description: "Major organ systems: circulatory, respiratory, and nervous.",
    difficulty: 6,
    topicCount: 1,
    material: `The human circulatory system is powered by the heart, a four-chambered muscular organ with two atria and two ventricles. Deoxygenated blood returns from the body to the right atrium, flows into the right ventricle, and is pumped to the lungs via the pulmonary artery to be oxygenated. Oxygenated blood returns from the lungs to the left atrium via the pulmonary veins, flows into the left ventricle, and is pumped out to the body through the aorta. The left ventricle has thicker, more muscular walls than the right ventricle because it must generate enough pressure to pump blood through the entire systemic circulation, not just the shorter pulmonary circuit.

The respiratory system exchanges oxygen and carbon dioxide between the air and the blood. Air travels through the trachea into the bronchi, then into progressively smaller bronchioles, ending in tiny air sacs called alveoli, where gas exchange occurs across a thin membrane with surrounding capillaries. Oxygen diffuses from the alveoli into the blood, while carbon dioxide diffuses from the blood into the alveoli to be exhaled.

The nervous system is organized into the central nervous system (brain and spinal cord) and the peripheral nervous system (nerves extending throughout the body). Neurons communicate via electrical signals called action potentials, which travel down the axon, and chemical signals called neurotransmitters, which cross the synapse to the next neuron. The brain's cerebrum, divided into left and right hemispheres, is responsible for higher-order functions like reasoning and voluntary movement, while the cerebellum coordinates balance and fine motor control, and the brainstem regulates involuntary functions like breathing and heart rate.`,
  },
  {
    id: "ecology",
    title: "Ecology",
    description: "Ecosystems, food webs, and energy flow.",
    difficulty: 7,
    topicCount: 1,
    material: `Ecology is the study of interactions between organisms and their environment. An ecosystem consists of a biological community (all the organisms living in an area) together with the abiotic, non-living factors such as sunlight, water, and soil with which they interact.

Energy flows through an ecosystem in one direction, entering primarily as sunlight. Producers (autotrophs), such as plants and algae, convert this light energy into chemical energy through photosynthesis. Primary consumers (herbivores) eat producers, secondary consumers (carnivores or omnivores) eat primary consumers, and tertiary consumers sit even higher on the food chain. Decomposers, such as fungi and bacteria, break down dead organic matter, recycling nutrients like nitrogen and carbon back into the ecosystem so producers can use them again. Unlike energy, matter is recycled within ecosystems rather than flowing in one direction.

A key feature of energy flow is that only about 10% of the energy available at one trophic level is typically transferred to the next trophic level; the rest is lost mostly as heat through cellular respiration and metabolic processes. This is why food chains rarely extend beyond four or five trophic levels and why there is far more producer biomass than top-predator biomass in most ecosystems, a pattern often illustrated with an energy pyramid.

Species interact in several characteristic ways: competition (two species vying for the same limited resource), predation (one species consumes another), mutualism (both species benefit, such as bees pollinating flowers), and parasitism (one species benefits at the other's expense). A population's carrying capacity is the maximum population size an environment can sustain indefinitely given its available resources.`,
  },
];

export const finalChallengeId = "final-challenge";

const LEVEL_STAGES = ["Foundations", "Application", "Mastery"];

const chapterSeeds: ChapterSeed[] = [
  ...topicSeeds.map((seed) => ({ ...seed, levelStages: LEVEL_STAGES })),
  {
    id: finalChallengeId,
    title: "Final Challenge — Mixed Biology",
    description: "Statements drawing on every topic in Biology 101.",
    difficulty: 8,
    topicCount: topicSeeds.length,
    material: topicSeeds.map((t) => `## ${t.title}\n${t.material}`).join("\n\n"),
    // Already mixes every chapter, so it's a single level rather than 3.
    levelStages: ["Final Challenge"],
  },
];

function buildChapter(seed: ChapterSeed): Chapter {
  const levels: LearningSet[] = seed.levelStages.map((stage, i) => ({
    id: `${seed.id}-${i + 1}`,
    title: stage,
    description: `${seed.title} · ${stage}`,
    difficulty: Math.min(8, seed.difficulty + i),
    topicCount: seed.topicCount,
    material: seed.material,
  }));

  return {
    id: seed.id,
    title: seed.title,
    description: seed.description,
    difficulty: seed.difficulty,
    topicCount: seed.topicCount,
    levels,
  };
}

export const chapters: Chapter[] = chapterSeeds.map(buildChapter);

export const regularChapters: Chapter[] = chapters.filter((c) => c.id !== finalChallengeId);

export const finalChallengeChapter: Chapter = chapters.find((c) => c.id === finalChallengeId)!;

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function getLevel(id: string): LevelWithContext | undefined {
  for (const chapter of chapters) {
    const index = chapter.levels.findIndex((l) => l.id === id);
    if (index !== -1) {
      return {
        ...chapter.levels[index],
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        levelIndex: index + 1,
        levelCount: chapter.levels.length,
      };
    }
  }
  return undefined;
}
