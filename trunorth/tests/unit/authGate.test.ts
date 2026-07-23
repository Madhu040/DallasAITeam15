import { describe, it, expect } from "vitest";

/**
 * Regression guard: the Anthropic API key must only ever be spent on an authenticated
 * (logged-in parent) session — the guest path (no login) always gets the offline/local
 * scorer, same as when no key is configured at all. This is a cost/abuse control, not a
 * safety control (input filtering always runs regardless of auth state).
 *
 * Deliberately does NOT mock the Anthropic SDK: if this env has a real ANTHROPIC_API_KEY
 * configured (as local dev typically will, once someone's testing the live path), an
 * unauthenticated request must still resolve to the deterministic offline heuristic
 * shape almost instantly — not a live model response, and not the ~8s request timeout.
 * If the auth gate ever regresses, this test either times out or returns a live-shaped
 * response that fails the assertions below, instead of silently starting to bill calls
 * for anonymous guest traffic.
 */
describe("Anthropic key is gated behind login", () => {
  it("POST /api/checkin/score with no Authorization header never reaches Anthropic", async () => {
    const { checkinRoutes } = await import("../../server/routes/checkin.js");
    const started = Date.now();

    const res = await checkinRoutes.request("/checkin/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapterId: "ch2",
        ageBand: "5-7",
        companion: { name: "Flicker", archetype: "companion_dragon" },
        answers: [{ questionId: "q_weather", prompt: "weather?", text: "kind of a rainy day" }],
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json() as { scores: { questionId: string; points: number }[] };
    // The offline heuristic's deterministic default for text with no BRIGHT/WOBBLY/HEAVY
    // keyword match is 1 — a real Claude call could plausibly return something else.
    expect(body.scores).toEqual([{ questionId: "q_weather", points: 1 }]);
    expect(Date.now() - started).toBeLessThan(2000);
  });

  it("POST /api/checkin/score with a garbage Bearer token is treated the same as no token", async () => {
    const { checkinRoutes } = await import("../../server/routes/checkin.js");

    const res = await checkinRoutes.request("/checkin/score", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer not-a-real-token" },
      body: JSON.stringify({
        chapterId: "ch2",
        ageBand: "5-7",
        companion: { name: "Flicker", archetype: "companion_dragon" },
        answers: [{ questionId: "q_weather", prompt: "weather?", text: "kind of a rainy day" }],
      }),
    });

    const body = await res.json() as { scores: { questionId: string; points: number }[] };
    expect(body.scores).toEqual([{ questionId: "q_weather", points: 1 }]);
  });

  it("POST /api/companion with no Authorization header never reaches Anthropic", async () => {
    const { companionRoutes } = await import("../../server/routes/companion.js");
    const started = Date.now();

    const res = await companionRoutes.request("/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decisionPointId: "dp_leftout_bench",
        sceneId: "e1",
        chapterId: "ch1",
        ageBand: "5-7",
        inputMode: "typed",
        childInput: "I would sit with them and ask if they want to play with us",
        companionContext: { situation: "test" },
        companion: { name: "Flicker", archetype: "companion_dragon" },
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json() as { confidence: number };
    // The offline rubric scorer always reports a confidence < 1 (never the live model's
    // typical near-1.0 confidence for a clear match) — a cheap signal this was local.
    expect(body.confidence).toBeLessThan(1);
    expect(Date.now() - started).toBeLessThan(2000);
  });
});
