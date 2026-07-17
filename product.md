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
  Level 1 The Singing Bridge / Everbright), so the app can pull the right images per
  level when needed — **without breaking** the fully-offline demo path (`?demo=1` +
  `public/assets/zones/`). Design the visuals together with Gabby, based on
  [`docs/scripts/Scene, script, players.docx`](./docs/scripts/Scene,%20script,%20players.docx) (Vandy).

### Gabby — Backend (Supabase level images, with Ermoni) 🔧

- [ ] Design the SVG / asset frames for Level 1 (bridge, Flicker, Wize, Shimmer Crystal)
  from Vandy’s Singing Bridge script, and work with Ermoni to store them in Supabase
  and wire pull-per-level in the app (keep local placeholders as offline fallback).

### Daniel — Frontend (Level 1 content + gameplay UX)

- [x] ~~Ship Level 1 **The Singing Bridge** from Vandy’s script into playable content~~
  (W1→W6 scenes, DPs, Flicker/Wize cast, multi-tap breathe/crossing, celebration,
  insights/fallbacks/demo bundle) — done 2026-07-13.
- [x] ~~Ship world movement + environment interact~~ (WASD/arrows, collision, E/Space,
  companion follow, sparks) — done 2026-07-14.
- [ ] Next: polish Level 1 play feel — expression changes along Flicker’s arc, richer
  investigation hotspots, and optional TileMap rooms if the team adopts grid levels.
  Also: fix the 11 open `npm run typecheck` errors (see §3.14) so CI goes green.
- **Files owned:** `trunorth/content/chapters/ch2/*`, `trunorth/src/engine/*`,
  `trunorth/src/input/InputController.ts`, `trunorth/src/ui/GameView.ts`,
  `trunorth/src/render/characters.ts`, `trunorth/src/content/{index,scenarios,zones}.ts`.

### Jose — Frontend (deployment) 🔧

- [ ] Deploy the app so users can play and test it: stand up a hosted environment
  for the **Vite client + Hono API** (`trunorth/server/`), configure env vars from
  `trunorth/.env.example`, verify health + `/api/companion` in production, and share
  the test URL (demo mode: `?demo=1`) with the team.

### Vandy — Product management (research & game vision)

- [x] ~~Deliver Level 1 script~~ — [`docs/scripts/Scene, script, players.docx`](./docs/scripts/Scene,%20script,%20players.docx)
  (The Singing Bridge: Flicker, Wize, Courage Feather) — done; content integrated.
- [ ] Research how existing SEL products — especially **GoZen!** — teach hard emotional
  skills to kids, and turn findings into vision for Levels 2+ (still feed Ermoni/Gabby
  for art, and Daniel for scene scripting).

### Ranya — Product management (research & testing criteria)

- [ ] Research (alongside Vandy) how programs like **GoZen!** teach emotional skills
  through simple formats, and translate findings into **test criteria for Level 1**:
  what “good” looks like when playing The Singing Bridge on this basic 2D DOM game
  (attention, clarity of choices, emotional beat landing, Courage Feather payoff).

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
| Level 1 script | `docs/scripts/Scene, script, players.docx` → **The Singing Bridge** (integrated) |
| Overall implementation status | **🟨 Playable MVP, DOM-scene model.** Three child scenarios (ch1 meadow, **ch2 Singing Bridge golden path W1→W6**, ch3 forest) + parent coach entry; scene engine with multi-tap/repair; **WASD/arrow world movement with collision, companion follow, collectibles**; companion safety filters + demo/live clients; counselor insights + Together Mode; local/demo persistence; **Hono API with parent auth, child profiles, remote-progress endpoints (server-built, client not wired), companion + reflect routes, SQLite**; Docker; 13 unit tests + content validate. **Not built:** Supabase assets, hosted deploy, client remote sync, e2e/red-team suites, JSON-Schema CI. **Known broken:** `npm run typecheck` fails (11 errors — see §3.14), so CI is red. Art is zone PNGs + inline SVG cast (placeholder style). |
| Toolchain | Node ≥20 (`.nvmrc` 22), Vite 6, TypeScript 5.8, Vitest 3, Hono, better-sqlite3, jose, bcryptjs, tsx |
| Quick test | `cd trunorth && npm install && npm run demo` → http://localhost:4173/?demo=1 (verified: build + preview work) |
| Last updated | 2026-07-17 (full reality audit of the ledger) |

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
│   ├── scripts/               # Narrative scripts (Singing Bridge, …)
│   ├── kickoff/               # Team slides
│   └── context/               # Deep-dive context files (Section 4)
└── trunorth/                  # Application (configurable via .env)
```

### Application (`trunorth/` tree)

```
trunorth/
├── content/
│   ├── chapters/ch1/          # ✅ Meadow — e1–e3 scenes + leftout/ask-grownup DPs
│   ├── chapters/ch2/          # ✅ Singing Bridge — w1–w6 + 6 DPs (golden path)
│   ├── chapters/ch3/          # ✅ Forest — c1–c2 + hothead/repair DPs
│   ├── demo/showcase.bundle.json     # ✅ 10 canned companion lines (demo mode)
│   └── fallbacks/companion-fallbacks.json  # ✅ band/timeout/safety lines, all 10 DPs
├── data/                      # SQLite runtime files (git-ignored)
├── public/
│   ├── assets/zones/          # 🟨 meadow/forest/cave/mountain PNG placeholders 🔧 Ermoni+Gabby
│   ├── favicon.svg
│   └── manifest.json          # PWA manifest (note: main.ts registers /sw.js, which doesn't exist)
├── scripts/
│   └── validate-content.ts    # 🟨 structural checks (no Ajv schemas yet)
├── server/                    # ✅ Hono API (dev: tsx watch) 🔧 Jose (deploy)
│   ├── auth/jwt.ts            # HS256 sign/verify (jose)
│   ├── config.ts              # ✅ .env loader + serverConfig
│   ├── db/migrate.ts          # SQLite schema (parents, children, progress, audit)
│   ├── routes/companion.ts    # POST /api/companion + /api/reflect
│   ├── index.ts               # health, auth, children, progress routes + CORS
│   └── main.ts                # listen entry (port 3001)
├── src/
│   ├── main.ts                # ✅ Boot, screens, startScenario, engine + world wiring
│   ├── companion/CompanionClient.ts   # ✅ Live + Demo clients
│   ├── config/                # ✅ app.ts, content.ts, gameState.ts (env-driven)
│   ├── content/               # ✅ SCENES/DPs registry, scenarios, zones
│   ├── counselor/             # ✅ insights + coPlay discuss prompts
│   ├── engine/                # ✅ SceneEngine, DecisionResolver, WorldRuntime, Collision
│   ├── input/InputController.ts # ✅ WASD/arrows + interact keys
│   ├── render/characters.ts   # ✅ Full-body SVG cast (Flicker, Wize, …)
│   ├── safety/filters.ts      # ✅ input/output filters
│   ├── store/ProgressStore.ts # ✅ Local + Demo stores
│   ├── styles/global.css      # ✅ Layout, HUD, overlays, zones
│   ├── types/index.ts         # ✅ Shared contracts
│   └── ui/                    # ✅ GameView, screens, auth helpers
├── tests/unit/engine.test.ts  # ✅ 13 tests (resolver, safety, golden path, cast, collision)
├── Dockerfile · docker-compose.yml
├── index.html · vite.config.ts · vitest.config.ts
├── package.json · .nvmrc · .env.example · .gitignore
└── .github/workflows/ci.yml   # typecheck, validate:content, test:unit, build
```

> Update this tree whenever directories or top-level files change.

**Intentionally absent (do not list as implemented):** `api/` (Vercel), `assets-src/`,
`TileMap` grid parser, `TruNorthProject/`, `tests/e2e`, red-team trees, JSON Schema pack
under `content/schema/`, `public/sw.js`.

---

## 3. Implemented components

> Inline entries stay short; deep walkthroughs live in `docs/context/` (Section 4).

### 3.0 Configuration (`src/config/`, `server/config.ts`, `.env.example`)
✅ Implemented. Runtime tunables via `.env` / `VITE_*`:
- `src/config/app.ts` — `appConfig` (apiUrl, feature flags incl. `worldMovement`, gameplay
  defaults Flicker/ch2/w1, timing, world-movement tunables), `isDemoMode()`.
- `src/config/content.ts` — `contentConfig`: zone metadata (`ZoneConfig[]`), achievement
  checklist, celebration copy. Note: the "bridge" zone and celebration reuse `forest.png`.
- `src/config/gameState.ts` — `createInitialGameState(demoMode)` from `appConfig.defaults`.
- `server/config.ts` — dependency-free `.env` loader + `serverConfig`
  (port/CORS/JWT/db path/companion model+floor+timeout).

### 3.1 Application entry (`src/main.ts`)
✅ Implemented. Detects demo mode (`?demo` / `VITE_DEMO_MODE`), wires
`LocalProgressStore` vs `DemoProgressStore` and Live vs Demo companion clients, navigates
landing → trust → onboarding → hub → game, starts `SceneEngine`, celebration → parent
gate → journey reflection. Attaches/detaches `worldRuntime` per screen; `beginEncounter`
freezes movement on trigger interact; collect pickups award crystals + persist. Together
Mode co-play step machine. Registers `/sw.js` in prod builds — **file doesn't exist**, so
registration silently no-ops.

### 3.2 Scene engine (`src/engine/SceneEngine.ts`, `DecisionResolver.ts`)
✅ Implemented — **click/trigger DOM scenes** (not tile-walking). Lifecycle detail:
[engine-runtime.md](./docs/context/engine-runtime.md).

- `SceneEngine` — loadScene (narration auto-advance), startDecision/triggerEncounter,
  submitChoice/submitTyped, multi-tap progress (`MULTI_TAP_REQUIRED`: dp_breathe ×5,
  dp_crossing ×4), repair loops, chapter-complete → celebration, companion + counselor
  callbacks, input freeze during companion calls.
- `DecisionResolver` — `resolveChoice` (option → band), `applyConsequence` (meter
  fill/level-ups, brownie points, 200-entry event log, repairAction, next scene).
  Also exports `canUsePlayfulExternalization` (unused by callers).

### 3.3 World movement (`src/engine/WorldRuntime.ts`, `Collision.ts`, `src/input/InputController.ts`)
✅ Implemented (DOM stage free-roam, not a tile grid) — see
[world-movement.md](./docs/context/world-movement.md).
- `worldRuntime` singleton — rAF loop, avatar movement with axis-separated AABB collision
  vs NPC feet boxes + walk bounds, companion lag-follow, collectible pickup, proximity
  interact (E/Space/Enter) with hints; feature-flagged `VITE_FEATURE_WORLD_MOVEMENT`.
- `Collision.ts` — pure AABB helpers, `moveWithCollision` (wall sliding), walk bands.
- `InputController` — WASD/arrows hold-polling, one-shot interact; clickable trigger
  hotspots remain as fallback.
⬜ Not in repo: `TileMap` grid parser, `SceneGraph`, `EmotionalResidue` modules.

### 3.4 Rendering (`src/render/characters.ts`)
🟨 Partial — inline SVG cast, no separate sprite/manifest pipeline.
- `renderFullBodyCharacter(opts)` — avatar (skin-tone aware), **Flicker** (red Guardian
  Dragon), **Wize** owl mentor, fox/sprite companion archetypes, helper animals, worry
  cloud, grown-up, NPCs; `ExpressionKey` mapping from scene `expression` strings.
⬜ Not in repo: Viewport layers, SceneRenderer, BubbleManager, ParticleSystem as separate
modules (bubbles/HUD live in `GameView` + CSS).

### 3.5 UI & parent surfaces (`src/ui/`)
✅ Implemented — see [ui-screens-views.md](./docs/context/ui-screens-views.md).
- `GameView.ts` — `renderGameView` (stage, HUD meters, characters, triggers, collectibles,
  narration, counselor panel, decision overlay with Together Mode 2-step flow),
  `renderCelebration` (Courage Feather), `renderJourneyReflection`, `renderParentGate`
  (4-digit PIN, SHA-256 hash in localStorage, 3-fail lockout), `renderTrustScreen`.
- `screens.ts` — `renderLanding`, `renderAuthForm` (parent login/register),
  `renderOnboarding` (archetype/name/avatar; default **Flicker**), `renderScenarioHub`.
  Known issue: its local `Screen` type includes `"dashboard"`, which `main.ts` rejects
  (typecheck error).
- `auth.ts` — session token helpers (`getToken`/`setSession`/`clearSession`),
  `apiLogin`/`apiRegister`, `hashPin`/`verifyPin` (WebCrypto SHA-256).
- Together Mode discuss prompts: `counselor/coPlay.ts`.

### 3.6 AI companion client (`src/companion/CompanionClient.ts`)
✅ Implemented — see [safety-companion-pipeline.md](./docs/context/safety-companion-pipeline.md).
- `LiveCompanionClient` — POST `{API}/api/companion` with optional bearer token.
- `DemoCompanionClient` — offline bundle lookup `{scene}:{dp}:{band}` + keyword band
  inference for typed lines; always attaches counselor insight tips.

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
- `insights.ts` — `insightForStep(dpId, band)` (hand-written coaching for **all 10 DPs**
  × 3 bands + generic fallback), `buildJourneyReflection(state)` (summary, strengths,
  growth edges, per-step insights, parent coaching), `childFacingLine`.
- `coPlay.ts` — `discussPrompt(dpId)` Together-Mode conversation starters (all 10 DPs).

### 3.10 Shared types (`src/types/index.ts`)
✅ Implemented. GameState, Scene, DecisionPoint, companion request/response, ScenarioMeta,
PlayMode, ProgressStore interface, AuthUser/ChildProfile, factories
`createDefaultMeters` (7 skills). Defaults: companion **Flicker**, chapter `ch2`, scene `w1`.

### 3.11 Server API (`server/`)
✅ Implemented locally (not yet hosted) — full endpoint walkthrough:
[server-api.md](./docs/context/server-api.md). Companion pipeline detail:
[safety-companion-pipeline.md](./docs/context/safety-companion-pipeline.md).

> 🔧 **Jose** — production hosting for this Hono server + static client.
- `index.ts` — `GET /api/health`; **parent auth** `register`/`login`/`me` (bcrypt + JWT);
  **child profiles** `GET/POST /api/children`; **remote progress** `GET/PUT
  /api/progress/:childId` (parent-owned, upsert; no client caller yet); audit-log writes;
  CORS from config.
- `routes/companion.ts` — `POST /api/companion`: input filter → Anthropic (if key) or
  local heuristic score → confidence floor → output filter → fallbacks library;
  `POST /api/reflect`: event list → counselor insights (no client caller yet).
- `auth/jwt.ts` — `signToken`/`verifyToken` (jose HS256, 7-day expiry).
- `db/migrate.ts` — SQLite schema: parents, child_profiles, progress, audit_logs (WAL).
- ⬜ No Vercel `api/` tree in this repo.

### 3.12 Content (`content/`)
✅ Implemented (draft; SME review still pending).
- **Ch.2 The Singing Bridge (golden path):**
  w1 quest → w2 investigate → w3 fact/story → w4 breathe (5 taps) → w5 choose →
  w6 crossing (4 taps) + Courage Feather finale. DPs: `dp_quest_start`,
  `dp_investigate`, `dp_fact_sort`, `dp_breathe`, `dp_choose_path`, `dp_crossing`.
- Ch.1 Meadow (e1–e3, 2 DPs) + Ch.3 Forest (c1–c2, 2 DPs) playable via hub.
- `fallbacks/companion-fallbacks.json` — all 10 DPs × strong/partial/poor/timeout/safety.
- `demo/showcase.bundle.json` — 10 canned responses keyed `{scene}:{dp}:{band}`.
- ⬜ `content/schema/` Ajv pack, `content/rubrics/` — not present.
- ⬜ Per-scene `tileMap` rooms — not used (scenes use `background` + `triggers`).

### 3.13 Assets (`public/assets/`)
🟨 Partial. Zone PNGs (meadow/forest/cave/mountain) under `public/assets/zones/`;
characters are code-drawn SVG. The Singing Bridge zone + celebration reuse `forest.png`
(no bridge art yet). No `assets-src/` provenance pipeline.

> 🔧 **Ermoni & Gabby** — Level 1 art + Supabase delivery (offline fallback required).

### 3.14 Build & tooling
🟨 Partial.
- `scripts/validate-content.ts` — walks chapter JSON for id/chapterId/emotionalArc/
  consequences (no Ajv schemas yet). **Passing** as of 2026-07-17.
- `npm run test:unit` — **13/13 passing**. `npm run build` — **passing** (vite build;
  server tsc errors are swallowed by `|| true`).
- **`npm run typecheck` — FAILING (11 errors), which makes CI red:**
  10 × TS2352 in `src/content/index.ts` (scene JSON `position: number[]` doesn't satisfy
  `[number, number]` for the `as Scene` casts) and 1 × TS2345 in `src/main.ts:218`
  (`screens.ts` `Screen` includes `"dashboard"`, not in `AppScreen`).
- `npm run lint` — broken: targets a nonexistent `api/` directory.
- CI (`.github/workflows/ci.yml`): typecheck → validate:content → test:unit → build.
- ⬜ `build-asset-manifest`, `red-team-suite`, `audit-bundle-size` — not in tree.
- ⬜ Playwright e2e — `test:e2e` script + devDependency exist; **no `tests/e2e` folder or
  playwright config**.

### 3.15 Tests (`tests/`)
🟨 Partial — `tests/unit/engine.test.ts` (**13 tests, all passing**): DecisionResolver
(bands, meters, repair), safety filters, Singing Bridge golden-path presence, counselor
insights + journey reflection, SVG cast rendering, world collision (wall slide + bounds).
⬜ integration / e2e / red-team folders.

---

## 4. Context files index (`docs/context/`)

| Context file | Documents | Summary |
|---|---|---|
| [engine-runtime.md](./docs/context/engine-runtime.md) | `src/engine/SceneEngine.ts`, `DecisionResolver.ts`, `src/main.ts`, `src/ui/GameView.ts`, `src/content/index.ts` | Boot screens, scene phases, multi-tap + repair + celebration flow |
| [world-movement.md](./docs/context/world-movement.md) | `src/engine/WorldRuntime.ts`, `src/engine/Collision.ts`, `src/input/InputController.ts` | Free-roam runtime: rAF loop, AABB collision, follow, collectibles, interact |
| [ui-screens-views.md](./docs/context/ui-screens-views.md) | `src/ui/GameView.ts`, `src/ui/screens.ts`, `src/ui/auth.ts` | Every render function: game view, overlays, onboarding, hub, parent gate, auth |
| [server-api.md](./docs/context/server-api.md) | `server/*` (index, main, config, auth, db, routes) | All HTTP endpoints, SQLite schema, JWT, companion pipeline steps |
| [safety-companion-pipeline.md](./docs/context/safety-companion-pipeline.md) | `server/routes/companion.ts`, `src/companion/*`, `src/safety/*`, fallbacks | Live vs demo companion paths, filters, fallback coverage |

---

## 5. Open gaps (feeds the task board)

| Gap | Owner hint | Status |
|---|---|---|
| Fix `npm run typecheck` (11 errors) → CI green | Daniel | ⬜ **CI currently red** |
| Level 1 / zone production art + Supabase | Ermoni + Gabby | ⬜ |
| Hosted deploy (client + Hono API) | Jose | ⬜ |
| Wire client to server remote-progress endpoints | (unassigned) | ⬜ server side done |
| GoZen!-informed vision for Levels 2+ | Vandy | 🟨 script L1 done; research open |
| Level 1 playtest criteria | Ranya | ⬜ |
| PR/spec shepherding | Madhu | ongoing |
| E2E golden path W1→W6 | (unassigned) | ⬜ |
| JSON Schema validate-content | (unassigned) | ⬜ |
| `npm run lint` fix (drops phantom `api/` dir) | (unassigned) | ⬜ |
| TileMap / WASD architecture | — | 🟨 free-roam WASD shipped; no tile grid |

---

## 6. Recent changelog (ledger)

| Date | Change |
|---|---|
| 2026-07-13 | Rebased this ledger onto real `trunorth/` tree (removed phantom `TruNorthProject/` claims). |
| 2026-07-13 | Integrated Level 1 **The Singing Bridge** (W1–W6, Flicker, Wize, Courage Feather). |
| 2026-07-13 | Updated team board: Daniel L1 done; Ermoni/Gabby/Jose/Vandy/Ranya tasks retargeted. |
| 2026-07-13 | Organized repo into `docs/{specs,scripts,kickoff,context}`; added configurable `server/config.ts`, `src/config/*`, expanded `.env.example`. |
| 2026-07-14 | Added world movement: WASD/arrows, collision, proximity interact (E/Space), companion follow, collectible pickup (`WorldRuntime`). |
| 2026-07-17 | Full reality audit: documented server auth/children/progress/reflect endpoints, world movement promoted to ✅, test count 11→13, recorded failing typecheck (CI red), broken lint script, missing `sw.js`; added context files `world-movement.md`, `ui-screens-views.md`, `server-api.md`. |
