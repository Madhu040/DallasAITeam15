import type { ScenarioMeta } from "../types/index.js";

/**
 * Consolidated Level 1 hub:
 * - Madhu's 3 Little Dragon phase names / biomes / starts (Forest → Valley → Mountain)
 * - Daniel's Singing Bridge quest clarity (Shimmer Crystal, look → sort → breathe → cross)
 */
export const SCENARIOS: ScenarioMeta[] = [
  {
    id: "ch2",
    audience: "child",
    title: "Forest of Questions",
    subtitle: "Phase 1 · Curiosity",
    description:
      "Say YES to the Shimmer Crystal quest with Flicker the Worry Dragon. Look carefully at the Singing Bridge, then sort FACT, MAYBE, and STORY with Wize the Wise Owl.",
    startSceneId: "w1",
    ageBand: "5-7",
    skills: ["worry_brave", "calm", "courage"],
    estimatedMinutes: 5,
  },
  {
    id: "ch3",
    audience: "child",
    title: "Valley of Welcome",
    subtitle: "Phase 2 · Kindness",
    description:
      "In the Valley and Cave of Purpose, help Flicker's body calm down — then choose KEEP GOING while still nervous.",
    startSceneId: "w4",
    ageBand: "5-7",
    skills: ["empathy", "calm", "self_worth", "worry_brave", "courage"],
    estimatedMinutes: 5,
  },
  {
    id: "ch4",
    audience: "child",
    title: "Mountain of Helpers",
    subtitle: "Phase 3 · Courage",
    description:
      "Cross the Singing Bridge one step at a time. Reach the Shimmer Crystal and earn Courage Feather #1.",
    startSceneId: "w6",
    ageBand: "5-7",
    skills: ["courage", "worry_brave", "self_worth"],
    estimatedMinutes: 4,
  },
  {
    id: "ch1",
    audience: "child",
    title: "Everbright Meadow",
    subtitle: "Bonus · Empathy & Friendship",
    description: "In the meadow, a friend feels left out. Practice welcoming others and offering belonging.",
    startSceneId: "e1",
    ageBand: "5-7",
    skills: ["empathy", "friendship_repair", "courage"],
    estimatedMinutes: 4,
  },
  {
    id: "parent_coach",
    audience: "parent",
    title: "Parent Coach Corner",
    subtitle: "Reflect & Guide",
    description: "Review your child's journey with counselor-style insights and home practice tips.",
    startSceneId: "parent_hub",
    ageBand: "8-10",
    skills: ["empathy", "calm", "courage"],
    estimatedMinutes: 6,
  },
];
