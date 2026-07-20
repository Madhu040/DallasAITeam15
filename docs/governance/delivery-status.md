# Delivery status — Definition of Done & risk register

> **Documents:** the Consolidated Technical Specification **§26 (risk register)** and
> **§27 (Definition of Done)**, tracked against what is actually built as recorded in
> [`product.md`](../../product.md) §3.
>
> The spec *states* the DoD and the risks; it cannot say **where we stand against them**.
> That is this file's only job. Point-in-time — **2026-07-20**, after §22 Phase 4 hardening
> items 1–5 (red-team, error surface, accessibility, performance budget, projector) **and an
> owner-directed game-feel arc** running well past the original NEXT-5: assessment-leak fix,
> reward juice, Ch.1+Ch.2 explore loops, following camera, the full art asset manifest (all
> 9 characters + 5 backgrounds + 17 props are real AI art), a sound engine (§17B.4) with all
> 7 clips now landed and wired, the diegetic stepping-stone path + ambient life (§7.7), the
> scenario-hub art refresh, **a full owner-playtest defect pass** (avatar art canon + 5 true
> skin-tone recolours, top-of-frame head-clipping fixed, 91 crystal pickups scattered per
> §7.1, per-scene spawn points so the decision is a real ~1000px journey rather than a
> one-second walk, copy personalized via `{name}`/`{companion}` tokens fixing 75 hardcoded
> "Flicker"/"Nova" instances, popup art now real PNGs, TTS narration cleaned up), and the
> **decision overlay now scales with resolution on any projector** (closing the gap this very
> file's DoD §27/§13A.6 rows first surfaced) — local commits through `273e6e6`, **40+ commits
> ahead of `origin/main`, still entirely unpushed**.
> Live gap list + the **NEXT-5 roadmap** remain `product.md` §5 (see the 📍 Current-position
> block) — all five of the original NEXT-5 items are now ✅ done. **What's actually next:**
> (1) **push to GitHub and confirm CI genuinely runs** — every "in CI" claim anywhere in this
> file has been *configured* but never once verified against a real push, and 40+ commits
> exist on a single machine with no remote copy; (2) **SME sign-off** on all child-facing
> copy written across this entire arc (§8.6) — the actual shipping blocker, separate from any
> engineering task; (3) the three remaining human Phase-4 items (manual screen-reader pass
> §22A.5, recorded backup video §13A.7, scope freeze — owner call, gates Phase 5); (4) a
> product decision on `singing-bridge` — a built, walkable grid level with zero scenes bound
> to it and no background art; either author the scene or delete the orphaned level.

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
| 6 | Parent gate, trust screen, and safe error surface implemented | ✅ | Gate ✅ (`renderParentGate`, PIN + 3-fail cool-down), trust screen ✅ (`renderTrustScreen`). **Error surface ✅ 2026-07-19** — `LiveCompanionClient` runs the §17D ladder (attempt → one in-character retry showing `API_RETRY_LINE` → hand-authored per-decision fallback, decision resolved anyway). Verified in a real browser in live mode with every `/api/**` call aborted: exactly 2 attempts, child saw the tangled-words line then the authored fallback, story continued. Retry copy is 🔒 SME-draft |
| 7 | Data capture **excludes raw child typed input** | ✅ | `GameEvent` stores no `rawInput`; no telemetry/Sentry in the tree. Formalize via **ADR-006** before EXT |
| 8 | Accessibility, projector legibility, performance, and **red-team** suites pass thresholds | 🟨 | All four suites now exist and pass in CI: **red-team ✅** (`redteam.test.ts`, in CI), **accessibility 🟨** (`accessibility.spec.ts` — axe WCAG 2.2 AA + keyboard-only + focus ring + reduced motion; found and fixed 2 real defects), **projector ✅** (`projector.spec.ts` — 1024×768 / 1366×768 / 1920×1080), **performance ✅** (`audit:bundle`, spec §19, fails CI on breach). Held at 🟨 for two honest reasons: the §22A.5 **manual screen-reader pass** has not happened and is the actual deliverable, and §13A.6 asks for verification at the **venue's** projector, which CI cannot do |

**Summary: 5 of 8 fully met** (was 4 before the Phase 4 hardening work).

### What the accessibility pass found (2026-07-19)

Same pattern as the red-team and offline suites — the rules were written down and partly
unimplemented, and only running something found it:

1. **The landing screen's primary CTA failed WCAG AA at 2.36:1.** `.btn-primary` put
   `--text-dark` (#3d3d3d) on `--accent` (#9d4edd) — the first button anyone presses in
   the demo, well under the 4.5:1 §20 requires. Fixed with a new `--accent-deep` token
   (#5a189a, ~10:1 against white). The audit also caught `.typed-submit` and
   `.companion-thinking` scraping past at **4.58:1** — passing, but with almost no margin
   on a projector; both moved to the deeper token too.
2. **`prefers-reduced-motion` did not actually stop motion.** The reset capped
   `animation-duration` to 0.01ms but left `animation-iteration-count`, so `infinite`
   animations (avatar walk-bob, companion thinking pulse) kept looping forever, just
   imperceptibly — still driving the compositor, which works against the §19 Chromebook
   frame-rate budget and is not what §20 "reduced motion disables shake/particles" asks for.

> **What this pass is not.** Automated tooling catches roughly a third of WCAG issues. The
> §22A.5 ask — a screen-reader + keyboard pass run by the team's visually-impaired member,
> whose account becomes a told part of the demo — is untouched by any of this. A green CI
> run is the floor that makes that session worth their time, not a substitute for it.

### What the projector pass found (2026-07-19)

Verifying 1024×768 / 1366×768 / 1920×1080 settled one open question and opened one gap:

- **Settled:** the `--px` size container *does* hold the stage at 16:9 (1024×768 → a
  1024×576 stage) and never stretches it, so the 4:3 case is safe. What §17B.7 is still
  missing is only the explicit letterbox *treatment*, not the aspect lock.
- **New gap:** the decision overlay is **fixed-size** — 452×64px with 16px text at every
  resolution tested, unlike characters and HUD which scale. It sits exactly on the §17A.4
  64px floor everywhere, so it passes, but it means that on a large venue projector the
  single most important surface in the demo is proportionally the *smallest* it ever gets.
  That cuts directly against §13A.4 "readable from 50 feet". Logged in `product.md` §5.

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

**Both of those wins were taken on 2026-07-19** — see items 6 and 8 above. The remaining
DoD gaps are no longer engineering: #1 needs the §22A.2 human playtest, and #8's last leg
is the §22A.5 manual screen-reader pass.

---

## Risk register (spec §26) — current mitigation state

| ID | Risk | Spec mitigation | State today |
|---|---|---|---|
| **R01** | AI safety failure | Five-layer safety, no open chat, fallback library, red-team suite, SME approval | 🟨 **Materially improved 2026-07-19.** All five layers exist; red-team suite now in CI and it **found and fixed 4 real defects** (see below). Remaining: 🔒 SME approval of distress wording; demo-mode typed input still bypasses `filterInput` |
| **R02** | COPPA / privacy noncompliance | MVP local-first; EXT legal gate; consent; minimization | ✅ for MVP (local-only, no raw input stored). 🔒 EXT blocked on **ADR-006** + counsel |
| **R03** | Runtime / platform churn | Pinned versions, ADRs, quarterly review, lockfile | ✅ Vite pinned `8.1.5`, model pinned to a dated ID, lockfile committed, ADRs now exist. ⬜ no quarterly review cadence agreed |
| **R04** | Demo network failure | Offline demo, preloaded assets, local server, recorded video | 🟨 **Materially improved 2026-07-19** — demo mode is now *proven* offline by CI (hard-blocked-network e2e), and the Google-Fonts CDN dependency that would have degraded typography on a WiFi failure is removed (fonts self-hosted). ⬜ **recorded backup video still does not exist** — rung 4 of the fallback ladder is missing |
| **R05** | Asset inconsistency / IP uncertainty | Style lock, provenance ledger, regeneration policy | 🟨 **Further improved 2026-07-20** — the **`assetRef → file` manifest** (`src/content/assetManifest.ts`, spec §10.3) now covers **9 of 9 characters** (all real AI art), 5 backgrounds, 17 props, all behind a live placeholder fallback. **R05's drift-catching worked twice more this arc**: `wize.png` briefly shipped as a human child instead of the owl the narration describes (caught, held back, owner-regenerated, now live); and the 5-tone avatar set independently drifted (headband colour varied, 2 of 5 carried unintended props) — a *de facto* style lock is now written down in `public/assets/README.md` (locked canon: plain purple headband, no props, one approved base recoloured per tone) with a keep/regenerate table per file and `tests/unit/avatarTones.test.ts` machine-checking tone order/spacing/alpha so a bad regeneration can't ship silently. ⬜ Still open under **ADR-005**: no formal *provenance ledger* (which tool/prompt/licence per asset) or written *regeneration policy* beyond the avatar case — those remain the owner/counsel calls, not the wiring |
| **R06** | Branching / content explosion | Bounded bands, repair actions, schema validation, review | ✅ Three bands only, converging routing, `validate-content` in CI. 🟨 no Ajv JSON-Schema pack yet |
| **R07** | Poor accessibility / keyboard flow | WCAG 2.2 AA, keyboard E2E, manual screen-reader pass | 🟨 **Materially improved 2026-07-19** — axe WCAG 2.2 AA audit **and** a keyboard-only E2E now run in CI, and writing them found and fixed 2 real defects (2.36:1 contrast on the primary CTA; reduced-motion not actually stopping infinite animations). ⬜ **The manual screen-reader pass has still not happened** — it is the §22A.5 deliverable and the mitigation's third leg |
| **R08** | Performance on Chromebook / projector | Bundle budget, particle caps, viewport tests, low-end profile | 🟨 **Further improved 2026-07-20** — bundle budget enforced in CI (`audit:bundle`, spec §19; 9.91 MB dist / 66% of budget) and viewport tests run at 1024×768 / 1366×768 / 1920×1080 with a 3s load-budget assertion. **The viewport suite itself found and closed a real gap**: the decision overlay was fixed-px at every resolution alike, unlike characters/HUD which scale — proportionally the *smallest* thing on screen at a big venue projector. Fixed (`--overlay-px` scaling) and the test strengthened to prove genuine scaling rather than mere floor-compliance (a fixed-px element sitting exactly on the accessibility floor passes a floor-only check identically to one that actually scales — the ambiguity that let the original bug ship unnoticed). ⬜ Still unmeasured: the §19 **frame-rate** row (60fps, no sustained <45fps) and **particle cap** (≤12) — both need a real low-end device profile, not a build artifact |

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
