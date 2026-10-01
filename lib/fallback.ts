import { finalChallengeId } from "./physics";
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
  kinematics: [
    {
      statement:
        "Acceleration due to gravity near Earth's surface is approximately 9.8 m/s², directed downward toward the center of the Earth.",
      isCorrect: true,
      explanation:
        "Correct. Free fall near Earth's surface occurs under a constant downward acceleration of about 9.8 m/s².",
      relevantMaterial:
        "Free fall near Earth's surface occurs under a constant gravitational acceleration of approximately 9.8 m/s², directed downward.",
    },
    {
      statement:
        "In projectile motion with no air resistance, the horizontal velocity stays constant throughout the flight while the vertical velocity changes due to gravity.",
      isCorrect: true,
      explanation:
        "Correct. Horizontal and vertical motion are independent; horizontal velocity is constant, and vertical velocity changes just like in free fall.",
      relevantMaterial:
        "In projectile motion with no air resistance, the horizontal and vertical components of motion are independent: horizontal velocity stays constant throughout the flight... while vertical velocity changes continuously due to gravity.",
    },
    {
      statement:
        "According to the kinematic equations, if an object starts at rest and accelerates uniformly over a distance, its final velocity is directly proportional to the distance traveled.",
      isCorrect: false,
      mistakePhrase: "directly proportional to the distance traveled",
      explanation:
        "Since v² = 2a·x when starting from rest, velocity is proportional to the square root of the distance traveled, not directly proportional to the distance itself.",
      relevantMaterial:
        "v² = v0² + 2a(x - x0)... when starting from rest (v0 = 0), velocity ends up proportional to the square root of the distance traveled, not directly proportional to the distance itself.",
    },
  ],
  "newtons-laws": [
    {
      statement:
        "Newton's second law states that the net force on an object equals its mass multiplied by its acceleration.",
      isCorrect: true,
      explanation: "Correct. This is Newton's second law, F = ma.",
      relevantMaterial:
        "Newton's second law states that the net force on an object equals its mass times its acceleration: F = ma.",
    },
    {
      statement:
        "Newton's third law states that for every action force, there is an equal and opposite reaction force acting on a different object.",
      isCorrect: true,
      explanation:
        "Correct. Action-reaction force pairs act on two different objects, not the same object.",
      relevantMaterial:
        "Newton's third law states that for every action force one object exerts on a second object, the second object exerts an equal and opposite reaction force back on the first — these two forces act on different objects.",
    },
    {
      statement:
        "An object's weight, like its mass, is measured in kilograms and stays the same regardless of the local strength of gravity.",
      isCorrect: false,
      mistakePhrase: "is measured in kilograms and stays the same regardless of the local strength of gravity",
      explanation:
        "Weight is a force (W = mg) measured in newtons, and it changes with local gravity. Only mass, measured in kilograms, stays constant.",
      relevantMaterial:
        "Weight is the force of gravity acting on an object's mass, calculated as W = mg, measured in newtons, and it does change with the local strength of gravity.",
    },
  ],
  "energy-work": [
    {
      statement: "Kinetic energy is calculated as one-half times mass times velocity squared.",
      isCorrect: true,
      explanation: "Correct. KE = (1/2)mv².",
      relevantMaterial: "Kinetic energy, the energy of motion, is given by KE = (1/2)mv².",
    },
    {
      statement:
        "The work-energy theorem states that the net work done on an object equals its change in kinetic energy.",
      isCorrect: true,
      explanation: "Correct, this is the work-energy theorem.",
      relevantMaterial:
        "The work-energy theorem states that the net work done on an object equals its change in kinetic energy.",
    },
    {
      statement:
        "When a ball is dropped and falls freely under gravity with no air resistance, its total mechanical energy increases as it falls because its kinetic energy increases.",
      isCorrect: false,
      mistakePhrase: "its total mechanical energy increases as it falls because its kinetic energy increases",
      explanation:
        "Total mechanical energy (kinetic + potential) stays constant during free fall without air resistance — kinetic energy increases but potential energy decreases by the same amount, so the total doesn't change.",
      relevantMaterial:
        "the total mechanical energy of a system (kinetic plus potential) remains constant over time... potential energy decreases as its height decreases while its kinetic energy increases by an equal amount.",
    },
  ],
  momentum: [
    {
      statement:
        "In a perfectly inelastic collision, the two objects stick together and move with a shared final velocity after the collision.",
      isCorrect: true,
      explanation: "Correct. That's the definition of a perfectly inelastic collision.",
      relevantMaterial:
        "A perfectly inelastic collision is a special case... in which the two objects stick together after colliding and move off with a single shared final velocity.",
    },
    {
      statement: "Momentum is conserved in an isolated system where no net external force acts on it.",
      isCorrect: true,
      explanation: "Correct, this is the law of conservation of momentum.",
      relevantMaterial:
        "The law of conservation of momentum states that in an isolated system with no net external force, the total momentum before an interaction equals the total momentum after it.",
    },
    {
      statement:
        "In an elastic collision, momentum is conserved but kinetic energy is not, since some of it converts into heat and deformation.",
      isCorrect: false,
      mistakePhrase: "kinetic energy is not, since some of it converts into heat and deformation",
      explanation:
        "This describes an inelastic collision. In an elastic collision, both momentum and kinetic energy are conserved.",
      relevantMaterial:
        "In an elastic collision, both momentum and total kinetic energy are conserved — no energy is lost to heat, sound, or deformation.",
    },
  ],
  "waves-sound": [
    {
      statement: "Wave speed equals frequency multiplied by wavelength.",
      isCorrect: true,
      explanation: "Correct. v = f·λ.",
      relevantMaterial: "Wave speed relates these quantities as v = f·λ.",
    },
    {
      statement:
        "Sound is a longitudinal wave that requires a medium to travel through and cannot propagate through a vacuum.",
      isCorrect: true,
      explanation: "Correct. Sound needs a medium and cannot travel through a vacuum.",
      relevantMaterial:
        "Sound is a longitudinal wave made of compressions and rarefactions of a medium; it requires a medium to travel through and cannot propagate through a vacuum.",
    },
    {
      statement:
        "According to the Doppler effect, the frequency of a sound appears lower to an observer when the source is moving toward them.",
      isCorrect: false,
      mistakePhrase: "appears lower to an observer when the source is moving toward them",
      explanation:
        "When the source moves toward the observer, the perceived frequency is higher, not lower — frequency appears lower when the source moves away.",
      relevantMaterial:
        "the observed frequency is higher than the source's actual frequency when the source moves toward the observer... and lower when the source moves away.",
    },
  ],
  "electricity-circuits": [
    {
      statement: "Ohm's Law states that voltage equals current multiplied by resistance.",
      isCorrect: true,
      explanation: "Correct. V = IR.",
      relevantMaterial: "Ohm's law relates these three quantities: V = IR, voltage equals current multiplied by resistance.",
    },
    {
      statement:
        "In a series circuit, the same current flows through every component, while the voltage divides across them.",
      isCorrect: true,
      explanation: "Correct, this is how series circuits behave.",
      relevantMaterial:
        "In a series circuit, components are connected end to end along a single path, so the same current flows through every component, while the total voltage divides across them.",
    },
    {
      statement:
        "In a parallel circuit, the total resistance is always greater than the resistance of any single branch.",
      isCorrect: false,
      mistakePhrase: "is always greater than the resistance of any single branch",
      explanation:
        "Total resistance in a parallel circuit is actually always less than the smallest individual branch resistance, since more parallel paths make it easier for current to flow.",
      relevantMaterial:
        "The total resistance of a parallel circuit is always less than the resistance of the smallest individual branch, since adding more parallel paths gives current more routes to flow.",
    },
  ],
  thermodynamics: [
    {
      statement:
        "The first law of thermodynamics states that the change in internal energy of a system equals the heat added minus the work done by the system.",
      isCorrect: true,
      explanation: "Correct. ΔU = Q - W.",
      relevantMaterial:
        "The first law of thermodynamics is a statement of energy conservation: the change in a system's internal energy equals the heat added to the system minus the work done by the system, ΔU = Q - W.",
    },
    {
      statement:
        "Heat flows spontaneously from a hotter object to a colder one, not the reverse, according to the second law of thermodynamics.",
      isCorrect: true,
      explanation: "Correct, this follows from the second law of thermodynamics.",
      relevantMaterial:
        "heat flows spontaneously from a hotter object to a colder one, never the reverse, without external work being done.",
    },
    {
      statement:
        "Specific heat capacity describes how much work is required to change an object's volume by one unit at constant pressure.",
      isCorrect: false,
      mistakePhrase: "how much work is required to change an object's volume by one unit at constant pressure",
      explanation:
        "Specific heat capacity actually describes how much heat energy is required to raise the temperature of a unit mass of a substance by one degree, not a change in volume.",
      relevantMaterial:
        "Specific heat capacity describes how much heat energy is required to raise the temperature of a unit mass of a substance by one degree; the relationship is Q = mcΔT.",
    },
  ],
  [finalChallengeId]: [
    {
      statement:
        "In projectile motion, horizontal velocity remains constant while vertical velocity changes due to gravitational acceleration of about 9.8 m/s².",
      isCorrect: true,
      explanation:
        "Correct. This combines kinematics and the constant downward acceleration of gravity near Earth's surface.",
      relevantMaterial:
        "horizontal velocity stays constant throughout the flight... while vertical velocity changes continuously due to gravity... approximately 9.8 m/s², directed downward.",
    },
    {
      statement:
        "During a perfectly inelastic collision, the colliding objects stick together, and while momentum is conserved, kinetic energy is generally not.",
      isCorrect: true,
      explanation:
        "Correct. Perfectly inelastic collisions conserve momentum but not kinetic energy, since some converts to heat, sound, or deformation.",
      relevantMaterial:
        "A perfectly inelastic collision is a special case of an inelastic collision in which the two objects stick together after colliding... momentum is still conserved, but kinetic energy is not.",
    },
    {
      statement:
        "A sound wave's frequency appears higher to a stationary observer when its source is moving away from them, according to the Doppler effect.",
      isCorrect: false,
      mistakePhrase: "appears higher to a stationary observer when its source is moving away from them",
      explanation:
        "This has it backwards — frequency appears lower when the source moves away, and higher when the source moves toward the observer.",
      relevantMaterial:
        "the observed frequency is higher than the source's actual frequency when the source moves toward the observer... and lower when the source moves away from the observer.",
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
