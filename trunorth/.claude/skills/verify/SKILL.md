---
name: verify
description: Build, launch, and drive the TruNorth app locally to verify changes at runtime (browser surface).
---

# Verifying TruNorth locally

## Launch

```bash
cd trunorth
rm -f src/**/*.js            # stray build JS shadows .ts sources (known quirk, ledger §3.14)
npm run dev                  # client :5173 + Hono API :3001 (concurrently)
curl -s http://localhost:3001/api/health   # {"status":"ok",...}
```

No `ANTHROPIC_API_KEY` in `.env` → the companion route scores with a local
heuristic; that is the normal local setup, not an error.

## Drive (browser, e.g. Claude in Chrome)

Golden path: `http://localhost:5173/` → **Play Now (Guest)** → (trust/onboarding
only on a fresh profile; a `trunorth_save_v1` localStorage save skips straight
to the hub) → pick a phase card → 3-question check-in (tap options, or type —
"Skip and start playing" works) → game stage.

- In-stage: WASD/arrows move, E/Space interacts; while `exploring`, the dashed
  trigger-zone rectangle is clickable as a fallback — click it to open the
  decision overlay without walking.
- A decision choice fires `POST /api/companion`; success shows the SEL Coach
  panel; multi-tap DPs (w4 ×5, w6 ×4) need repeated choices before advancing.

## Useful probes

- API down (`lsof -ti tcp:3001 | xargs kill`, vite client keeps running):
  decisions must still resolve — SceneEngine catches the fetch failure and shows
  the local counselor insight. No console errors expected.
- Stale save: old saves with removed fields (e.g. `flags.demoMode`) must load.
- Progress (crystal counter, "Done" badge) persists across scenario switches
  and reloads via localStorage.

## Gotchas

- Kill both ports when done; `pkill -f "tsx watch server/main.ts"` for the API.
- Don't run `npm run build` during verification — it emits the stray `src/**/*.js`.
