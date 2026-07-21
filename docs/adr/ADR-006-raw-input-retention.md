# ADR-006 — Raw child-input retention policy

- **Status:** ⬜ **Open** — decision owed by Owner + Counsel
- **Owner:** Owner + Counsel
- **Gate:** Before the EXT backend stores any child-derived data (spec §25)

> Deliberately **undecided**. This ADR is a **legal/policy** decision, not an engineering one.
> Per spec §15 the implementer must *"flag, not adjudicate"* legal questions — so this file
> presents the mechanism and the options and stops there.

## Context

Spec §11.5 defines an event-log record that includes **`rawInput`** — the child's literal typed
words — and flags it as the heaviest data category in the product (§11.5 retention note, §15).
COPPA and equivalents govern collection from minors.

Current state:

- Play is **local-only**; nothing child-derived leaves the device (`LocalProgressStore`).
- The implemented `GameEvent` **does not currently store `rawInput` at all** — it keeps
  `sceneId`, `decisionPointId`, `scoreBand`, `skill`, `safetyFlag` (`product.md` §3.10).
- So today the product is **more conservative than the spec's schema**, which is a safe place
  to be sitting while this is undecided.

**2026-07-20 update:** ADR-003 is now Accepted (Supabase) and the EXT backend exists —
`child_profiles` (parent-entered display_name/age_band/avatar_json, not child-derived) and
`progress.game_state_json` (the same derived-only `GameState`/`GameEvent` shape above — still
no `rawInput` field). **This ADR is still open and still gates the decision** — nothing here
resolves it — but flagging that the schema persisted today happens to already sit on the
conservative side (decision driver 1). The client has no caller for `/api/progress/:childId`
yet (`product.md` §3.8), so no game state has actually been written server-side either way.

The decision still bites the moment anything with a genuine `rawInput` field is added to what
the EXT backend persists.

## Options considered

| Option | Pros | Cons |
|---|---|---|
| **Derived fields only** (`scoreBand`, `skills`, `confidence`) — spec's own default | Minimal data; strongest COPPA posture; still powers meters, dashboard, strength-mirroring | Loses the ability to audit *why* a score was given |
| Raw input on-device only, never synced | Enables local strength-mirroring with the child's own words | Device backups may still capture it; "local only" must be enforced, not assumed |
| Raw input persisted server-side | Best debugging + model-quality analysis | Heaviest category; needs consent, retention limits, deletion flow, counsel sign-off |

## Decision drivers

1. **Spec §11.5 already recommends the conservative default:** *"default to storing the
   derived fields, not the raw text, on the backend unless there's a reviewed reason."*
2. **§14.3** says the parent dashboard must not show raw transcripts without care — a
   dashboard requirement that derived-only satisfies automatically.
3. **§9.8 strength-mirroring reads `strengthsSnapshot`, not transcripts** — so the marquee
   feature that seems to need raw text actually does not.

## Consequences (either way)

- Whatever is chosen must be reflected in `GameEvent` (§11.5 fields are still incomplete —
  tracked in `product.md` §5) **and** in the parent-facing privacy notice (§15).
- If derived-only is chosen, say so explicitly in the trust screen (§17E) — "we never store
  what your child types" is a strong, honest parent-trust claim and costs nothing to make true.
