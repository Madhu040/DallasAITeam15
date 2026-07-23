# Architecture Decision Records (ADRs)

Required by the [Consolidated Technical Specification](../specs/Consolidated%20TruNorth-Technical-Specification.md)
**§25**, which states ADRs are *"Required before build freeze. Tracked in `docs/adr/`."*

An ADR records **one decision**: the context that forced it, the option chosen, the options
rejected, and the consequences we accept. ADRs are immutable once `Accepted` — if a decision
changes, write a new ADR that supersedes the old one rather than editing history.

## Index

| ADR | Decision | Owner (per §25) | Status |
|---|---|---|---|
| [ADR-001](./ADR-001-vite-major-version.md) | Vite 8.x vs Vite 7 fallback | Build lead | ✅ Accepted 2026-07-19 |
| [ADR-002](./ADR-002-serverless-platform.md) | Vercel Functions vs Netlify Functions | Build + DevOps | ✅ Accepted 2026-07-19 (ratifies existing code) |
| [ADR-003](./ADR-003-ext-database-and-auth.md) | Supabase vs Neon + Clerk for EXT | Owner + Build | ✅ Accepted 2026-07-20 — Supabase |
| [ADR-004](./ADR-004-model-pin-and-lifecycle.md) | Claude Haiku 4.5 pinned ID + model lifecycle | Safety + Build | ✅ Accepted 2026-07-19 |
| [ADR-005](./ADR-005-asset-provenance.md) | Asset generation / provenance policy | Owner + Art lead | ⬜ Open — gates art freeze |
| [ADR-006](./ADR-006-raw-input-retention.md) | Raw-input retention policy | Owner + Counsel | ⬜ Open — gates any EXT backend storage |

## Status values

- **Proposed** — drafted, not yet agreed.
- **Accepted** — agreed and in force; the code should match.
- **Superseded by ADR-NNN** — replaced; kept for history.

## Template

```markdown
# ADR-NNN — <short decision title>

- **Status:** Proposed | Accepted <date> | Superseded by ADR-NNN
- **Owner:** <role, per spec §25>
- **Gate:** <what this decision blocks>

## Context
What forces a decision now.

## Decision
What we chose, stated in one sentence.

## Options considered
| Option | Pros | Cons | Verdict |

## Consequences
What becomes true, easier, and harder. Include what we accept as a cost.

## Verification
How we know it holds (test, command, or observable).
```
