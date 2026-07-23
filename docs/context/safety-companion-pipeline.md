# Safety & companion pipeline

**Sources:** `trunorth/server/routes/companion.ts`, `trunorth/src/companion/CompanionClient.ts`,
`trunorth/src/companion/fallbackLines.ts`, `trunorth/src/safety/filters.ts`,
`trunorth/content/fallbacks/companion-fallbacks.json`,
`trunorth/content/demo/showcase.bundle.json`, `trunorth/src/counselor/insights.ts`,
`trunorth/server/routes/checkin.ts`, `trunorth/src/companion/CheckinScorer.ts`,
`trunorth/src/counselor/checkin.ts`

## Live path (`LiveCompanionClient` → Hono)

1. **Input filter** (`filterInput`) — blocks jailbreak, distress, PII patterns, etc.
   On block: safety fallback line + redirect response.
2. **Auth gate (2026-07-20 — cost/abuse control, not a safety control):** the Anthropic
   call only ever happens on an authenticated (logged-in parent) session. Both
   `/api/companion` and `/api/checkin/score` read the `Authorization: Bearer` header and
   `verifySupabaseToken` it; **no header, a garbage/expired token, or no key configured
   are all the same branch** — straight to the offline scorer, same as always. Client
   plumbing already existed for this (`LiveCompanionClient`/`LiveCheckinScorer` already
   took an optional bearer token) — this was a **server-only** change, since the server
   is the actual trust boundary and never assumed the client's own state. Guarded by
   `tests/unit/authGate.test.ts`, which deliberately runs against whatever
   `ANTHROPIC_API_KEY` is in the local `.env` (no mocking) so a regression would either
   time out or return a live-shaped response instead of silently passing.
   ⚠️ **Practical consequence:** "Play Now (Guest)" — the primary, most common way a child
   plays — never triggers a live Claude call under this rule, for either the DP companion
   or the check-in, regardless of whether a key is configured. Only sessions reached via
   parent login (`renderAuthForm` → `"children"` screen → Continue → hub) get live-scored
   companion feedback and check-in scoring; the guest path is the same offline-heuristic
   experience it always was before this change.
3. **Model or local score** — if `ANTHROPIC_API_KEY` set and step 2 passed, Claude call
   (~8s timeout); else `scoreLocally` heuristic + fallback library line.
4. **Confidence floor** (default 0.55) — low confidence → fallback band/line.
5. **Output filter** (`filterOutput`) — reject unsafe model text → substitute fallback.
6. Attach counselor `insightForStep` child/parent tips when available.

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

## Check-in LLM scoring (`routes/checkin.ts`, `CheckinScorer.ts`) — new 2026-07-20

The pre-level check-in's typed ("own words") answers were 100% offline keyword-heuristic
until now. This adds an LLM-scored path with the same architecture principles as the DP
companion pipeline above, but **one design difference**: it scores the **whole check-in as
a single batch call at the end**, not per-question — the check-in already shows no
per-question feedback (only the final compass screen), so there's no UX reason to make one
call per answer, and batching means the model sees all of a chapter's answers together.

**Why safety filtering is never deferred to that batch call:** `checkTypedSafety` (in
`src/counselor/checkin.ts`) runs `filterInput` **synchronously, on submit**, exactly like
before this change — a distress disclosure is caught the instant it's typed, not after a
network round-trip. Only answers that pass this local check are queued into
`pendingTyped`; blocked ones finalize instantly with the same fallback points rule
(distress → 0, anything else blocked → 1) and are never sent anywhere.

**Server side never trusts that client-side check happened.** `POST /api/checkin/score`
re-runs `filterInput` per answer on arrival — an answer it blocks server-side gets the same
fallback point rule and is excluded from the Anthropic call, mirroring `/api/companion`'s
"the server is the actual boundary" posture.

**Scoring path**, for whatever answers pass the server's filter:
1. No `ANTHROPIC_API_KEY`, **or no valid logged-in parent session** (see the auth gate
   above — same rule applies here) → `scoreCheckinTextLocally` (the same pure keyword
   scorer `checkTypedSafety`'s caller — the offline/demo fallback — already uses; single
   source of truth, so client-offline and server-fallback scoring can never drift apart).
   No `reason`, no `greeting` — their absence IS the tell that this was the offline path.
2. Key present AND authenticated → one Claude call with a system prompt asking for BOTH,
   in a single response: a 0-2 score + one-sentence internal `reason` per answer ("never a
   grade, never a diagnosis, judge only the feeling conveyed"), and one short (≤240 char)
   personalized `greeting` in the companion's voice, addressed to `childName` and weaving in
   a specific detail from EACH answer given (2026-07-23: previously asked for "something
   specific" from just one answer — now explicitly instructed to reference every question
   answered, with the char budget raised from 160 to fit). Strict JSON object contract:
   `{"scores":[{"questionId","points":0-2,"reason"}],"greeting"}`.
3. `parseModelResponse` validates each score entry (`questionId` must be one the request
   asked about, `points` must be exactly 0/1/2) and **falls back to the offline heuristic
   per-item** for anything the model dropped, mis-shaped, or scored out of range — a
   question is never left unscored. `reason` is truncated (200 chars) but never safety-
   filtered — it's a **dev-console-only verification aid**, `console.log`ged from
   `renderCheckin`, deliberately never rendered in the DOM so it can't run afoul of the
   "no assessment language in front of the child" rule `child-surface.spec.ts` guards.
4. **`greeting` IS real free text reaching the child** (unlike the points-only contract
   this route shipped with a day earlier), so it goes through `filterOutput` before ever
   being returned — same boundary rules as the companion pipeline (no clinical terms, no
   identity-claiming, no mentioning a score/grade). An unsafe or absent greeting is simply
   omitted (`undefined`), never substituted with something unverified.
5. Any exception (network/timeout/JSON parse) falls back to the offline heuristic — and no
   greeting — for the whole remaining batch.

**Client orchestration** (`scoreCheckinBatch` in `CheckinScorer.ts`, returning
`{ scores: Map<questionId, {points, reason?}>, greeting? }`) applies the identical
graceful-degradation principle one layer up: if the live call throws, every pending answer
falls back to the offline heuristic and there's no greeting; if it returns a partial
result, only the missing questions do. `renderCheckin` (`src/ui/screens.ts`) shows a brief
"{companion} is thinking about what you shared…" card while this one batch call is in
flight, then renders the existing compass/placement screen — now showing the live
`greeting` (own emphasized `.checkin-greeting` CSS style) in place of the generic
`checkinCompanionLine` whenever one comes back. `buildCheckinResult`'s point math was not
touched by any of this, only how a typed answer's points (and now also a greeting) get
produced.

**Closing the child-name gap.** The greeting needs a real name to be worth anything, but
`gameState.profile.childDisplayName` defaults to the hardcoded placeholder `"Nova"` for
every solo session and the `childrenScreen.ts` "Continue" button never actually fed a real
child profile's name into gameplay state. Fixed alongside this: each child row now has its
own **"Play as {name}"** button (`renderChildren`'s `onContinue` takes an optional
`childName`); `main.ts`'s `"children"` case sets `gameState.profile.childDisplayName` from
it before navigating to hub. Without using that button, the greeting will address "Nova."

**Verified fully live** (not just the fallback path): a throwaway pre-confirmed Supabase
test user (created via the Auth admin API, since this project has email confirmation on —
plain signup doesn't grant a session) got a real access token, and a real
`/api/checkin/score` call with two distinct typed answers returned specific correct
reasons and a greeting naming the child and referencing both answers, cleanly passing
`filterOutput` — a ~2.2s round-trip vs the <35ms unauthenticated fallback. Test user
deleted afterward.
