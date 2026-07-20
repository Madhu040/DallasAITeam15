# Audio assets (spec §17B.4)

Drop your CC0 clips here using these exact filenames. The game reads them through
`src/audio/sfx.ts`; until a file exists, that cue is simply silent — no crash, no console
noise — so the offline demo never breaks if a file is missing. Same fallback contract as
the art asset manifest (`src/content/assetManifest.ts`).

**Rules**
- MP3, mono or stereo, short (footsteps/chimes should be well under 1s; the decision
  stings and celebration fanfare can run a couple seconds).
- Keep the whole audio/ folder small — it counts against the CI bundle budget
  (`npm run audit:bundle`, spec §19).
- §17A.4 calm-first budget: the ambient bed must read as *low-stimulation* — no melody
  hooks, no rising tension, nothing a child would call "exciting." Event cues can be
  brighter; the bed never competes with them.
- Never delete a placeholder path from the code; a missing file just stays silent.

## Suggested sources (all CC0, no attribution required)
- **[Kenney.nl](https://kenney.nl/assets)** — "Interface Sounds", "UI Audio", "RPG Audio"
  packs cover footstep/click/chime/fanfare well. Everything Kenney publishes is CC0.
- **[Freesound.org](https://freesound.org)**, filtered to the CC0 license — best source
  for a genuinely calm ambient loop (search "calm ambient loop" or "meadow ambience").

## sfx/  (one-shot event cues)
| File | Spec §17B.4 event | Fired from |
|---|---|---|
| `footstep.mp3` | avatar takes a step while exploring | `WorldRuntime` (throttled, ~3/sec) |
| `discovery.mp3` | first time examining a discoverable object | `main.ts` `recordDiscovery` |
| `spark-pickup.mp3` | a gentle chime on brownie-point pickup | `main.ts` `onWorldCollect` |
| `decision-strong.mp3` | "a magical harp swirl" — a strong choice | `SceneEngine` → `onDecisionBand` |
| `decision-thud.mp3` | "a soft comical thud" — a poor choice / repair nudge | `SceneEngine` → `onDecisionBand` |
| `celebration.mp3` | chapter complete | `main.ts` `onCelebration` |

## ambience/  (looped, low-energy exploration bed)
| File | Notes |
|---|---|
| `exploring-bed.mp3` | loops while `phase === "exploring"`; pauses for decisions/dialog/celebration so it never fights their own cues. Mixed well below the event cues (`VITE_SFX_AMBIENCE_VOLUME`, default 0.15 vs 0.7). |
