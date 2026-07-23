import { describe, it, expect } from "vitest";
import {
  CHECKIN_QUESTIONS,
  questionsForChapter,
  scoreTypedCheckinAnswer,
  scoreCheckinTextLocally,
  checkTypedSafety,
  buildCheckinResult,
  checkinPlacementLabel,
  checkinCompanionLine,
  type CheckinAnswer,
} from "../../src/counselor/checkin.js";
import { createInitialGameState } from "../../src/config/gameState.js";
import { buildJourneyReflection } from "../../src/counselor/insights.js";

function answers(points: number[]): CheckinAnswer[] {
  return points.map((p, i) => ({
    questionId: `q${i}`,
    points: p,
    source: "option" as const,
    safetyFlag: "none" as const,
  }));
}

describe("pre-level check-in", () => {
  it("picks 2-4 questions per chapter, each with options and open answers", () => {
    for (const chapterId of ["ch1", "ch2"]) {
      const qs = questionsForChapter(chapterId);
      expect(qs.length).toBeGreaterThanOrEqual(2);
      expect(qs.length).toBeLessThanOrEqual(4);
      for (const q of qs) {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.allowTyped).toBe(true);
        expect(CHECKIN_QUESTIONS).toContain(q);
      }
      expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
    }
  });

  it("scores typed answers by feeling words", () => {
    expect(scoreTypedCheckinAnswer("I feel happy and excited!").points).toBe(2);
    expect(scoreTypedCheckinAnswer("kind of nervous about school").points).toBe(1);
    expect(scoreTypedCheckinAnswer("I am sad and feel alone").points).toBe(0);
    expect(scoreTypedCheckinAnswer("bananas").points).toBe(1);
  });

  it("flags distress in typed answers and scores gentle", () => {
    const scored = scoreTypedCheckinAnswer("I want to hurt myself");
    expect(scored.safetyFlag).toBe("distress");
    expect(scored.points).toBe(0);
  });

  it("scoreCheckinTextLocally is the single source of truth behind the offline path", () => {
    expect(scoreCheckinTextLocally("i feel happy and excited")).toBe(2);
    expect(scoreCheckinTextLocally("kind of nervous about school")).toBe(1);
    expect(scoreCheckinTextLocally("i am sad and feel alone")).toBe(0);
    expect(scoreCheckinTextLocally("bananas")).toBe(1);
  });

  it("checkTypedSafety catches distress/blocked input instantly, without scoring it", () => {
    const distress = checkTypedSafety("I want to hurt myself");
    expect(distress.blockedPoints).toBe(0);
    expect(distress.safetyFlag).toBe("distress");

    const profane = checkTypedSafety("this is so stupid");
    expect(profane.blockedPoints).toBe(1);
    expect(profane.safetyFlag).toBe("profanity");

    const clean = checkTypedSafety("I feel happy and excited!");
    expect(clean.blockedPoints).toBeNull();
    expect(clean.safetyFlag).toBe("none");
    expect(clean.text).toContain("happy");
  });

  it("places totals into bright / steady / gentle with a 0-10 starting point", () => {
    const bright = buildCheckinResult("ch2", answers([2, 2, 2]));
    expect(bright.placement).toBe("bright");
    expect(bright.startingPoint).toBe(10);

    const steady = buildCheckinResult("ch2", answers([1, 1, 1]));
    expect(steady.placement).toBe("steady");

    const gentle = buildCheckinResult("ch2", answers([0, 0, 1]));
    expect(gentle.placement).toBe("gentle");
    expect(gentle.startingPoint).toBeLessThanOrEqual(3);
  });

  it("has a label and companion line for every placement", () => {
    for (const placement of ["bright", "steady", "gentle"] as const) {
      expect(checkinPlacementLabel(placement).length).toBeGreaterThan(0);
      expect(checkinCompanionLine(placement, "Flicker")).toContain("Flicker");
    }
  });

  it("surfaces the check-in baseline in the journey reflection", () => {
    const state = createInitialGameState();
    state.progress.checkins = {
      [state.profile.chapterId]: buildCheckinResult(state.profile.chapterId, answers([0, 0, 0])),
    };
    const reflection = buildJourneyReflection(state);
    expect(reflection.summary).toContain("starting point");
    expect(reflection.parentCoaching.some((line) => line.includes("check-in"))).toBe(true);
  });
});
