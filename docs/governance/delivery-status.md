# Delivery status — Definition of Done & risk register

> **Documents:** the Consolidated Technical Specification **§26 (risk register)** and
> **§27 (Definition of Done)**, tracked against what is actually built as recorded in
> [`product.md`](../../product.md) §3.
>
> The spec *states* the DoD and the risks; it cannot say **where we stand against them**.
> That is this file's only job. Point-in-time — **2026-07-19**, after Phase 4.
> Live gap list remains `product.md` §5.

**Legend:** ✅ met · 🟨 partial · ⬜ not met · 🔒 blocked on a non-engineering sign-off

---

## Definition of Done — MVP showcase (spec §27)

| # | Criterion | Status | Evidence / what's missing |
|---|---|---|---|
| 1 | Golden path completes in **under 3 minutes** in demo mode | 🟨 | **Engine time now measured: 6.2s** for the full 5-DP ch1 chapter (`tests/e2e/demo-mode.spec.ts`), against a 180s budget — the engine is nowhere near the constraint, leaving ~174s of reading/thinking headroom. **Still 🟨 because a scripted walk-through is not a child**: the DoD criterion is about a *child* finishing in 3 minutes, which needs the §22A.2 human playtest. Automated run is a regression guard only |
| 2 | Option-C detour + repair path demonstrate adaptivity **without shame or dead air** | ✅ | Repair loop verified in-browser on `dp_share_flower` (poor → repair insight → retry). Copy is 🔒 SME-draft |
| 3 | **No network request occurs in demo mode**; Playwright offline test passes | ✅ | `tests/e2e/demo-mode.spec.ts` (3 tests, in CI): asserts zero off-origin and zero `/api/` requests during scored play, **and** replays the path with the network hard-blocked (§13A.3). Writing it **found a real defect** — see below |
| 4 | Proxy never exposes the API key; falls back safely on timeout / malformed output | ✅ | Key is server-side only (`serverConfig`, never `VITE_`-prefixed); timeout → `scoreLocally`, malformed → `parseModelResponse` catch → fallback. Covered by `redteam.test.ts` |
| 5 | Every decision point has a complete `emotionalArc` **and** full fallback coverage | ✅ | `validate-content` enforces `emotionalArc`; `redteam.test.ts` asserts every registered DP has `safety` + `timeout` fallback lines |
| 6 | Parent gate, trust screen, and safe error surface implemented | 🟨 | Gate ✅ (`renderParentGate`, PIN + 3-fail cool-down), trust screen ✅ (`renderTrustScreen`). Error surface 🟨 — in-character API-failure line + single auto-retry only partly built (§17D) |
| 7 | Data capture **excludes raw child typed input** | ✅ | `GameEvent` stores no `rawInput`; no telemetry/Sentry in the tree. Formalize via **ADR-006** before EXT |
| 8 | Accessibility, projector legibility, performance, and **red-team** suites pass thresholds | 🟨 | **Red-team ✅ shipped** (`redteam.test.ts`, 45 cases, in CI). Accessibility ⬜ no audit; projector legibility ⬜ untested at venue res; performance ⬜ no budget measured |

**Summary: 4 of 8 fully met** (was 3 before the e2e work).

### What the offline test found (2026-07-19)

Writing DoD item 3 immediately caught a **real stage-readiness defect**: `index.html` loaded
**Nunito and Inter from Google Fonts over the network**, violating §13A.1 ("demo mode disables
external asset fetches — all assets preloaded/bundled") and §13A.3 ("must run with no internet
at all"). On a stage with failed WiFi the game would have silently rendered in system fallback
fonts — different typography from every rehearsal, and a direct hit to the §17B.5 guard-3
legibility requirement and §13A.4 "readable from 50 feet".

Fixed by **self-hosting both fonts** (`public/fonts/*.woff2`, SIL Open Font License, single
variable file each, ~85 kB total) with `@font-face` in `global.css` and `<link rel="preload">`
in `index.html`. Verified: no `fonts.googleapis.com`/`fonts.gstatic.com` reference survives in
`dist/`, and the hard-blocked-network test passes.

> Same lesson as the red-team suite: demo mode *looked* offline-safe and wasn't. The
> stage-safety claims in §13A only become true when something asserts them.

**Remaining cheapest wins:** #6 (in-character API-failure surface + auto-retry) and #8's
accessibility pass — the latter is also §22A.5, where it doubles as a credibility story.

---

## Risk register (spec §26) — current mitigation state

| ID | Risk | Spec mitigation | State today |
|---|---|---|---|
| **R01** | AI safety failure | Five-layer safety, no open chat, fallback library, red-team suite, SME approval | 🟨 **Materially improved 2026-07-19.** All five layers exist; red-team suite now in CI and it **found and fixed 4 real defects** (see below). Remaining: 🔒 SME approval of distress wording; demo-mode typed input still bypasses `filterInput` |
| **R02** | COPPA / privacy noncompliance | MVP local-first; EXT legal gate; consent; minimization | ✅ for MVP (local-only, no raw input stored). 🔒 EXT blocked on **ADR-006** + counsel |
| **R03** | Runtime / platform churn | Pinned versions, ADRs, quarterly review, lockfile | ✅ Vite pinned `8.1.5`, model pinned to a dated ID, lockfile committed, ADRs now exist. ⬜ no quarterly review cadence agreed |
| **R04** | Demo network failure | Offline demo, preloaded assets, local server, recorded video | 🟨 **Materially improved 2026-07-19** — demo mode is now *proven* offline by CI (hard-blocked-network e2e), and the Google-Fonts CDN dependency that would have degraded typography on a WiFi failure is removed (fonts self-hosted). ⬜ **recorded backup video still does not exist** — rung 4 of the fallback ladder is missing |
| **R05** | Asset inconsistency / IP uncertainty | Style lock, provenance ledger, regeneration policy | ⬜ Open — **ADR-005**. No manifest, no provenance ledger; built art diverges from spec §10 |
| **R06** | Branching / content explosion | Bounded bands, repair actions, schema validation, review | ✅ Three bands only, converging routing, `validate-content` in CI. 🟨 no Ajv JSON-Schema pack yet |
| **R07** | Poor accessibility / keyboard flow | WCAG 2.2 AA, keyboard E2E, manual screen-reader pass | ⬜ Keyboard play works, some ARIA labels exist, but **no audit, no E2E, no screen-reader pass**. Spec §22A.5 wants this as a *told* part of the demo |
| **R08** | Performance on Chromebook / projector | Bundle budget, particle caps, viewport tests, low-end profile | 🟨 Bundle is small (~146 kB JS / 45 kB gzip) and builds in <1s, but **no budget is enforced** and no low-end/projector test has run |

### R01 — what the red-team suite actually found (2026-07-19)

Running the §9.6 battery for the first time surfaced four **live-path** defects, all now fixed
and regression-guarded in `tests/unit/redteam.test.ts`:

1. **False positive, most serious.** Profanity used substring matching, so `"hello".includes("hell")`
   was true — *"hello Jamie, want to play with us?"*, effectively the ideal answer to the game's
   first typed decision point, was **blocked as profanity**. Now word-boundary matched.
2. **Real-world meet-up requests passed through** and were scored as ordinary answers, despite
   Appendix A §4.3 forbidding the topic outright.
3. **PII *solicitation* was unfiltered** ("what is your address", "where do you live") — only the
   child disclosing their own PII was caught.
4. **Jailbreak patterns were too narrow** — "ignore your instructions", "disregard your guidelines",
   "you are now DAN", "no limits" all passed.

Also hardened: distress is now evaluated **first**, so a distressed child reaches the distress
path even when the message also trips profanity.

**Two further defects surfaced by live-model verification (2026-07-19):** `matchedCriterion`
was silently dropped on the live path (required by §9.4/§8.3), and Haiku 4.5 emitted
*"that's a superpower"* — the exact identity-claiming phrasing the §9.8 guard forbids and
names as a correction target. Both fixed; the identity guard is enforced in the system prompt
**and** at the output filter, because a prompt instruction is not an enforcement mechanism.

> This is the argument for §9.6's "safety testing is a deliverable, not a checkbox" — the safety
> stack looked complete on paper and had four holes in it.

---

## Standing blockers that are not engineering

| Blocker | Owner | Blocks |
|---|---|---|
| 🔒 SME sign-off on distress wording, the 3 new Ch.1 DPs, and Ch.2 narrative copy | Vandy + SME | Shipping any of it to a real child (spec §8.6) |
| 🔒 Counsel review of COPPA posture | Owner + Counsel | ADR-006 → the entire EXT tier |
| ✅ ~~Live model verification with a real API key~~ | Build | **Done 2026-07-19** — real Haiku 4.5 calls verified against the §9.4 contract; found and fixed 2 live-path defects (see ADR-004) |
