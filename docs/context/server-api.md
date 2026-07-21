# Server API (Hono)

**Sources:** `trunorth/server/main.ts`, `trunorth/server/index.ts`, `trunorth/server/config.ts`,
`trunorth/server/auth/supabase.ts`, `trunorth/server/db/migrate.ts`, `trunorth/server/db/supabase.ts`,
`trunorth/server/routes/companion.ts`

> **2026-07-20 (ADR-003):** parent auth + child profiles + progress + audit logs moved from
> SQLite/bcrypt+JWT to **Supabase** (Postgres + Supabase Auth). Full walkthrough:
> [server-auth-supabase.md](./server-auth-supabase.md). SQLite now only backs Play Together's
> `together_rooms` table.

## Boot

- `server/main.ts` — imports `db/migrate.js` (side-effect: opens/creates the SQLite file,
  now only used by Play Together), then `serve({ fetch: app.fetch, port })` via
  `@hono/node-server`. Default port **3001**.
- `server/config.ts` — `serverConfig`: hand-rolled `.env` loader (no dotenv dependency; only fills
  keys not already in `process.env`), then typed getters for `port`, `host`, `databasePath`,
  `corsOrigins` (comma list), `supabase.{url, serviceRoleKey, jwtSecret}`, and
  `companion.{apiKey, model, confidenceFloor, timeoutMs}`.

## Database

- **Supabase Postgres** (`server/db/supabase.ts`, `supabase/migrations/0001_children_progress.sql`)
  — `child_profiles` (parent_id → `auth.users`, display_name, age_band, avatar_json), `progress`
  (one row per child, `game_state_json` + `updated_at`), `audit_logs` (actor_id, action,
  resource_id). RLS enabled on all three as defense-in-depth; the gateway uses the
  service-role key and scopes every query by `parent_id` explicitly (RLS is not the only
  enforcement). `getServiceClient()` is a lazy singleton.
- **SQLite** (`server/db/migrate.ts`) — now only opens the file for `together_rooms`
  (created lazily in `server/routes/together.ts`). DB file lives under `trunorth/data/`
  (git-ignored).

## Auth (`server/auth/supabase.ts`)

Parents authenticate directly against Supabase Auth from the browser (`src/ui/auth.ts`,
`@supabase/supabase-js`); this server only verifies the resulting access token — it never
handles passwords.

- `verifySupabaseToken(token)` — returns `AuthUser | null` (never throws). Two modes,
  selected by `SUPABASE_JWT_SECRET`: set → local `jwtVerify` (HS256, legacy projects);
  empty → `createRemoteJWKSet` against the project's `/auth/v1/.well-known/jwks.json`
  (current projects' asymmetric keys; jose caches the key set in-module).
- Every Supabase Auth user is treated as `role: "parent"` — children never authenticate.

## Routes (`server/index.ts`)

CORS restricted to `serverConfig.corsOrigins`. `authMiddleware` = Bearer token →
`verifySupabaseToken` → `c.set("user")`.

| Route | Auth | Behavior |
|---|---|---|
| `GET /api/health` | — | status, timestamp, companion model + `hasApiKey` flag |
| `GET /api/health/supabase` | — | `{configured, reachable, error?}` — head-count query against `child_profiles` |
| `GET /api/auth/me` | Bearer | echoes the verified Supabase user |
| `GET /api/children` | Bearer | list caller's child profiles (Supabase, scoped by `parent_id`) |
| `POST /api/children` | Bearer | create profile (name ≤30 chars), writes an `audit_logs` row (non-fatal on failure) |
| `GET /api/progress/:childId` | Bearer | ownership check, returns stored `GameState` JSON or null |
| `PUT /api/progress/:childId` | Bearer | ownership check, upsert `game_state_json` |
| `POST /api/companion` | optional | see pipeline below |
| `POST /api/reflect` | — | maps `{events:[{decisionPointId, scoreBand}]}` → `insightForStep` list + parent coaching + disclaimer. **No client caller yet.** |

> The client calls `/api/companion` (LiveCompanionClient) and, since 2026-07-20,
> `/api/children` (`src/ui/childrenScreen.ts`, after Supabase Auth sign-in). Register/login
> themselves go straight to Supabase Auth from the browser — there is no `/api/auth/register`
> or `/api/auth/login` anymore. `/api/progress/:childId` still has no client caller;
> gameplay persistence remains localStorage (`LocalProgressStore`).

## Companion route (`server/routes/companion.ts`)

`POST /api/companion` pipeline:

1. Require `decisionPointId` + `sceneId` (400 otherwise).
2. `filterInput(childInput)` — on block: safety fallback line, `redirect: true`, band `partial`, original safety flag.
3. No `ANTHROPIC_API_KEY` → `scoreLocally` (keyword heuristic → band; insight-derived line).
4. Key present → Anthropic `messages.create` (max_tokens 420, AbortController timeout) with
   `buildSystemPrompt` (companion persona, strict boundaries, together-mode addendum,
   JSON-only response contract).
5. `parseModelResponse` — extract first `{...}` JSON, clamp line lengths (120/400/300); parse
   failure → `scoreLocally`.
6. `filterOutput` on companionLine + counselorInsight — unsafe → safety fallback + `off_topic` flag.
7. Confidence below `CONFIDENCE_FLOOR` → band forced `partial` + partial fallback line.
8. `enrichWithLocalInsight` — backfill counselorInsight/parentTip from `insightForStep`.
9. Any thrown error → `scoreLocally(req, "timeout")` with the per-DP `timeout` fallback line.

`getFallback(dpId, band)` reads `content/fallbacks/companion-fallbacks.json`
(strong/partial/poor/timeout/safety per DP, all 10 DPs covered) with a generic last-resort line.
