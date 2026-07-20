# Spec coverage — Master Spec vs. what is built

> **Documents:** [`docs/specs/TruNorth Master Spec.md`](../specs/TruNorth%20Master%20Spec.md) (intent, 1798 lines)
> measured against the implemented tree in `trunorth/` as recorded in [`product.md`](../../product.md) (reality).
>
> **Spec hierarchy (resolved 2026-07-19).** The three specs in `docs/specs/` are *layered, not competing* —
> both engineering docs declare "Derived from: `TruNorth Master Spec.md` (Draft v2)", and the Consolidated
> spec states the conflict order itself:
> **Master Spec → SME/counsel rulings → Consolidated technical spec (v3.0) → ADRs → repo README.**
> This audit measures against the **Master Spec** (top of that hierarchy), so it remains valid.
> [`TruNorth Technical Specification.md`](../specs/TruNorth%20Technical%20Specification.md) is the
> Phase-1 **Draft v1 and is superseded** by Consolidated v3.0 — banner-marked, kept for history only.
>
> **Not covered here:** the Consolidated v3.0 *engineering* deltas (Vite 8.x pin, Node 24, pinned
> Haiku 4.5 model ID, WCAG 2.2 AA, Part II governance artifacts, Part III enterprise). Those are
> tracked as rows in `product.md` §5.
> **Point-in-time audit — 2026-07-19**, taken immediately after Phase 3 (commit `b2ceb82`).
> This file is a *snapshot*, not a live tracker. `product.md` §3 remains authoritative for
> "what is built"; the Master Spec remains authoritative for "what is intended";
> `product.md` §5 is the live gap list that feeds the task board.
> Re-run this audit when a phase lands and update the date above.

**Legend:** ✅ built · 🟨 partial (note says what's missing) · ⬜ not built · `[MVP]` / `[EXT]` = spec scope tier.

---

## Headline

The core `[MVP]` engine is built and CI-green: scene-graph state machine, Tier-B movement,
two playable chapters, the full five-layer companion safety stack, rubric-based scoring,
demo mode, parent gate, and celebration screens. Remaining gaps cluster in four places:
**presentation/"juice" (§17B), the `[EXT]` backend/dashboard, mini-games (§16), and the
§22A credibility items** (which are content/SME/scheduling work, not engineering).

**Biggest structural divergence:** both built chapters target ages **5–7**, whereas the spec
structures Ch.2 as 8–10 and Ch.3 as 11–15. Tracked as an open team question, not a bug.

---

## 1. Core architecture & gameplay (spec §2, §5–6)

| Feature | Spec | Status | Note |
|---|---|---|---|
| Scene-graph state machine, DOM, no engine | §2.2 | ✅ | `SceneEngine` + `DecisionResolver` |
| Tier-B movement: keyboard, collision, collectibles, proximity interact | §2.3 | ✅ | `WorldRuntime`; Tier-A fallback is a feature flag as the spec requires |
| Scene / DecisionPoint schema (`inputMode`, `themeSensitivity`, `selSkills`, `companionContext`, `consequences`, `repairAction`) | §6.1 | ✅ | All fields present in `src/types/index.ts` + content JSON |
| `emotionalArc` present on every DP, CI-enforced | §6.1a | ✅ | `scripts/validate-content.ts` fails a DP without it |
| 4–6 decision points per chapter | §6.3 | ✅ | ch1 = 5, ch2 = 6 (reached in Phase 2) |
| Authoring format: JSON under `/content`, one dir per chapter | §6.2 | ✅ | |
| JSON **Schema** gate in CI | §6.2 | 🟨 | `validate-content` is structural only; no Ajv schema pack |
| `emotionalResidue` — characters remember earlier treatment | §6.1b | ⬜ | `GameState.emotionalResidue` + `ResidueLevel` shape exist, **no behavior wired** |
| Diegetic stepping-stone progress path | §7.7 | ✅ | Shipped 2026-07-19 — `src/render/progressPath.ts`: one connected SVG trail in the `world-layer` (camera carries it with the ground), a stone per main scene (`CHAPTER_PATHS`; ch1 e2a/b/c detours fold onto the e2 stone), current stone glows + breathes, road ahead faint/dashed, not a HUD bar. Ambient life shipped alongside (`src/render/ambientLife.ts`) — light motes / dappled sun / grass-sway / bridge water glints, calm-first §17A.4. Both `aria-hidden`, freeze under reduced motion. `tests/unit/progressPath.test.ts` (4) |

## 2. SEL framework & scoring (spec §7–8)

| Feature | Spec | Status | Note |
|---|---|---|---|
| 7 tracked skill meters | §7.2 | ✅ | `createDefaultMeters()` |
| Strong / partial / poor bands; authored + typed scoring | §8.2–8.3 | ✅ | Typed path is rubric-based since Phase 3 |
| Ask-for-Help scored beat on the Ch.1 path (cross-cutting, no meter) | §7.2 | ✅ | Phase 1 — `dp_ask_grownup` → `ask_for_help` |
| Progressive meter **display** (3 in Ch.1, reveal on schedule) | §7.2 | ⬜ | All 7 tracked, but no chapter-gated reveal in the HUD |
| Positive self-talk decision-point type (Self-Worth, in-story) | §16.4 | ⬜ | |

## 3. AI companion & safety (spec §9) — strongest area

| Feature | Spec | Status | Note |
|---|---|---|---|
| Fixed character, no open chat, input scoped to the active DP | §9.2 | ✅ | |
| Five defense layers: input filter · prompt contract · structured JSON · output filter · fallback library | §9.3 | ✅ | Server path complete |
| Structured response contract | §9.4 | ✅ | `matchedCriterion` surfaced as of Phase 3 |
| Timeout + graceful fallback; API key server-side only | §9.5, §9.7 | ✅ | |
| Distress flag + distress-aware resume | §9.6, §17D | ✅ | Phase 1; **re-entry copy is SME-draft** |
| Low-confidence → hand-authored fallback line | §17B.9.3 | ✅ | Confidence floor wired |
| `companionLine` ≤120 chars **measure-and-split** into sequential bubbles | §9.4 | 🟨 | Currently truncates at 120; does not split into click-through bubbles |
| Red-team adversarial suite (jailbreak / injection / distress battery) | §9.6 | ⬜ | Filters unit-tested; the spec calls the suite a *deliverable* |
| Strength-mirroring from the event log | §9.8 | ⬜ | Mechanic absent |
| `baselineStrength` onboarding seed (solves the §9.8 session-1 empty state) | §17C.3a | ⬜ | Profile field exists but is never seeded by an onboarding question. Spec tags this 🟢 do-not-cut |
| Demo/offline typed input runs `filterInput` | §9.3 | 🟨 | Server filters; `DemoCompanionClient` does not |

## 4. Rewards & progression (spec §7)

| Feature | Spec | Status | Note |
|---|---|---|---|
| Brownie points / collectibles | §7.1 | ✅ | |
| Meter fill + persistence | §7.2 | ✅ | |
| Celebration / graduation screens | §7.4 | ✅ | `renderCelebration` |
| Kindness Sparks: gated behind kind actions + non-maxed "found X of Y" tally | §7.6 | 🟨 | Collectibles + `kindnessSparksFound` exist; kind-gating and the celebration tally are incomplete |
| Companion **visual** level-up / new looks | §7.3 | ⬜ | `companion.level` / `appearanceRef` never read |
| Reward "juice": companion reaction + particle flight → meter fill; stimulation budget | §17B.2 | ⬜ | `onMeterJuice` hook exists but only re-renders |

## 5. Persistence & backend (spec §11)

| Feature | Spec | Status | Note |
|---|---|---|---|
| `ProgressStore` interface + `LocalProgressStore` `[MVP]` | §11.1 | ✅ | + `DemoProgressStore` |
| Auto-save at every decision point | §5.2, §17D | ✅ | |
| Event-log schema | §11.5 | 🟨 | `GameEvent` covers the core fields; missing `rawInput`, `skills[]`, `companionLineUsed`, `confidence`, `strengthsSnapshot` — the last is what §9.8 would read |
| `RemoteProgressStore` client + cross-device sync `[EXT]` | §11.3 | 🟨 | Server endpoints + SQLite exist; **client not wired**, not hosted |
| No secrets in client code | §11.4 | ✅ | env-only |

## 6. Parent surfaces (spec §12, §14, §17E)

| Feature | Spec | Status | Note |
|---|---|---|---|
| Parent gate: PIN, child-resistant, 3-fail cool-down, grown-up surface | §12.2, §12.4 | ✅ | `renderParentGate` |
| Gate framed as a **connection ritual**, not a PIN-only lock | §12.1 | 🟨 | Mechanic is a PIN; the connection check-in copy isn't surfaced |
| Trust / transparency screen ("what the companion can and can't say") `[MVP]` | §17E | ✅ | `renderTrustScreen` |
| Watch / co-play mode with coach's-corner SEL prompts; child keeps agency | §17E | ✅ | Together Mode + `coPlay` prompts + cross-device Play Together |
| Parent dashboard with developmental metrics `[EXT]` | §14 | 🟨 | `buildJourneyReflection` is a post-play parent summary, not a trends dashboard |

## 7. UX & interaction detailing (spec §17A–17B)

| Feature | Spec | Status | Note |
|---|---|---|---|
| Overhead in-world dialogue bubbles | §17B.1 | ✅ | + z-layering fix |
| Async input-freeze during an in-flight fetch | §17B.9.1 | ✅ | |
| Interaction lock at emotional pivots (`pivotLockMs`) | §17B.6 | 🟨 | Field exists on some DPs; freeze-on-fetch works, but no typewriter-pivot lock |
| Uniform scaling / **16:9 letterbox** lock | §17B.7 | 🟨 | Stage scales via a `--px` size container; not a strict 16:9 letterbox with bars |
| Progressive/typewriter text + tap-to-complete truth table | §17B.6 | ⬜ | Spec calls this the mechanism that *enforces* reflective pacing |
| Sound design: SFX, ambient bed, event-mapped cues | §17B.4 | 🟨 | Engine + event wiring shipped 2026-07-19 (`src/audio/sfx.ts`) — footsteps, discovery/spark chimes, strong/poor decision stings, celebration fanfare, calm-first ambient bed, mute toggle. No CC0 audio files sourced yet; every cue plays silence until `public/audio/README.md`'s filenames are filled in |
| Three expression states for every character | §17B.3 | 🟨 | neutral/worried/happy/calm exist; not a formalized per-character 3-state pipeline |
| Hybrid voice input `[EXT]` | §17B.8 | ⬜ | Privacy-gated in spec |
| Accessibility: keyboard operability, contrast, color+icon, ARIA | §17, §17A.4 | 🟨 | Keyboard ✅, some ARIA labels; no formal audit (spec §22A.5 wants a proof pass) |

## 8. Onboarding, states, art, demo, deploy

| Feature | Spec | Status | Note |
|---|---|---|---|
| Onboarding: companion archetype + naming, avatar skin-tone/hair | §17C, §3.6 | ✅ | |
| `baselineStrength` seed question | §17C.3a | ⬜ | See §3 above — spec tags 🟢 do-not-cut |
| Empty / error / resume states | §17D | 🟨 | Distress-resume ✅; in-character API-failure line + single auto-retry only partly covered |
| Demo mode: `?demo=1`, canned bundle, offline, visually identical, demo pill `[MVP-critical]` | §13A | ✅ | Re-verified in-browser 2026-07-19 |
| Recorded backup demo video | §13A.7 | ⬜ | Stage fallback ladder rung 4 |
| Frozen "clean cartoon" AI art + asset manifest | §10 | 🟨 | 8-bit pixel-SVG cast + placeholder zone PNGs; no `assetRef → file` manifest |
| Live public URL / serverless deploy | §13 | 🟨 | Vercel adapter scaffolded; not deployed |
| Mini-games: emotion-recognition, 3-breath cool-down, affirmation `[EXT]` | §16 | ⬜ | The multi-tap "breathe" beat is a kindness mini-game, not the calm-down tool |
| Chapter 3 (11–15, free typing, resilience) | §4 | ⬜ | Spec marks it a stretch goal |

## 9. Credibility gaps a reviewer will probe (spec §22A)

These are mostly **content, scheduling, and SME work — not engineering** — and the spec ranks
them above additional `[EXT]` features for judge confidence.

| Item | Spec | Status |
|---|---|---|
| Evidence the SEL works (pre/post probe or one cited study) | §22A.1 | ⬜ owner + SME |
| Real-child playtest clip | §22A.2 | ⬜ Test lane |
| Parent-trust story | §22A.3 | ✅ built (`renderTrustScreen`); needs SME sign-off on the wording |
| Graceful-mediocrity posture (AI unhelpful-but-safe) | §22A.4 | ✅ confidence floor → vetted fallback |
| Accessibility proof pass (screen-reader / keyboard / contrast) | §22A.5 | ⬜ |
| Representation review before art lock | §22A.6 | 🟨 configurable avatar ✅; art review pending |
| Failure / empty states verified in a test pass | §22A.7 | 🟨 |
| Business case names the trust risk | §22A.8 | ⬜ Business lane |

---

## Cross-cutting note — SME sign-off is the shared blocker

Phases 1–3 shipped real mechanics whose **copy is explicitly draft**: the distress re-entry
lines (§17D), the three new Ch.1 decision points, and the Ch.2 narrative. Per spec §8.6 and
Appendix A/B, no chapter's content is "locked" until the SME reviews scenarios, option bands,
companion coaching lines, and the typed-reply rubric. That review — not more engineering —
is the gate on shipping any of it to a real child.
