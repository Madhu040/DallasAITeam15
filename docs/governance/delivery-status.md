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
| 1 | Golden path completes in **under 3 minutes** in demo mode | 🟨 | Path plays end-to-end (verified in-browser W1→W7 and ch1 e1→e3). **Never timed against the 3-min budget**, and ch1 grew 2→5 DPs in Phase 2, which lengthens it |
| 2 | Option-C detour + repair path demonstrate adaptivity **without shame or dead air** | ✅ | Repair loop verified in-browser on `dp_share_flower` (poor → repair insight → retry). Copy is 🔒 SME-draft |
| 3 | **No network request occurs in demo mode**; Playwright offline test passes | 🟨 | Demo mode verified working offline by hand; **no Playwright test exists** (`test:e2e` script + dep exist, no `tests/e2e/`) |
| 4 | Proxy never exposes the API key; falls back safely on timeout / malformed output | ✅ | Key is server-side only (`serverConfig`, never `VITE_`-prefixed); timeout → `scoreLocally`, malformed → `parseModelResponse` catch → fallback. Covered by `redteam.test.ts` |
| 5 | Every decision point has a complete `emotionalArc` **and** full fallback coverage | ✅ | `validate-content` enforces `emotionalArc`; `redteam.test.ts` asserts every registered DP has `safety` + `timeout` fallback lines |
| 6 | Parent gate, trust screen, and safe error surface implemented | 🟨 | Gate ✅ (`renderParentGate`, PIN + 3-fail cool-down), trust screen ✅ (`renderTrustScreen`). Error surface 🟨 — in-character API-failure line + single auto-retry only partly built (§17D) |
| 7 | Data capture **excludes raw child typed input** | ✅ | `GameEvent` stores no `rawInput`; no telemetry/Sentry in the tree. Formalize via **ADR-006** before EXT |
| 8 | Accessibility, projector legibility, performance, and **red-team** suites pass thresholds | 🟨 | **Red-team ✅ shipped** (`redteam.test.ts`, 45 cases, in CI). Accessibility ⬜ no audit; projector legibility ⬜ untested at venue res; performance ⬜ no budget measured |

**Summary: 3 of 8 fully met.** The two cheapest remaining wins are **#1 (time the golden path)**
and **#3 (a single Playwright offline assertion)** — both are hours, not days, and both are
stage-critical.

---

## Risk register (spec §26) — current mitigation state

| ID | Risk | Spec mitigation | State today |
|---|---|---|---|
| **R01** | AI safety failure | Five-layer safety, no open chat, fallback library, red-team suite, SME approval | 🟨 **Materially improved 2026-07-19.** All five layers exist; red-team suite now in CI and it **found and fixed 4 real defects** (see below). Remaining: 🔒 SME approval of distress wording; demo-mode typed input still bypasses `filterInput` |
| **R02** | COPPA / privacy noncompliance | MVP local-first; EXT legal gate; consent; minimization | ✅ for MVP (local-only, no raw input stored). 🔒 EXT blocked on **ADR-006** + counsel |
| **R03** | Runtime / platform churn | Pinned versions, ADRs, quarterly review, lockfile | ✅ Vite pinned `8.1.5`, model pinned to a dated ID, lockfile committed, ADRs now exist. ⬜ no quarterly review cadence agreed |
| **R04** | Demo network failure | Offline demo, preloaded assets, local server, recorded video | 🟨 Demo mode ✅ and verified offline. ⬜ **recorded backup video does not exist** — rung 4 of the fallback ladder is missing |
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

> This is the argument for §9.6's "safety testing is a deliverable, not a checkbox" — the safety
> stack looked complete on paper and had four holes in it.

---

## Standing blockers that are not engineering

| Blocker | Owner | Blocks |
|---|---|---|
| 🔒 SME sign-off on distress wording, the 3 new Ch.1 DPs, and Ch.2 narrative copy | Vandy + SME | Shipping any of it to a real child (spec §8.6) |
| 🔒 Counsel review of COPPA posture | Owner + Counsel | ADR-006 → the entire EXT tier |
| ⬜ Live model verification with a real API key | Build | ADR-004 is config-verified only; the live Haiku 4.5 call is unproven |
