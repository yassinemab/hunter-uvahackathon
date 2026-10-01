import type { Chapter, LearningSet, LevelWithContext } from "./types";

// Hardcoded "Physics 101" course content for the v0 demo.
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
    id: "kinematics",
    title: "Kinematics",
    description: "Displacement, velocity, acceleration, and projectile motion.",
    difficulty: 1,
    topicCount: 1,
    material: `Kinematics describes motion without regard to what causes it. Displacement is the change in an object's position (a vector, with direction), while distance is the total length of the path traveled (a scalar). Velocity is the rate of change of displacement over time, while speed is the magnitude of velocity. Acceleration is the rate of change of velocity over time, measured in meters per second squared (m/s²).

For motion under constant acceleration, three equations relate these quantities: v = v0 + at (final velocity equals initial velocity plus acceleration times time), x = x0 + v0*t + (1/2)a*t² (position as a function of time), and v² = v0² + 2a(x - x0) (final velocity squared in terms of distance traveled). Note that in this last equation, when starting from rest (v0 = 0), velocity ends up proportional to the square root of the distance traveled, not directly proportional to the distance itself.

Free fall near Earth's surface occurs under a constant gravitational acceleration of approximately 9.8 m/s², directed downward, usually denoted g. In projectile motion with no air resistance, the horizontal and vertical components of motion are independent: horizontal velocity stays constant throughout the flight (no horizontal acceleration), while vertical velocity changes continuously due to gravity, just as in free fall.`,
  },
  {
    id: "newtons-laws",
    title: "Newton's Laws of Motion",
    description: "Inertia, F=ma, and action-reaction force pairs.",
    difficulty: 2,
    topicCount: 1,
    material: `Newton's first law, the law of inertia, states that an object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted on by a net external force. Newton's second law states that the net force on an object equals its mass times its acceleration: F = ma, with force measured in newtons (N), equivalent to kg·m/s². Newton's third law states that for every action force one object exerts on a second object, the second object exerts an equal and opposite reaction force back on the first — these two forces act on different objects, not the same one.

Mass is the amount of matter in an object, a scalar quantity measured in kilograms that does not depend on location. Weight is the force of gravity acting on an object's mass, calculated as W = mg, measured in newtons, and it does change with the local strength of gravity — an object weighs less on the Moon than on Earth even though its mass is unchanged.

Friction is a force that opposes relative motion between surfaces in contact. Static friction acts on objects that are not yet moving relative to each other, while kinetic friction acts once sliding begins; the maximum static friction coefficient for a pair of surfaces is generally greater than or equal to the kinetic friction coefficient for the same surfaces.`,
  },
  {
    id: "energy-work",
    title: "Energy and Work",
    description: "Kinetic and potential energy, work, and conservation of energy.",
    difficulty: 3,
    topicCount: 1,
    material: `Work is done on an object when a force causes a displacement in the direction of that force: W = F*d*cos(θ), measured in joules. Kinetic energy, the energy of motion, is given by KE = (1/2)mv². Gravitational potential energy, the energy stored due to an object's height above a reference point, is given by PE = mgh. Power is the rate at which work is done, P = W/t, measured in watts.

The work-energy theorem states that the net work done on an object equals its change in kinetic energy. The law of conservation of mechanical energy states that in the absence of non-conservative forces like friction or air resistance, the total mechanical energy of a system (kinetic plus potential) remains constant over time. For example, when a ball is dropped and falls freely, its potential energy decreases as its height decreases while its kinetic energy increases by an equal amount as its speed increases, so the sum of the two — the total mechanical energy — stays the same throughout the fall.`,
  },
  {
    id: "momentum",
    title: "Momentum and Collisions",
    description: "Conservation of momentum, impulse, and elastic vs. inelastic collisions.",
    difficulty: 4,
    topicCount: 1,
    material: `Momentum is the product of an object's mass and velocity, p = mv, a vector quantity. The law of conservation of momentum states that in an isolated system with no net external force, the total momentum before an interaction equals the total momentum after it. Impulse is the change in momentum caused by a force acting over time, J = FΔt = Δp.

Collisions are classified by whether kinetic energy is conserved. In an elastic collision, both momentum and total kinetic energy are conserved — no energy is lost to heat, sound, or deformation. In an inelastic collision, momentum is still conserved, but kinetic energy is not; some of it converts into other forms of energy such as heat, sound, or permanent deformation of the colliding objects. A perfectly inelastic collision is a special case of an inelastic collision in which the two objects stick together after colliding and move off with a single shared final velocity.`,
  },
  {
    id: "waves-sound",
    title: "Waves and Sound",
    description: "Wave properties, wave speed, sound, and the Doppler effect.",
    difficulty: 5,
    topicCount: 1,
    material: `A wave is characterized by its wavelength (λ, the distance between successive crests), frequency (f, the number of cycles per second, in hertz), amplitude (the maximum displacement from equilibrium), and period (T = 1/f, the time for one complete cycle). Wave speed relates these quantities as v = f·λ.

Waves are classified as transverse, where the medium oscillates perpendicular to the direction of travel (such as light or a wave on a string), or longitudinal, where the medium oscillates parallel to the direction of travel. Sound is a longitudinal wave made of compressions and rarefactions of a medium; it requires a medium to travel through and cannot propagate through a vacuum. The speed of sound in air at room temperature is approximately 343 m/s, and sound generally travels faster through denser, more rigid media — faster in solids than in liquids, and faster in liquids than in gases.

The Doppler effect describes the change in observed frequency when a wave source and observer are moving relative to each other: the observed frequency is higher than the source's actual frequency when the source moves toward the observer (the waves are compressed), and lower when the source moves away from the observer (the waves are stretched out).`,
  },
  {
    id: "electricity-circuits",
    title: "Electricity and Circuits",
    description: "Current, voltage, resistance, and series/parallel circuits.",
    difficulty: 6,
    topicCount: 1,
    material: `Electric current is the rate of flow of electric charge, I = Q/t, measured in amperes. Voltage, or potential difference, is measured in volts, and resistance is measured in ohms. Ohm's law relates these three quantities: V = IR, voltage equals current multiplied by resistance. Electric power can be calculated as P = IV, which is equivalent to P = I²R or P = V²/R.

In a series circuit, components are connected end to end along a single path, so the same current flows through every component, while the total voltage divides across them according to each component's resistance; the total resistance of a series circuit is the sum of the individual resistances. In a parallel circuit, components are connected across common points, so the same voltage appears across each branch, while the current divides among the branches according to their resistance. The total resistance of a parallel circuit is always less than the resistance of the smallest individual branch, since adding more parallel paths gives current more routes to flow and makes it easier, not harder, for current to flow overall.`,
  },
  {
    id: "thermodynamics",
    title: "Thermodynamics",
    description: "Heat, temperature, specific heat, and the laws of thermodynamics.",
    difficulty: 7,
    topicCount: 1,
    material: `Temperature is a measure of the average kinetic energy of the particles in a substance, while heat is the transfer of energy between objects due to a temperature difference. Specific heat capacity describes how much heat energy is required to raise the temperature of a unit mass of a substance by one degree; the relationship is Q = mcΔT, where c is the specific heat capacity, m is mass, and ΔT is the change in temperature. Heat can transfer by conduction (through direct contact), convection (through the bulk movement of a fluid), or radiation (through electromagnetic waves, requiring no medium).

The first law of thermodynamics is a statement of energy conservation: the change in a system's internal energy equals the heat added to the system minus the work done by the system, ΔU = Q - W. The second law of thermodynamics states that the total entropy of an isolated system never decreases over time, and as a consequence, heat flows spontaneously from a hotter object to a colder one, never the reverse, without external work being done. The ideal gas law, PV = nRT, relates the pressure, volume, and temperature of an ideal gas.`,
  },
];

export const finalChallengeId = "final-challenge";

const LEVEL_STAGES = ["Foundations", "Application", "Mastery"];

const chapterSeeds: ChapterSeed[] = [
  ...topicSeeds.map((seed) => ({ ...seed, levelStages: LEVEL_STAGES })),
  {
    id: finalChallengeId,
    title: "Final Challenge — Mixed Physics",
    description: "Statements drawing on every topic in Physics 101.",
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
