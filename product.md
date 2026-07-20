# TruNorth — Product Context (`product.md`)

> **Living implementation ledger.** This file is the single high-level, always-current
> picture of **what actually exists in `trunorth/` right now** — files, methods,
> and functionality. Design intent lives in [`docs/README.md`](./docs/README.md) and the
> specs under [`docs/specs/`](./docs/specs/) — **product intent:**
> [`TruNorth Master Spec.md`](./docs/specs/TruNorth%20Master%20Spec.md); **engineering intent:**
> [`Consolidated TruNorth-Technical-Specification.md`](./docs/specs/Consolidated%20TruNorth-Technical-Specification.md) (v3.0).
> This file is not a plan — reality always wins here.

---

## Team roles & task board

Each teammate has one active to-do. Tasks come from the current gaps in Section 3
(⬜ / 🟨 items and pending work). Check a task off only when the matching Section 3
entry is updated in the same change.

> **🔧 = actively being worked on.** The folder tree (Section 2) and component entries
> (Section 3) are tagged `🔧 <name>` wherever someone on this board is currently
> working. Check for a 🔧 tag before touching an area — coordinate with the owner first.

### Ermoni — Backend (Supabase, first iteration: level images) 🔧

- [ ] Get Supabase connected to the app and storing the **level / zone images** (start with
  Level 1 / Everbright), so the app can pull the right images per
  level when needed — **without breaking** the fully-offline demo path (`?demo=1` +
  `public/assets/zones/`). Design the visuals together with Gabby, based on
  [`docs/scripts/Updated-Script-6-8anxiety .docx`](./docs/scripts/Updated-Script-6-8anxiety%20.docx) (current script).

### Gabby — Backend (Supabase level images, with Ermoni) 🔧

- [ ] Design the SVG / asset frames for Level 1 (Flicker, Wize, Nova, Star Crystal)
  from the current 5–7 anxiety script, and work with Ermoni to store them in Supabase
  and wire pull-per-level in the app (keep local placeholders as offline fallback).

### Daniel — Frontend (Level 1 content + gameplay UX)

- [x] ~~Ship Level 1 **The Singing Bridge** from Vandy’s script into playable content~~
  (W1→W6 scenes, DPs, Flicker/Wize cast, multi-tap breathe/crossing, celebration,
  insights/fallbacks/demo bundle) — done 2026-07-13.
- [x] ~~Ship world movement + environment interact~~ (WASD/arrows, collision, E/Space,
  companion follow, sparks) — done 2026-07-14.
- [x] ~~Rebase Level 1 onto the new 5–7 anxiety script, **The Little Dragon Who Wouldn't
  Stop Guarding** (Nova/Flicker/Star Crystals), and ship cross-device **Play Together**
  invites + mobile/LAN play~~ — branch `feat/singing-bridge-level-1` (PR #7) diverged
  from main before the w7 finish/Wize-Flicker-fix/stage-objects/z-layering work landed,
  so it was manually reconciled onto a fresh branch off main rather than merged: new
  narrative content (dp_\*.json, w1–w7 scenes, zones/achievements/celebration,
  coPlay/insights/fallbacks/demo bundle) replaces the old Singing Bridge text 1:1 on the
  same DP ids; **4 new grid maps** (`forest-of-questions`, `meadow-of-curiosity`,
  `cave-of-purpose`, `mountain-festival`) replace the single `singing-bridge` grid so
  the explorable-movement feature keeps working with the new per-scene biomes; the w7
  walk-to-finish mechanic, Wize/Flicker character-role split, dialogue z-layering fix,
  and speech/voice toggle from main are all preserved unchanged. Play Together (new
  `server/routes/together.ts`, `src/together/inviteStore.ts`, `src/ui/togetherScreens.ts`,
  `src/util/id.ts`) is additive on top — see
  [play-together-invites.md](./docs/context/play-together-invites.md). Done 2026-07-18.
- [ ] Next: polish Level 1 play feel — expression changes along Flicker’s arc, richer
  investigation hotspots, and optional TileMap rooms if the team adopts grid levels.
  Also: fix the remaining `npm run typecheck` errors (see §3.14) so CI goes green.
  Also: no automated tests yet for Play Together (server route / invite store / UI).
- **Files owned:** `trunorth/content/chapters/ch2/*`, `trunorth/src/engine/*`,
  `trunorth/src/input/InputController.ts`, `trunorth/src/ui/GameView.ts`,
  `trunorth/src/render/characters.ts`, `trunorth/src/content/{index,scenarios,zones}.ts`,
  `trunorth/src/together/*`, `trunorth/src/ui/togetherScreens.ts`.

### Jose — Frontend (deployment) 🔧

- [ ] Deploy the app so users can play and test it: stand up a hosted environment
  for the **Vite client + Hono API** (`trunorth/server/`), configure env vars from
  `trunorth/.env.example`, verify health + `/api/companion` in production, and share
  the test URL (demo mode: `?demo=1`) with the team.

### Vandy — Product management (research & game vision)

- [x] ~~Deliver Level 1 script~~ — [`docs/scripts/Scene, script, players.docx`](./docs/scripts/Scene,%20script,%20players.docx)
  (The Singing Bridge: Flicker, Wize, Courage Feather) — done; superseded 2026-07-18 by
  [`docs/scripts/Updated-Script-6-8anxiety .docx`](./docs/scripts/Updated-Script-6-8anxiety%20.docx)
  (The Little Dragon Who Wouldn't Stop Guarding), now the integrated Level 1 content.
- [ ] Research how existing SEL products — especially **GoZen!** — teach hard emotional
  skills to kids, and turn findings into vision for Levels 2+ (still feed Ermoni/Gabby
  for art, and Daniel for scene scripting).

### Ranya — Product management (research & testing criteria)

- [ ] Research (alongside Vandy) how programs like **GoZen!** teach emotional skills
  through simple formats, and translate findings into **test criteria for Level 1**:
  what “good” looks like when playing The Little Dragon Who Wouldn't Stop Guarding on
  this basic 2D DOM game (attention, clarity of choices, emotional beat landing, Star
  Crystal payoff).

### Madhu — Product management (PR support & spec alignment)

- [ ] Provide continuous support across the team: help review and shepherd pull
  requests, and make sure work stays aligned with
  `docs/specs/TruNorth Master Spec.md` (product intent) + `docs/specs/Consolidated TruNorth-Technical-Specification.md`
  (engineering intent, v3.0) and **this `product.md`** (what’s built).
  Prefer PRs that update `product.md` in the same change when files/behavior move.

---

## 0. How to use and maintain this file (read before editing)

These rules exist so `product.md` stays trustworthy and consistent across every pull request.

1. **This file describes reality, not intent.** The technical specification says what the
   product *should* be; `product.md` records what has *actually been built*. If it isn't
   in the repo and working, it does not get a "done" description here.

2. **Update it in the same change set as the code.** Any PR that adds, removes, or changes
   a file, method, or behavior in `trunorth/` must update the matching section here in the
   same PR. Treat an out-of-date `product.md` as a broken build.

3. **Keep entries short and factual.** For each implemented file: its path, its purpose in
   one line, and its key exports (functions/classes/methods) with a one-line description
   each. No design rationale, no future plans — those live in the spec.

4. **Never delete an empty section.** `⬜` is a truthful signal that nothing is built
   there yet. Sections grow from `⬜` → `🟨` → `✅` as real code lands.

5. **Offload depth to context files.** When an entry would exceed ~15 lines or needs
   tables/diagrams/method-by-method walkthroughs, move the detail to
   [`docs/context/`](./docs/context/)`<area>-<subject>.md` (the file states which sources
   it documents at the top), keep a one-line summary + link here, and add a row to
   Section 4.

6. **Mirror the real folder structure.** Section 2 must always reflect the actual
   directory tree of `trunorth/`.

7. **Status legend** (use these consistently):
   - `⬜ Not implemented` — scaffolding only, or doesn't exist yet.
   - `🟨 Partial` — some functionality exists; note what's missing.
   - `✅ Implemented` — built and working; describe methods/functionality.

8. **When this file and the spec disagree:** this file wins for "what is built"; the spec
   wins for "what is intended."
   **Repo layout note (2026-07-13):** older drafts referred to `TruNorthProject/` with
   TileMap / Vercel `api/` / rAF loop. That tree is not in this repository. The working
   app is `trunorth/` (DOM scenes + Hono server). Do not reintroduce phantom folders.

---

## 1. Snapshot

| Field | Value |
|---|---|
| Product | TruNorth — choice-driven social-emotional learning (SEL) narrative for ages 5–15 |
| Project root | `trunorth/` (repo root = DallasAITeam15 monorepo wrapper) |
| Spec source of truth | **Product/SEL/safety intent:** `docs/specs/TruNorth Master Spec.md` (Draft v2). **Engineering intent:** `docs/specs/Consolidated TruNorth-Technical-Specification.md` (v3.0). Conflict order per that doc's own hierarchy: Master Spec → SME/counsel rulings → Consolidated tech spec → ADRs → repo README. ⚠️ `docs/specs/TruNorth Technical Specification.md` is **Draft v1 and superseded** by the Consolidated v3.0 — do not review against it. Coverage audit: [spec-coverage.md](./docs/context/spec-coverage.md) |
| Level 1 script | `docs/scripts/Updated-Script-6-8anxiety .docx` → **The Little Dragon Who Wouldn't Stop Guarding** (integrated 2026-07-18, supersedes the original Singing Bridge script) |
| Overall implementation status | **🟨 Playable MVP, DOM-scene model.** Two child levels, both grid-backed (**ch1 Everbright Meadow**, **ch2 The Little Dragon Who Wouldn't Stop Guarding golden path W1→W7** — Wize is the guiding companion, Flicker the dragon physically blocks the path until the final walk-to-stage finish; ch3 forest removed 2026-07-17) + parent coach entry; scene engine with multi-tap/repair; **WASD/arrow world movement with collision, companion follow, collectibles**; **parameterized 100×100 grid levels (per-cell color + walkability, canvas background, center-point collision) — every scene binds a grid via `gridMapId` (6 grids: everbright-meadow, singing-bridge [orphaned], forest-of-questions, meadow-of-curiosity, cave-of-purpose, mountain-festival), hub cards show grid thumbnails**; companion safety filters + demo/live clients; counselor insights + Together Mode (co-play discuss prompts); **cross-device Play Together invites (shareable 4-letter code / `?invite=` link, SQLite-backed rooms, SSE live updates, mobile/LAN dev support — see [play-together-invites.md](./docs/context/play-together-invites.md))**; **pre-level check-in (3 open-ended questions → 0–10 starting point + bright/steady/gentle placement, fed into journey reflection)**; **declarative stage objects (grid-cell-placed interactables: multi-page dialogs + finish lines that advance/complete a stage — pure JSON authoring)**; local/demo persistence; **Hono API with parent auth, child profiles, remote-progress endpoints (server-built, client not wired), companion + reflect + together routes, SQLite**; Docker; 57 unit tests + content validate. **Scored Ask-for-Help beat** on the Ch.1 path (`dp_ask_grownup` → cross-cutting `ask_for_help` skill, no meter) and **distress-aware resume** (`resumeCheckin` screen when a session ended in `safetyFlag: distress`; re-entry copy is SME-draft) added 2026-07-19. **Phase 2 (widened interaction curve, 2026-07-19):** Ch.1 grew from 2 → **5 decision points** (new scenes e2a/e2b/e2c: reassure a shy friend → share/take turns → repair an accident, meeting spec §6.3's 4–6/chapter floor), and **2 of ch2's 6 DPs (`dp_quest_start`, `dp_investigate`) are now `inputMode: "both"`** so typed replies land in the Little Dragon level (typed DPs 1 → 3 across the game). **Phase 4 hardening (2026-07-19):** §17D in-character API-failure surface + one auto-retry + authored fallback, demo-mode `filterInput` gap closed, axe WCAG 2.2 AA + keyboard-only accessibility suite, §19 bundle-size budget enforced in CI, and §13A.6 projector-resolution verification — 118 unit + 11 e2e tests. **Not built:** Supabase assets, hosted deploy, client remote sync, JSON-Schema CI, automated tests for Play Together, manual screen-reader pass (§22A.5), recorded backup video. **CI is green**: `typecheck`/`lint`/`validate:content`/`test:unit`/`build`/`audit:bundle`/`test:e2e` all exit 0 (see §3.14). Art is grid canvases + inline SVG cast (8-bit pixel-art style); zone PNGs remain for celebration + fallback. |
| Toolchain | Node ≥20 (`.nvmrc` 22), Vite 6, TypeScript 5.8, Vitest 3, Hono, better-sqlite3, jose, bcryptjs, tsx, ESLint 9 + typescript-eslint |
| Quick test | `cd trunorth && npm install && npm run demo` → http://localhost:4173/?demo=1 (verified: build + preview work) |
| Last updated | 2026-07-19 (§22 Phase 4 hardening: §17D error surface + accessibility + perf budget + projector resolutions) |

---

## 2. Folder structure

### Repo root

```
DallasAITeam15/
├── product.md                 # Living ledger + task board (this file)
├── README.md
├── .github/workflows/ci.yml   # ✅ CI: typecheck → lint → validate:content → test:unit →
│                              #    build → audit:bundle → playwright e2e.
│                              #    MUST stay at the repo root (Actions ignores subdirs);
│                              #    runs with working-directory: trunorth
├── docs/
│   ├── README.md              # Design intent overview
│   ├── specs/                 # Technical specifications
│   ├── scripts/               # Narrative scripts (current: Little Dragon 5–7 anxiety script; superseded: Singing Bridge)
│   ├── kickoff/               # Team slides
│   └── context/               # Deep-dive context files (Section 4)
└── trunorth/                  # Application (configurable via .env)
```

### Application (`trunorth/` tree)

```
trunorth/
├── content/
│   ├── chapters/ch1/          # ✅ Everbright Meadow — e1–e3 + e2a–e2c + 5 DPs + 14 dialogs + 16 stage objects (13 discoveries)
│   ├── chapters/ch2/          # ✅ The Little Dragon Who Wouldn't Stop Guarding — w1–w7 + 6 DPs (2 "both") + 1 dialog + 2 stage objects
│   ├── demo/showcase.bundle.json     # ✅ 24 canned companion lines (demo mode)
│   └── fallbacks/companion-fallbacks.json  # ✅ band/timeout/safety lines, all 13 DPs
├── data/                      # SQLite runtime files (git-ignored)
├── public/
│   ├── assets/zones/          # 🟨 meadow/forest/cave/mountain PNG placeholders 🔧 Ermoni+Gabby
│   ├── favicon.svg
│   └── manifest.json          # PWA manifest (note: main.ts registers /sw.js, which doesn't exist)
├── scripts/
│   ├── validate-content.ts    # 🟨 structural checks (no Ajv schemas yet)
│   └── audit-bundle-size.ts   # ✅ spec §19 performance budgets, in CI (fails on breach)
├── api/
│   └── [[...route]].ts        # ✅ Vercel Node Function — forwards /api/* to the Hono `app`
├── server/                    # ✅ Hono API (dev: tsx watch) 🔧 Jose (deploy)
│   ├── auth/jwt.ts            # HS256 sign/verify (jose)
│   ├── config.ts              # ✅ .env loader + serverConfig
│   ├── db/migrate.ts          # SQLite schema (parents, children, progress, audit, together_rooms)
│   ├── routes/companion.ts    # POST /api/companion + /api/reflect
│   ├── routes/together.ts     # ✅ Play Together invite rooms (create/join/get/close/stream)
│   ├── index.ts               # health, auth, children, progress routes + CORS (LAN-aware origin fn)
│   └── main.ts                # listen entry (port 3001)
├── src/
│   ├── main.ts                # ✅ Boot, screens, startScenario, engine + world + Play Together wiring
│   ├── audio/speech.ts        # ✅ On-device companion voice toggle (SpeechSynthesis)
│   ├── companion/CompanionClient.ts   # ✅ Live (1 auto-retry) + Demo (safety-filtered) clients
│   ├── companion/fallbackLines.ts     # ✅ client-side authored fallback copy + §17D retry line
│   ├── config/                # ✅ app.ts (incl. LAN-aware resolveApiUrl), content.ts, gameState.ts (env-driven)
│   ├── content/               # ✅ SCENES/DPs/DIALOGS registry, scenarios, zones, gridLevels, stageObjects, sparks
│   ├── counselor/             # ✅ insights + coPlay discuss prompts + pre-level checkin + typedScoring
│   ├── engine/                # ✅ SceneEngine, DecisionResolver, WorldRuntime, Collision, GridMap
│   ├── input/InputController.ts # ✅ WASD/arrows + interact keys
│   ├── render/                # ✅ characters.ts (SVG cast), gridBackground.ts, juice.ts (§17B.2 Glow Gauge)
│   ├── safety/filters.ts      # ✅ input/output filters
│   ├── store/ProgressStore.ts # ✅ Local + Demo stores
│   ├── styles/global.css      # ✅ Layout, HUD, overlays, zones; stage container-scaled (--px); Play Together flow styles
│   ├── together/inviteStore.ts # ✅ Play Together client: createRoom/joinRoom/watchRoom, COLOR_TUNES/PLAYER_CHARACTERS
│   ├── types/index.ts         # ✅ Shared contracts
│   ├── util/id.ts             # ✅ newId() — LAN/non-secure-context UUID fallback
│   └── ui/                    # ✅ GameView, screens, togetherScreens, auth helpers
├── tests/unit/                # ✅ 135 tests — engine (13) + grid (8) + checkin (6) + stageObjects (10) + phase1 (6) + phase2 (7) + phase3 (7) + phase4-errors (10) + sparks (10) + exploreLoop (7) + redteam (51)
├── tests/e2e/                 # ✅ 18 Playwright tests — demo-mode (3) + accessibility (4) + projector (4) + child-surface (3) + camera (4)
├── public/fonts/              # ✅ self-hosted Nunito + Inter variable woff2 (SIL OFL) — no CDN, offline-safe
├── playwright.config.ts       # ✅ e2e config; webServer runs `vite preview` (production build)
├── Dockerfile · docker-compose.yml
├── index.html · vite.config.ts · vitest.config.ts
├── tsconfig.json · tsconfig.server.json · tsconfig.api.json  # api.json = typecheck-only, covers api/
├── package.json · .nvmrc · .env.example · .gitignore
└── (CI lives at the REPO ROOT — see the root tree above; GitHub Actions ignores subdirs)
```

> Update this tree whenever directories or top-level files change.

**Intentionally absent (do not list as implemented):** `assets-src/`,
`TileMap` grid parser, `TruNorthProject/`, `tests/e2e`, red-team trees, JSON Schema pack
under `content/schema/`, `public/sw.js`. (`api/` now exists — see above — as of the Vercel
adapter added 2026-07-17.)

---

## 3. Implemented components

> Inline entries stay short; deep walkthroughs live in `docs/context/` (Section 4).

### 3.0 Configuration (`src/config/`, `server/config.ts`, `.env.example`)
✅ Implemented. Runtime tunables via `.env` / `VITE_*`:
- `src/config/app.ts` — `appConfig` (apiUrl via `resolveApiUrl()` getter — prefers the
  same-origin proxy off localhost so LAN/phone play reaches the API, feature flags incl.
  `worldMovement`/`togetherMode`, gameplay defaults Flicker/ch2/w1/age-band 5-7, timing,
  world-movement tunables), `isDemoMode()`.
- `src/config/content.ts` — `contentConfig`: zone metadata (`ZoneConfig[]` — `forest`
  repurposed for ch2's new narrative, `meadow` for ch1, `mountain` unused/decorative),
  achievement checklist, celebration copy (Star Crystal / Sky Festival, `mountain.png`).
- `src/config/gameState.ts` — `createInitialGameState(demoMode)` from `appConfig.defaults`.
- `server/config.ts` — dependency-free `.env` loader + `serverConfig`
  (port/CORS/JWT/db path/companion model+floor+timeout).

### 3.1 Application entry (`src/main.ts`)
✅ Implemented. Detects demo mode (`?demo` / `VITE_DEMO_MODE`), wires
`LocalProgressStore` vs `DemoProgressStore` and Live vs Demo companion clients, navigates
landing → trust → onboarding → hub → **check-in** → game, starts `SceneEngine`,
celebration → parent gate → journey reflection. The `checkin` screen (between hub card
select and `startScenario`) stores its `CheckinRecord` in `progress.checkins[chapterId]`
and raises `flags.lastSafetyFlag` on a flagged typed answer. Attaches/detaches `worldRuntime` per screen; `beginEncounter`
freezes movement on trigger interact; collect pickups award crystals + persist. Together
Mode co-play step machine. **Play Together invites:** landing's "Play Together" button (or
a `?invite=CODE` URL) routes through new `togetherLobby` → `togetherSetup` →
`togetherWaiting` screens before `hub`; `togetherPlayers` state feeds `renderGameView`'s
badge list — see [play-together-invites.md](./docs/context/play-together-invites.md).
Registers `/sw.js` in prod builds — **file doesn't exist**, so registration silently no-ops.

### 3.1a Companion voice (`src/audio/speech.ts`)
✅ Implemented. On-device only (browser `SpeechSynthesis`, no audio/text leaves the
device — companion lines are already safety-filtered before they're spoken). `speakLine`/
`stopSpeaking`, `isSpeechSupported`/`isVoiceEnabled`/`setVoiceEnabled` (persisted in
localStorage, default on when `VITE_FEATURE_VOICE_OUTPUT` is set). Wired into `main.ts`
(speaks each companion line) and a voice on/off toggle button in `GameView.ts`. Covers
part of the youngest-band voice-over need; no music/SFX/ambient audio exist anywhere in
the repo.

### 3.2 Scene engine (`src/engine/SceneEngine.ts`, `DecisionResolver.ts`)
✅ Implemented — **click/trigger DOM scenes** (not tile-walking). Lifecycle detail:
[engine-runtime.md](./docs/context/engine-runtime.md).

- `SceneEngine` — loadScene (narration auto-advance; skipped when the scene has a
  finish/advance stage object), startDecision/triggerEncounter,
  submitChoice/submitTyped, multi-tap progress (`MULTI_TAP_REQUIRED`: dp_breathe ×5,
  dp_crossing ×4), repair loops, chapter-complete → celebration, companion + counselor
  callbacks, input freeze during companion calls. Public finish-object paths:
  `advanceScene(targetSceneId?)` and idempotent `completeChapter()` → celebration
  (see [world-stage-objects.md](./docs/context/world-stage-objects.md)).
- `DecisionResolver` — `resolveChoice` (option → band), `applyConsequence` (meter
  fill/level-ups, brownie points, 200-entry event log, repairAction, next scene).
  Also exports `canUsePlayfulExternalization` (unused by callers).
- 🟨 `SceneEngine`'s `callbacks.onMeterJuice(skill)` fires on a strong-band choice, but
  its only listener (`main.ts`) is a plain `renderGame()` re-render — there is no
  particle/companion-reaction effect yet (CSS has a `meterPop` fill animation, nothing
  more). The hook exists and should be *extended*, not recreated, when reward "juice" is
  built.

### 3.3 World movement (`src/engine/WorldRuntime.ts`, `Collision.ts`, `src/input/InputController.ts`)
✅ Implemented (DOM stage free-roam, not a tile grid) — see
[world-movement.md](./docs/context/world-movement.md).
- `worldRuntime` singleton — rAF loop, avatar movement with axis-separated AABB collision
  vs NPC feet boxes (default 70×42, per-character `solidSize` override — ch2 Flicker uses
  190×80 to seal the bridge) + walk bounds, companion lag-follow, collectible pickup,
  proximity interact (E/Space/Enter) with hints; feature-flagged `VITE_FEATURE_WORLD_MOVEMENT`.
  Proximity targets are a union: trigger zones → **stage objects** → NPC fallback
  (`onObjectInteract` callback) — see
  [world-stage-objects.md](./docs/context/world-stage-objects.md).
- `Collision.ts` — pure AABB helpers, `moveWithCollision` (wall sliding), walk bands.
- `InputController` — WASD/arrows hold-polling, one-shot interact; clickable trigger
  hotspots remain as fallback.
- **Grid levels** (`GridMap.ts`, `src/content/gridLevels.ts`,
  `src/render/gridBackground.ts`) — parameterized 100×100 cell grid (flat vector:
  coordinate + color + walkable per cell), painted-level builders (6 registered:
  `everbright-meadow` ← ch1; `forest-of-questions`/`meadow-of-curiosity`/
  `cave-of-purpose`/`mountain-festival` ← ch2 w1–w7; `singing-bridge` — orphaned since
  the ch2 narrative swap, no scene binds it, kept as a reference build), canvas
  background + hub thumbnails (`createGridThumbnail`), center-point collision in
  `WorldRuntime`. **Every scene JSON sets `gridMapId`** — grids are the levels now; URL
  `?grid=<id>` (+`&gridDebug=1`) still overrides for testing. See
  [world-grid-levels.md](./docs/context/world-grid-levels.md).
⬜ Not in repo: `SceneGraph`, `EmotionalResidue` modules.

### 3.4 Rendering (`src/render/characters.ts`)
🟨 Partial — inline SVG cast in **8-bit pixel-art style** (ASCII pixel maps →
`<rect>` grids with `shape-rendering="crispEdges"`), no separate sprite/manifest pipeline.
- `renderFullBodyCharacter(opts)` — avatar (skin-tone aware), **Flicker** (red Guardian
  Dragon; id/assetRef containing "flicker" resolves to the dragon, used for the ch2
  bridge-blocker NPC), **Wize** owl mentor, fox/sprite companion archetypes, helper
  animals, worry cloud, grown-up, NPCs; `ExpressionKey` mapping from scene `expression`
  strings.
  Expressions rendered as pixel overlays (eyes/brows/mouth, worry sparks, happy sparkles).
⬜ Not in repo: Viewport layers, SceneRenderer, BubbleManager, ParticleSystem as separate
modules (bubbles/HUD live in `GameView` + CSS).

### 3.5 UI & parent surfaces (`src/ui/`)
✅ Implemented — see [ui-screens-views.md](./docs/context/ui-screens-views.md).
- `GameView.ts` — `renderGameView` (stage, HUD meters, characters, triggers, collectibles,
  **stage objects** (emoji sprites, click fallback) + **`renderDialogOverlay`**
  (multi-page speaker dialog — see
  [world-stage-objects.md](./docs/context/world-stage-objects.md)),
  counselor panel (draggable via its header handle, ✕ to dismiss; position + dismissal
  survive re-renders, a dismissed insight returns when a new one arrives),
  decision overlay with Together Mode 2-step flow
  (narration bar removed 2026-07-18 — `scene.narration` is no longer displayed;
  stage-object dialogs carry story text; engine auto-advance timing unchanged);
  **stage z-layering** so no dialogue is ever blocked by a character:
  characters ≤ ~64 < counselor panel 70 < speaking character + bubble / interact hint 75
  < thinking pill 80 < modal overlays 100;
  **everything on the stage scales with viewport size** — the stage is a CSS size
  container exposing `--px` = 1 design px, characters set `--char-size` and their SVGs
  fill it, text uses `clamp()` legibility floors),
  `renderCelebration` (Star Crystal), `renderJourneyReflection`, `renderParentGate`
  (4-digit PIN, SHA-256 hash in localStorage, 3-fail lockout), `renderTrustScreen`.
  `renderGameView`'s last param, `togetherPlayers: TogetherPlayer[]`, renders a small
  badge row (name/role/accent color) next to the "Playing Together" pill — see
  [play-together-invites.md](./docs/context/play-together-invites.md).
- `screens.ts` — `renderLanding`, `renderAuthForm` (parent login/register),
  `renderOnboarding` (archetype/name/avatar; default **Flicker**), `renderScenarioHub`
  (child cards use grid canvas thumbnails when the start scene binds a grid; PNG fallback),
  `renderCheckin` (pre-level check-in cards + compass result; skippable — see
  [ui-screens-views.md](./docs/context/ui-screens-views.md)),
  `renderResumeCheckin` (distress-aware re-entry card, spec §17D — calm 🫂 card with a
  non-scored "keep going / sit here for a bit" pair; SME-draft copy).
- `togetherScreens.ts` — **new.** `renderTogetherLobby` (host/join-by-code),
  `renderTogetherPlayerSetup` (name/color/character picker), `renderTogetherWaiting`
  (code/link + live seat status via SSE/polling) — see
  [play-together-invites.md](./docs/context/play-together-invites.md).
- `auth.ts` — session token helpers (`getToken`/`setSession`/`clearSession`),
  `apiLogin`/`apiRegister`, `hashPin`/`verifyPin` (WebCrypto SHA-256).
- Together Mode discuss prompts (same-browser co-play, distinct from Play Together
  invites): `counselor/coPlay.ts`.

### 3.6 AI companion client (`src/companion/CompanionClient.ts`, `fallbackLines.ts`)
✅ Implemented — see [safety-companion-pipeline.md](./docs/context/safety-companion-pipeline.md).
- `LiveCompanionClient` — POST `{API}/api/companion` with optional bearer token.
  **One auto-retry on failure (spec §17D, Phase 4):** a thrown network error *or* a non-OK
  status triggers a single retry after `timing.companionRetryDelayMs` (600 ms); the optional
  `hooks.onRetry` fires first so the companion speaks in-character while it retries. A second
  failure throws `CompanionUnavailableError`. Capped at exactly one retry (test-enforced).
- `DemoCompanionClient` — **runs `filterInput` first** (Phase 4 — closes the gap where demo
  mode scored typed text with no safety filter), returning the `safety` fallback line +
  `redirect: true` + the real `safetyFlag` on a block. Otherwise: offline bundle lookup
  `{scene}:{dp}:{band}` where band comes from the shared **rubric scorer**
  (`scoreTypedResponse`, §3.9) using `req.typedRubricRef`; surfaces `matchedCriterion`;
  always attaches counselor insight tips.
- `fallbackLines.ts` — **new (Phase 4).** Client-side access to
  `content/fallbacks/companion-fallbacks.json` (previously server-only): `fallbackLine(dpId,
  band)`, `GENERIC_FALLBACK_LINE`, and `API_RETRY_LINE` (the §17D in-character
  "my words got a little tangled" line — **SME-draft, sign-off pending**).
- `SceneEngine`'s catch paths in `submitTyped`/`fetchCompanionFeedback` now serve
  `fallbackLine(dp.id, band)` and resolve the decision anyway, replacing a hardcoded generic
  string — so a dead proxy produces authored copy and a continuing story, never a dead end.

### 3.7 Safety (`src/safety/filters.ts`)
✅ Implemented. `filterInput` (jailbreak/distress/PII/profanity/length),
`filterOutput` (clinical/meetup blocklist), `sanitizeChildInput`, `escapeHtml`.
Used by unit tests and the server companion route.

### 3.8 Progress store (`src/store/ProgressStore.ts`)
✅ Implemented (MVP).
- `LocalProgressStore` — `trunorth_save_v1` in localStorage (load/save/clear/appendEvent).
- `DemoProgressStore` — in-memory.
- ⬜ Client `RemoteProgressStore` not built — note the **server** already exposes
  `GET/PUT /api/progress/:childId` (§3.11); nothing in the client calls it yet.

### 3.9 Counselor layer (`src/counselor/`)
✅ Implemented.
- `insights.ts` — `insightForStep(dpId, band)` (hand-written coaching for **all 13 DPs**
  × 3 bands + generic fallback; 11 registered [+3 new ch1 Phase-2 beats] + 2 legacy ch3 DPs kept as library data),
  `buildJourneyReflection(state)` (summary, strengths, growth edges, per-step insights,
  parent coaching), `childFacingLine`.
- `coPlay.ts` — `discussPrompt(dpId)` Together-Mode conversation starters (all 13 DPs).
- `typedScoring.ts` — **shared offline rubric scorer** (Phase 2/3). `scoreTypedResponse(text,
  rubricId?)` → `{ band, matchedCriterion, confidence }`. A per-DP `TYPED_RUBRICS` entry
  (selected by `DecisionPoint.typedRubricRef`: `inclusion`/`brave_start`/`curiosity`) layers
  decision-specific strong/poor phrases on a GENERIC base (the exact union of the two flat
  keyword lists it replaced, so choice-mode option labels score unchanged). Strong wins over
  poor. Single source of truth for both `scoreLocally` (server) and `DemoCompanionClient`.
- `checkin.ts` — pre-level check-in: `CHECKIN_QUESTIONS` bank (6 open-ended questions,
  tappable 0–2-pt options + own-words path), `questionsForChapter` (3 per chapter,
  deterministic rotation), `scoreTypedCheckinAnswer` (sanitize + `filterInput` + feeling-word
  heuristic; distress → 0 pts + flag), `buildCheckinResult` (0–10 starting point,
  bright/steady/gentle placement; answer text never stored), placement labels/companion
  lines. `buildJourneyReflection` appends the baseline to its summary + parent coaching.
  Also hosts the distress-resume helpers (spec §17D): `shouldResumeInDistress(flag)`
  predicate + `RESUME_DISTRESS` re-entry copy (**SME-draft, sign-off pending**), consumed
  by `main.ts`'s boot branch and `renderResumeCheckin`.

### 3.10 Shared types (`src/types/index.ts`)
✅ Implemented. GameState, Scene (`SceneCharacter` has optional `solidSize` [w, h]
collision-footprint override), DecisionPoint, companion request/response, ScenarioMeta,
PlayMode, ProgressStore interface, AuthUser/ChildProfile, `CheckinRecord`/`CheckinPlacement`
(+ optional `progress.checkins` map), **`StageObject`/`StageObjectInteraction`
(discriminated union: openDialog | finish) + `DialogRecord`/`DialogPage` + optional
`Scene.objects`**, factories
`createDefaultMeters` (7 skills). Defaults: companion **Flicker**, chapter `ch2`, scene `w1`.
Skill types split (2026-07-19): **`MeterSkillId`** = the 7 metered skills (keys of
`meters`); **`SkillId` = `MeterSkillId | "ask_for_help"`** — `ask_for_help` is a
cross-cutting, scorable/loggable skill with **no meter** (spec §7.2/§8.4). The resolver
skips skills that have no meter, so scoring it is a safe no-op on the meter map.
`DecisionPoint.typedRubricRef` (previously dormant) is now populated on the 3 typed DPs and
mirrored onto `CompanionRequest.typedRubricRef` by `SceneEngine.buildCompanionRequest`, so the
offline rubric scorer (§3.9) selects the right rubric without importing the content registry
into the server/API bundle (Phase 3, 2026-07-19).
⬜ `GameState.companion` also carries `{ level: 1|2|3, appearanceRef }` (seeded
`companion_dragon_base` in `config/gameState.ts`) — the field exists but nothing reads
`appearanceRef` anywhere; there is no companion visual-leveling behavior yet, just the
inert data shape.

### 3.11 Server API (`server/`)
✅ Implemented locally (not yet hosted) — full endpoint walkthrough:
[server-api.md](./docs/context/server-api.md). Companion pipeline detail:
[safety-companion-pipeline.md](./docs/context/safety-companion-pipeline.md).

> 🔧 **Jose** — production hosting for this Hono server + static client.
- `api/[[...route]].ts` — Vercel Node.js Function (`export const runtime = "nodejs"`,
  required so `better-sqlite3` works) using `hono/vercel`'s `handle(app)` to forward every
  `/api/*` path to the unchanged Hono `app`; catch-all filename so one function serves all
  routes. **Requires `DATABASE_PATH=/tmp/trunorth.db`** (or similar) as a Vercel env var —
  the project filesystem is read-only outside `/tmp`, so the default `./data/trunorth.db`
  would crash every cold start (`db/migrate.ts` opens the file at module load). This makes
  parent-auth/children/progress non-persistent across cold starts on Vercel, which is
  currently fine because the client doesn't call those endpoints yet (§3.8); wiring real
  persistence needs a serverless-compatible DB swap (Vercel Postgres/Neon or Turso
  libSQL), a separate task from this adapter.
- `index.ts` — `GET /api/health`; **parent auth** `register`/`login`/`me` (bcrypt + JWT);
  **child profiles** `GET/POST /api/children`; **remote progress** `GET/PUT
  /api/progress/:childId` (parent-owned, upsert; no client caller yet); audit-log writes;
  CORS is now a dynamic origin function (was a static list) — allows `serverConfig.corsOrigins`
  plus any `localhost`/`127.0.0.1`/LAN-IP (`192.168.x`/`10.x`/`172.16–31.x`) origin, so a
  phone on `http://192.168.x.x:5173` can reach the API for Play Together.
- `routes/companion.ts` — `POST /api/companion`: input filter → Anthropic (if key) or
  local **rubric score** (`scoreTypedResponse` via `req.typedRubricRef`, §3.9) → confidence
  floor → output filter → fallbacks library;
  `POST /api/reflect`: event list → counselor insights (no client caller yet).
- `routes/together.ts` — **new.** Play Together invite rooms: `POST /api/together/rooms`
  (create, returns a 4-letter code), `GET /api/together/rooms/:code`, `POST
  /api/together/rooms/:code/join`, `POST /api/together/rooms/:code/close`, `GET
  /api/together/rooms/:code/stream` (SSE). No auth — guest-friendly, 2-hour TTL. See
  [play-together-invites.md](./docs/context/play-together-invites.md).
- `auth/jwt.ts` — `signToken`/`verifyToken` (jose HS256, 7-day expiry).
- `db/migrate.ts` — SQLite schema: parents, child_profiles, progress, audit_logs,
  `together_rooms` (WAL).
- ⬜ No Vercel `api/` tree in this repo.

### 3.12 Content (`content/`)
✅ Implemented (draft; SME review still pending). Every scene sets `gridMapId`, so both
levels play on grid backgrounds (§3.3); hub shows only these two + parent coach.
Scenes may declare **stage objects** (`objects[]`: grid-cell interactables → dialog or
finish line) and **dialogs** (`dlg_*.json`, registered in `DIALOGS`): ch1 has a welcome
signpost (e1), a North Gate finish/advance (e2 — replaces its auto-advance timer), and a
Celebration Arch finish/complete (e3, alternate to `dp_ask_grownup`); ch2 has Wize's
star-legend scroll (w1) and the ✅ Level Complete finish (w7). Authoring guide:
[world-stage-objects.md](./docs/context/world-stage-objects.md).
- **Ch.2 The Little Dragon Who Wouldn't Stop Guarding (golden path, grids
  `forest-of-questions`/`meadow-of-curiosity`/`cave-of-purpose`/`mountain-festival`,
  ages 5–7):** explorer Nova collects Star Crystals for the Sky Festival with Flicker, an
  overprotective Guardian Dragon. Wize the owl is the follower companion (assetRef
  `char_wize` on the `companion` id); Flicker stands in the path with a widened
  `solidSize` solid, physically blocking the way through w1–w6.
  w1 quest start (Forest) → w2 curious questions (Forest of Questions) → w3 inspect a
  worry-flower (Meadow of Curiosity) → w4 welcome Flicker beside you (Valley of Welcome,
  5 taps) → w5 thank Flicker's purpose (Cave of Purpose) → w6 festival steps (Mountain of
  Helpers, 4 taps) → w7 Flicker steps aside, player walks to the Sky Festival stage's ✅
  finish/complete checkmark → Star Crystal celebration. DPs: `dp_quest_start`,
  `dp_investigate`, `dp_fact_sort`, `dp_breathe`, `dp_choose_path`, `dp_crossing`
  (no longer a chapter-complete decision — `CHAPTER_COMPLETE_DECISION` is ch1-only).
  **`dp_quest_start` and `dp_investigate` are `inputMode: "both"`** (Phase 2, 2026-07-19) —
  they render tap options *and* a text box; a typed reply is scored via the companion pipeline
  (offline: the rubric scorer in `src/counselor/typedScoring.ts` keyed by `typedRubricRef`;
  online: the LLM) then routed by band. Both were chosen because every band
  advances forward (no typed-partial dead-end) and neither is a multi-tap mini-game (`dp_breathe`
  ×5 / `dp_crossing` ×4 stay choice-only so the tap-count mechanic is preserved).
  **Superseded 2026-07-18:** the original Singing Bridge script (Flicker/Wize, river
  crossing, Courage Feather, grid `singing-bridge`) — see the team-board Daniel entry and
  §6 changelog for why (a stale unrebased branch reconciled forward rather than merged).
- **Ch.1 Everbright Meadow (grid `everbright-meadow`):** e1–e3 **+ e2a/e2b/e2c**, **5 DPs**
  (Phase 2, 2026-07-19). Golden path: notice a left-out friend → invite (`dp_leftout_bench`,
  `inputMode: "both"`) → **reassure a shy friend** (`dp_reassure_shy`) → **share the last flower /
  take turns** (`dp_share_flower`) → **repair after knocking over a crown** (`dp_repair_oops`) →
  ask a grown-up for help (`dp_ask_grownup`, chapter finale). The 3 new scenes reuse the
  `everbright-meadow` grid + existing cast (avatar/companion/rabbit/deer); each advances via its
  DP consequence (strong/partial → next scene, poor → same-scene repair loop). New-DP copy is
  draft pending SME review (like the rest of §3.12).
- **Ch.3 Forest removed 2026-07-17** (files deleted, registry/scenario/hub entries
  dropped). Its 2 DPs remain only as library data in insights/coPlay/fallbacks.
- `fallbacks/companion-fallbacks.json` — 13 DPs × strong/partial/poor/timeout/safety
  (11 registered + 2 legacy ch3).
- `demo/showcase.bundle.json` — 24 canned responses keyed `{scene}:{dp}:{band}` (incl.
  strong/partial/poor for the 3 new ch1 DPs + typed partial/poor for the 2 promoted ch2 DPs).
- ⬜ `content/schema/` Ajv pack, `content/rubrics/` — not present.
- ⬜ Per-scene `tileMap` rooms — not used (scenes use `gridMapId` + `triggers`).

### 3.13 Assets (`public/assets/`)
🟨 Partial. Zone PNGs (meadow/forest/cave/mountain) under `public/assets/zones/`;
characters are code-drawn 8-bit pixel SVG (see §3.4); `favicon.svg` is a matching
8-bit compass star. Ch2's zone card + celebration reuse `forest.png`/`mountain.png`
(no dedicated forest/cave/mountain-path art for the 4 new ch2 grids yet). No
`assets-src/` provenance pipeline.

> 🔧 **Ermoni & Gabby** — Level 1 art + Supabase delivery (offline fallback required).

### 3.14 Build & tooling
🟨 Partial (CI green as of 2026-07-19; a few known-deferred quirks remain).
- `scripts/validate-content.ts` — walks chapter JSON for id/chapterId/emotionalArc/
  consequences, plus dialog files (`dlg_*`: id/chapterId/non-empty pages) and scene
  `objects[]` (unique ids, 0–99 cells, resolvable dialog/finish targets) — two-pass,
  still no Ajv schemas. **Passing** as of 2026-07-17.
- `npm run test:unit` — **43/43 passing**. `npm run build` — **passing** (vite build;
  server tsc errors are swallowed by `|| true`, see the known quirk below).
- **`npm run typecheck` — PASSING** (`tsc --noEmit && tsc -p tsconfig.api.json`), fixed
  2026-07-19. The fix uncovered a second, previously-invisible layer of errors: the
  `&&` meant `tsc -p tsconfig.api.json` (the server/api pass) had **never once run to
  completion** in this repo's history — it was always short-circuited by the first
  command's failures. What got fixed, in order:
  1. 5 × TS2352 in `src/content/index.ts` (scene JSON `position: number[]` doesn't
     satisfy `[number, number]` for the `as Scene` casts on w4/w6/e1/e2/e3) — matched
     the `as unknown as Scene` pattern the file already used for `w7`.
  2. 1 × TS2345 in `src/ui/screens.ts` (local `Screen` type included `"dashboard"`,
     which was never actually passed to `onAuth()` anywhere) — removed as dead type
     surface.
  3. *(newly surfaced)* `tsconfig.api.json` had `noEmit: true` but still inherited
     `rootDir: "server"` from `tsconfig.server.json` while also including `api/` in its
     file list, tripping `TS6059` — fixed by setting `"rootDir": "."` in
     `tsconfig.api.json`.
  4. *(newly surfaced)* `server/index.ts`'s `authMiddleware` derived its context type via
     a fragile `Parameters<Parameters<typeof app.use>[1]>[0]` extraction that resolved to
     an untyped context (`c.set("user", ...)` failed) — retyped directly as Hono's own
     `Context<{ Variables: Variables }>`.
  5. *(newly surfaced)* `server/routes/companion.ts` imported
     `companion-fallbacks.json` without the import attribute Node's ESM/NodeNext module
     resolution requires — added `with { type: "json" }` (a real runtime-correctness
     fix, not just a type-checker workaround).
- **`npm run lint` — PASSING**, fixed 2026-07-19. Added `eslint.config.js` (flat config
  for ESLint v9) + the `typescript-eslint` dev dependency (previously missing
  entirely — bare `eslint` alone can't parse `.ts` syntax). The one real violation it
  surfaced (an unused `GameEvent` import in `src/counselor/insights.ts`) was removed.
  ✅ **Now wired into CI** — `.github/workflows/ci.yml` runs `npm run lint` (between
  `typecheck` and `validate:content`), so a lint regression fails the pipeline (Phase 3,
  2026-07-19).
- **Known quirk (left as-is on purpose):** the server pass of `npm run build`
  (`tsc -p tsconfig.server.json --noEmit false`) emits stray `.js` files **into `src/`**
  for client files the server imports (`src/types/index.js`, `src/safety/filters.js`,
  `src/counselor/{insights,checkin}.js`) because `rootDir: "server"` puts them outside
  `dist-server`. These strays silently **shadow the `.ts` sources** in vitest and vite
  (all imports use `.js` extensions) — if tests/dev ignore your edits after a build,
  delete `src/**/*.js` strays. **Never commit them.** This whole build path is interim
  and will be replaced when the proper hosted API/backend build lands (Jose's deploy
  task) — don't invest in fixing it.
- CI (`.github/workflows/ci.yml`): typecheck → **lint** → validate:content → test:unit → build
  → **playwright install chromium → test:e2e** (report uploaded as an artifact on failure).
- ⬜ `build-asset-manifest` — not in tree. **`red-team-suite` ✅ shipped**
  as `tests/unit/redteam.test.ts` (§3.15). **`audit-bundle-size` ✅ shipped** (below).
- ✅ **`scripts/audit-bundle-size.ts`** (`npm run audit:bundle`, in CI after `build`) —
  spec §19 performance budgets as a build-artifact audit; exits non-zero on breach and
  prints the largest contributors. Two tiers: the spec's own **15 MB** showcase-bundle
  ceiling, plus tighter per-asset-class budgets (JS 250 kB raw / 80 kB gzip, CSS 60 kB,
  fonts 200 kB) set with headroom over today's build, because a 15 MB ceiling alone would
  sit green through a 10× regression. **Current: 1.38 MB total, JS 145.8 kB (44.1 kB gzip,
  55% of budget), CSS 21.5 kB, fonts 85.5 kB** — the four zone PNGs are the largest assets
  at ~250–324 kB each. Raising a budget is allowed; doing it silently is not (see the
  file header).
- ✅ **Playwright e2e — 11 tests** across 3 suites, serving the production build via
  `vite preview`: `demo-mode.spec.ts` (3 — DoD §27 items 1 and 3),
  `accessibility.spec.ts` (4 — spec §20/§17A.4/§22A.5, axe-core WCAG 2.2 AA scan +
  keyboard-only + focus ring + reduced motion), `projector.spec.ts` (4 — spec §13A.6
  resolutions + §19 load budget). Dev dep added: `@axe-core/playwright`.

### 3.15 Tests (`tests/`)
🟨 Partial — **57 tests, all passing**: `tests/unit/engine.test.ts` (13 — DecisionResolver
bands/meters/repair, safety filters, Little Dragon golden-path presence, ch3 absence,
counselor insights + journey reflection, SVG cast rendering, world collision wall slide +
bounds) + `tests/unit/grid.test.ts` (8 — grid cell vector, painting/world lookup,
center-point slide, level registry, `?grid=` resolution, scenario/scene→grid routing,
legacy `singing-bridge` river crossing (grid still registered though orphaned),
Flicker-solid path block on w6's own `gridMapId` vs clear in w7) +
`tests/unit/checkin.test.ts` (6 — question rotation, typed
feeling-word scoring, distress flag, placement bands, labels/lines, reflection baseline)
+ `tests/unit/stageObjects.test.ts` (10 — cell→world parity, object placement/sprites,
object/dialog content integrity incl. ch2 w7-checkmark completion,
advanceScene/completeChapter, auto-advance suppression)
+ `tests/unit/phase1.test.ts` (6 — Ask-for-Help beat scores `ask_for_help` as primary
skill + logs it + fills courage/empathy meters without a `ask_for_help` meter;
insight framing; distress-resume predicate `shouldResumeInDistress` + `RESUME_DISTRESS`
copy)
+ `tests/unit/phase2.test.ts` (7 — `dp_quest_start`/`dp_investigate` promoted to `"both"` yet
keep tap options; every band on `dp_quest_start` advances w1→w2; ch1 meets the 4–6 DP floor;
e1→e2→e2a→e2b→e2c→e3 chain; each new ch1 DP has 3-band options + forward/repair routing +
insight + co-play coverage)
+ `tests/unit/phase3.test.ts` (7 — rubric scorer: generic base preserved, inclusion/curiosity/
brave_start decision-specific bands, strong-wins-over-poor, unknown-rubric fallback,
`matchedCriterion` surfaced, every typed DP wired to a registered `typedRubricRef`)
+ `tests/unit/phase4-errors.test.ts` (10 — §17D retry ladder: retry-once-then-succeed,
non-OK status also retried, capped at exactly one retry, retry copy carries no raw-error
vocabulary, authored per-DP fallback served (not the generic string), every registered DP
has `timeout` + `safety` copy; demo-mode `filterInput`: distress/PII/jailbreak blocked
offline, ordinary answers still scored, **and every authored option label passes
`filterInput` unblocked** — the regression guard for the `"hello"`/`"hell"` class of bug).
✅ **e2e is no longer an open gap** — `tests/e2e/` holds 11 Playwright tests (§3.14).
⬜ No tests yet for Play Together (§3.16).

### 3.16 Play Together invites (`server/routes/together.ts`, `src/together/`, `src/ui/togetherScreens.ts`)
✅ Implemented (no auth, 2-hour room TTL, no automated tests yet). Cross-device
alternative to the same-browser "Together Mode" toggle: a parent and child join the same
playthrough from different devices via a shareable 4-letter code or `?invite=CODE` link,
backed by SQLite rooms + SSE live updates, with a localStorage fallback when the API is
unreachable. Ships alongside LAN/mobile support (`vite.config.ts` `host:true`,
`resolveApiUrl()` same-origin preference, `viewport-fit=cover`). Full detail:
[play-together-invites.md](./docs/context/play-together-invites.md).

---

## 4. Context files index (`docs/context/`)

| Context file | Documents | Summary |
|---|---|---|
| [engine-runtime.md](./docs/context/engine-runtime.md) | `src/engine/SceneEngine.ts`, `DecisionResolver.ts`, `src/main.ts`, `src/ui/GameView.ts`, `src/content/index.ts` | Boot screens, scene phases, multi-tap + repair + celebration flow |
| [world-movement.md](./docs/context/world-movement.md) | `src/engine/WorldRuntime.ts`, `src/engine/Collision.ts`, `src/input/InputController.ts` | Free-roam runtime: rAF loop, AABB collision, follow, collectibles, interact |
| [world-grid-levels.md](./docs/context/world-grid-levels.md) | `src/engine/GridMap.ts`, `src/content/gridLevels.ts`, `src/render/gridBackground.ts` | 100×100 grid levels: cell vector, painting API, canvas bg, center-point collision, `?grid=` testing |
| [world-stage-objects.md](./docs/context/world-stage-objects.md) | `StageObject`/`DialogRecord` types, `src/content/stageObjects.ts`, `DIALOGS`, WorldRuntime object proximity, `renderDialogOverlay`, SceneEngine finish methods, `main.ts` dispatch | Declarative stage objects: grid-cell interactables → multi-page dialogs + finish lines (advance/complete); authoring guide |
| [ui-screens-views.md](./docs/context/ui-screens-views.md) | `src/ui/GameView.ts`, `src/ui/screens.ts`, `src/ui/auth.ts` | Every render function: game view, overlays, onboarding, hub, parent gate, auth |
| [server-api.md](./docs/context/server-api.md) | `server/*` (index, main, config, auth, db, routes) | All HTTP endpoints, SQLite schema, JWT, companion pipeline steps |
| [safety-companion-pipeline.md](./docs/context/safety-companion-pipeline.md) | `server/routes/companion.ts`, `src/companion/*`, `src/safety/*`, fallbacks | Live vs demo companion paths, filters, fallback coverage |
| [play-together-invites.md](./docs/context/play-together-invites.md) | `server/routes/together.ts`, `src/together/inviteStore.ts`, `src/ui/togetherScreens.ts`, `src/util/id.ts`, `main.ts`/`GameView.ts` wiring | Cross-device Play Together invite rooms: server routes, client store, UI screens, mobile/LAN support |
| [adr/](./docs/adr/README.md) | Consolidated tech spec v3.0 §25 — decisions ADR-001…006 | **Architecture Decision Records** (spec requires them tracked in `docs/adr/`). Accepted: 001 Vite 8 pin, 002 Vercel Node runtime, 004 model pin + lifecycle. Open/undecided: 003 EXT DB+auth, 005 asset provenance, 006 raw-input retention |
| [governance/delivery-status.md](./docs/governance/delivery-status.md) | Consolidated tech spec v3.0 §26 (risk register) + §27 (Definition of Done) | Where we stand against the DoD (3 of 8 met) and each risk R01–R08; includes what the red-team suite found. Point-in-time 2026-07-19 |
| [spec-coverage.md](./docs/context/spec-coverage.md) | `docs/specs/` Master Spec §2–§22A measured against the implemented tree (§3 of this file) | **Point-in-time audit (2026-07-19, post-Phase 3):** feature-by-feature ✅/🟨/⬜ coverage of the Master Spec, incl. `[MVP]`/`[EXT]` tiers and the §22A credibility gaps. A snapshot, not a live tracker — §5 below is the live gap list |

---

## 5. Open gaps (feeds the task board)

> ### 📍 Current position (2026-07-19)
>
> **Active track: a "game-feel" arc on top of Phase 4 (owner-directed, from playtest
> feedback).** Landed this session (local commits `f9d2174`/`d48e317`/`d450ee0`/`c93f1eb`/`c0f2e5e`/`613b0aa`/…
> nothing pushed): killed the in-game assessment leak (child no longer sees coach/clinical
> text), reward juice (§17B.2), Chapter 1 rebuilt as an **explore→discover→decide loop**
> (spoken goals + 13 discovery dialogs + Kindness Sparks), per-chapter celebration, a
> **following zoom camera** (§5), the **art asset manifest** — real AI backgrounds/props/
> characters now render with a live fallback — **Chapter 2 rebuilt with the same
> explore→discover→decide loop** (w1–w6 goals + 12 new discovery dialogs + gated sparks),
> a **sound engine** (`src/audio/sfx.ts`) wired to every real game event, awaiting the
> actual CC0 clips, and a **diegetic stepping-stone path + ambient life** (§7.7) — in-world
> progress the child walks (glowing "here" stone + worn trail, not a HUD bar) plus barely-
> there ambient motion (light motes / dappled sun, calm-first §17A.4). 142 unit + 18 e2e green.
>
> > **NEXT 5, in order** (roadmap so it survives a context reset):
> > 1. ✅ **Asset manifest** — done 2026-07-19 (`assetManifest.ts`, spec §10.3). Backgrounds,
> >    props, and 8/9 characters render as real art (owner re-cut the character cutouts).
> >    The first `wize.png` depicted a human child, not "Wize the owl" that shipped
> >    narration describes; held back, then the owner re-generated it as an owl (verified,
> >    matches) and it's mapped in. Only `avatar` stays on SVG (skin-tone choice). 31 PNGs committed.
> > 2. ✅ **Chapter 2 explore loop** — done 2026-07-19. Same treatment as Ch.1: w1–w6 each
> >    got a spoken `goal`, 2 new discovery objects (reusing already-art-mapped assetRefs, so
> >    they render as real props immediately), and a gated Kindness Spark tied to that
> >    scene's decision; w7 got a short goal. 12 new SME-draft dialogs, all Wize-voiced.
> > 3. ✅ **Sound — engine + event wiring done 2026-07-19** (`src/audio/sfx.ts`, spec §17B.4).
> >    Footsteps, discovery chime, spark-pickup chime, a bright cue on a strong choice /
> >    soft thud on a poor one, celebration fanfare, and a low-energy ambient bed
> >    (§17A.4 calm-first, paused outside `exploring`) are all wired to real game events.
> >    Mutable via a new 🎵 toggle (§13A.6); no cue carries info the visuals don't already
> >    (§17B.4 accessibility). **Same asset-manifest pattern as the art:** the engine and
> >    fallback (missing file = silence, never a crash) ship now; **the actual CC0 clips are
> >    not sourced yet** — `public/audio/README.md` has exact filenames + Kenney/Freesound
> >    links. **→ next real task is #4.**
> > 4. ✅ **Ambient life + diegetic stepping-stone path** — done 2026-07-19 (§7.7). The path
> >    (`src/render/progressPath.ts`) is one connected SVG trail in the world layer — a stone
> >    per main scene (`CHAPTER_PATHS`, branch scenes fold onto their parent), the current
> >    stone glowing gold + breathing, the road ahead faint and dashed, sitting above the
> >    stage objects so a cairn can't occlude it. Ambient life (`src/render/ambientLife.ts`)
> >    is zone-budgeted, barely-there motion: drifting light motes + slow dappled sun +
> >    edge grass-sway (+ water glints on the bridge zone). The spec's literal "clouds"
> >    don't fit these skyless overhead backgrounds — matched the actual art instead. Both
> >    are `aria-hidden`/`pointer-events:none` and freeze under `prefers-reduced-motion`.
> >    **→ next real task is #5.**
> > 5. **Verify CI actually runs** (the repo-root move is unconfirmed on GitHub) + close the
> >    human Phase-4 items (screen-reader pass, backup video, scope freeze).
>
> **Underlying Phase 4 status: 5 of 7 items done** (below). The game-feel arc is additive on
> top; the scope freeze (item 7) still gates Phase 5.
>
> **We are in the spec's §22 Phase 4 — "Week 4–5: Hardening" — with 5 of 7 items done.**
> (Consolidated tech spec §22 defines Phases 1–5. ⚠️ These are **not** the same as the
> "Phase 0–4" labels used in the §6 changelog below, which were an ad-hoc working sequence.
> **Use the spec's §22 numbering from here on**; the changelog labels are historical.)
>
> | §22 Phase 4 item | State |
> |---|---|
> | Red-team suite green | ✅ done |
> | Empty/error/resume states | ✅ done 2026-07-19 — distress-resume + in-character API-failure line + single auto-retry + authored fallback (§17D), verified in-browser with the API dead |
> | Projector-resolution verification | ✅ done 2026-07-19 — `tests/e2e/projector.spec.ts`, 1024×768 / 1366×768 / 1920×1080 in CI. ⚠️ *not* a substitute for confirming the actual venue spec (§13A.6 is a rehearsal task) |
> | Recorded backup video | ⬜ *(human task)* |
> | Accessibility pass on showcase | 🟨 automated half done 2026-07-19 (axe WCAG 2.2 AA + keyboard-only + focus ring + reduced motion, in CI; **found and fixed 2 real defects**). ⬜ the §22A.5 deliverable — a **manual screen-reader pass by the team's visually-impaired member** — is still open and is the part that becomes the credibility story |
> | Performance budget + release notes | 🟨 budget ✅ enforced in CI (`audit:bundle`, spec §19); release notes ⬜ |
> | Scope freeze | ⬜ *(owner decision)* |
>
> Earlier §22 phases are essentially complete except: asset manifest / style lock / provenance
> (ADR-005), JSON-Schema validators, the 16:9 viewport lock, meter juice, and the
> `baselineStrength` onboarding seed. **§22 Phase 5 is `[EXT]` post-MVP** (backend,
> `RemoteProgressStore`, dashboard, mini-games, voice) and should not start before the
> showcase path is frozen.
>
> Rows below the divider were surfaced by the **2026-07-19 Master-Spec coverage audit** —
> full feature-by-feature matrix in [spec-coverage.md](./docs/context/spec-coverage.md).
> Spec § references point at the Master Spec (intent); this table stays the live tracker.

| Gap | Owner hint | Status |
|---|---|---|
| Fix `npm run typecheck` → CI green | Daniel | ✅ fixed 2026-07-19 |
| Level 1 / zone production art + Supabase | Ermoni + Gabby | ⬜ |
| Hosted deploy (client + Hono API) | Jose | 🟨 Vercel Node Function adapter (`api/[[...route]].ts`) added 2026-07-17; actual Vercel project/env vars/deploy still pending |
| Wire client to server remote-progress endpoints | (unassigned) | ⬜ server side done |
| GoZen!-informed vision for Levels 2+ | Vandy | 🟨 script L1 done; research open |
| Level 1 playtest criteria | Ranya | ⬜ |
| PR/spec shepherding | Madhu | ongoing |
| JSON Schema validate-content | (unassigned) | ⬜ |
| `npm run lint` fix | (unassigned) | ✅ fixed 2026-07-19 (`eslint.config.js` added) |
| Wire `npm run lint` into `.github/workflows/ci.yml` (it works now but CI doesn't run it) | (unassigned) | ✅ fixed 2026-07-19 (Phase 3) |
| TileMap / WASD architecture | — | ✅ free-roam WASD + 100×100 grid levels; all scenes bind `gridMapId` |
| Automated tests for Play Together (server route / invite store / UI) | (unassigned) | ⬜ |
| Level 1 art for the 4 new ch2 grid biomes (forest/meadow/cave/mountain path) | Ermoni + Gabby | ✅ 2026-07-19 — `forest-of-questions` / `meadow-of-curiosity` / `cave-of-purpose` / `mountain-festival` PNGs committed and wired via `backgroundImageUrl` (grid-level id → art). The old `singing-bridge` biome has no art yet → falls back to the canvas grid |
| Ask-for-Help decision point — spec treats a scored beat on the Ch.1 path as non-negotiable (safety on-ramp) | (unassigned) | ✅ fixed 2026-07-19 (`dp_ask_grownup` now scores the new `ask_for_help` cross-cutting skill) |
| Typed input barely used — was only 1 of 8 DPs (`dp_leftout_bench`) | (unassigned) | 🟨 improved 2026-07-19 (Phase 2 + Phase 3): 3 of 11 registered DPs now `"both"`, and offline typed scoring is now **rubric-based** (`typedScoring.ts`, per-DP `typedRubricRef`) instead of a flat keyword list. Could widen to more DPs; the rubric is still substring-matching (no stemming/negation handling) when no LLM key is set |
| Demo/offline typed input isn't safety-filtered — `DemoCompanionClient` scores typed text but (unlike the server `/api/companion`) never calls `filterInput`, so distress/PII in a typed answer isn't caught in pure demo mode | (unassigned) | ✅ fixed 2026-07-19 (Phase 4) — `filterInput` now runs first in `DemoCompanionClient`, mirroring the server's order. Side effect: the §17D distress-resume path is reachable offline for the first time |
| No audio/SFX beyond the voice toggle (`src/audio/speech.ts`) — no chimes, ambient bed, or event-mapped sound | (unassigned) | 🟨 **engine + event wiring shipped 2026-07-19** (`src/audio/sfx.ts`, spec §17B.4) — footsteps, discovery chime, spark-pickup chime, strong/poor decision stings, celebration fanfare, calm-first ambient bed, all wired to real events behind a new mute toggle. ⬜ **no actual audio files yet** — every cue plays silence until CC0 clips are dropped into `public/audio/{sfx,ambience}/` per the README (same drop-in pattern the art asset manifest used) |
| Reward "juice" (companion reaction + particle flight on a strong choice) | (unassigned) | ✅ shipped 2026-07-19 — `src/render/juice.ts`: companion reaction + 10-particle Bézier flight into the meter (per-frame rAF, resolution-independent arc) + meter catch + **world bloom** (§17B.2's "grass blooms where I walk"). Skipped under `prefers-reduced-motion` |
| Companion visual leveling — `companion.appearanceRef`/`level` field exists (§3.10) but is never read; no sprite change on level-up | (unassigned) | ⬜ |
| Red-team adversarial input test suite (jailbreak/distress/off-topic battery) | (unassigned) | ✅ shipped 2026-07-19 (Phase 4) — `tests/unit/redteam.test.ts`, 45 cases in CI. **Found and fixed 4 real live-path defects**, incl. `"hello"` being blocked as profanity (substring match on "hell"), unfiltered meet-up requests, unfiltered PII solicitation, and over-narrow jailbreak patterns. 🔒 distress *wording* still needs SME sign-off |
| Live model verification of the pinned Haiku 4.5 against the §9.4 contract | Build | ✅ done 2026-07-19 — verified with a real key. **Found 2 live-path defects, both fixed:** `matchedCriterion` was silently dropped (§9.4/§8.3), and the model emitted "that's a superpower" — the identity-claiming phrasing §9.8 forbids. See ADR-004 |
| Demo-mode `filterInput` gap now also covered by the red-team suite's scope note — `DemoCompanionClient` still scores typed text without safety filtering | (unassigned) | ✅ fixed 2026-07-19 (Phase 4) — see the row above; duplicate of it |
| Time the golden path against the §27 DoD 3-minute budget | (unassigned) | 🟨 **engine time measured 2026-07-19: 6.2s** vs a 180s child budget (e2e). Still 🟨 — a scripted walk-through isn't a child; the DoD criterion needs the §22A.2 human playtest |
| Playwright offline assertion for demo mode (§27 DoD item 3) | (unassigned) | ✅ shipped 2026-07-19 — `tests/e2e/demo-mode.spec.ts` (3 tests, wired into CI). **Found a real defect:** the app loaded Nunito/Inter from the Google Fonts CDN, so an offline stage would have silently fallen back to system fonts. Fonts are now self-hosted in `public/fonts/` |
| E2E golden path W1→W7 (ch2 Little Dragon) — the e2e suite currently walks the **ch1** chapter only | (unassigned) | 🟨 harness now exists, so adding the ch2 path is cheap |
| Distress-aware resume state (companion opens differently after a session ending in `safetyFlag: distress`) | (unassigned) | 🟨 built 2026-07-19 (`resumeCheckin` screen, wired + tested); **re-entry copy is SME-draft, needs SME sign-off before shipping to a real child** |
| Ch.1/Ch.2 age-band targeting vs. spec structure — code defaults ch2 to age-band 5-7, spec's structure is ch1=5–7/ch2=8–10; needs a deliberate team call, not a code fix | Madhu | 🟡 open question |
| — *(rows below from the 2026-07-19 spec-coverage audit)* | — | — |
| **Which spec is authoritative?** — resolved by reading the docs themselves: they are layered, not competing. Master Spec (product intent) → Consolidated v3.0 (engineering intent); `TruNorth Technical Specification.md` is Draft v1 and **superseded** | Madhu | ✅ resolved 2026-07-19 — §1 updated, Draft v1 banner-marked SUPERSEDED |
| Engineering spec v3.0 prefers **Node 24.x LTS** (22.x = compat fallback); repo is on the fallback (`.nvmrc` 22) — `engines` tightened to Vite 8's real floor `^20.19.0 \|\| >=22.12.0` | (unassigned) | 🟨 acceptable per spec, but a deliberate call |
| Engineering spec v3.0 sets a formal **WCAG 2.2 AA** target (upgrades the Master Spec's §17A.4 checklist); no audit has been run | Test lane | 🟨 automated audit shipped 2026-07-19 (Phase 4) — axe-core scan at `wcag2a/2aa/21a/21aa/22aa` over landing, hub, gameplay stage and decision overlay, in CI. **Found and fixed 2 real defects** (see the accessibility row below). Automated tooling catches roughly a third of WCAG issues, so this is a floor, not a certification |
| Engineering spec v3.0 Part II governance artifacts | Madhu | 🟨 **added 2026-07-19** — `docs/adr/` (ADR-001…006, spec §25 requires exactly this path) + `docs/governance/delivery-status.md` (DoD §27 + risk register §26 tracked against reality). The gap register (§24) and confidence matrix (§28) live in the spec itself and are not duplicated. ⬜ **3 ADRs remain undecided: 003 (EXT DB+auth), 005 (asset provenance), 006 (raw-input retention)** — owner/counsel/art calls, deliberately not resolved by the implementer |
| Engineering spec v3.0 Vite pin | (unassigned) | ✅ fixed 2026-07-19 — pinned `vite 8.1.5`; required a coordinated `vitest` 3→4 major bump (spec didn't anticipate this); `engines` tightened to Vite 8's real floor. See ADR-001 |
| Engineering spec v3.0 model pin | (unassigned) | ✅ fixed 2026-07-19 — `claude-haiku-4-5-20251001`, guarded by a red-team test that rejects any `-latest` alias. See ADR-004 |
| Engineering spec v3.0 Part III `[ENTERPRISE]` (RBAC, HIPAA/FERPA, PWA sync, SIS) — correctly not built; recorded so it isn't mistaken for an omission | — | ⬜ `[EXT]` deliberately deferred |
| `emotionalResidue` (spec §6.1b) — characters remembering earlier treatment. `GameState.emotionalResidue` + `ResidueLevel` shape exist but **no behavior is wired** | (unassigned) | ⬜ spec tags `[MVP, low-cost]` |
| Strength-mirroring (spec §9.8) + the `baselineStrength` onboarding seed (spec §17C.3a) — companion citing the child's real past strengths; profile field exists but is never seeded or read | (unassigned) | ⬜ spec tags the seed 🟢 **do-not-cut** |
| Progressive meter **display** schedule (spec §7.2) — all 7 tracked, but Ch.1 should show only 3 and reveal the rest on a schedule | (unassigned) | ⬜ |
| Event-log schema incomplete vs spec §11.5 — missing `rawInput`, `skills[]`, `companionLineUsed`, `confidence`, `strengthsSnapshot` (the last is what §9.8 mirroring would read) | (unassigned) | 🟨 core fields present |
| `companionLine` ≤120 chars should **measure-and-split** into sequential click-through bubbles (spec §9.4 / §17B.5 guard 1); currently truncates | (unassigned) | 🟨 cap enforced by truncation |
| Kindness Sparks (spec §7.6) | (unassigned) | ✅ shipped 2026-07-19 — Ch.1 went from **1 collectible across 6 scenes** to 11 across 6, **4 gated** behind a strong resolution (activates the dormant `SceneCollectible.gate`); non-maxed "found X of 11" tally on celebration. Ch.2 still has sparse sparks — same treatment would help there |
| **Child was shown that they are being assessed** — the in-game panel rendered an "SEL Coach Insight" badge, the clinical `For grown-ups:` parent tip, and a "not a clinical diagnosis" disclaimer to a 5-year-old mid-play; the celebration button read "See counselor insights". Breaks §1.1 stealth learning and §12.4 | (unassigned) | ✅ fixed 2026-07-19 — solo play is companion-voiced and child-only; Together Mode keeps the coach panel; guarded by `tests/e2e/child-surface.spec.ts` |
| **Celebration copy was hardcoded to Ch.2** — finishing Ch.1 congratulated the child for things that happened in a different chapter, about an absent character | (unassigned) | ✅ fixed 2026-07-19 — per-chapter `contentConfig.celebrations` + `celebrationFor()`. 🔒 **Ch.1 copy is SME-draft** |
| Ch.2 has the same sparse-collectible problem Ch.1 had — the §7.6 spark pass has not been applied to w1–w7 | (unassigned) | ✅ fixed 2026-07-19 — w1–w6 each gained a gated spark tied to that scene's decision (12 sparks total, 6 gated), same pattern as Ch.1 |
| Ch.2 has no explore loop — w1–w7 are still spawn→hitbox→answer, the shape ch1 just moved away from | (unassigned) | ✅ fixed 2026-07-19 — w1–w6 each got a spoken `goal` + 2 new discovery objects (12 new SME-draft Wize-voiced dialogs, registered in `content/index.ts`); w7 got a short goal. Discovery objects reuse already-art-mapped assetRefs (bush, dropped_hat, flower_patch, basket, bell, petals, notice_scroll, note, flower_crown, trail_marker) so they render as real props immediately, no new art needed. Object placement pre-validated with a scratch cell-finder script against each scene's real grid + character positions + trigger bounds before authoring, so `validate-content` (walkable cell, 150px character clearance, trigger-overlap) passed clean on the first run — no repeat of the Ch.1 pond/collision rework. Covered by the existing `stageObjects.test.ts` "every object has a unique id, a walkable in-range cell, and a resolvable interaction" test, which iterates all scenes including ch2. 135 unit + 18 e2e still green |
| Production art — **manifest built & fully wired 2026-07-19.** `src/content/assetManifest.ts` (spec §10.3) swaps PNGs in for placeholders with an `onerror` live-fallback. **Live in the demo:** all 5 backgrounds, all 17 props, and 8 of 9 characters — verified in-browser with zero fallbacks firing. Character art was re-cut to tight, genuinely-transparent cutouts (verified with a full-image alpha scan, not just corner pixels — the deer's old opaque box is fixed). **`wize.png` round-trip**: the first version depicted a human child, not "Wize the gentle mentor owl" — shipped narration says *"Wize the owl whispers..."* (`w2.scene.json`), so a human on screen would have contradicted the story. Held back rather than shipped; the owner regenerated it as an owl (verified in-browser — glasses, feathers, matches the character), re-mapped, all tests re-green. **Only `avatar` stays on SVG** — deliberate, a single `nova.png` would erase the child's 5-way skin-tone choice. 31 source PNGs committed (7.2 MB, bundle 8.03/15 MB). | (build) | ✅ 8/9 characters live (avatar SVG by design) |
| Following camera (spec §5 world feel) | (unassigned) | ✅ shipped 2026-07-19 — zoom-follow camera, `appConfig.world.cameraZoom` 1.8, `?zoom=N` override |
| **Bigger roamable levels** — owner playtest: "it is still stuck to the square… I wanted to move around, go for some time, pick some diamonds on the way before getting to answers." | (unassigned) | ✅ fixed 2026-07-20 — **but not by enlarging the world.** Measuring first inverted the plan: the decision sat 174–372px from spawn (<1s of walking) while 71–86% of each level went unvisited, so the route was the problem, not the size — and scaling `WORLD_W/H` would have scaled content uniformly for no gain. New `Scene.spawnCell` starts each scene across the level from *its own* decision (981→1238px, ~2.5–2.9s) through the scattered crystals, with a flood-fill reachability guard so a far spawn can never soft-lock a scene |
| Diegetic progress path / stepping-stones (spec §7.7) — in-world chapter orientation, explicitly *not* a HUD bar | (unassigned) | ✅ shipped 2026-07-19 — `src/render/progressPath.ts`: one connected SVG trail in the `world-layer` (so the camera carries it with the ground), a stone per main scene of the chapter (`CHAPTER_PATHS` + `pathIndexForScene`, with ch1's e2a/b/c detours folding onto the e2 stone so a side-quest isn't a new stone). Travelled stones are mossy, the current stone glows gold and breathes (the quiet arrival cue), the road ahead is faint + dashed — no numbers, no countdown, `aria-hidden`/`pointer-events:none`, above the stage objects so a cairn can't occlude the "here" stone. **Ambient life shipped alongside** (`src/render/ambientLife.ts`, §7.7 companion / §17A.4 calm-first): zone-budgeted drifting light motes + slow dappled sun + edge grass-sway (+ water glints on the bridge zone) — the spec's literal "clouds" were dropped because these overhead backgrounds have no sky band; matched the art instead. New `tests/unit/progressPath.test.ts` (4, incl. branch-folding). Verified in-browser (forest + meadow); freezes under reduced motion (e2e). 142 unit + 18 e2e green |
| Progressive/typewriter text + tap-to-complete truth table + pivot interaction-lock (spec §17B.6) — the mechanism that *enforces* reflective pacing | (unassigned) | ⬜ `pivotLockMs` authored on some DPs but unused |
| 16:9 letterbox aspect-ratio lock (spec §17B.7) — stage currently scales via a `--px` size container, not a locked letterboxed canvas | (unassigned) | 🟨 |
| Three-expression-state pipeline for every character + `assetRef → file` asset manifest (spec §17B.3, §10.3) | Ermoni + Gabby | 🟨 **manifest built & wired 2026-07-19** (`assetManifest.ts`, real character art live); expression *variants* still missing — one base PNG per character, no worried/happy swap yet |
| Parent gate framed as a **connection ritual** rather than PIN-only (spec §12.1) — engineering unchanged, copy/framing missing | (unassigned) | 🟨 |
| Mini-games (spec §16) — emotion-recognition, 3-breath cool-down, affirmation, positive self-talk DPs (§16.4) | (unassigned) | ⬜ `[EXT]` (3-breath tagged MVP-light) |
| Parent dashboard with developmental metrics + guided-conversation prompts (spec §14) | (unassigned) | 🟨 `[EXT]`; `buildJourneyReflection` is a post-play summary, not trends |
| Chapter 3 (11–15, free typing, resilience) (spec §4) | (unassigned) | ⬜ spec marks it a stretch goal |
| Recorded backup demo video (spec §13A.7) — rung 4 of the stage fallback ladder | (unassigned) | ⬜ |
| Accessibility proof pass — screen-reader + keyboard-only + contrast on the showcase scene (spec §22A.5) | Test lane | 🟨 **keyboard-only + contrast ✅ automated 2026-07-19** (`tests/e2e/accessibility.spec.ts`, 4 tests in CI). **Found and fixed 2 real defects:** (1) the landing screen's primary CTA `.btn-primary` was `--text-dark` on `--accent` = **2.36:1**, a serious WCAG AA failure on the first button anyone presses — fixed with a new `--accent-deep` token (~10:1 white-on-purple), also applied to `.typed-submit` and `.companion-thinking` which were scraping by at 4.58:1; (2) the `prefers-reduced-motion` reset capped duration but not iteration count, so `infinite` animations (avatar walk-bob, companion thinking pulse) kept looping imperceptibly and driving the compositor forever — `animation-iteration-count: 1` added. ⬜ **The screen-reader pass is still open and is the actual §22A.5 deliverable** — a human task owned by the team's visually-impaired member, whose account is what makes it a *told* credibility story |
| ⚠️ **The CI workflow was never running on GitHub.** It lived at `trunorth/.github/workflows/ci.yml`, but GitHub Actions only discovers workflows under the **repo-root** `.github/workflows/`. **Confirmed against the repo's Actions tab on 2026-07-19: zero workflows, zero runs** — so every "in CI" claim previously made in this ledger (lint, red-team, e2e, bundle budget) was *configured* but never once enforced on a push | (unassigned) | ✅ fixed 2026-07-19 (Phase 4) — moved to repo-root `.github/workflows/ci.yml` with `defaults.run.working-directory: trunorth` (there is no root `package.json`, so `npm ci` would otherwise fail on step 1) and `cache-dependency-path: trunorth/package-lock.json`. ⚠️ **Unverified until someone pushes** — no one has yet seen this workflow succeed on GitHub, so treat the first push as the real test |
| Projector-resolution verification (spec §13A.6, §13A.8; Consolidated §6.1/§6.6) | Test lane | ✅ automated 2026-07-19 — `tests/e2e/projector.spec.ts` at 1024×768 / 1366×768 / 1920×1080: no page overflow, stage + HUD unclipped, decision overlay on screen, ≥12px text, ≥64px hit targets (§17A.4), stage holds 16:9. ⚠️ still needs the physical §13A.6 rehearsal — confirming the venue's actual projector spec is not something CI can do |
| **Decision overlay does not scale with resolution** (surfaced by the projector suite, 2026-07-19) — the choice button measures **452×64px / 16px text at 1024×768, 1366×768 and 1920×1080 alike**, unlike characters/HUD which scale with `--px`. It sits exactly on the §17A.4 64px floor everywhere, so it passes, but on a large venue projector the most important surface in the demo is proportionally the smallest it ever gets — cuts against §13A.4 "readable from 50 feet" | (unassigned) | ⬜ new |
| Performance budget enforced in CI (spec §19) | (unassigned) | ✅ shipped 2026-07-19 (Phase 4) — `scripts/audit-bundle-size.ts` + `npm run audit:bundle` in CI. Currently 1.38 MB dist / 145.8 kB JS / 44.1 kB gzip, all well inside budget. Not yet covered by a measurement: the §19 **frame-rate** (60fps / no sustained <45fps on a Chromebook profile) and **particle-cap** rows — those need a device profile, not a build artifact |
| §22A credibility items: SEL evidence/citation (§22A.1), real-child playtest clip (§22A.2), business-case risk statement (§22A.8) | Vandy / Ranya / Business | ⬜ content + scheduling, not engineering |
| **SME sign-off is the shared blocker** — distress re-entry copy, the 3 new Ch.1 DPs, and the Ch.2 narrative are all draft; spec §8.6 says no chapter locks until the SME reviews scenarios, option bands, coaching lines, and the typed rubric | Vandy + SME | 🟡 gates shipping any of it to a real child |

---

## 6. Recent changelog (ledger)

| Date | Change |
|---|---|
| 2026-07-20 | **Avatar art drift: canon pinned, and the five tones are now guarded by tests.** The five Explorer PNGs weren't the same child — headband colour varied purple/green/blue and 2 of 5 carried a green backpack + compass the others didn't, so changing skin tone changed the *person*. Canon is now locked in `public/assets/README.md` (plain purple headband, no backpack/props — the majority of the existing set, and the reading at ~110px sprite size where a compass badge is just noise). **Method corrected too:** generating the prompt five times is what caused the drift, since independent generations vary hairstyle and props even at a fixed seed — and indeed even the two otherwise-on-canon files have hairstyles of their own. The set is now specified as **four skin-tone recolour *edits* of one approved base** (`nova-warm-medium.png`, tone_3: on canon, the onboarding default, and mid-range so each shift is smallest), with a Nano Banana edit prompt that pins pose, face, hairstyle, headband, clothing, line work, shading, framing and alpha, and forbids adding or removing props. Art regeneration is owner-side. **Measured the set rather than eyeballing it** (new `tests/helpers/png.ts`, a minimal RGBA PNG decoder, so no image dependency): face-tone luminance runs 202 → 181 → 152 → 130 → 100, which confirmed the `tone_1…tone_5` mapping is correct and evenly spaced — but also surfaced a real inclusion problem nobody had noticed: **the set is compressed toward light**, bottoming out at `#a05030` (≈100) when the palette it represents reaches `#4a2c14` (≈45), so the deep end is under-served — the whole reason five tones exist. Flagged in the README with target hexes. New `tests/unit/avatarTones.test.ts` (5) pins the silent, invisible-until-a-child-plays failure modes of hand-regenerated art: a file must exist per tone, stay a genuine cutout (>15% transparent — the deer's opaque box, caught once already), **darken monotonically tone_1→tone_5** (otherwise the tone a child picks isn't the child they see), keep >10 luminance between neighbours, and not drift lighter at the deep end. Tests: 164→169 unit. |
| 2026-07-20 | **The decision is a journey now, and the copy uses the child's own names (owner playtest #4 + #5).** **(1) "It is still stuck to the square."** Measured before changing anything, and the diagnosis inverted the plan: the decision trigger sat **174–372px from spawn** — under a second of walking at 420px/s — while **71–86% of every level, and every crystal and discovery, was walkable but never visited**. The world was never too small; the *route* was too short. That also killed the obvious fix: enlarging `WORLD_W/H` scales content uniformly, so the walk would still have been under a second — a coordinate migration for no gain. Instead added **`Scene.spawnCell`**, a per-scene spawn override. Levels are shared between scenes (all six ch1 scenes use `everbright-meadow`) but each puts its decision somewhere different, so one per-level spawn could never be far from all of them. Each scene now starts the child **across the level from its own decision: 981→1238px, ~2.5–2.9s of walking** before the first choice, straight through the scattered crystals. Spawns are placed by a one-shot script against the real `GridMap`: walkable, clear of characters/objects/triggers, inside a comfortable interior margin — with a **deeper top margin because the first attempt put the child behind the HUD chips**, and, critically, a **flood-fill reachability check**, since the furthest cell can be across the pond or behind the tree line and would soft-lock the scene. New `tests/unit/sceneSpawn.test.ts` (6) covers walkable-spawn, headroom, minimum journey distance, crystals-en-route, and the reachability guard. **A camera e2e caught the regression this created** — it hard-coded the old geometry ("Jamie's trigger sits up and slightly right of the spawn") and walked *away* from the decision; rewritten to walk the real ~918px-right/390px-down route with ~2:1 weighted steps, so it still proves the decision is reachable **by walking**, now over the full journey. **(2) "Make conversation real."** Three fixes. The companion referred to *itself in the third person* in its own speech bubble ("Flicker's already worried") — rewritten to first person. All 13 scene goals rewritten warmer and spoken ("Hey {name} — someone's crying over by the bench. Come on, let's go see if they're okay."). And the real defect underneath: onboarding lets the child **name their own companion**, but the copy hard-coded "Flicker"/"Nova" in **75 places** — every speaker label, 4 lines where another character names the companion, 5 decision prompts and 4 choice labels. A child who named their dragon Sparky was told *"Flicker's name is on it"*, and a child called Aisha read prompts about Nova — breaking the one relationship the game is built on. Added `src/content/personalize.ts` (`{name}` / `{companion}`), applied to goals, dialog text, speaker labels, decision prompts, choice labels and everything spoken aloud, with a guest fallback so no child is ever shown "undefined". Verified live by renaming the profile to Sparky/Aisha and watching the prompt re-render. New `tests/unit/personalize.test.ts` (8) including a guard that no authored copy hard-codes the default names and no copy uses a token `personalize` doesn't understand. 🔒 All rewritten child-facing copy is SME-draft (§8.6). Tests: 150→164 unit, 18 e2e green; typecheck/lint/validate/build/audit clean. |
| 2026-07-19 | **Playtest defect pass: popup art, robotic narration, top-of-frame clipping, avatar art pipeline, and scattered crystal pickups.** Five fixes from owner playtest feedback. (a) **Popups rendered the pixel SVG, not the PNG** — `renderDialogOverlay`'s speaker portrait always drew the code-drawn sprite, so Wize appeared as a pixel owl in the pop-up while being a painted owl two inches away in the world. Now resolves through `characterImageUrl` with the standard `onerror` → SVG fallback. (b) **TTS said "Wize says: …" before every line** — a narrator prefix that reads as robotic instruction rather than a character talking to a child; dropped, since the portrait + name already show the speaker and the overlay's `aria-label` still announces it. (c) **Characters' heads were cut off by the top of the frame** — sprites are feet-anchored and ~110–120 world px tall (`--px` maps 1 world px to 1 sprite px), so feet closer than a sprite-height to the world's top draw above `y=0`; the camera cannot compensate because it is *already* clamped to the world's top edge and translating further would reveal empty space above the background. Fixed where it belongs — a `MIN_FEET_Y = 150` movement clamp (`keepSpriteOnScreen`) for the player, plus a matching `checkCharacterHeadroom` rule in `validate-content` for authored positions (no current scene violates it; the guard stops it regressing). New `tests/unit/spriteHeadroom.test.ts` (4). (d) **The Explorer is real art now — the last pixel-SVG character is gone.** It had stayed SVG *for a reason*: the child picks 1 of 5 skin tones at onboarding and one fixed PNG would erase that. Owner chose per-tone art and generated all five during the pass, so `characterImageUrl` now takes `skinTone` and resolves through a new `AVATAR_FILES` map (`tone_1…tone_5` → `nova-light-fair … nova-deep-brown`), with an unmapped tone or failed load still falling back to the tone-aware SVG. **All five verified before wiring** (the `wize.png` lesson — technically-valid art can still be the wrong picture): dimensions ~280×670, and a *full-image* alpha histogram showing 39–46% fully-transparent with 2.5–6.2% anti-aliased edge pixels, i.e. genuine cutouts and not an opaque box; each was then looked at to confirm it depicts the intended child and tone ordering. ⚠️ **Recorded drift, not a blocker:** the five are not visually identical apart from skin tone — headband colour varies (purple/green/blue) and 2 of the 5 carry a green backpack + compass the other 3 don't — so the "same child, different tone" read is imperfect; noted in `public/assets/README.md` with guidance to regenerate from a fixed seed/character reference. **9 of 9 characters now render as real art.** (e) **Crystals — §7.1's "brownie points scattered for immediate, low-stakes fun", which had never been populated:** all 23 collectibles in the game were `kindness_spark`, so there was nothing to pick up while simply moving. Added **91 crystals across all 13 scenes** (7 each), placed by a one-shot script against each scene's *real* `GridMap` so every one is on a walkable cell with 150px character/object/collectible clearance, outside trigger bounds (grabbing a crystal must never trip a decision early), 200px apart, and above the headroom line — `validate:content` passed first run. Crystals are deliberately **excluded from the §7.6 spark tally**: inflating the "you found 4 of 6" denominator with dozens of freebies would destroy the "find what I missed" replay signal, so `chapterSparkTotal`/`chapterSparksFound` now filter by kind. They render cooler and smaller than sparks (blue 💎, slow bob vs. the spark's gold pulse) so "a treat on my way" reads differently from "something I earned". 4 new crystal invariant tests. Tests: 142→150 unit, 18 e2e green; typecheck/lint/validate/build/audit clean (bundle 9.29/15 MB). **Still open from the same feedback:** genuinely *bigger* roamable levels — `WORLD_W/H` are fixed 1920×1080 constants that all authored content is positioned against, so enlarging the play space is a coordinate migration, tracked as its own task. |
| 2026-07-19 | **Scenario-hub cards now show the real AI background art instead of the raw pixel walk-map.** The "Little Dragon phases" hub (`src/ui/screens.ts`) had never gotten the asset-manifest treatment the in-game scenes did — each card prepended a `createGridThumbnail` canvas (the crude cell-tint grid), so the child's *first* impression of a chapter was a blocky green/grey rectangle, not the painted world they'd actually enter. Now each card prepends the same `backgroundImageUrl(gridLevel.id)` PNG the scene renders (Forest of Questions → forest, Valley of Welcome → flower meadow, Mountain of Helpers → lantern festival, Everbright Meadow → meadow-with-pond — all four child cards have art), with the identical live-fallback contract (spec §10.3): `onerror` swaps back to the grid thumbnail, and a grid level with no mapped art (e.g. `singing-bridge`) skips straight to it, so the hub never blanks. Decorative `alt=""` (the card's `<h3>` title already names it) keeps the axe WCAG scan clean. Verified in-browser — all four cards load the real art, zero fallbacks firing. typecheck/lint/unit(142)/build clean; accessibility + child-surface e2e green. |
| 2026-07-19 | **Diegetic stepping-stone path + ambient life (spec §7.7 / §17A.4 calm-first).** Progress visibility that reinforces "I'm journeying through a world" instead of "I'm completing a quiz." **The path** (`src/render/progressPath.ts`) is one connected **SVG trail rendered into the `world-layer`** (so the camera carries it with the ground, not chrome bolted on top): a stone per *main* scene of the chapter, from a new `CHAPTER_PATHS` map in `content/index.ts` (ch1 `e1→e2→e3`, ch2 `w1→w2→w3`, ch3 `w4→w5`, ch4 `w6→w7`), with a `pathIndexForScene` helper that **folds ch1's e2a/e2b/e2c detours onto the e2 stone** so a side-quest never reads as "a new stone appeared." Travelled stones are mossy, the current stone glows gold and slowly breathes (the quiet arrival cue §7.7 asks for — no numbers, no countdown), the road ahead is faint and dashed. `aria-hidden` + `pointer-events:none` (decorative, §20), and z-ordered **above** the ground-level stage objects after a first pass showed a trail-marker cairn occluding the "you are here" stone. **Ambient life** (`src/render/ambientLife.ts`) is zone-budgeted, barely-there world motion under the calm-first budget: drifting light motes (pollen/dust, the universal element), slow dappled sun (soft-light glows drifting like light through leaves), edge grass-sway, and water glints on the bridge zone. **Design call worth recording:** the spec names "clouds drifting across the sky," but the AI backgrounds are overhead/isometric with *no sky band* — a white cloud blob lands over painted grass and looks wrong (confirmed in-browser on the meadow). Matched the actual art (air + light) instead of the literal word, which is the faithful reading of "ambient life" here; kept it subtle enough that you feel it in motion rather than notice it. Both wired into `GameView.ts` right before the character loop so they tuck behind everyone. Verified in-browser on the Forest of Questions (forest budget) and Everbright Meadow (meadow budget) — the trail reads as a path, the "here" stone is clearly the anchor, ambient motion doesn't distract. New `tests/unit/progressPath.test.ts` (4: per-scene stone mapping, branch-folding, the w-phases, and the −1 "not on this path → light nothing" guard). All animation is CSS so the existing global `prefers-reduced-motion` rule freezes it for free (the reduced-motion e2e still passes). Tests: 138→142 unit, 18 e2e still green; typecheck/lint/validate/build/audit clean (bundle 8.17/15 MB). |
| 2026-07-19 | **Sound engine built and wired to every real game event (spec §17B.4).** New `src/audio/sfx.ts` — one-shot event cues (`playSfx`) plus a looped, low-energy ambient bed (`startAmbience`/`stopAmbience`), fully on-device (`<audio>` elements over local `/audio/` files, no network calls, so `?demo=1`'s zero-network guarantee is untouched). Same fallback contract as the art asset manifest: a missing or broken clip fires the browser's native `error` event, gets marked `broken`, and every future `playSfx` call for that key becomes a silent no-op — verified this actually fires correctly even against `vite preview`'s SPA-fallback quirk (which returns a 200/HTML page for any unmatched path instead of a real 404 — the browser's media decoder still rejects it and emits `error`, confirmed live). **Wired to real events, not stubs:** footsteps (new `WorldCallbacks.onFootstep`, throttled to ~3/sec while the avatar moves, `WorldRuntime.stepMovement`), a discovery chime (first-time-only, `main.ts` `recordDiscovery`), a spark-pickup chime (`onWorldCollect`), a bright cue on a strong choice / a soft thud on a poor one — the two examples spec §17B.4 names by name — via a new `EngineCallbacks.onDecisionBand` fired for every resolved decision (`partial` intentionally gets no cue; the consequence copy already carries that beat), a celebration fanfare, and the ambient bed started/stopped purely off `phase === "exploring"` so it steps aside for decisions/dialog/celebration rather than competing with their own cues — also stopped centrally in `navigate()` on any exit from the game screen. **Mutable via a new 🎵/🔕 toggle** in `GameView.ts`, mirroring the existing voice toggle exactly (same `localStorage` pattern, `aria-pressed`); §13A.6 venue-safe, §17B.4 accessibility (no cue carries information the visuals don't already). **No audio files exist yet** — this session builds the engine and ships the fallback, same two-step pattern the art pipeline used: `public/audio/README.md` documents the exact filenames each cue expects and points at CC0 sources (Kenney.nl, Freesound.org filtered to CC0); dropping a correctly-named file in makes it play with no code change. Verified live in-browser (walked through Ch.2 w1→w2, opened a discovery, picked up movement, resolved a strong decision) with zero console errors throughout, confirming the missing-file path never surfaces as a defect. New `tests/unit/sfx.test.ts` (3: unsupported-environment safety, the strong→bright/poor→thud mapping, partial's intentional no-cue). `stubCallbacks()` in `stageObjects.test.ts` updated for the new required `onDecisionBand`. Tests: 135→138 unit, 18 e2e still green; typecheck/lint/validate/build/audit clean. |
| 2026-07-19 | **`wize.png` fixed and re-mapped — the owl mismatch from earlier today is resolved.** The owner regenerated `wize.png`; it's now a bespectacled owl matching "Wize the gentle mentor owl" (confirmed visually in-browser — feathers, glasses, no resemblance to the earlier human-child render), still a genuine RGBA cutout (26% fully transparent pixels, no opaque box). Re-added `wize: "characters/wize.png"` to `assetManifest.ts`'s `CHARACTER_FILES`; the owl now renders live in Ch.2's Forest of Questions alongside Flicker. **8 of 9 characters are now live** (only `avatar` stays on SVG, by design). Full pipeline re-verified: typecheck/lint/unit(135)/build/audit clean; e2e 18/18 (two failures on the first run traced to a leftover manual preview server contending for port 4173 during the automated run — both passed in isolation and on a clean re-run, not a regression). |
| 2026-07-19 | **Chapter 2 rebuilt as an explore→discover→decide loop — and a real content bug caught along the way.** Same treatment Ch.1 got: w1–w6 each gained a spoken `goal` (Wize-voiced, same `onSceneChange`/`speakLine` mechanism as Ch.1) and **2 new discovery objects** (12 new SME-draft dialogs, `content/index.ts` registration), plus a **gated Kindness Spark tied to that scene's decision point** (6 new gated sparks, 12 sparks total across the chapter); w7 (the walk-to-finish scene) got a short goal for consistency. New discovery objects deliberately reuse assetRefs already wired to real art (`bush`, `dropped_hat`, `flower_patch`, `basket`, `bell`, `petals`, `notice_scroll`, `note`, `flower_crown`, `trail_marker`) so they render as real props immediately, no new art needed. **Placement was pre-validated before authoring**, not after: a scratch script queried each scene's real `GridMap` + character positions + trigger bounds for cells clearing the §17A.4 150px character-clearance and trigger-overlap rules `validate-content` enforces — `validate-content` passed clean on the first run, no repeat of Ch.1's pond/collision rework. Covered by the existing `stageObjects.test.ts` scene-integrity test, which iterates every registered scene including ch2. **While spot-checking the new art in-browser, found a real defect the corner-only PNG check from the previous session's manifest work had missed**: `wize.png` is a well-cut, genuinely-transparent file (verified with a full-image alpha scan this time, not just 4 corner pixels) — but it depicts a human child, not "Wize the gentle mentor owl." Shipped narration says *"Wize the owl whispers..."* (`w2.scene.json`) and the companion-fallback copy says *"the owl says..."* — mapping the file would have shown a human on screen while the story called her an owl, confusing to a 5-year-old. Reverted `wize` out of `assetManifest.ts`'s `CHARACTER_FILES` (stays on the SVG owl); every other character file was checked against its narrative role and matches (flicker=dragon, jamie=rabbit, grownup=ranger, worry-cloud=cloud, deer=deer). 30 uncommitted-until-now content files + the manifest fix are still local, not yet committed — awaiting confirmation. Tests: 135 unit + 18 e2e still green; typecheck/lint/validate/build/audit clean. |
| 2026-07-19 | **Art asset manifest — real AI backgrounds + props now render, with a live fallback.** Built `src/content/assetManifest.ts` (spec §10.3): three lookups — `characterImageUrl` (resolved `CharacterId` → PNG, reusing the renderer's own `resolveCharacterKey`, now exported), `objectImageUrl` (`assetRef` → prop PNG), `backgroundImageUrl` (grid-level id → 16:9 PNG, ids already match the AI filenames 1:1). `GameView` renders the code-drawn placeholder first and swaps in an `<img>` only when the manifest has one, **each with an `onerror` that restores the placeholder** — so a missing *or broken* file falls back live and `?demo=1` never breaks (verified in-browser: backgrounds, bench, ball, flower-crown, signpost all render as real art). **Everything wired: all 5 backgrounds, all 17 props, and 8 of 9 characters render as real art** — verified in-browser (Flicker, Jamie, the deer, backgrounds and every prop load with zero `onerror` fallbacks firing). The character files were initially uncut 1408×768 frames and were briefly held back; the owner re-cut all of them to tight, background-removed portrait cutouts (verified RGBA + transparent corners), including the deer that was the old opaque-box blocker, so they are all mapped now. **`avatar` is the one deliberate hold-out** — it stays on the tone-aware SVG because it's redrawn per the child's chosen skin tone (a real 5-way onboarding pick; a single `nova.png` would erase it), confirmed in-browser that the avatar honors the selected tone. **Also fixed a pre-existing a11y defect** the manifest work surfaced: off the explore phase a stage object is a plain `<div>` carrying `aria-label` with no role (WCAG `aria-prohibited-attr`, serious) — added `role="img"`; `accessibility.spec.ts` decision-overlay scan is green again. **Committed all 31 source PNGs** (7.2 MB; bundle 8.03/15 MB). Tests: 135 unit + 18 e2e green; typecheck/lint/validate/audit clean. |
| 2026-07-19 | **Following camera — the world is no longer one screen.** Playtest feedback that the game still felt like "one rectangle / a diorama". Root cause: there was no camera — the 100×100 grid mapped 1:1 onto the 1920×1080 viewport, so the entire level was always visible and moving revealed nothing. Added a **following, zoom-in camera** (`WorldRuntime.applyCamera`): all world-space DOM (background, characters, sparks, stage objects, hotspots, move hint) now lives in a new `.world-layer` that is transformed `scale(z) translate(...)` each frame to keep the avatar near centre, clamped so it never shows past the level edges, with a dt-based lerp for smooth follow. Screen chrome (HUD, pills, diamond counter, discovery chip, overlays) stays fixed on the viewport, outside the layer. **It is a pure display transform** — avatar world coordinates, collision, proximity, and pickup are all untouched, so only *what's shown* changes; verified in-browser that walking now scrolls the world and content (pond, the ball) sits off-screen to be discovered. Zoom is `appConfig.world.cameraZoom` (default **1.8** — shows ~a third of the level at once), with a `?zoom=N` URL override. Characters are now ~1.8× bigger and far more readable, which also sets up the incoming real art. **Testing:** the four existing logic suites boot with `?zoom=1` (camera off) so their element framing stays stable — the camera moves elements around, and coupling logic assertions to framing would make them flaky. New `tests/e2e/camera.spec.ts` (4) exercises the real zoom: it zooms and follows, causes no page overflow, `?zoom=1` disables it, and a scored decision is still reachable by walking with the camera on (proximity + E, the real play path). Tests: unit 135 (unchanged), e2e 14→18. Also this session: **saved the AI-art prompt pack to [`docs/scripts/ai-art-prompt-pack.md`](./docs/scripts/ai-art-prompt-pack.md)** and created **`trunorth/public/assets/{characters,backgrounds,objects}/`** with a naming README, ready for the incoming Nano Banana / Midjourney PNGs (which will wire in behind an `assetRef → file` manifest — not yet built — so the offline demo keeps working). |
| 2026-07-19 | **Chapter 1 rebuilt as an explore→discover→decide loop, after playtest feedback that the game "feels like a quiz" and had "no game feeling".** The previous round (scattering collectibles) was the wrong fix — pickups with no goal and no consequence are scenery, not a loop. Root cause: every ch1 scene was *spawn → walk into a hitbox → answer*. Movement had no purpose because nothing told the child there was anything to look for, and nothing was learned by looking. **What changed:** (a) new `Scene.goal` — the companion states what you're looking for on arrival, so wandering becomes searching; (b) **13 new discoverable stage objects across all 6 ch1 scenes** (2–4 each) with **13 new authored dialogs**, each revealing a piece of context that makes the scene's decision make sense when you reach it (e.g. e1: a half-made flower crown, an abandoned ball, and the deer telling you Jamie has been alone since morning — *then* the invite decision); (c) **exploring pays** — `recordDiscovery` in `main.ts` awards a brownie point per discovery plus a 2-point bonus for finding everything in a scene, tracked in new `progress.discoveries`, deliberately decoupled from SEL scoring per §7.1; (d) a quiet **"🔍 2 of 4" discovery chip** (a chip, not a progress bar — §7.7 warns HUD chrome "measures the child"); (e) sparks and stage objects made far more visible (sparks 26→52px with a stronger glow; objects gently bob). **Five real bugs found and fixed during the build, four of them by tests:** the `object-beckon` animation was applied to the stage-object *button* rather than its sprite, so the element's box never settled and it became unclickable to anything waiting for a stable hit target (this would have broken the existing North Gate e2e click); **seven object/character and object/trigger collisions** authored in one pass (labels stacked on top of each other, and objects placed *inside* decision triggers where the decision fires before the child can examine anything) — now prevented by a new `checkObjectPlacement` rule in `validate-content` (150px character clearance + trigger overlap) mirrored by a unit test; **four discoveries placed on non-walkable cells** (in the pond) and therefore unreachable, caught by the existing `stageObjects` walkability test; a generation bug that put `obj_pond_edge` at cell `[0,0]`; and an over-eager relocation script that moved the pre-existing North Gate and Celebration Arch, reverted. New `tests/unit/exploreLoop.test.ts` (7) asserts every ch1 scene states a goal, has ≥2 discoverables, wires each to a registered non-empty dialog, uses a real sprite, keeps clearance from characters/triggers, **and can still be completed without examining anything** (§7.6: exploring is never required to progress). Tests 128→135 unit, 14 e2e unchanged. **Script for review: [`docs/scripts/ch1-explore-script-SME-DRAFT.md`](./docs/scripts/ch1-explore-script-SME-DRAFT.md)** — every new child-facing line, scene by scene, with four open questions for the SME. 🔒 All of it is SME-draft per §8.6. |
| 2026-07-19 | **Game-feel pass: stopped the assessment leak, built the §17B.2 reward juice, and gave Ch.1 something to actually play.** Triggered by playtest feedback that the game "feels like a quiz", isn't visually rich, and tells the child they're being assessed. All four points turned out to be `[MVP]` spec items that were never built, plus one outright defect — none were future-phase work. (a) **Assessment leak (defect, spec §1.1/§12.4/§14.3).** `buildCounselorPanel` rendered an "SEL Coach Insight" badge, a `For grown-ups:` paragraph carrying the clinical parent tip (*"Naming and questioning worry (ACT/CBT) reduces fusion with catastrophic thoughts for ages 5–8"*), and a "not a clinical diagnosis" disclaimer — **on screen, mid-game, to a five-year-old.** That breaks the stealth-learning pillar and §12.4's rule that grown-up surfaces be a *deliberately different* screen. Solo play now shows a warm gold card badged with the companion's name carrying only `forChild`; Together Mode (a parent is deliberately present) keeps the full coach panel. Parent content was already homed behind the parent gate in `renderJourneyReflection`, so nothing was lost. New `tests/e2e/child-surface.spec.ts` (3 tests) scans every visible pixel across a full playthrough for assessment vocabulary — **and immediately found a second leak**: the celebration screen's "See counselor insights" button, now "Grown-up corner" (§12.1 frames the gate as a connection ritual, not a report). (b) **Reward juice (§17B.2).** `onMeterJuice` previously only re-rendered — the reward was a number changing off to the side. New `src/render/juice.ts`: companion sprite reaction, 10 particles (the §17A.4 budget is 8–12) flying companion→meter along a **quadratic Bézier evaluated per frame in rAF** — the spec is explicit that a CSS transition cannot do this, since `cubic-bezier()` is an easing curve not a spatial path — with arc lift as a **fraction of stage height** so it survives projector scaling, a meter catch-pulse, and a **world bloom** (flowers sprout around the avatar, scene briefly warms) implementing §17B.2's "a 6-year-old reads *the grass blooms where I walk* far faster than *the purple bar moved*". All of it no-ops under `prefers-reduced-motion` and is purely decorative — remove it and state changes identically. Verified in-browser: 10 particles, 7 blooms, companion cheer, meter catch, world warm all fire on a strong choice. (c) **Kindness Sparks (§7.1/§7.6).** Root cause of the "quiz" feel: **Ch.1 shipped with ONE collectible across six scenes**, so every scene was walk-to-trigger → answer → next. Ch.1 now has **11 sparks across 6 scenes, 4 of them gated** behind a `strong` resolution of that scene's decision — activating the previously-dormant `SceneCollectible.gate` field. New `src/content/sparks.ts` (`visibleSparks`/`chapterSparkTotal`/`chapterSparksFound`); `WorldRuntime` now treats the rendered DOM element as the source of truth for what's collectable, so gate logic lives in exactly one place and the runtime can't hand out an unearned spark. Celebration shows a deliberately **non-maxed** "you found X of 11" tally framed as an invitation. §7.6's hard constraint — sparks are **never required to progress** — is enforced by a test. (d) **Per-chapter celebration.** The celebration screen was hardcoded to **Ch.2**: finishing Ch.1 (Jamie, sharing, apologising, asking a grown-up) congratulated the child for *"Inspected a worry-flower"* and *"Took festival steps while nervous"* — none of which happened, about a character absent from the chapter. Now `contentConfig.celebrations` keyed by chapter + `celebrationFor()` with a ch2 fallback. **Ch.1 copy is a clearly-marked SME DRAFT** (§8.6), consistent with the distress and new-DP copy. Tests 118→128 unit, 11→14 e2e. ⚠️ **Known flake:** `projector.spec.ts` failed once under load on a layout measurement taken before CSS applied; hardened with a `document.fonts.ready` + double-rAF settle and a polled assertion, then clean across 3 full + 4 isolated runs — but reproduced once *after* the fix and could not be reproduced since, so it is reduced, not proven eliminated. CI already retries once. |
| 2026-07-19 | **§22 Phase 4 hardening, items 2–5: error surface, accessibility, performance budget, projector resolutions. 4 real defects found and fixed.** (a) **DoD §27 item 6 — §17D API-failure surface.** `LiveCompanionClient` now runs the spec's ladder: attempt → **one** in-character retry (`onRetry` hook fires `API_RETRY_LINE`, "My words got a little tangled — let me try that again!", so the child sees the companion rather than a spinner; input stays frozen per §17B.9 guard 1) → `CompanionUnavailableError` → `SceneEngine`'s catch serves the **hand-authored per-decision fallback** and resolves the decision anyway. Previously there was no retry at all and the catch emitted a hardcoded `"Let's keep going — you're doing great."`; the client had no access to `companion-fallbacks.json` whatsoever (server-only import) — so the one case where authored copy matters most, a dead proxy on stage, was the one case that got a generic string. New `src/companion/fallbackLines.ts` bridges it. Retries are capped at exactly one, test-enforced, because an unbounded loop on stage is worse than a fallback. **Verified end-to-end in a real browser in live mode with every `/api/**` call aborted:** exactly 2 attempts, and the child saw *"My words got a little tangled…"* → *"You made room for Jamie — belonging starts with one kind invite."* → counselor insight → story continued. (b) **Closed the demo-mode `filterInput` gap** carried from Phase 3: `DemoCompanionClient` now filters before scoring, mirroring the server's order — demo mode, the mode *guaranteed* to be running on stage, was the only one with no safety filter on typed input. Side effect worth noting: this makes the §17D distress-resume path reachable offline for the first time. Added a regression guard asserting **every authored option label passes `filterInput`** — the same class of bug as the red-team suite's `"hello"`/`"hell"` false positive, now guarded before it can recur through the new filter call. (c) **Accessibility pass (spec §20 / §17A.4 / §22A.5)** — new `tests/e2e/accessibility.spec.ts` (4 tests in CI): axe-core scan at `wcag2a/2aa/21a/21aa/22aa` over landing, hub, gameplay stage and decision overlay; a scored decision completed by **Tab/Enter alone** with an asserted *rendered* focus ring (not just a stylesheet selector); and a `prefers-reduced-motion` check. **Found 2 real defects:** the landing screen's primary CTA was **2.36:1 contrast** (`--text-dark` on `--accent`) — a serious AA failure on the first button anyone presses — fixed via a new `--accent-deep` token at ~10:1, also applied to `.typed-submit`/`.companion-thinking` which were only scraping past at 4.58:1; and the reduced-motion reset capped `animation-duration` but not `animation-iteration-count`, so `infinite` animations kept looping imperceptibly and driving the compositor forever (works against the §19 Chromebook frame-rate budget). ⚠️ **The §22A.5 deliverable is still open** — the manual screen-reader pass by the team's visually-impaired member is the part that becomes a told credibility story; automated tooling catches roughly a third of WCAG issues and is a floor, not a certification. (d) **Performance budget (spec §19)** — new `scripts/audit-bundle-size.ts` + `npm run audit:bundle`, in CI after `build`, non-zero exit on breach (verified by deliberately breaching it). Two tiers: the spec's 15 MB showcase ceiling plus tighter per-asset-class budgets with headroom, because 15 MB alone would sit green through a 10× regression. Current: 1.38 MB dist, 145.8 kB JS (44.1 kB gzip, 55% of budget), 21.5 kB CSS, 85.5 kB fonts; the 4 zone PNGs dominate at ~250–324 kB each. (e) **Projector resolutions (spec §13A.6/§13A.8, Consolidated §6.1/§6.6)** — new `tests/e2e/projector.spec.ts` at 1024×768 / 1366×768 / 1920×1080: no page overflow, stage + HUD unclipped, overlay on screen, ≥12px text, ≥64px hit targets, and the stage verified to hold **16:9** (settling a ledger open question — the `--px` container does maintain aspect and never stretches; what's missing from §17B.7 is only the explicit letterbox *treatment*). Initial load measured at ~40–100ms against the §19 3s budget. **Surfaced a new gap:** the decision overlay is fixed-size — 452×64px / 16px text at *every* resolution — so on a big venue projector the most important surface in the demo is proportionally the smallest it ever gets (§13A.4). Logged in §5, not silently accepted. Tests 108→118 unit, 3→11 e2e. New dev dep `@axe-core/playwright`. All of typecheck/lint/validate:content/test:unit/build/audit:bundle/test:e2e green. |
| 2026-07-19 | **Live model verification (ADR-004) — found and fixed 2 live-path defects.** With a real key configured, exercised `claude-haiku-4-5-20251001` against the §9.4 contract: structured JSON parses, `confidence` 0.92–0.95 on strong answers and 0.65 on an ambiguous one (the 0.55 floor behaved without needing to force `partial`), `companionLine` 87–98 chars (under the 120 cap), ~3.3 s latency vs the 8 s timeout, and **adversarial input blocked pre-model in 0.03 s** — `filterInput` runs before the API call, so jailbreak traffic costs nothing. Two defects the offline path did **not** have: (1) **`matchedCriterion` was silently dropped** — §9.4 requires it and §8.3 says the model must cite the criterion it matched, but `buildSystemPrompt` never asked for it and `parseModelResponse` never read it, so the live path returned *less* than the offline rubric scorer; now requested + parsed, re-verified returning `"offered_inclusion"`. (2) **Haiku 4.5 emitted "that's a superpower"** — the exact identity-claiming phrasing the §9.8 identity-framing guard forbids and explicitly names as a correction target; the system prompt had no such rule and `filterOutput` only screened clinical/meet-up terms. Now forbidden in the prompt **and** rejected by `filterOutput` (a prompt rule is not an enforcement mechanism), with 6 regression cases; re-verified live, lines now return in the approved past-tense situational form. Also fixed a config break introduced by the e2e work: vitest's default include was collecting `tests/e2e/*.spec.ts` and failing on Playwright's `test.describe` — `vitest.config.ts` now includes `tests/unit/**/*.test.ts` only. Tests 102→108. |
| 2026-07-19 | **E2E stage-readiness suite (DoD §27 items 1 & 3) + self-hosted fonts.** Added `playwright.config.ts` + `tests/e2e/demo-mode.spec.ts` (3 tests, wired into CI after `build`, report uploaded on failure), serving the **production build** via `vite preview` because §13A's stage claims are about the built artifact. Tests: (1) zero off-origin and zero `/api/` requests during scored play in demo mode; (2) the same path replayed with the network **hard-blocked** (§13A.3 "no internet at all") — stronger than observation because it catches a *conditional* external fetch; (3) the full 5-DP ch1 golden path to celebration, reporting engine time. **Writing test 1 immediately found a real stage-readiness defect:** `index.html` loaded Nunito + Inter from the **Google Fonts CDN**, violating §13A.1 ("all assets preloaded/bundled") — on a stage with failed WiFi the game would have silently rendered in system fallback fonts, different typography from every rehearsal and a direct hit to §17B.5 guard-3 legibility and §13A.4 "readable from 50 feet". Fixed by self-hosting both as single variable woff2 files (`public/fonts/`, SIL Open Font License, ~85 kB total) with `@font-face` in `global.css` and `<link rel="preload">`; verified no `fonts.googleapis.com`/`fonts.gstatic.com` reference survives in `dist/`. **Golden-path engine time measured: 6.2s** against the 180s child budget — the engine is nowhere near the constraint (~174s of reading headroom). DoD item 3 → ✅; item 1 stays 🟨 because a scripted walk-through is not a child and the criterion still needs the §22A.2 human playtest. DoD now **4 of 8 met**. Also fixed a locator lesson worth recording: several controls (trigger hotspot, stage objects) expose their name only via `aria-label`, so Playwright `hasText` silently misses them — the suite uses `getByRole({ name })` throughout. |
| 2026-07-19 | **Phase 4: red-team safety suite + spec-conformance fixes + Part II governance.** (a) **Red-team suite (spec §9.6 — "a deliverable, not a checkbox"):** new `tests/unit/redteam.test.ts` (45 cases, in CI) covering jailbreak/prompt-injection, real-world meet-up, PII solicitation, child PII disclosure, distress/self-harm, profanity, output-filter rejection, input hardening, fallback coverage, and model pinning. Running it for the first time **found four real live-path defects, now fixed in `src/safety/filters.ts`**: (1) *the most serious* — profanity used substring matching, so `"hello".includes("hell")` was true and *"hello Jamie, want to play with us?"* — effectively the ideal answer to the game's first typed DP — was **blocked as profanity**; now word-boundary matched; (2) real-world meet-up requests passed through and were scored normally, despite Appendix A §4.3 forbidding the topic; (3) PII *solicitation* ("what is your address") was unfiltered — only the child disclosing their own PII was caught; (4) jailbreak patterns were too narrow ("ignore your instructions", "disregard your guidelines", "you are now DAN", "no limits" all passed). Also hardened: distress is now evaluated **first**, so a distressed child reaches the distress path even when the message also trips profanity; distress lexicon extended with recognized ideation euphemisms and marked **SME-owned**. Jailbreak patterns deliberately key on rule-breaking markers rather than the word "pretend", so imaginative play ("pretend you are a puppy") is not blocked — guarded by explicit false-positive tests. (b) **Spec-conformance (Consolidated v3.0 Appendix F):** pinned the companion model `claude-3-5-haiku-latest` → **`claude-haiku-4-5-20251001`** (ADR-004) — a floating alias would silently invalidate everything the red-team suite certifies; and pinned **`vite` 8.1.5** (ADR-001), which required a coordinated **`vitest` 3→4** major bump the spec didn't anticipate, plus `engines` tightened to Vite 8's real floor. (c) **Part II governance (spec §25):** created `docs/adr/` — ADR-001 (Vite), ADR-002 (Vercel Node runtime, ratifying existing code), ADR-004 (model pin + lifecycle) **Accepted**; ADR-003 (EXT DB+auth), ADR-005 (asset provenance), ADR-006 (raw-input retention) deliberately left **Open** as owner/counsel/art decisions the implementer must not make. Added `docs/governance/delivery-status.md` tracking the §27 Definition of Done (**3 of 8 met**) and the §26 risk register against reality. Tests 57→102. Verified: typecheck/lint/validate/build green, and all four safety fixes re-probed over real HTTP against the running API. **Live model call still unverified** — no API key available, so only config plumbing and the no-key path were exercised. |
| 2026-07-19 | **Spec-coverage audit (docs only — no code change).** Measured the Master Spec (§2–§22A, Appendix A) against the implemented tree feature-by-feature and recorded the result as a point-in-time snapshot in new context file [spec-coverage.md](./docs/context/spec-coverage.md) (indexed in §4). Confirmed the core `[MVP]` engine is built and green (scene-graph state machine, Tier-B movement, two chapters, the full five-layer safety stack, rubric scoring, demo mode, parent gate, celebration); remaining gaps cluster in presentation/"juice" (§17B), the `[EXT]` backend/dashboard, mini-games (§16), and the §22A credibility items (content/SME/scheduling, not engineering). Added the newly-surfaced gaps as rows in §5 — notably `emotionalResidue` unwired (§6.1b), strength-mirroring + the 🟢 do-not-cut `baselineStrength` seed (§9.8/§17C.3a), progressive meter display (§7.2), the incomplete event-log schema (§11.5), `companionLine` measure-and-split (§9.4), typewriter/pacing enforcement (§17B.6), and the SME sign-off that gates all draft copy (§8.6). Biggest structural divergence recorded: both built chapters target ages 5–7 vs the spec's Ch.2 = 8–10 / Ch.3 = 11–15 (already an open team question, not a bug). **Follow-up the same day — spec hierarchy resolved:** the three overlapping specs in `docs/specs/` turned out to be *layered, not competing* — both engineering docs declare "Derived from: `TruNorth Master Spec.md` (Draft v2)", and the Consolidated spec states the conflict order itself (Master Spec → SME/counsel → Consolidated v3.0 → ADRs → README). `TruNorth Technical Specification.md` is the Phase-1 **Draft v1, superseded** by Consolidated v3.0 (same Sections 1–23 updated in place + Part II governance + Part III enterprise). Actions: §1 and the Madhu task-board entry now name Master Spec (product intent) + Consolidated v3.0 (engineering intent); Draft v1 carries a SUPERSEDED banner listing the decisions v3.0 changed (kept in place, not renamed, so existing links resolve); `trunorth/README.md` already referenced the Consolidated spec, corroborating it. Also logged v3.0's Appendix-F platform deltas against the build as §5 rows — **Vite 8.x pinned vs `^6.2.2` built**, **pinned Haiku 4.5 dated ID vs `claude-3-5-haiku-latest` floating alias**, Node 24 preferred vs 22, WCAG 2.2 AA unaudited, and the absent Part II governance artifacts. Those are flagged only — dependency/model changes need their own reviewed change, not a docs edit. No `trunorth/` files touched. |
| 2026-07-19 | **Phase 3: robust rubric-based typed scoring + lint in CI.** The offline (no-LLM) scoring of free-typed answers was two duplicated flat keyword lists (`scoreLocally` in the server, `inferBandFromInput` in `DemoCompanionClient`) that ignored the dormant `DecisionPoint.typedRubricRef` field. Replaced both with **one shared scorer** `src/counselor/typedScoring.ts` (`scoreTypedResponse(text, rubricId?)` → `{ band, matchedCriterion, confidence }`): per-DP `TYPED_RUBRICS` (`inclusion`/`brave_start`/`curiosity`) layer decision-specific strong/poor phrases on a GENERIC base that is the **exact union** of the two old lists, so choice-mode option labels score identically while free-typed answers get real discrimination. Activated `typedRubricRef` on the 3 typed DPs and plumbed it through `CompanionRequest.typedRubricRef` (set in `SceneEngine.buildCompanionRequest`) so both the server and demo scorer pick the rubric **without** importing the content registry into the API bundle; also surfaced the previously-unused `matchedCriterion`. Wired `npm run lint` into `.github/workflows/ci.yml` (between typecheck and validate) and gitignored `trunorth/.claude/` (local preview launch config). **Verified in-browser (`?demo=1`)** on `dp_leftout_bench`: the same scene scored a typed "…ignore them and keep playing" as **poor** (→ repair loop, poor insight) and "…come play with us… join our game" as **strong** (→ advance, strong insight) — both scored *partial* under the old heuristic, so the rubric genuinely improves discrimination. Tests 50→57 (`tests/unit/phase3.test.ts`, 7); typecheck/lint/validate:content/build all green; no console errors. Noted a follow-up gap: demo-mode typed input still isn't run through `filterInput` (server path is). |
| 2026-07-19 | **Phase 2: widened the interaction curve (spec §2.4/§4 click→typing model, §6.3 DP floor).** (a) **Typed input in the main level:** promoted ch2 `dp_quest_start` (w1) and `dp_investigate` (w2) from `inputMode: "choice"` to `"both"` — they now render tap options *and* a text box; a typed reply is scored through the companion pipeline (demo/local keyword heuristic or LLM) and routed by band. Chosen deliberately: every band on both advances the story forward (no typed-partial dead-end), and neither is a multi-tap mini-game, so `dp_breathe`/`dp_crossing`'s tap-count mechanic is untouched. Typed DPs across the game: 1 → 3. (b) **Ch.1 Everbright Meadow 2 → 5 DPs** (meets spec §6.3's 4–6/chapter floor): 3 new grid-backed scenes `e2a`/`e2b`/`e2c` inserted between e2 and e3 (`e2.nextSceneId` e3→e2a), each with one new DP following the established one-DP-per-scene + advance-on-resolve pattern — `dp_reassure_shy` (reassure a shy friend; empathy/calm), `dp_share_flower` (share the last flower / take turns; friendship_repair/empathy), `dp_repair_oops` (apologize + fix after knocking over a crown; friendship_repair/courage). Each: strong/partial → next scene, poor → same-scene repair loop; option labels are keyword-aligned so demo-mode band inference matches `selScore`. Full supporting coverage added: `insights.ts` (3 DPs × 3 bands), `coPlay.ts` (3 discuss prompts), `companion-fallbacks.json` (3 DPs × 5 lines), `showcase.bundle.json` (13 new entries: strong/partial/poor for the 3 ch1 DPs + typed partial/poor for the 2 promoted ch2 DPs). Registered all in `src/content/index.ts`. Updated `stageObjects.test.ts` (e2 `advanceScene` now → e2a, reflecting the new chain). New `tests/unit/phase2.test.ts` (7). **Verified end-to-end in-browser (`?demo=1`):** full ch1 play-through e1→e2→e2a→e2b→e2c→e3→celebration with all 5 DPs incl. a poor→repair loop on `dp_share_flower`; and ch2 `dp_quest_start` rendering as "both" with a typed reply scored strong → w1→w2. Tests 43→50; typecheck/lint/validate:content/build all still green; no console errors. New-DP copy is draft pending SME review (consistent with §3.12). |
| 2026-07-19 | **Phase 1: added the spec-mandated scored Ask-for-Help beat + a distress-aware resume.** (a) **Ask-for-Help (spec §7.2):** the existing `dp_ask_grownup` (Scene e3) was already authored as an ask-for-help beat in all its copy — only the skill tag was wrong. Split the skill type into `MeterSkillId` (the 7 metered skills) + `SkillId = MeterSkillId \| "ask_for_help"` (`src/types/index.ts`), retagged `dp_ask_grownup.selSkills` to `["ask_for_help", "courage", "empathy"]` (ask_for_help primary → logged as the event skill), aligned its 3 insight `skillFocus` values, and cast the resolver's meter lookup to `MeterSkillId` (the existing `if (meter)` guard already makes scoring a meterless skill a safe no-op). Reused the existing Ch.1 grown-up scene rather than inventing the spec's phantom "W2b". (b) **Distress-aware resume (spec §17D/§9.6):** new `renderResumeCheckin` screen (`src/ui/screens.ts`) shown at boot only when the saved state's `flags.lastSafetyFlag === "distress"` (`shouldResumeInDistress` predicate + `RESUME_DISTRESS` copy in `src/counselor/checkin.ts`; new `resumeCheckin` AppScreen + boot branch in `main.ts`). Calm 🫂 card, a "keep going / just sit here for a bit" pair (neither scored), clears the flag on acknowledge so it fires once per episode (distress event stays in the log for the parent record). **Re-entry copy is a clearly-marked SME DRAFT — must be SME-signed-off before shipping to a real child.** Verified end-to-end in-browser: distress-ended save routes to the screen, both paths work, flag clears, no re-fire, no console errors. Tests 37→43 (`tests/unit/phase1.test.ts`); typecheck/lint/validate/build all still green. |
| 2026-07-19 | **Phase 0: fixed all `npm run typecheck`/`npm run lint` errors — CI is green.** Matched the existing `as unknown as Scene` cast pattern for w4/w6/e1/e2/e3 in `src/content/index.ts`; dropped the dead `"dashboard"` value from `src/ui/screens.ts`'s local `Screen` type. Fixing those two unmasked a second layer that had never run before (the typecheck script's `&&` always short-circuited past the server/api pass): fixed `tsconfig.api.json`'s `rootDir` (was inheriting `"server"` while also including `api/`), retyped `server/index.ts`'s `authMiddleware` context via Hono's own `Context<{ Variables }>` instead of a fragile `Parameters<Parameters<...>>` extraction, and added the `with { type: "json" }` import attribute `server/routes/companion.ts` needs under NodeNext module resolution. Added `eslint.config.js` (ESLint v9 flat config) + the `typescript-eslint` dev dependency, which had never been installed; removed the one real violation found (an unused `GameEvent` import in `src/counselor/insights.ts`). `npm run lint` is not yet wired into CI. 37/37 tests still passing; `validate:content` and `build` unaffected. |
| 2026-07-18 | Split Little Dragon hub into **3 phases** (Forest/Meadow, Valley/Cave, Mountain/Festival) on top of main. |
| 2026-07-13 | Rebased this ledger onto real `trunorth/` tree (removed phantom `TruNorthProject/` claims). |
| 2026-07-13 | Integrated Level 1 **The Singing Bridge** (W1–W6, Flicker, Wize, Courage Feather). |
| 2026-07-13 | Updated team board: Daniel L1 done; Ermoni/Gabby/Jose/Vandy/Ranya tasks retargeted. |
| 2026-07-13 | Organized repo into `docs/{specs,scripts,kickoff,context}`; added configurable `server/config.ts`, `src/config/*`, expanded `.env.example`. |
| 2026-07-14 | Added world movement: WASD/arrows, collision, proximity interact (E/Space), companion follow, collectible pickup (`WorldRuntime`). |
| 2026-07-17 | Full reality audit: documented server auth/children/progress/reflect endpoints, world movement promoted to ✅, test count 11→13, recorded failing typecheck (CI red), broken lint script, missing `sw.js`; added context files `world-movement.md`, `ui-screens-views.md`, `server-api.md`. |
| 2026-07-17 | Added parameterized 100×100 grid levels: `GridMap` (cell vector: coordinate/color/walkable, painting API), `gridLevels.ts` (2 demo levels, `?grid=<id>` testing), canvas `gridBackground.ts`, center-point grid collision in `WorldRuntime`, optional `Scene.gridMapId`; tests 13→19; context file `world-grid-levels.md`. |
| 2026-07-17 | Made grid levels the only levels: all ch1/ch2 scenes bind `gridMapId` (everbright-meadow / singing-bridge), hub cards render grid canvas thumbnails, ch1 scenario retitled "Everbright Meadow"; **removed ch3 Forest** (content files + registry + hub card + default unlock); tests 19→20; typecheck errors 11→9. |
| 2026-07-17 | Added **pre-level check-in**: hub → `checkin` screen before every level (3 open-ended questions from a 6-question bank, tap or own-words answers, safety-filtered) → 0–10 starting point + bright/steady/gentle placement stored in `progress.checkins`, shown on a compass scale, and surfaced in the parent journey reflection. New `src/counselor/checkin.ts`, `renderCheckin`; tests 20→26. **Deleted committed stale compiled JS (`src/counselor/insights.js`, `src/safety/filters.js`, `src/types/index.js`)** — they silently shadowed the `.ts` sources in vitest and vite builds. Root cause: the server build pass emits into `src/` (documented as a known quirk in §3.14; left as-is until the proper hosted API/backend build replaces it). |
| 2026-07-17 | Added Vercel deploy scaffolding: `api/[[...route]].ts` (Node Function wrapping the existing Hono `app` via `hono/vercel`'s `handle()`, catch-all so one function serves every `/api/*` route) + `tsconfig.api.json` (typecheck-only config covering `server/`+`api/` without disturbing the Docker build's `tsconfig.server.json`); `npm run typecheck`'s second pass now uses it. Code-side only — the actual Vercel project (root dir, env vars incl. `DATABASE_PATH=/tmp/...`, deploy) is still a manual step for whoever holds the Vercel account. |
| 2026-07-17 | Recreated the full character cast (`src/render/characters.ts`) + `public/favicon.svg` in 8-bit pixel-art style: ASCII pixel maps rendered as crisp SVG `<rect>` grids, pixel expression overlays (brows/mouth/sparks/sparkles). Same exports, sizes, and aspect ratios — no caller changes. |
| 2026-07-17 | Made the whole game stage scale with the screen (characters were fixed 110/120px while the stage shrank): `.game-viewport` is now a CSS size container defining `--px` (1/1920 of stage width); characters get a `--char-size` var in `GameView` and their SVGs fill it (`width:100%; height:auto`); labels, speech bubbles, collectibles, move/interact hints, HUD meters, pills, zone sign, narration bar all sized in `calc(n * var(--px))` with `clamp()` legibility floors on text. Verified at 1600/700/480px windows — avatar:stage ratio constant 0.0573. `src/styles/global.css` + `src/ui/GameView.ts` only. |
| 2026-07-18 | Made the SEL Coach insight panel draggable + closable (`GameView.ts` + `global.css` only): new `.counselor-panel-header` (badge + ✕) acts as a pointer-capture drag handle with window-clamped inline `left/top`; ✕ dismisses. Module-scope state keeps the dragged position and the dismissed-insight key across the full re-renders `renderGameView` does each phase/meter update — a dismissed insight stays hidden until a different insight arrives. |
| 2026-07-18 | Fixed dialogs being blocked by characters + removed the bottom narration bar (`GameView.ts` + `global.css` only): characters (z up to ~64 from `10 + y/20`) were punching through the decision/dialog `.overlay` (was z 30) and standing on the counselor panel (was z 25). New stage z-layering: counselor panel 70, speaking character + bubble / interact hint 75, thinking pill 80, modal overlays 100. Companion speech bubble restyled (wider `360*--px` max, border, tail, 11px floor). Narration bar deleted — `scene.narration` no longer renders (stage-object dialogs carry story text; `SceneEngine` auto-advance untouched). Also de-overlapped top pills: stage tag drops below the demo pill, together-pill below the crystal counter; move hint moved to bottom-left. Verified in-browser (w1→w3 + scroll dialog); 36/36 tests, typecheck still 9 known errors. |
| 2026-07-17 | Added **declarative stage objects** (groundwork for the anxiety level & infinite stage authoring): `Scene.objects[]` — grid-cell-placed interactables with a `StageObjectInteraction` union (`openDialog` → new multi-page `renderDialogOverlay` with speaker/portrait, fed by `dlg_*.json` + `DIALOGS` registry; `finish` → new public `SceneEngine.advanceScene`/`completeChapter`, with `advance`\|`complete` per object). WorldRuntime proximity now targets triggers → objects → NPC fallback (`onObjectInteract`); objects render as emoji sprites with click fallback; narration auto-advance is skipped when a finish/advance object exists. Demo content: ch1 signpost/North Gate/Celebration Arch, ch2 w1 Wize scroll (ch2 finale untouched). validate-content now checks dialogs + objects; tests 26→36. Verified in-browser (dialog paging/freeze, gate advance, arch celebration, no auto-advance). New context file `world-stage-objects.md`. |
| 2026-07-18 | Removed Flicker's detached orange wing pixels (`O: #ff9e00`) from `dragonSvg` in `src/render/characters.ts` — the floating triangles read as a stray orange mouse cursor next to the companion in-game; body/belly widened one column to fill the gap. Art-only, no export changes. |
| 2026-07-18 | **Fixed the Wize/Flicker role swap in Level 1 + walk-to-finish ending.** Ch2 scenes now cast **Wize the owl as the follower companion** (assetRef `char_wize` on the `companion` id; GameView labels/pill say "Wize" whenever the scene's companion assetRef is wize) and **Flicker the dragon as a stationary NPC blocking the Singing Bridge** (new `flicker` id → dragon sprite mapping in `characters.ts`; new optional `SceneCharacter.solidSize` [w,h] lets his solid span the whole 154px plank corridor, 190×80 at the south entrance in w1–w6). Chapter completion is no longer decision-driven: `dp_crossing` strong now advances to **new scene w7**, where Flicker stands aside and a ✅ "Level Complete" `finish/complete` stage object sits on the north bank — the player physically crosses the bridge and presses E to end the level (ch2 removed from `CHAPTER_COMPLETE_DECISION`; `GOLDEN_PATH`/`CHAPTER_FINALE` updated; new `finish_check` sprite). Script text unchanged. Tests 36→37 (bridge-block collision test; ch2 finale guard rewritten for w7); verified end-to-end in headless Chromium (blocked at bridge in w1, full W1→W7 play-through, checkmark → Courage Feather celebration). |
| 2026-07-18 | **Rebased Level 1 onto the new 5–7 anxiety script ("The Little Dragon Who Wouldn't Stop Guarding") + shipped cross-device Play Together invites, reconciling a stale unrebased branch instead of merging it.** Daniel's `feat/singing-bridge-level-1` (PR #7) had branched off main on 2026-07-14, before the w7 finish, Wize/Flicker role fix, dialogue z-layering fix, stage objects, and SEL coach panel landed — so its own independent Level 1 rewrite collided with all of that on the same files (`GitHub: CONFLICTING`). Resolution was a fresh branch off main with the PR's changes manually re-applied rather than a git merge: **content** — all `content/chapters/ch2/dp_*.json` + `w1–w6.scene.json` replaced 1:1 on the same DP ids with the new narrative (explorer Nova, Flicker, Star Crystals, Sky Festival), `config/content.ts` zones/achievements/celebration, `content/scenarios.ts` ch2 metadata, `counselor/{coPlay,insights}.ts`, `content/{demo/showcase.bundle,fallbacks/companion-fallbacks}.json`, `src/ui/screens.ts` onboarding line, `src/engine/SceneEngine.ts` multi-tap/repair companion lines — all updated to match; **preserved unchanged** — the w7 walk-to-finish stage-object mechanic (new `w7.scene.json` + `dlg_star_legend.json` replacing `dlg_bridge_legend.json`; `dp_crossing` strong band now targets w7), the Wize/Flicker character-role split (reapplied to every new scene), the dialogue z-layering fix, speech/voice toggle, and declarative stage objects; **new** — 4 grid maps (`forest-of-questions`, `meadow-of-curiosity`, `cave-of-purpose`, `mountain-festival` in `gridLevels.ts`) so the explorable-grid feature keeps working per-biome instead of the single `singing-bridge` grid (now orphaned but left registered). **Play Together** (additive, not part of the conflict): new `server/routes/together.ts` (SQLite `together_rooms`, create/join/get/close/SSE-stream), `src/together/inviteStore.ts`, `src/ui/togetherScreens.ts`, `src/util/id.ts`; wired into `main.ts` (new `togetherLobby`/`togetherSetup`/`togetherWaiting` screens, `?invite=CODE` bootstrap) and `GameView.ts` (player badges); LAN/mobile support (`vite.config.ts` `host:true`, `config/app.ts` `resolveApiUrl()`, `index.html` `viewport-fit=cover`, dynamic CORS origin in `server/index.ts`). New context file `play-together-invites.md`. ch1/ch3 and Daniel's role-fix/z-layering work are untouched. Tests: `tests/unit/grid.test.ts`'s bridge-block test rewritten to read `w6`'s own `gridMapId` and relative offsets instead of hardcoded Singing-Bridge pixel positions; 37/37 passing, `validate:content` passing, typecheck 9→6 known errors (narrower `as Scene` JSON-cast mismatch, unrelated to this change). No automated tests yet for Play Together. |
| 2026-07-18 | Fixed a second stray-orange-pixel regression in `dragonSvg` (`src/render/characters.ts`): the "worried" expression's 4 floating worry-sparks were 3× `GOLD` (`#ffd60a`) + 1× a different hardcoded orange (`#ff6b35`), isolated in empty space near the sprite — same "reads as a leftover cursor" bug as the 07-17 wing-pixel fix, just a different pixel. Went unnoticed before because Flicker was rarely "worried"; the new Little Dragon script keeps Flicker worried through nearly every ch2 scene, making it obvious. Changed the odd spark to `GOLD` to match the other three. Art-only, no export changes; 37/37 tests still passing. |
