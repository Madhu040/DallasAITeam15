# ADR-002 — Serverless platform for the companion proxy

- **Status:** Accepted 2026-07-19 (ratifies a decision already implemented in code)
- **Owner:** Build + DevOps
- **Gate:** Before serverless companion-proxy implementation (spec §25)

## Context

Spec v3.0 (Appendix F/G03) resolves an earlier ambiguity — the Phase-1 baseline said
*"Vercel Edge Functions or Netlify Functions"* — in favour of **Vercel Functions on the Node
runtime**, with Netlify as the alternate and standalone Vercel Edge deprecated.

The repo already implements this: `trunorth/api/[[...route]].ts` is a catch-all Vercel Node
Function wrapping the existing Hono `app` via `hono/vercel`. This ADR records the decision
that the code already embodies, so it is reviewable rather than implicit.

## Decision

**Vercel Functions on the Node runtime** is the deployment target for `/api/*`.
Netlify Functions remain the documented alternate. Vercel **Edge** runtime is ruled out.

## Options considered

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Vercel Functions (Node)** | `better-sqlite3` works (native module); one catch-all serves every route; matches v3.0 | Cold starts; `/tmp`-only writable FS | **Chosen** |
| Vercel Edge | Fast cold start | **Cannot run `better-sqlite3`**; no Node built-ins | Rejected — hard blocker |
| Netlify Functions | Viable Node runtime | No advantage over Vercel here; team has no Netlify setup | Alternate, not chosen |

## Consequences

- `export const runtime = "nodejs"` is **load-bearing** in `api/[[...route]].ts`. Removing it
  breaks the API at cold start.
- The project filesystem is read-only outside `/tmp`, so **`DATABASE_PATH=/tmp/trunorth.db`
  must be set** as a Vercel env var — the default `./data/trunorth.db` would crash every cold
  start, because `db/migrate.ts` opens the file at module load.
- Consequently, parent-auth/children/progress are **non-persistent across cold starts** on
  Vercel today. Acceptable only because no client code calls those endpoints yet; real
  persistence needs the serverless-compatible DB chosen in **ADR-003**.

## Verification

Deploy-time: `GET /api/health` returns 200 from the deployed URL.
Not yet verified — the Vercel project itself is still unprovisioned (`product.md` §5,
Jose's lane).
