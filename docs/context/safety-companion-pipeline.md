# Safety & companion pipeline

**Sources:** `trunorth/server/routes/companion.ts`, `trunorth/src/companion/CompanionClient.ts`,
`trunorth/src/companion/fallbackLines.ts`, `trunorth/src/safety/filters.ts`,
`trunorth/content/fallbacks/companion-fallbacks.json`,
`trunorth/content/demo/showcase.bundle.json`, `trunorth/src/counselor/insights.ts`

## Live path (`LiveCompanionClient` → Hono)

1. **Input filter** (`filterInput`) — blocks jailbreak, distress, PII patterns, etc.
   On block: safety fallback line + redirect response.
2. **Model or local score** — if `ANTHROPIC_API_KEY` set, Claude call (~8s timeout);
   else `scoreLocally` heuristic + fallback library line.
3. **Confidence floor** (default 0.55) — low confidence → fallback band/line.
4. **Output filter** (`filterOutput`) — reject unsafe model text → substitute fallback.
5. Attach counselor `insightForStep` child/parent tips when available.

## Transport failure — the §17D ladder (Phase 4, 2026-07-19)

Steps 1–5 above assume the proxy is *reachable*. When it is not — the case spec §17D says
"can happen on stage" — `LiveCompanionClient.request` runs a three-rung ladder:

1. **Attempt.** A thrown network error *or* a non-OK HTTP status both count as failure.
2. **One in-character retry.** The `onRetry` hook fires first, so `SceneEngine` speaks
   `API_RETRY_LINE` ("My words got a little tangled — let me try that again!") while the
   retry is in flight. The child sees the companion, not a spinner. Input stays frozen
   (§17B.9 guard 1) and the phase stays `awaitingCompanion` throughout.
   Delay: `appConfig.timing.companionRetryDelayMs` (600 ms).
3. **Authored fallback.** A second failure throws `CompanionUnavailableError`;
   `SceneEngine`'s catch serves `fallbackLine(dp.id, band)` from the hand-authored library
   and **resolves the decision anyway** so the story never dead-ends.

Retries are capped at exactly one — verified by test, because an unbounded retry loop on
stage is worse than a fallback line.

> The retry copy is **SME-draft**, like the distress re-entry copy. Child-facing.

## Demo path (`DemoCompanionClient`)

- **Input filter first** — `filterInput` runs before scoring, mirroring the server's order.
  (Until Phase 4 it did not: demo mode scored typed text with no safety filter at all, so
  the one mode guaranteed to be running on stage was the only one without the filter.
  A blocked input now returns the `safety` fallback line, `redirect: true`, and the real
  `safetyFlag` — which also makes the §17D distress-resume path reachable offline.)
- Lookup key: `{sceneId}:{decisionPointId}:{band}` in `showcase.bundle.json`.
- Band from the shared rubric scorer (`scoreTypedResponse`, keyed by `typedRubricRef`).
- Always attaches `insightForStep` tips; no network.

## Fallback library

`companion-fallbacks.json` keys by decision-point id with
`strong` / `partial` / `poor` / `timeout` / `safety` strings. All 13 DPs are covered
(11 registered + 2 legacy ch3); a unit test asserts every registered DP has `timeout` and
`safety` copy so the §17D ladder can never bottom out on the generic string.

Both sides now read it: the server via `getFallback`, the client via
`src/companion/fallbackLines.ts`. Before Phase 4 only the server imported it, which left
the client with a hardcoded generic line for the one case — proxy unreachable — where the
authored copy matters most.

## Client safety surface

All child-facing UI should render via `textContent` (GameView). Prefer
`filters.ts` as the TypeScript source of truth (do not maintain a parallel
hand-edited `.js` duplicate).
