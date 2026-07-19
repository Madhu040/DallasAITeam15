# ADR-005 — Asset generation & provenance policy

- **Status:** ⬜ **Open** — decision owed by Owner + Art lead
- **Owner:** Owner + Art lead
- **Gate:** Before art freeze (spec §25)

> Deliberately **undecided**. Records context and options for the owner + art lead.

## Context

Spec §10 requires one frozen "clean cartoon" style, generated in a Week 1–2 sprint then locked,
with an `assetRef → file` manifest so scenes never reference raw paths. Spec G09 additionally
requires a **provenance ledger** (what tool, what prompt, what license) because this is a
commercial-intent children's product.

Current state (`product.md` §3.4, §3.13):

- The character cast is **code-drawn inline SVG in an 8-bit pixel style** — not AI-generated
  "clean cartoon", and not a frozen asset set.
- Zone art is a handful of **placeholder PNGs**; ch2's four new biomes reuse them.
- **No asset manifest and no provenance record exist.**

So the built art and the specified art pipeline have diverged, and there is no record of how
any existing asset was produced.

## Options considered

| Option | Pros | Cons |
|---|---|---|
| **Adopt the current 8-bit pixel SVG as the official style** | Already built, consistent, scales crisply, zero license risk (authored in code), tiny payload | Contradicts spec §10's "clean cartoon"; less warm for ages 5–7 |
| **Generate the clean-cartoon set per spec §10, replace SVG** | Matches spec and the warmth target; supports the 3-expression matrix (§17B.3) | Real art-sprint cost; license/provenance review needed; drift risk across scenes |
| **Hybrid: AI backgrounds + code-drawn characters** | Backgrounds are where AI helps most; characters stay on-model for free | Two pipelines to maintain |

## Decision drivers

1. **§3.6 representation** and **§17B.3 three expression states per character** must be
   satisfiable by whatever is chosen — the current SVG cast already does expressions.
2. **Provenance is required regardless of choice.** Even code-drawn assets need the ledger
   entry (author, date, license) for the commercial story.
3. **IP constraint (§21-Q17): original characters only** — no branded/licensed likenesses.

## Consequences (either way)

- An `assetRef → file` manifest must exist before art freeze; scenes already reference
  `assetRef` strings, so this is additive.
- If the clean-cartoon path is chosen, `src/render/characters.ts` becomes a fallback rather
  than the primary renderer — plan the swap so the offline demo path never breaks.
