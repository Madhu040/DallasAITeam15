# TruNorth — Product Context (`product.md`)

> **Living implementation ledger.** This file is the single high-level, always-current
> picture of **what actually exists in `trunorth/` right now** — files, methods,
> and functionality. Design intent lives in [`docs/README.md`](./docs/README.md) and the
> specs under [`docs/specs/`](./docs/specs/) (primary:
> [`TruNorth Technical Specification.md`](./docs/specs/TruNorth%20Technical%20Specification.md)).
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
  `docs/specs/TruNorth Technical Specification.md` (intent) and **this `product.md`** (what’s built).
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
| Spec source of truth | `docs/README.md` + `docs/specs/` (intent) |
| Level 1 script | `docs/scripts/Updated-Script-6-8anxiety .docx` → **The Little Dragon Who Wouldn't Stop Guarding** (integrated 2026-07-18, supersedes the original Singing Bridge script) |
| Overall implementation status | **🟨 Playable MVP, DOM-scene model.** Two child levels, both grid-backed (**ch1 Everbright Meadow**, **ch2 The Little Dragon Who Wouldn't Stop Guarding golden path W1→W7** — Wize is the guiding companion, Flicker the dragon physically blocks the path until the final walk-to-stage finish; ch3 forest removed 2026-07-17) + parent coach entry; scene engine with multi-tap/repair; **WASD/arrow world movement with collision, companion follow, collectibles**; **parameterized 100×100 grid levels (per-cell color + walkability, canvas background, center-point collision) — every scene binds a grid via `gridMapId` (6 grids: everbright-meadow, singing-bridge [orphaned], forest-of-questions, meadow-of-curiosity, cave-of-purpose, mountain-festival), hub cards show grid thumbnails**; companion safety filters + demo/live clients; counselor insights + Together Mode (co-play discuss prompts); **cross-device Play Together invites (shareable 4-letter code / `?invite=` link, SQLite-backed rooms, SSE live updates, mobile/LAN dev support — see [play-together-invites.md](./docs/context/play-together-invites.md))**; **pre-level check-in (3 open-ended questions → 0–10 starting point + bright/steady/gentle placement, fed into journey reflection)**; **declarative stage objects (grid-cell-placed interactables: multi-page dialogs + finish lines that advance/complete a stage — pure JSON authoring)**; local/demo persistence; **Hono API with parent auth, child profiles, remote-progress endpoints (server-built, client not wired), companion + reflect + together routes, SQLite**; Docker; 57 unit tests + content validate. **Scored Ask-for-Help beat** on the Ch.1 path (`dp_ask_grownup` → cross-cutting `ask_for_help` skill, no meter) and **distress-aware resume** (`resumeCheckin` screen when a session ended in `safetyFlag: distress`; re-entry copy is SME-draft) added 2026-07-19. **Phase 2 (widened interaction curve, 2026-07-19):** Ch.1 grew from 2 → **5 decision points** (new scenes e2a/e2b/e2c: reassure a shy friend → share/take turns → repair an accident, meeting spec §6.3's 4–6/chapter floor), and **2 of ch2's 6 DPs (`dp_quest_start`, `dp_investigate`) are now `inputMode: "both"`** so typed replies land in the Little Dragon level (typed DPs 1 → 3 across the game). **Not built:** Supabase assets, hosted deploy, client remote sync, e2e/red-team suites, JSON-Schema CI, automated tests for Play Together. **CI is green**: `typecheck`/`lint`/`validate:content`/`test:unit`/`build` all exit 0 (see §3.14 — fixed 2026-07-19). Art is grid canvases + inline SVG cast (8-bit pixel-art style); zone PNGs remain for celebration + fallback. |
| Toolchain | Node ≥20 (`.nvmrc` 22), Vite 6, TypeScript 5.8, Vitest 3, Hono, better-sqlite3, jose, bcryptjs, tsx, ESLint 9 + typescript-eslint |
| Quick test | `cd trunorth && npm install && npm run demo` → http://localhost:4173/?demo=1 (verified: build + preview work) |
| Last updated | 2026-07-19 (Phase 3: rubric-based typed scoring + lint wired into CI) |

---

## 2. Folder structure

### Repo root

```
DallasAITeam15/
├── product.md                 # Living ledger + task board (this file)
├── README.md
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
│   ├── chapters/ch1/          # ✅ Everbright Meadow — e1–e3 + e2a–e2c + 5 DPs + 1 dialog + 3 stage objects
│   ├── chapters/ch2/          # ✅ The Little Dragon Who Wouldn't Stop Guarding — w1–w7 + 6 DPs (2 "both") + 1 dialog + 2 stage objects
│   ├── demo/showcase.bundle.json     # ✅ 24 canned companion lines (demo mode)
│   └── fallbacks/companion-fallbacks.json  # ✅ band/timeout/safety lines, all 13 DPs
├── data/                      # SQLite runtime files (git-ignored)
├── public/
│   ├── assets/zones/          # 🟨 meadow/forest/cave/mountain PNG placeholders 🔧 Ermoni+Gabby
│   ├── favicon.svg
│   └── manifest.json          # PWA manifest (note: main.ts registers /sw.js, which doesn't exist)
├── scripts/
│   └── validate-content.ts    # 🟨 structural checks (no Ajv schemas yet)
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
│   ├── companion/CompanionClient.ts   # ✅ Live + Demo clients
│   ├── config/                # ✅ app.ts (incl. LAN-aware resolveApiUrl), content.ts, gameState.ts (env-driven)
│   ├── content/               # ✅ SCENES/DPs/DIALOGS registry, scenarios, zones, gridLevels, stageObjects
│   ├── counselor/             # ✅ insights + coPlay discuss prompts + pre-level checkin + typedScoring
│   ├── engine/                # ✅ SceneEngine, DecisionResolver, WorldRuntime, Collision, GridMap
│   ├── input/InputController.ts # ✅ WASD/arrows + interact keys
│   ├── render/                # ✅ characters.ts (SVG cast), gridBackground.ts (grid canvas)
│   ├── safety/filters.ts      # ✅ input/output filters
│   ├── store/ProgressStore.ts # ✅ Local + Demo stores
│   ├── styles/global.css      # ✅ Layout, HUD, overlays, zones; stage container-scaled (--px); Play Together flow styles
│   ├── together/inviteStore.ts # ✅ Play Together client: createRoom/joinRoom/watchRoom, COLOR_TUNES/PLAYER_CHARACTERS
│   ├── types/index.ts         # ✅ Shared contracts
│   ├── util/id.ts             # ✅ newId() — LAN/non-secure-context UUID fallback
│   └── ui/                    # ✅ GameView, screens, togetherScreens, auth helpers
├── tests/unit/                # ✅ 57 tests — engine (13) + grid (8) + checkin (6) + stageObjects (10) + phase1 (6) + phase2 (7) + phase3 (7)
├── Dockerfile · docker-compose.yml
├── index.html · vite.config.ts · vitest.config.ts
├── tsconfig.json · tsconfig.server.json · tsconfig.api.json  # api.json = typecheck-only, covers api/
├── package.json · .nvmrc · .env.example · .gitignore
└── .github/workflows/ci.yml   # typecheck, validate:content, test:unit, build
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

### 3.6 AI companion client (`src/companion/CompanionClient.ts`)
✅ Implemented — see [safety-companion-pipeline.md](./docs/context/safety-companion-pipeline.md).
- `LiveCompanionClient` — POST `{API}/api/companion` with optional bearer token.
- `DemoCompanionClient` — offline bundle lookup `{scene}:{dp}:{band}` where band comes from
  the shared **rubric scorer** (`scoreTypedResponse`, §3.9) using `req.typedRubricRef`; surfaces
  `matchedCriterion`; always attaches counselor insight tips.

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
- CI (`.github/workflows/ci.yml`): typecheck → **lint** → validate:content → test:unit → build.
- ⬜ `build-asset-manifest`, `red-team-suite`, `audit-bundle-size` — not in tree.
- ⬜ Playwright e2e — `test:e2e` script + devDependency exist; **no `tests/e2e` folder or
  playwright config**.

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
`matchedCriterion` surfaced, every typed DP wired to a registered `typedRubricRef`).
⬜ integration / e2e / red-team folders. ⬜ No tests yet for Play Together (§3.16).

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
| [spec-coverage.md](./docs/context/spec-coverage.md) | `docs/specs/` Master Spec §2–§22A measured against the implemented tree (§3 of this file) | **Point-in-time audit (2026-07-19, post-Phase 3):** feature-by-feature ✅/🟨/⬜ coverage of the Master Spec, incl. `[MVP]`/`[EXT]` tiers and the §22A credibility gaps. A snapshot, not a live tracker — §5 below is the live gap list |

---

## 5. Open gaps (feeds the task board)

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
| E2E golden path W1→W7 | (unassigned) | ⬜ |
| JSON Schema validate-content | (unassigned) | ⬜ |
| `npm run lint` fix | (unassigned) | ✅ fixed 2026-07-19 (`eslint.config.js` added) |
| Wire `npm run lint` into `.github/workflows/ci.yml` (it works now but CI doesn't run it) | (unassigned) | ✅ fixed 2026-07-19 (Phase 3) |
| TileMap / WASD architecture | — | ✅ free-roam WASD + 100×100 grid levels; all scenes bind `gridMapId` |
| Automated tests for Play Together (server route / invite store / UI) | (unassigned) | ⬜ |
| Level 1 art for the 4 new ch2 grid biomes (forest/meadow/cave/mountain path) | Ermoni + Gabby | ⬜ still reuses existing zone PNGs |
| Ask-for-Help decision point — spec treats a scored beat on the Ch.1 path as non-negotiable (safety on-ramp) | (unassigned) | ✅ fixed 2026-07-19 (`dp_ask_grownup` now scores the new `ask_for_help` cross-cutting skill) |
| Typed input barely used — was only 1 of 8 DPs (`dp_leftout_bench`) | (unassigned) | 🟨 improved 2026-07-19 (Phase 2 + Phase 3): 3 of 11 registered DPs now `"both"`, and offline typed scoring is now **rubric-based** (`typedScoring.ts`, per-DP `typedRubricRef`) instead of a flat keyword list. Could widen to more DPs; the rubric is still substring-matching (no stemming/negation handling) when no LLM key is set |
| Demo/offline typed input isn't safety-filtered — `DemoCompanionClient` scores typed text but (unlike the server `/api/companion`) never calls `filterInput`, so distress/PII in a typed answer isn't caught in pure demo mode | (unassigned) | ⬜ noticed 2026-07-19 (Phase 3); server path is filtered |
| No audio/SFX beyond the voice toggle (`src/audio/speech.ts`) — no chimes, ambient bed, or event-mapped sound | (unassigned) | ⬜ |
| Reward "juice" (companion reaction + particle flight on a strong choice) — `onMeterJuice` hook exists (§3.2) but only re-renders; no visual effect | (unassigned) | ⬜ |
| Companion visual leveling — `companion.appearanceRef`/`level` field exists (§3.10) but is never read; no sprite change on level-up | (unassigned) | ⬜ |
| Red-team adversarial input test suite (jailbreak/distress/off-topic battery) | (unassigned) | ⬜ |
| Distress-aware resume state (companion opens differently after a session ending in `safetyFlag: distress`) | (unassigned) | 🟨 built 2026-07-19 (`resumeCheckin` screen, wired + tested); **re-entry copy is SME-draft, needs SME sign-off before shipping to a real child** |
| Ch.1/Ch.2 age-band targeting vs. spec structure — code defaults ch2 to age-band 5-7, spec's structure is ch1=5–7/ch2=8–10; needs a deliberate team call, not a code fix | Madhu | 🟡 open question |
| — *(rows below from the 2026-07-19 spec-coverage audit)* | — | — |
| **Which spec is authoritative?** `docs/specs/` holds three overlapping specs — `TruNorth Master Spec.md` (1798 ln), `TruNorth Technical Specification.md` (1334 ln, the one §1 of this file names as primary), and `Consolidated TruNorth-Technical-Specification.md` (1629 ln). The 2026-07-19 audit was run against the **Master Spec**. The team should designate one primary and retire/mark the others | Madhu | 🟡 open question — blocks clean spec-alignment reviews |
| `emotionalResidue` (spec §6.1b) — characters remembering earlier treatment. `GameState.emotionalResidue` + `ResidueLevel` shape exist but **no behavior is wired** | (unassigned) | ⬜ spec tags `[MVP, low-cost]` |
| Strength-mirroring (spec §9.8) + the `baselineStrength` onboarding seed (spec §17C.3a) — companion citing the child's real past strengths; profile field exists but is never seeded or read | (unassigned) | ⬜ spec tags the seed 🟢 **do-not-cut** |
| Progressive meter **display** schedule (spec §7.2) — all 7 tracked, but Ch.1 should show only 3 and reveal the rest on a schedule | (unassigned) | ⬜ |
| Event-log schema incomplete vs spec §11.5 — missing `rawInput`, `skills[]`, `companionLineUsed`, `confidence`, `strengthsSnapshot` (the last is what §9.8 mirroring would read) | (unassigned) | 🟨 core fields present |
| `companionLine` ≤120 chars should **measure-and-split** into sequential click-through bubbles (spec §9.4 / §17B.5 guard 1); currently truncates | (unassigned) | 🟨 cap enforced by truncation |
| Kindness Sparks (spec §7.6) — gate some behind kind actions/exploration + show a non-maxed "found X of 6" tally on the celebration screen | (unassigned) | 🟨 collectibles + `kindnessSparksFound` exist |
| Diegetic progress path / stepping-stones (spec §7.7) — in-world chapter orientation, explicitly *not* a HUD bar | (unassigned) | ⬜ |
| Progressive/typewriter text + tap-to-complete truth table + pivot interaction-lock (spec §17B.6) — the mechanism that *enforces* reflective pacing | (unassigned) | ⬜ `pivotLockMs` authored on some DPs but unused |
| 16:9 letterbox aspect-ratio lock (spec §17B.7) — stage currently scales via a `--px` size container, not a locked letterboxed canvas | (unassigned) | 🟨 |
| Three-expression-state pipeline for every character + `assetRef → file` asset manifest (spec §17B.3, §10.3) | Ermoni + Gabby | 🟨 expressions exist ad-hoc; no manifest |
| Parent gate framed as a **connection ritual** rather than PIN-only (spec §12.1) — engineering unchanged, copy/framing missing | (unassigned) | 🟨 |
| Mini-games (spec §16) — emotion-recognition, 3-breath cool-down, affirmation, positive self-talk DPs (§16.4) | (unassigned) | ⬜ `[EXT]` (3-breath tagged MVP-light) |
| Parent dashboard with developmental metrics + guided-conversation prompts (spec §14) | (unassigned) | 🟨 `[EXT]`; `buildJourneyReflection` is a post-play summary, not trends |
| Chapter 3 (11–15, free typing, resilience) (spec §4) | (unassigned) | ⬜ spec marks it a stretch goal |
| Recorded backup demo video (spec §13A.7) — rung 4 of the stage fallback ladder | (unassigned) | ⬜ |
| Accessibility proof pass — screen-reader + keyboard-only + contrast on the showcase scene (spec §22A.5) | Test lane | ⬜ spec wants it as a *told* part of the demo |
| §22A credibility items: SEL evidence/citation (§22A.1), real-child playtest clip (§22A.2), business-case risk statement (§22A.8) | Vandy / Ranya / Business | ⬜ content + scheduling, not engineering |
| **SME sign-off is the shared blocker** — distress re-entry copy, the 3 new Ch.1 DPs, and the Ch.2 narrative are all draft; spec §8.6 says no chapter locks until the SME reviews scenarios, option bands, coaching lines, and the typed rubric | Vandy + SME | 🟡 gates shipping any of it to a real child |

---

## 6. Recent changelog (ledger)

| Date | Change |
|---|---|
| 2026-07-19 | **Spec-coverage audit (docs only — no code change).** Measured the Master Spec (§2–§22A, Appendix A) against the implemented tree feature-by-feature and recorded the result as a point-in-time snapshot in new context file [spec-coverage.md](./docs/context/spec-coverage.md) (indexed in §4). Confirmed the core `[MVP]` engine is built and green (scene-graph state machine, Tier-B movement, two chapters, the full five-layer safety stack, rubric scoring, demo mode, parent gate, celebration); remaining gaps cluster in presentation/"juice" (§17B), the `[EXT]` backend/dashboard, mini-games (§16), and the §22A credibility items (content/SME/scheduling, not engineering). Added the newly-surfaced gaps as rows in §5 — notably `emotionalResidue` unwired (§6.1b), strength-mirroring + the 🟢 do-not-cut `baselineStrength` seed (§9.8/§17C.3a), progressive meter display (§7.2), the incomplete event-log schema (§11.5), `companionLine` measure-and-split (§9.4), typewriter/pacing enforcement (§17B.6), and the SME sign-off that gates all draft copy (§8.6). Biggest structural divergence recorded: both built chapters target ages 5–7 vs the spec's Ch.2 = 8–10 / Ch.3 = 11–15 (already an open team question, not a bug). No `trunorth/` files touched. |
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
