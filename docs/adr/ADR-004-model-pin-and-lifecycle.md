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

### Live verification — completed 2026-07-19

Real `claude-haiku-4-5-20251001` calls were exercised against the §9.4 contract with a
configured key. Results:

| Check | Result |
|---|---|
| Structured JSON parses; all §9.4 fields present | ✅ |
| `scoreBand` / `skill` / `confidence` | ✅ 0.92–0.95 on strong answers; 0.65 on an ambiguous one |
| Confidence floor (0.55) behaviour | ✅ ambiguous answer stayed `partial` without needing to be forced |
| `companionLine` ≤120 chars | ✅ observed 87–98 |
| Latency vs 8 s timeout | ✅ ~3.3 s |
| Adversarial input blocked **pre-model** | ✅ jailbreak rejected in 0.03 s — no API call, so adversarial traffic costs nothing |

**The live run found two defects the offline path did not have, both now fixed:**

1. **`matchedCriterion` was silently dropped.** §9.4 requires it and §8.3 says the model must
   cite the criterion it matched — but `buildSystemPrompt` never asked for it and
   `parseModelResponse` never read it, so the live path returned *less* than the offline
   rubric scorer. Now requested and parsed; re-verified returning `"offered_inclusion"`.
2. **The model emitted "that's a superpower"** — the exact identity-claiming phrasing the
   §9.8 guard forbids and names as a correction target. The system prompt had no such rule
   and `filterOutput` only screened clinical/meet-up terms. Now forbidden in the prompt
   **and** rejected by the output filter (a prompt rule is not a guarantee), with regression
   cases in `tests/unit/redteam.test.ts`. Re-verified: lines now come back in the approved
   past-tense situational form.
