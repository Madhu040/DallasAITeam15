# ADR-003 — EXT database & auth provider (Supabase vs Neon + Clerk)

- **Status:** ✅ **Accepted — Supabase** (2026-07-20)
- **Owner:** Jose
- **Gate:** Before any remote-progress work starts (spec §25) — cleared

> **Decision (2026-07-20):** Supabase. Postgres + Auth + RLS in one vendor was the deciding
> factor — RLS maps directly onto "a parent can only read their own child's rows" (decision
> driver 1 below), enforced in the database rather than only in application code. The
> existing Hono API is kept as a **gateway** rather than replaced: the browser authenticates
> directly against Supabase Auth, and the gateway verifies the resulting JWT and reads/writes
> Supabase Postgres with the service-role key (RLS stays on as defense-in-depth; the gateway
> scopes every query by `parent_id` explicitly, since the service role bypasses RLS). Full
> walkthrough: [server-auth-supabase.md](../context/server-auth-supabase.md). This also fixes
> the SQLite-on-Vercel cold-start problem noted below — Play Together's `together_rooms` table
> is the only thing still on SQLite.

## Context

The `[EXT]` tier adds parent accounts, child profiles, and cross-device sync (spec §11.3).
Current state:

- The **server side already exists** — `POST/GET /api/children`, `GET/PUT /api/progress/:childId`,
  parent auth with bcrypt + JWT — backed by **SQLite via `better-sqlite3`**.
- **No client calls them.** `LocalProgressStore` is what actually runs (`product.md` §3.8).
- SQLite does not survive serverless cold starts (see **ADR-002**), so the current backend
  cannot be the production one.

So this decision blocks turning an already-built server surface into a real feature.

## Options considered

| Option | Pros | Cons |
|---|---|---|
| **Supabase** | Postgres + auth + RLS in one; row-level security maps well to "parent owns child rows"; generous free tier | Another vendor; auth migration off the existing bcrypt+JWT code |
| **Neon + Clerk** | Neon Postgres scales to zero (good for bursty demo traffic); Clerk is a strong auth product | Two vendors to wire; Clerk pricing at scale; more migration |
| **Neon + keep existing JWT auth** | Reuses the auth already written; smallest code delta | We own auth security (reset flows, lockout, rotation) for a children's product |
| **Turso / libSQL** | Closest to the SQLite already written — least schema churn | Smaller ecosystem; RLS story weaker than Postgres |

## Decision drivers (for whoever decides)

1. **RLS is the important one.** Whatever is chosen must enforce "a parent can only read their
   own child's rows" *in the database*, not only in application code (spec G07).
2. **COPPA posture (ADR-006, spec §15) constrains what may be stored at all** — decide the
   retention question first, or you may migrate data you should never have persisted.
3. **This is not on the showcase path.** The demo is local-only + demo mode. Do not let this
   block MVP work.

## Consequences (either way)

- The existing `server/db/migrate.ts` SQLite schema becomes the migration source, not the
  production store.
- A client `RemoteProgressStore` must be written against the existing `ProgressStore`
  interface — gameplay code should not change (spec §11.1).
