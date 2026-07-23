import { describe, it, expect } from "vitest";
import { scoreCheckinBatch, type CheckinScorer } from "../../src/companion/CheckinScorer.js";
import type { CheckinScoreRequest, CheckinScoreResponse } from "../../src/types/index.js";

const baseReq: CheckinScoreRequest = {
  chapterId: "ch2",
  ageBand: "5-7",
  companion: { name: "Flicker", archetype: "companion_dragon" },
  childName: "Alex",
  answers: [
    { questionId: "q_weather", prompt: "weather?", text: "i feel happy and excited" },
    { questionId: "q_hard_thing", prompt: "hard thing?", text: "kind of nervous about school" },
  ],
};

describe("scoreCheckinBatch — scores", () => {
  it("returns an empty map when there is nothing pending (no network call needed)", async () => {
    const neverCalled: CheckinScorer = { score: () => { throw new Error("must not be called"); } };
    const result = await scoreCheckinBatch(neverCalled, { ...baseReq, answers: [] });
    expect(result.scores.size).toBe(0);
  });

  it("uses the scorer's response as-is when it covers every question", async () => {
    const scorer: CheckinScorer = {
      async score(): Promise<CheckinScoreResponse> {
        return { scores: [{ questionId: "q_weather", points: 2 }, { questionId: "q_hard_thing", points: 0 }] };
      },
    };
    const result = await scoreCheckinBatch(scorer, baseReq);
    expect(result.scores.get("q_weather")?.points).toBe(2);
    expect(result.scores.get("q_hard_thing")?.points).toBe(0);
  });

  it("carries the reason through when the scorer provides one", async () => {
    const scorer: CheckinScorer = {
      async score(): Promise<CheckinScoreResponse> {
        return { scores: [{ questionId: "q_weather", points: 2, reason: "used bright words" }] };
      },
    };
    const result = await scoreCheckinBatch(scorer, { ...baseReq, answers: [baseReq.answers[0]] });
    expect(result.scores.get("q_weather")?.reason).toBe("used bright words");
  });

  it("fills in the offline heuristic for any question missing from a partial response", async () => {
    const scorer: CheckinScorer = {
      async score(): Promise<CheckinScoreResponse> {
        return { scores: [{ questionId: "q_weather", points: 2 }] }; // q_hard_thing missing
      },
    };
    const result = await scoreCheckinBatch(scorer, baseReq);
    expect(result.scores.get("q_weather")?.points).toBe(2);
    expect(result.scores.get("q_hard_thing")?.points).toBe(1); // "nervous" -> offline heuristic band 1
    expect(result.scores.get("q_hard_thing")?.reason).toBeUndefined();
  });

  it("falls back entirely to the offline heuristic when the scorer throws", async () => {
    const scorer: CheckinScorer = {
      async score(): Promise<CheckinScoreResponse> {
        throw new Error("network down");
      },
    };
    const result = await scoreCheckinBatch(scorer, baseReq);
    expect(result.scores.get("q_weather")?.points).toBe(2);
    expect(result.scores.get("q_hard_thing")?.points).toBe(1);
    expect(result.greeting).toBeUndefined();
  });
});

describe("scoreCheckinBatch — greeting", () => {
  it("passes the greeting through on a successful live response", async () => {
    const scorer: CheckinScorer = {
      async score(): Promise<CheckinScoreResponse> {
        return {
          scores: [{ questionId: "q_weather", points: 2 }],
          greeting: "Hi Alex! Sounds like a bright day.",
        };
      },
    };
    const result = await scoreCheckinBatch(scorer, { ...baseReq, answers: [baseReq.answers[0]] });
    expect(result.greeting).toBe("Hi Alex! Sounds like a bright day.");
  });

  it("has no greeting when the scorer omits one (e.g. offline/demo path)", async () => {
    const scorer: CheckinScorer = {
      async score(): Promise<CheckinScoreResponse> {
        return { scores: [{ questionId: "q_weather", points: 2 }] };
      },
    };
    const result = await scoreCheckinBatch(scorer, { ...baseReq, answers: [baseReq.answers[0]] });
    expect(result.greeting).toBeUndefined();
  });

  it("has no greeting when the scorer throws (network failure)", async () => {
    const scorer: CheckinScorer = {
      async score(): Promise<CheckinScoreResponse> {
        throw new Error("down");
      },
    };
    const result = await scoreCheckinBatch(scorer, { ...baseReq, answers: [baseReq.answers[0]] });
    expect(result.greeting).toBeUndefined();
  });
});
