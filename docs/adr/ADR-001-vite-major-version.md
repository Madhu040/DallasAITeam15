# ADR-001 — Vite major version (8.x vs 7.x fallback)

- **Status:** Accepted 2026-07-19
- **Owner:** Build lead
- **Gate:** After scaffold spike + browser/demo-machine test (spec §25)

## Context

The Consolidated tech spec v3.0 (§3, Appendix F/G02) updates the platform baseline from
Vite 6.x to **Vite 8.x pinned**. The repo shipped `vite ^6.2.2` — two majors behind and
range-specified rather than pinned, so a fresh `npm install` could silently resolve a
different build tool than the one the demo was rehearsed on.

A constraint surfaced during the bump that the spec does not mention: **vitest 3.2.7
declares `vite ^5 || ^6 || ^7`** — it does not support Vite 8. So "pin Vite 8" is not a
one-line change; it forces a coordinated vitest major bump.

## Decision

Pin **`vite` to exact `8.1.5`**, and take the coordinated **`vitest` 3.2.7 → 4.1.10** and
**`@vitest/coverage-v8` → 4.1.10** bump that Vite 8 requires. Tighten `engines.node` to
Vite 8's real floor, `^20.19.0 || >=22.12.0`.

## Options considered

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Vite 8.1.5 + vitest 4** | Spec-conformant; current security/perf; pinned | Two coordinated majors at once | **Chosen** |
| Vite 7 + stay on vitest 3 | Smaller step; vitest 3 supports `^7.0.0-0` | Not spec-conformant; defers the same vitest bump | Rejected — pays the cost twice |
| Stay on Vite 6 | Zero risk today | Leaves G02 open; unpinned range persists | Rejected |

## Consequences

- The demo machine builds with the exact tool the team tested; `npm ci` is reproducible.
- We absorb vitest 4's breaking changes now rather than at showcase crunch time. In practice
  the existing 57 tests needed **no changes** to pass on vitest 4.
- `engines` now rejects Node 20.0–20.18, which Vite 8 cannot run on. This is intentional:
  the previous `>=20` would have let a teammate install a Node that silently fails to build.
- `.nvmrc` stays at **22**, which v3.0 explicitly permits as the compat fallback. The spec's
  Node 24 preference remains open (tracked in `product.md` §5).

## Verification

```bash
cd trunorth && npm run typecheck && npm run lint && npm run validate:content \
  && npm run test:unit && npm run build
```

Verified 2026-07-19: typecheck/lint/validate green, **102/102 tests on vitest 4.1.10**,
`vite v8.1.5` build succeeded, and a browser smoke test on the Vite 8 build booted the app
and rendered the scenario hub with no console errors.
