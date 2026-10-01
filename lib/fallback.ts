import { finalChallengeId } from "./biology";
import type { GeneratedStatement } from "./types";

// Deterministic fallback content, used automatically whenever the LLM call
// in lib/llm.ts fails or returns something we can't parse. Follows the exact
// same schema as model-generated statements so the UI never has to know the
// difference.
//
// `mistakePhrase` must appear verbatim (once) in `statement` — the exact
// character span is derived at runtime via indexOf rather than hand-counted,
// so these stay correct even if the wording above them shifts.

type StatementSeed = {
  statement: string;
  isCorrect: boolean;
  mistakePhrase?: string;
  explanation: string;
  relevantMaterial: string;
};

const seeds: Record<string, StatementSeed[]> = {
  "cell-biology": [
    {
      statement:
        "Mitochondria are the primary site of aerobic respiration, generating most of the cell's ATP through oxidative phosphorylation.",
      isCorrect: true,
      explanation:
        "This is correct. Mitochondria have a double membrane and their own DNA, and are where most ATP is produced via oxidative phosphorylation.",
      relevantMaterial:
        "The mitochondria are the primary site of aerobic respiration, generating most of the cell's ATP through oxidative phosphorylation.",
    },
    {
      statement:
        "The nucleus is surrounded by a double membrane and serves as the main site of protein synthesis in the cell.",
      isCorrect: false,
      mistakePhrase: "protein synthesis",
      explanation:
        "The nucleus is the site of DNA replication and transcription, not protein synthesis. Protein synthesis (translation) happens at ribosomes, either free in the cytoplasm or on the rough endoplasmic reticulum.",
      relevantMaterial:
        "The nucleus houses the cell's DNA... and is the site of DNA replication and transcription. Ribosomes... are the site of protein synthesis (translation).",
    },
    {
      statement:
        "The Golgi apparatus modifies, sorts, and packages proteins and lipids received from the endoplasmic reticulum into vesicles for transport.",
      isCorrect: true,
      explanation:
        "Correct. The Golgi apparatus receives proteins and lipids from the ER and packages them into vesicles for transport to their destinations.",
      relevantMaterial:
        "The Golgi apparatus modifies, sorts, and packages proteins and lipids received from the ER into vesicles for transport to their destinations.",
    },
  ],
  genetics: [
    {
      statement:
        "During meiosis, homologous chromosomes separate during anaphase I, while sister chromatids remain joined until anaphase II.",
      isCorrect: true,
      explanation:
        "Correct. Homologous chromosomes separate in anaphase I; sister chromatids stay joined until they separate in anaphase II.",
      relevantMaterial:
        "During meiosis I, homologous chromosomes pair up and separate during anaphase I... sister chromatids only separate during anaphase II.",
    },
    {
      statement:
        "Guanine pairs with cytosine via two hydrogen bonds, while adenine pairs with thymine via three hydrogen bonds.",
      isCorrect: false,
      mistakePhrase: "two hydrogen bonds",
      explanation:
        "This reverses the bond counts. Guanine and cytosine actually form three hydrogen bonds, while adenine and thymine form two.",
      relevantMaterial:
        "Adenine pairs with thymine via two hydrogen bonds, and guanine pairs with cytosine via three hydrogen bonds.",
    },
    {
      statement:
        "Humans are diploid organisms whose gametes are produced through meiosis, resulting in haploid sperm and egg cells that each carry 23 chromosomes.",
      isCorrect: true,
      explanation:
        "Correct. Humans are diploid (46 chromosomes), and meiosis produces haploid gametes with 23 chromosomes each.",
      relevantMaterial:
        "Humans are diploid, carrying two copies of each chromosome (23 pairs, 46 total)... Gametes... are haploid, containing only 23 chromosomes, produced through meiosis.",
    },
  ],
  evolution: [
    {
      statement:
        "Natural selection acts on existing variation within a population and does not create new traits on demand.",
      isCorrect: true,
      explanation:
        "Correct. Natural selection works on variation that already exists in a population rather than generating new traits as needed.",
      relevantMaterial:
        "Natural selection acts on existing variation within a population; it does not create new traits on demand.",
    },
    {
      statement:
        "Genetic drift is a mechanism of evolutionary change that requires a trait to be beneficial in order to spread through a population.",
      isCorrect: false,
      mistakePhrase: "requires a trait to be beneficial in order to spread through a population",
      explanation:
        "Genetic drift is driven by random chance, not by whether a trait is beneficial. It has an especially strong effect in small populations regardless of fitness.",
      relevantMaterial:
        "Genetic drift is a separate mechanism of evolutionary change caused by random chance, which has a particularly strong effect in small populations and does not require a trait to be beneficial.",
    },
    {
      statement:
        "Convergent evolution occurs when unrelated species independently evolve similar traits because they face similar environmental pressures.",
      isCorrect: true,
      explanation:
        "Correct. Convergent evolution describes unrelated species independently evolving similar traits under similar pressures, like bat and bird wings.",
      relevantMaterial:
        "Convergent evolution occurs when unrelated species independently evolve similar traits because they face similar environmental pressures, such as the wings of bats and birds.",
    },
  ],
  "cellular-respiration": [
    {
      statement:
        "Glycolysis takes place in the cytoplasm and splits one glucose molecule into two pyruvate molecules without requiring oxygen.",
      isCorrect: true,
      explanation:
        "Correct. Glycolysis is an anaerobic process that occurs in the cytoplasm and converts one glucose into two pyruvate molecules.",
      relevantMaterial:
        "Glycolysis occurs in the cytoplasm and does not require oxygen. It splits one molecule of glucose... into two molecules of pyruvate.",
    },
    {
      statement:
        "The electron transport chain is located in the inner mitochondrial membrane, where oxygen acts as the final electron acceptor, combining with electrons and protons to form carbon dioxide.",
      isCorrect: false,
      mistakePhrase: "carbon dioxide",
      explanation:
        "Oxygen combines with electrons and protons at the end of the electron transport chain to form water, not carbon dioxide. CO2 is released earlier, during the citric acid cycle.",
      relevantMaterial:
        "Oxygen serves as the final electron acceptor, combining with electrons and protons to form water; this is why the process is called aerobic respiration.",
    },
    {
      statement:
        "Aerobic respiration of one glucose molecule yields roughly 30-32 ATP in total, far more than glycolysis alone produces.",
      isCorrect: true,
      explanation:
        "Correct. Full aerobic breakdown of glucose yields roughly 30-32 ATP, compared to the small net gain from glycolysis alone.",
      relevantMaterial:
        "In total, aerobic respiration of one glucose molecule yields roughly 30-32 ATP, far more than glycolysis alone.",
    },
  ],
  photosynthesis: [
    {
      statement:
        "Photosynthesis occurs in the chloroplast and converts light energy into chemical energy stored in glucose.",
      isCorrect: true,
      explanation:
        "Correct. Photosynthesis takes place in the chloroplast and stores light energy as chemical energy in glucose.",
      relevantMaterial:
        "Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. It takes place in the chloroplast.",
    },
    {
      statement:
        "The light-dependent reactions take place in the thylakoid membranes, where splitting water releases oxygen as a byproduct.",
      isCorrect: true,
      explanation:
        "Correct. The light reactions occur in the thylakoid membranes, and splitting water (photolysis) releases oxygen.",
      relevantMaterial:
        "The light-dependent reactions occur in the thylakoid membranes inside the chloroplast... split water molecules (photolysis), releasing oxygen as a byproduct.",
    },
    {
      statement:
        "The Calvin cycle takes place in the thylakoid membrane, where the enzyme RuBisCO fixes carbon dioxide into organic molecules.",
      isCorrect: false,
      mistakePhrase: "thylakoid membrane",
      explanation:
        "The Calvin cycle actually takes place in the stroma, not the thylakoid membrane. The thylakoid membrane is where the light-dependent reactions occur.",
      relevantMaterial:
        "The second stage, the Calvin cycle (light-independent reactions), takes place in the stroma, the fluid-filled space surrounding the thylakoids.",
    },
  ],
  "human-biology": [
    {
      statement:
        "The left ventricle has thicker, more muscular walls than the right ventricle because it must pump blood through the entire systemic circulation.",
      isCorrect: true,
      explanation:
        "Correct. The left ventricle's thicker walls generate the higher pressure needed to pump blood through the whole body, not just the lungs.",
      relevantMaterial:
        "The left ventricle has thicker, more muscular walls than the right ventricle because it must generate enough pressure to pump blood through the entire systemic circulation.",
    },
    {
      statement:
        "In the alveoli, oxygen diffuses from the blood into the air sacs, while carbon dioxide diffuses from the air into the blood to be used by the body.",
      isCorrect: false,
      mistakePhrase: "oxygen diffuses from the blood into the air sacs",
      explanation:
        "This reverses the direction of gas exchange. Oxygen actually diffuses from the alveoli into the blood, while carbon dioxide diffuses from the blood into the alveoli to be exhaled.",
      relevantMaterial:
        "Oxygen diffuses from the alveoli into the blood, while carbon dioxide diffuses from the blood into the alveoli to be exhaled.",
    },
    {
      statement:
        "Neurons communicate via electrical action potentials that travel down the axon, and via neurotransmitters that cross the synapse to the next neuron.",
      isCorrect: true,
      explanation:
        "Correct. Neurons use electrical action potentials along the axon and chemical neurotransmitters across synapses to communicate.",
      relevantMaterial:
        "Neurons communicate via electrical signals called action potentials, which travel down the axon, and chemical signals called neurotransmitters, which cross the synapse to the next neuron.",
    },
  ],
  ecology: [
    {
      statement:
        "Only about 10% of the energy available at one trophic level is typically transferred to the next, with the rest lost mostly as heat.",
      isCorrect: true,
      explanation:
        "Correct. Roughly 10% of energy transfers between trophic levels, with most of the rest lost as heat through metabolism.",
      relevantMaterial:
        "Only about 10% of the energy available at one trophic level is typically transferred to the next trophic level; the rest is lost mostly as heat.",
    },
    {
      statement:
        "In an ecosystem, decomposers recycle energy back to producers, while matter flows continuously in one direction starting as sunlight.",
      isCorrect: false,
      mistakePhrase: "decomposers recycle energy back to producers",
      explanation:
        "This swaps matter and energy. Decomposers recycle matter/nutrients back into the ecosystem; energy flows in one direction from sunlight and is not recycled.",
      relevantMaterial:
        "Decomposers... break down dead organic matter, recycling nutrients... Unlike energy, matter is recycled within ecosystems rather than flowing in one direction.",
    },
    {
      statement:
        "Mutualism is a species interaction in which both participating species benefit, such as bees pollinating flowers.",
      isCorrect: true,
      explanation:
        "Correct. Mutualism describes an interaction where both species involved benefit, such as bees and flowering plants.",
      relevantMaterial:
        "mutualism (both species benefit, such as bees pollinating flowers)",
    },
  ],
  [finalChallengeId]: [
    {
      statement:
        "During meiosis, sister chromatids separate during anaphase I, the same stage at which homologous chromosomes separate.",
      isCorrect: false,
      mistakePhrase: "sister chromatids separate during anaphase I",
      explanation:
        "Sister chromatids remain joined during anaphase I and only separate during anaphase II. Only homologous chromosomes separate in anaphase I.",
      relevantMaterial:
        "During meiosis I, homologous chromosomes pair up and separate during anaphase I, while sister chromatids remain joined; sister chromatids only separate during anaphase II.",
    },
    {
      statement:
        "Photosynthesis produces the oxygen and glucose that cellular respiration consumes, while cellular respiration produces the carbon dioxide and water that photosynthesis consumes.",
      isCorrect: true,
      explanation:
        "Correct. Photosynthesis and respiration are complementary: each process's outputs are the other's inputs.",
      relevantMaterial:
        "Photosynthesis and cellular respiration are complementary processes: respiration consumes the oxygen and glucose that photosynthesis produces, and produces the carbon dioxide and water that photosynthesis consumes.",
    },
    {
      statement:
        "In an energy pyramid, producers typically have far more biomass than top predators, since only about 10% of energy passes to each subsequent trophic level.",
      isCorrect: true,
      explanation:
        "Correct. Because only ~10% of energy transfers between trophic levels, producer biomass is far greater than top-predator biomass in most ecosystems.",
      relevantMaterial:
        "This is why food chains rarely extend beyond four or five trophic levels and why there is far more producer biomass than top-predator biomass in most ecosystems.",
    },
  ],
};

function buildStatement(setId: string, seed: StatementSeed, index: number): GeneratedStatement {
  const id = `fallback-${setId}-${index}`;

  if (!seed.isCorrect) {
    if (!seed.mistakePhrase) {
      throw new Error(`Fallback seed for "${setId}" index ${index} is incorrect but has no mistakePhrase.`);
    }
    const start = seed.statement.indexOf(seed.mistakePhrase);
    if (start === -1) {
      throw new Error(
        `Fallback seed for "${setId}" index ${index}: mistakePhrase not found in statement text.`
      );
    }
    return {
      id,
      statement: seed.statement,
      isCorrect: false,
      incorrectSpan: { start, end: start + seed.mistakePhrase.length },
      explanation: seed.explanation,
      relevantMaterial: seed.relevantMaterial,
    };
  }

  return {
    id,
    statement: seed.statement,
    isCorrect: true,
    explanation: seed.explanation,
    relevantMaterial: seed.relevantMaterial,
  };
}

export function getFallbackStatements(setId: string): GeneratedStatement[] {
  const setSeeds = seeds[setId];
  if (!setSeeds) {
    throw new Error(`No fallback statements configured for learning set "${setId}".`);
  }
  return setSeeds.map((seed, index) => buildStatement(setId, seed, index));
}
