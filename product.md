# TruNorth — Product Context (`product.md`)

> **Living implementation ledger.** This file is the single high-level, always-current
> picture of **what actually exists in `trunorth/` right now** — files, methods,
> and functionality. It is the practical counterpart to the design intent in
> [`docs/specs/TruNorth Technical Specification.md`](./docs/specs/TruNorth%20Technical%20Specification.md)
> and [`Consolidated TruNorth-Technical-Specification.md`](./docs/specs/Consolidated%20TruNorth-Technical-Specification.md).

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
   product *should* be; `product.md` records what has *actually been built*. It is an
   **echo of the spec, filtered down to implemented code only.** If it isn't in the repo
   and working, it does not get a "done" description here.

2. **Update it on every pull request.** Any PR that adds, removes, or changes a file,
   method, or behavior in `trunorth/` must update the matching section here in the
   same PR. Treat an out-of-date `product.md` as a broken build.

3. **It grows as the project grows.** Start minimal. As real code lands, replace
   `⬜ Not implemented` placeholders with concise descriptions of the file, its exported
   methods/functions, and what they do. Never delete a section just because it's empty —
   an empty section is a truthful signal that nothing is built there yet.

4. **Keep entries short and factual.** For each implemented file, capture: its path,
   its purpose in one line, and its key exports (functions/classes/methods) with a
   one-line description each. No design rationale, no future plans — those live in the
   spec.

5. **Offload detail to context files when an entry gets long.** When a file's description,
   its method list, or a subsystem's explanation becomes too large or complex to sit
   inline here (rule of thumb: more than ~15 lines, or needs diagrams/tables/deep
   walkthroughs), move that detail into a dedicated file under
   [`docs/context/`](./docs/context/) and **link to it** from the inline
   entry. Keep only a one-line summary + the link in `product.md`.
   - Naming: `docs/context/<area>-<subject>.md`
     (e.g. `engine-scene-lifecycle.md`, `safety-companion-pipeline.md`).
   - The context file should state which source file(s) it documents at the top.

6. **Mirror the real folder structure.** Section 2 must always reflect the actual
   directory tree of `trunorth/`. When folders are added/removed, update it.

7. **Status legend** (use these consistently):
   - `⬜ Not implemented` — folder/file exists but is empty scaffolding, or doesn't exist yet.
   - `🟨 Partial` — some functionality exists; note what's missing.
   - `✅ Implemented` — built and working; describe methods/functionality.

8. **Spec drift note.** Spec intent lives in the repo-root technical specification docs.
   When this file and the spec disagree about what exists, **this file wins for "what
   is built"; the spec wins for "what is intended."**  
   **Repo layout note (2026-07-13):** older drafts of this ledger referred to
   `TruNorthProject/` with TileMap / Vercel `api/` / rAF loop. **That tree is not in this
   repository.** The working app is `trunorth/` (DOM scenes + Hono server). Do not
   reintroduce phantom folders in Section 2.

---

## 1. Snapshot

| Field | Value |
|---|---|
| Product | TruNorth — choice-driven social-emotional learning (SEL) narrative for ages 5–15 |
| Project root | `trunorth/` (repo root = DallasAITeam15 monorepo wrapper) |
| Spec source of truth | `docs/specs/TruNorth Technical Specification.md` / Consolidated spec (intent) |
| Level 1 script | `docs/scripts/Scene, script, players.docx` → **The Singing Bridge** (integrated) |
| Overall implementation status | **🟨 Playable MVP, DOM-scene model.** Three child scenarios (ch1 meadow, **ch2 Singing Bridge golden path W1→W6**, ch3 forest) + parent coach entry; scene engine; companion safety filters + demo/live clients; counselor insights + together-mode; local/demo persistence; onboarding, parent gate, trust screen; Hono API + SQLite auth stubs; Docker; unit tests (11) + content validate. **Not built:** TileMap/WASD movement, Supabase assets, hosted deploy, e2e/red-team suites, JSON Schema CI, remote progress sync. Art is zone PNGs + inline SVG cast (placeholder style). |
| Toolchain | Node ≥20 (`.nvmrc` 22), Vite 6, TypeScript 5.8, Vitest 3, Hono, better-sqlite3, tsx |
| Quick test | `cd trunorth && npm install && npm run demo` → http://localhost:4173/?demo=1 |
| Last updated | 2026-07-13 (folder organize + config) |

---

## 2. Folder structure

### Repo root

```
DallasAITeam15/
├── product.md                 # Living ledger + task board
├── README.md
├── docs/
│   ├── README.md
│   ├── specs/                 # Technical specifications
│   ├── scripts/               # Narrative scripts (Singing Bridge, …)
│   ├── kickoff/               # Team slides
│   └── context/               # Deep-dives (was TruNorthContextFiles)
└── trunorth/                  # Application (configurable via .env)
```

### Application (`trunorth/` tree)


```
trunorth/
├── content/
│   ├── chapters/ch1/          # ✅ Meadow — e1–e3 scenes + leftout/ask-grownup DPs
│   ├── chapters/ch2/          # ✅ Singing Bridge — w1–w6 + 6 DPs (golden path)
│   ├── chapters/ch3/          # ✅ Forest — c1–c2 + hothead/repair DPs
│   ├── demo/showcase.bundle.json     # ✅ Canned companion lines (demo mode)
│   └── fallbacks/companion-fallbacks.json  # ✅ Per-dp band/timeout/safety lines
├── public/
│   ├── assets/zones/          # 🟨 meadow/forest/cave/mountain PNG placeholders 🔧 Ermoni+Gabby
│   ├── favicon.svg
│   └── manifest.json          # PWA manifest
├── scripts/
│   └── validate-content.ts    # 🟨 structural checks (no Ajv schemas yet)
├── server/                    # ✅ Hono API (dev: tsx watch) 🔧 Jose (deploy)
│   ├── auth/jwt.ts
│   ├── db/migrate.ts          # SQLite schema migrate
│   ├── routes/companion.ts    # POST /api/companion
│   ├── index.ts               # app routes
│   └── main.ts                # listen entry
├── src/
│   ├── main.ts                # ✅ Boot, screens, startScenario, engine wiring
│   ├── config/                # ✅ app.ts, content.ts, gameState.ts (env-driven)
│   ├── companion/CompanionClient.ts   # ✅ Live + Demo clients
│   ├── content/               # ✅ SCENES/DPs registry, scenarios, zones
│   ├── counselor/             # ✅ insights + coPlay discuss prompts
│   ├── engine/                # ✅ SceneEngine, DecisionResolver
│   ├── render/characters.ts   # ✅ Full-body SVG cast (Flicker, Wize, …)
│   ├── safety/filters.ts      # ✅ input/output filters
│   ├── store/ProgressStore.ts # ✅ Local + Demo stores
│   ├── styles/global.css      # ✅ Layout, HUD, overlays, zones
│   ├── types/index.ts         # ✅ Shared contracts
│   └── ui/                    # ✅ GameView, screens, auth helpers
├── server/config.ts           # ✅ Env loader + serverConfig
├── tests/unit/engine.test.ts  # ✅ 11 tests (resolver, safety, golden path, cast)
├── Dockerfile · docker-compose.yml
├── index.html · vite.config.ts · vitest.config.ts
├── package.json · .nvmrc · .env.example · .gitignore
└── .github/workflows/ci.yml   # typecheck, validate:content, test:unit, build
```

Repo root holds `product.md`, `docs/` (specs, scripts, kickoff, context), and `trunorth/`.

> Update this tree whenever directories or top-level files change.

**Intentionally absent (do not list as implemented):** `api/` (Vercel), `assets-src/`,
`TileMap` / `MovementController` / `InputController`, `TruNorthProject/`, e2e/red-team
trees, JSON Schema pack under `content/schema/`.

---

## 3. Implemented components

> Inline entries stay short; deep walkthroughs live in `docs/context/` (Section 4).

### 3.0 Configuration (`src/config/`, `server/config.ts`, `.env.example`)
✅ Implemented. Runtime tunables via `.env` / `VITE_*` — ports, CORS, companion model,
demo defaults (Flicker, ch2), feature flags, zone/celebration copy in `content.ts`.

### 3.1 Application entry (`src/main.ts`)
✅ Implemented. Detects demo mode (`?demo` / `VITE_DEMO_MODE`), wires
`LocalProgressStore` vs `DemoProgressStore` and Live vs Demo companion clients, navigates
landing → trust → onboarding → hub → game, starts `SceneEngine`, celebration → parent
gate → journey reflection. Together-mode co-play step machine.

### 3.2 Scene engine (`src/engine/`)
✅ Implemented — **click/trigger DOM scenes** (not tile-walking). Lifecycle detail:
[engine-runtime.md](./docs/context/engine-runtime.md).

- `SceneEngine` — loadScene, startDecision, submitChoice/submitTyped, multi-tap
  progress (`MULTI_TAP_REQUIRED` for `dp_breathe` / `dp_crossing`), repair loops,
  chapter complete → celebration, companion + counselor callbacks.
- `DecisionResolver` — `resolveChoice`, `applyConsequence` (meter deltas, brownie,
  event log, repairAction).

✅ Partial world movement (DOM stage, not full TileMap): `InputController`, `Collision`, `WorldRuntime` — WASD/arrows, NPC solids, trigger interact, collectibles.
⬜ Not in repo: full `TileMap` grid parser, `SceneGraph`, `EmotionalResidue` modules.

### 3.3 Rendering (`src/render/`)
🟨 Partial — inline SVG cast, no separate sprite/manifest pipeline.
- `renderFullBodyCharacter` — avatar, **Flicker** (red Guardian Dragon), **Wize** owl mentor,
  helper animals, worry cloud, grown-up (plus fox/sprite companion archetypes).

⬜ Not in repo: Viewport layers, SceneRenderer, BubbleManager, ParticleSystem, AvatarSprite
as separate modules (bubbles/HUD live in `GameView` + CSS).

### 3.4 Input (`src/input/InputController.ts`)
✅ Implemented for exploration — WASD/arrows hold-polling, E/Space/Enter interact;
choice UI + clickable trigger hotspots remain as fallback.

### 3.5 UI & parent surfaces (`src/ui/`)
✅ Implemented.
- `GameView` — scene stage, meters, narration, decision overlay, counselor panel,
  celebration (Courage Feather copy for ch2), journey reflection, parent gate, trust screen.
- `screens` — landing, auth forms, onboarding (default companion **Flicker**), scenario hub.
- `auth` — token session helpers for parent login.
- Together Mode discuss prompts: `counselor/coPlay.ts`.

### 3.6 AI companion client (`src/companion/`)
✅ Implemented — see [safety-companion-pipeline.md](./docs/context/safety-companion-pipeline.md).
- `LiveCompanionClient` — POST `{API}/api/companion` with optional bearer token.
- `DemoCompanionClient` — offline bundle lookup `{scene}:{dp}:{band}` + rubric-ish band
  inference for typed lines; attaches counselor insight tips.

### 3.7 Safety (`src/safety/filters.ts`)
✅ Implemented. `filterInput` (jailbreak/distress/PII/etc.), `filterOutput`,
`sanitizeChildInput`, `escapeHtml`. Used by unit tests and server companion route.

### 3.8 Progress store (`src/store/ProgressStore.ts`)
✅ Implemented (MVP).
- `LocalProgressStore` — `trunorth_save_v1` in localStorage.
- `DemoProgressStore` — in-memory.
- `RemoteProgressStore` — ⬜ [EXT] not built.

### 3.9 Counselor layer (`src/counselor/`)
✅ Implemented.
- `insightForStep` / `buildJourneyReflection` / `childFacingLine` — per-DP band coaching
  including Singing Bridge steps.
- `discussPrompt` — Together Mode conversation starters per DP.

### 3.10 Shared types (`src/types/index.ts`)
✅ Implemented. GameState, Scene, DecisionPoint, companion request/response, ScenarioMeta,
PlayMode, factories `createDefaultMeters` / `createInitialGameState` (default companion
**Flicker**, chapter `ch2`, scene `w1`).

### 3.11 Server API (`server/`)
✅ Implemented locally — [safety-companion-pipeline.md](./docs/context/safety-companion-pipeline.md).

> 🔧 **Jose** — production hosting for this Hono server + static client.
- `routes/companion.ts` — input filter → Anthropic (if key) or local score → confidence
  floor → output filter → fallbacks library.
- `auth/jwt.ts`, `db/migrate.ts` — parent auth / SQLite scaffolding.
- ⬜ No Vercel `api/` tree in this repo.

### 3.12 Content (`content/`)
✅ Implemented (draft; SME review still pending).
- **Ch.2 The Singing Bridge (golden path):**  
  w1 quest → w2 investigate → w3 fact/story → w4 breathe (5 taps) → w5 choose →  
  w6 crossing (4 taps) + Courage Feather finale. DPs: `dp_quest_start`,
  `dp_investigate`, `dp_fact_sort`, `dp_breathe`, `dp_choose_path`, `dp_crossing`.
- Ch.1 Meadow + Ch.3 Forest still playable via hub.
- `fallbacks/` + `demo/showcase.bundle.json` updated for Singing Bridge.
- ⬜ `content/schema/` Ajv pack, `content/rubrics/` — not present.
- ⬜ Per-scene `tileMap` rooms — not used (scenes use `background` + click `triggers`).

### 3.13 Assets (`public/assets/`)
🟨 Partial. Zone PNGs under `public/assets/zones/`; characters are code-drawn SVG.
No `assets-src/` provenance pipeline.

> 🔧 **Ermoni & Gabby** — Level 1 art + Supabase delivery (offline fallback required).

### 3.14 Build & tooling
🟨 Partial.
- `scripts/validate-content.ts` — walks chapter JSON for id/chapterId/emotionalArc/
  consequences (no schema Ajv yet).
- CI: typecheck, validate:content, test:unit, build.
- ⬜ `build-asset-manifest`, `red-team-suite`, `audit-bundle-size` — not in tree.
- ⬜ Playwright e2e golden path — script listed in package.json; **no `tests/e2e` yet**.

### 3.15 Tests (`tests/`)
🟨 Partial — `tests/unit/engine.test.ts` (11): DecisionResolver, safety filters,
Singing Bridge golden path presence, insights, SVG cast.  
⬜ integration / e2e / red-team folders.

---

## 4. Context files index (`docs/context/`)

| Context file | Documents | Summary |
|---|---|---|
| [engine-runtime.md](./docs/context/engine-runtime.md) | `src/engine/*`, `src/main.ts`, `src/ui/GameView.ts` | Boot screens, scene phases, multi-tap + repair + celebration |
| [safety-companion-pipeline.md](./docs/context/safety-companion-pipeline.md) | `server/routes/companion.ts`, `src/companion/*`, `src/safety/*`, fallbacks | Live vs demo companion paths, filters, fallback coverage |

---

## 5. Open gaps (feeds the task board)

| Gap | Owner hint | Status |
|---|---|---|
| Level 1 script → playable ch2 | Daniel | ✅ Done 2026-07-13 |
| Level 1 / zone production art + Supabase | Ermoni + Gabby | ⬜ |
| Hosted deploy (client + Hono API) | Jose | ⬜ |
| GoZen!-informed vision for Levels 2+ | Vandy | 🟨 script L1 done; research open |
| Level 1 playtest criteria | Ranya | ⬜ |
| PR/spec shepherding | Madhu | ongoing |
| E2E golden path W1→W6 | (unassigned) | ⬜ |
| JSON Schema validate-content | (unassigned) | ⬜ |
| TileMap / WASD architecture | — | ⬜ **Not started; not current model** |

---

## 6. Recent changelog (ledger)

| Date | Change |
|---|---|
| 2026-07-13 | Rebased this ledger onto real `trunorth/` tree (removed phantom `TruNorthProject/` claims). |
| 2026-07-13 | Integrated Level 1 **The Singing Bridge** (W1–W6, Flicker, Wize, Courage Feather). |
| 2026-07-13 | Updated team board: Daniel L1 done; Ermoni/Gabby/Jose/Vandy/Ranya tasks retargeted. |
| 2026-07-13 | Organized repo into `docs/{specs,scripts,kickoff,context}`; added configurable `server/config.ts`, `src/config/*`, expanded `.env.example`. |
| 2026-07-14 | Added world movement: WASD/arrows, collision, proximity interact (E/Space), companion follow, collectible pickup (`WorldRuntime`). |
