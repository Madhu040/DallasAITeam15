# ADR-004 — Companion model pin & lifecycle policy

- **Status:** Accepted 2026-07-19
- **Owner:** Safety + Build
- **Gate:** Before live AI testing with child-facing flows (spec §25)

## Context

The companion proxy defaulted to **`claude-3-5-haiku-latest`** — a previous-generation model
behind a **floating alias**. Spec v3.0 (§3, §11.6, Appendix F/G02, G04) requires *"Claude
Haiku 4.5, production-pinned dated ID"* plus a lifecycle policy.

A floating alias is not merely a currency issue. The model behind `-latest` can change with
no commit on our side, which means **any safety result we certify may have been certified
against a different model than the one a child talks to.** For a product whose central risk
is what an AI says to a child, that makes the red-team suite (spec §9.6) unfalsifiable.

## Decision

Pin the default to the dated ID **`claude-haiku-4-5-20251001`** in `server/config.ts` and
`.env.example`. The value stays env-overridable (`COMPANION_MODEL`) for local experiments,
but the committed default is always a dated ID.

**Lifecycle policy:** re-pinning is a deliberate, reviewed change that must
(a) update this ADR or supersede it, (b) re-run the red-team suite against the new ID, and
(c) be recorded in `product.md`. Never re-point to a `-latest` alias.

## Options considered

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Pinned `claude-haiku-4-5-20251001`** | Reproducible safety baseline; current generation; spec-conformant | Must re-pin deliberately on upgrade | **Chosen** |
| Keep `claude-3-5-haiku-latest` | Zero work; auto-picks updates | Safety baseline not reproducible; older generation; violates G04 | Rejected |
| Pin an older dated 3.5 ID | Reproducible | Still a previous generation; weaker at the constrained-JSON contract | Rejected |

## Consequences

- The red-team suite now asserts the pin, so a floating alias cannot be reintroduced silently
  (`tests/unit/redteam.test.ts` → "model pinning").
- Model upgrades become explicit work with a required safety re-run — accepted cost.
- Newer-generation Haiku should follow the §9.4 structured-output contract more reliably,
  reducing fallback substitutions on the live path.

## Verification

`GET /api/health` reports the effective model:

```bash
curl -s localhost:3001/api/health   # → "companionModel":"claude-haiku-4-5-20251001"
```

Automated guard in `tests/unit/redteam.test.ts`: the model must not contain `-latest` and
must end in a `-YYYYMMDD` date.

> ⚠️ **Not yet verified: the live call.** No `ANTHROPIC_API_KEY` is configured in this
> environment, so only config plumbing and the no-key path (`scoreLocally` + fallback
> library) have been exercised. A real Haiku 4.5 request/response against the §9.4 JSON
> contract is **still owed** before any keyed deploy. Tracked in `product.md` §5.
