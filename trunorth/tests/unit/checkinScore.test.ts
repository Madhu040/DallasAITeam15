import { describe, it, expect } from "vitest";
import { parseModelResponse } from "../../server/routes/checkin.js";
import type { CheckinScoreRequestItem } from "../../src/types/index.js";

const items: CheckinScoreRequestItem[] = [
  { questionId: "q_weather", prompt: "weather?", text: "i feel happy and excited" },
  { questionId: "q_hard_thing", prompt: "hard thing?", text: "kind of nervous about school" },
];

describe("parseModelResponse (POST /api/checkin/score) — scores", () => {
  it("maps a well-formed model response straight through, including reason", () => {
    const text = JSON.stringify({
      scores: [
        { questionId: "q_weather", points: 2, reason: "used bright feeling words" },
        { questionId: "q_hard_thing", points: 1, reason: "mixed, a little uncertain" },
      ],
    });
    expect(parseModelResponse(text, items).scores).toEqual([
      { questionId: "q_weather", points: 2, reason: "used bright feeling words" },
      { questionId: "q_hard_thing", points: 1, reason: "mixed, a little uncertain" },
    ]);
  });

  it("extracts the JSON object even with surrounding prose", () => {
    const text = `Sure, here you go:\n${JSON.stringify({
      scores: [
        { questionId: "q_weather", points: 2 },
        { questionId: "q_hard_thing", points: 0 },
      ],
    })}\nHope that helps!`;
    const { scores } = parseModelResponse(text, items);
    expect(scores.find((r) => r.questionId === "q_weather")?.points).toBe(2);
    expect(scores.find((r) => r.questionId === "q_hard_thing")?.points).toBe(0);
  });

  it("falls back to the offline heuristic for a question the model dropped", () => {
    const text = JSON.stringify({ scores: [{ questionId: "q_weather", points: 2 }] });
    const { scores } = parseModelResponse(text, items);
    expect(scores).toContainEqual({ questionId: "q_weather", points: 2, reason: undefined });
    // q_hard_thing was dropped by the model — offline heuristic scores "nervous" as 1.
    expect(scores).toContainEqual({ questionId: "q_hard_thing", points: 1 });
  });

  it("falls back entirely on unparseable model output", () => {
    const { scores } = parseModelResponse("not json at all", items);
    expect(scores).toContainEqual({ questionId: "q_weather", points: 2 });
    expect(scores).toContainEqual({ questionId: "q_hard_thing", points: 1 });
  });

  it("ignores an out-of-range points value and falls back for that item", () => {
    const text = JSON.stringify({
      scores: [
        { questionId: "q_weather", points: 5 },
        { questionId: "q_hard_thing", points: 1 },
      ],
    });
    const { scores } = parseModelResponse(text, items);
    expect(scores.find((r) => r.questionId === "q_weather")?.points).toBe(2); // fallback heuristic
    expect(scores.find((r) => r.questionId === "q_hard_thing")?.points).toBe(1);
  });

  it("ignores a questionId the request never asked about", () => {
    const text = JSON.stringify({
      scores: [
        { questionId: "not_a_real_question", points: 2 },
        { questionId: "q_weather", points: 2 },
        { questionId: "q_hard_thing", points: 1 },
      ],
    });
    const { scores } = parseModelResponse(text, items);
    expect(scores).toHaveLength(2);
    expect(scores.some((r) => r.questionId === "not_a_real_question")).toBe(false);
  });

  it("truncates an absurdly long reason rather than passing it through raw", () => {
    const text = JSON.stringify({
      scores: [{ questionId: "q_weather", points: 2, reason: "x".repeat(500) }],
    });
    const { scores } = parseModelResponse(text, [items[0]]);
    expect(scores[0].reason?.length).toBeLessThanOrEqual(200);
  });
});

describe("parseModelResponse — greeting", () => {
  it("passes through a clean greeting", () => {
    const text = JSON.stringify({
      scores: [{ questionId: "q_weather", points: 2 }],
      greeting: "Hi Alex! I heard today felt bright and exciting for you.",
    });
    const { greeting } = parseModelResponse(text, [items[0]]);
    expect(greeting).toBe("Hi Alex! I heard today felt bright and exciting for you.");
  });

  it("drops a greeting that fails the output filter (e.g. clinical language)", () => {
    const text = JSON.stringify({
      scores: [{ questionId: "q_weather", points: 2 }],
      greeting: "Hi Alex! It sounds like you might need therapy for that.",
    });
    const { greeting } = parseModelResponse(text, [items[0]]);
    expect(greeting).toBeUndefined();
  });

  it("is undefined when the model response has no greeting at all", () => {
    const text = JSON.stringify({ scores: [{ questionId: "q_weather", points: 2 }] });
    const { greeting } = parseModelResponse(text, [items[0]]);
    expect(greeting).toBeUndefined();
  });

  it("truncates an absurdly long greeting", () => {
    const text = JSON.stringify({
      scores: [{ questionId: "q_weather", points: 2 }],
      greeting: "Hi! ".repeat(100),
    });
    const { greeting } = parseModelResponse(text, [items[0]]);
    expect(greeting?.length).toBeLessThanOrEqual(200);
  });
});
