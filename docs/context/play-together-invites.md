# Play Together invites (cross-device rooms)

**Sources:** `trunorth/server/routes/together.ts`, `trunorth/src/together/inviteStore.ts`,
`trunorth/src/ui/togetherScreens.ts`, `trunorth/src/util/id.ts` (+ integration points in
`src/main.ts`, `src/ui/GameView.ts`, `src/config/app.ts`, `server/index.ts`,
`vite.config.ts`, `index.html`, `.env.example`)

Lets a parent and child join the same playthrough from **different devices** (phone +
laptop, two phones) via a shareable 4-letter code or `?invite=CODE` link, instead of the
older same-browser-only "Together Mode" co-play toggle (`counselor/coPlay.ts` — unrelated,
still separate).

## Server (`server/routes/together.ts`)

- SQLite table `together_rooms` (code, host seat, `players_json`, status, timestamps,
  `expires_at`), created lazily on first import. Rooms auto-expire after 2 hours
  (`ROOM_TTL_MS`); `purgeExpired()` runs on every read.
- `POST /api/together/rooms` — host creates a room, gets back a 4-letter code
  (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789` alphabet, collision-retried).
- `GET /api/together/rooms/:code` — fetch current room state.
- `POST /api/together/rooms/:code/join` — second player joins (rejects if full, rejects if
  the requested role — parent/child — is already taken).
- `POST /api/together/rooms/:code/close`.
- `GET /api/together/rooms/:code/stream` — SSE, pushes room updates for ~6 minutes so the
  waiting screen updates live without polling; client reconnects/falls back to polling.
- Mounted in `server/index.ts` alongside `companionRoutes`. CORS now uses a dynamic
  origin function (not a static list) so phones on the same Wi-Fi (LAN IPs
  `192.168.x.x` / `10.x.x.x` / `172.16-31.x.x`) are allowed in addition to
  `serverConfig.corsOrigins`.

## Client store (`src/together/inviteStore.ts`)

- `createRoom`/`joinRoom`/`loadRoom`/`watchRoom` talk to the API; `watchRoom` prefers the
  SSE stream and falls back to 1.5s polling if it errors, plus a same-tab
  `storage` event listener as a last resort.
- If the API is unreachable (`status === 0`), `createRoom`/`joinRoom` fall back to a
  **localStorage-only room** so the same-browser demo path still works offline.
- `COLOR_TUNES` (5 named accent/soft color pairs) and `PLAYER_CHARACTERS` (5 sprite
  choices incl. `wize`/owl, `helper_bear`) drive the player-customization UI.
- `getSeatId()` — per-tab identity via `sessionStorage`, generated with `newId()`.

## UI (`src/ui/togetherScreens.ts`)

- `renderTogetherLobby` — host or join-by-code.
- `renderTogetherPlayerSetup` — name/color/character picker, returns a
  `PlayerSetupResult`.
- `renderTogetherWaiting` — shows the code/link + both seats; returns an unsubscribe
  function (wraps `watchRoom`) that `main.ts` calls on navigation away.
- Styled in `global.css` under "Play Together invite flow" (`.together-*` classes) —
  additive; does not touch the unrelated stage z-index / container-scaling CSS.

## `src/util/id.ts`

`newId()` — UUID helper that falls back to `crypto.getRandomValues` then a
timestamp+random string when `crypto.randomUUID()` isn't available (phones on
`http://192.168.x.x` are a non-secure context, where `randomUUID` is undefined).
`DecisionResolver` also uses this now instead of `crypto.randomUUID()` directly, for the
same LAN-compatibility reason.

## Wiring (`src/main.ts`, `src/ui/GameView.ts`)

- New `AppScreen` states: `togetherLobby` → `togetherSetup` → `togetherWaiting` →
  (`enterTogetherReady`) → `hub`. Reached from the landing page's "Play Together" button
  (after the existing trust/onboarding gate) or by opening a `?invite=CODE` link directly.
- `togetherPlayers: TogetherPlayer[]` module state feeds `renderGameView`'s new last
  parameter — renders a small badge per joined player (name, role, accent color) next to
  the existing "Playing Together" pill. Purely additive: does not touch the
  dialog-stage-object params or the character z-index fix that landed the same week.
- Joining sets `gameState.profile.childDisplayName` / `avatar` / `companionArchetype` from
  the child seat's picks (`applyTogetherToProfile`).

## Mobile/LAN support added alongside this feature

- `vite.config.ts` — `server.host` / `preview.host` = `true` (exposes on the LAN).
- `index.html` — `viewport-fit=cover` for notch/safe-area support.
- `src/config/app.ts` — `resolveApiUrl()` prefers the same-origin `/api` proxy whenever the
  page isn't on localhost, so a hardcoded `VITE_API_URL=http://localhost:3001` doesn't
  break phones hitting the LAN IP.

## Known gaps

- ⬜ No automated tests yet (server route, invite store, or UI screens) — manual/local
  verification only so far.
- ⬜ Requires `npm run dev` (API reachable); the hosted-deploy task (Jose, §3.11) will
  determine the real cross-device story once the API is public.
