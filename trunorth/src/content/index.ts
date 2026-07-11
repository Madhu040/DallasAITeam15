import type { DecisionPoint, Scene } from "../types/index.js";

import w1 from "../../content/chapters/ch2/w1.scene.json";
import w2 from "../../content/chapters/ch2/w2.scene.json";
import w3a from "../../content/chapters/ch2/w3a.scene.json";
import w4 from "../../content/chapters/ch2/w4.scene.json";
import dpRobinLadder from "../../content/chapters/ch2/dp_robin_ladder.json";
import dpRobinEncounter from "../../content/chapters/ch2/dp_robin_encounter.json";
import dpClimbCelebration from "../../content/chapters/ch2/dp_climb_celebration.json";

import e1 from "../../content/chapters/ch1/e1.scene.json";
import e2 from "../../content/chapters/ch1/e2.scene.json";
import e3 from "../../content/chapters/ch1/e3.scene.json";
import dpLeftout from "../../content/chapters/ch1/dp_leftout_bench.json";
import dpAskGrownup from "../../content/chapters/ch1/dp_ask_grownup.json";

import c1 from "../../content/chapters/ch3/c1.scene.json";
import c2 from "../../content/chapters/ch3/c2.scene.json";
import dpHothead from "../../content/chapters/ch3/dp_hothead_calm.json";
import dpRepair from "../../content/chapters/ch3/dp_friendship_repair.json";

export const SCENES: Record<string, Scene> = {
  w1: w1 as Scene,
  w2: w2 as Scene,
  w3a: w3a as Scene,
  w4: w4 as Scene,
  e1: e1 as Scene,
  e2: e2 as Scene,
  e3: e3 as Scene,
  c1: c1 as Scene,
  c2: c2 as Scene,
};

export const DECISION_POINTS: Record<string, DecisionPoint> = {
  dp_robin_encounter: dpRobinEncounter as DecisionPoint,
  dp_robin_ladder: dpRobinLadder as DecisionPoint,
  dp_climb_celebration: dpClimbCelebration as DecisionPoint,
  dp_leftout_bench: dpLeftout as DecisionPoint,
  dp_ask_grownup: dpAskGrownup as DecisionPoint,
  dp_hothead_calm: dpHothead as DecisionPoint,
  dp_friendship_repair: dpRepair as DecisionPoint,
};

export function getScene(id: string): Scene | undefined {
  return SCENES[id];
}

export function getDecisionPoint(id: string): DecisionPoint | undefined {
  return DECISION_POINTS[id];
}

export const GOLDEN_PATH = ["w1", "w2", "w3a", "w4"];

export const CHAPTER_FINALE: Record<string, string> = {
  ch1: "e3",
  ch2: "w4",
  ch3: "c2",
};

export const CHAPTER_COMPLETE_DECISION: Record<string, string> = {
  ch1: "dp_ask_grownup",
  ch2: "dp_climb_celebration",
  ch3: "dp_friendship_repair",
};
