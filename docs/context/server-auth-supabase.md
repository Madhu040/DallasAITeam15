# Parent auth on Supabase (ADR-003)

**Sources:** `trunorth/server/auth/supabase.ts`, `trunorth/server/db/supabase.ts`,
`trunorth/src/lib/supabase.ts`, `trunorth/src/ui/auth.ts`, `trunorth/src/ui/childrenScreen.ts`,
`trunorth/supabase/migrations/0001_children_progress.sql`, `trunorth/server/index.ts`

Replaces the original bcrypt+JWT+SQLite parent auth (ADR-003 decided **Supabase**, 2026-07-20).
SQLite (`server/db/migrate.ts`) now only backs Play Together's `together_rooms` table.

## Architecture

The Hono server stays as a **gateway**, not a pass-through: the browser talks to Supabase
Auth directly for sign-in/sign-up (`@supabase/supabase-js`), and the resulting access token
is sent as a Bearer header to the existing `/api/children` and `/api/progress/:childId`
endpoints. Those endpoints use the Supabase **service-role key** to read/write Postgres —
not the anon key — so Row-Level Security is a safety net, not the enforcement layer; every
query still scopes explicitly by `parent_id`.

```
Browser ──(email/password)──> Supabase Auth ──> access token
Browser ──(Bearer token)─────> Hono API ──(service-role key)──> Supabase Postgres
```

## One-time setup (for whoever configures a Supabase project)

1. Create/open the Supabase project. Copy **Project URL**, **anon/public key**, and
   **service_role key** from Settings → API.
2. Paste `trunorth/supabase/migrations/0001_children_progress.sql` into the SQL Editor and
   run it once. Creates `child_profiles`, `progress`, `audit_logs` with RLS enabled.
3. In `trunorth/.env`:
   ```
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service_role key — server only, never VITE_>
   SUPABASE_JWT_SECRET=            # leave empty — see "HS256 vs JWKS" below
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon/public key>
   ```
4. Dashboard → Authentication → Providers → Email: for local dev, consider turning off
   **Confirm email** so `signUp` returns a session immediately. Leave it on for anything
   closer to production — `src/ui/auth.ts`'s `signUp` already returns
   `{ needsEmailConfirm: true }` and the login form shows a "check your email" message
   instead of silently doing nothing.
5. `curl localhost:3001/api/health/supabase` → `{ configured: true, reachable: true }`
   confirms the server can reach the `child_profiles` table.

## HS256 vs JWKS (`server/auth/supabase.ts`)

Supabase projects sign access tokens one of two ways, and `verifySupabaseToken` supports
both via one env switch:

- **`SUPABASE_JWT_SECRET` set** — legacy projects on a shared HS256 secret. Verified locally
  with `jose`'s `jwtVerify`, no network call per request.
- **`SUPABASE_JWT_SECRET` empty (default)** — current projects sign with asymmetric keys.
  Verified against `createRemoteJWKSet("${SUPABASE_URL}/auth/v1/.well-known/jwks.json")`;
  jose caches the key set in-module, so this costs a network round-trip only on the first
  verification (and on key rotation), not per request.

After the first real login, note in this file which mode this project actually uses, so the
next person doesn't have to rediscover it.

## Token flow

1. Browser: `signIn`/`signUp` (`src/ui/auth.ts`) call Supabase Auth directly; on success,
   `applySession` caches `session.access_token` and `{id, email}` in module state.
2. `getToken()` is **synchronous** — existing callers (`LiveCompanionClient`'s bearer,
   Play Together's authed-check) read the cache without becoming async.
3. Any authenticated request to the Hono API sends `Authorization: Bearer <access_token>`.
   `authMiddleware` → `verifySupabaseToken` → `c.set("user", { id, email, role: "parent" })`.
4. `GET/POST /api/children`, `GET/PUT /api/progress/:childId` query Supabase Postgres via
   `getServiceClient()`, scoped by `.eq("parent_id", user.id)`.

`initAuth()` (called once at boot, skipped in demo mode) hydrates the cache from any existing
Supabase session and subscribes to `onAuthStateChange`, and purges the old
`trunorth_token`/`trunorth_user` localStorage keys left over from the bcrypt+JWT era.

## Demo mode / bundle size

`src/lib/supabase.ts`'s `getSupabase()` returns `null` in demo mode (`?demo=1`) or when the
`VITE_SUPABASE_*` env vars are empty — required so the offline demo makes zero external
requests (enforced by `tests/e2e/demo-mode.spec.ts`). It also **dynamically imports**
`@supabase/supabase-js` rather than a static import, so the SDK (~35 KB gz) loads as a
separate chunk only when a parent opens login/children — not on the guest/demo golden path.
`scripts/audit-bundle-size.ts`'s JS budgets were raised (250→450 KB raw, 80→130 KB gzip) to
account for it, since that audit sums all `dist/` JS regardless of chunking.

## What did NOT move to Supabase

- **Play Together** (`server/routes/together.ts`, `together_rooms`) — still SQLite,
  unauthenticated, 2-hour TTL. Out of scope for this migration.
- **Parent-gate PIN** (`hashPin`/`verifyPin` in `src/ui/auth.ts`) — a separate local
  SHA-256 mechanism unrelated to account auth, untouched.
