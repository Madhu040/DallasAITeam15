# UI screens & game view

**Sources:** `trunorth/src/ui/GameView.ts`, `trunorth/src/ui/screens.ts`, `trunorth/src/ui/auth.ts`,
`trunorth/src/ui/childrenScreen.ts`, `trunorth/src/lib/supabase.ts`, `trunorth/src/ui/captions.ts`

All UI is imperative DOM construction (no framework). Dynamic text goes through
`textContent` or a local `escapeText`/`escapeHtml` helper before `innerHTML`.

## `GameView.ts`

- `renderGameView(container, state, scene, phase, companionLine, activeDecisionId, counselor, onChoice, onTyped, onTrigger, togetherMode, coPlayStep, onCoPlayReady, onWorldReady)` —
  builds the play screen each render:
  - Viewport with demo/together pills, crystal (brownie) counter, zone stage tag,
    HUD meters (empathy ❤️ / calm 🌊 / courage ⭐ with level aria-labels).
  - Scene background from `zoneFromBackground`/`zoneForChapter` (`contentConfig.zones` image),
    plus legacy `treehouse|classroom|playground` CSS classes.
  - Characters via `renderFullBodyCharacter` SVG, per-character labels (companion uses the
    child's chosen name), depth z-index from y-position; companion speech `bubble` shown during
    `consequence`/`awaitingCompanion` — also mirrors that line into the persistent
    bottom-center `captions.ts` box (2026-07-20, see below) via
    `showCaption(companionName, companionLine)` (non-persistent — auto-hides on its own
    timer after `appConfig.timing.captionMinVisibleMs`, since the phase itself is too
    short-lived to gate visibility on; see `captions.ts` below for why).
  - Collectible ✨ sparks (`data-collectible-id`), clickable dashed `trigger-zone` buttons while
    `exploring`, "…is reflecting with you" indicator during `awaitingCompanion`.
    (The bottom narration bar was removed 2026-07-18 — `scene.narration` is no longer
    displayed; story text is carried by stage-object dialogs. Engine narration
    auto-advance timing is unchanged.)
  - **Stage z-layering (2026-07-18)** — guarantees no dialogue is blocked by a
    character: characters get `10 + floor(y/20)` (max ~64) < counselor panel 70 <
    speaking character (bubble host, inline z 75) = interact hint 75 < thinking pill 80
    < modal `.overlay` (decision + stage-object dialogs) 100. The companion bubble is
    wider (`360 * --px` max), bordered, with a ::after tail. In demo mode the stage tag
    drops below the demo pill (`.demo-pill ~ .stage-tag`); the together-pill sits below
    the crystal counter; the move hint lives bottom-left (clear of the counselor panel).
  - Calls `onWorldReady(viewport, scene, exploring)` so `worldRuntime.attach` can take over movement.
  - **Responsive stage scaling:** `.game-viewport` (global.css) is a CSS size container
    (`container-type: size`) defining `--px: 0.0520833cqw` = 1 design px of the 1920×1080
    scene space. Characters set `--char-size` (110; worry cloud 120) inline and
    `.character` width is `calc(var(--char-size) * var(--px))` with the SVG at
    `width:100%; height:auto` (the SVG's own width/height attrs remain as fallback).
    Labels, bubbles, collectibles, move/interact hints, HUD meters, pills, zone sign,
    and stage tag are sized in `calc(n * var(--px))`; text uses
    `clamp(min, calc(n * var(--px)), n px)` so it shrinks with the stage but never below
    a legibility floor. Positions were already %-based (world coords / 1920 or 1080).
  - Counselor side panel (`buildCounselorPanel`) during exploring/decision/consequence.
    **Draggable + closable (2026-07-18):** the header row (badge + ✕ button,
    `.counselor-panel-header`) is a pointer-capture drag handle — dragging sets inline
    `left/top` clamped to the window; the ✕ dismisses the panel. Both survive re-renders
    via module-scope state (`counselorPanelPos`, `dismissedCounselorKey` keyed on the
    insight's text via `counselorKey`), so a dismissed insight stays closed until a
    *different* insight arrives, and the dragged position persists for the session.
  - Decision overlay (`renderDecisionOverlay`) during `decision`/`encounter`.
  - Dialog overlay (`renderDialogOverlay`, stage-object NPC dialogs) — **also mirrors its
    current page into `captions.ts`** (2026-07-20) via `showCaption(speaker, pageText)`,
    right alongside its existing `speakOverlayOnce` call.
- `renderDecisionOverlay` (private) — modal dialog. Together Mode is a two-step machine:
  step 1 "Talk together" shows `discussPrompt(dpId)` + ready button; step 2 shows the prompt,
  optional parent-reflection textarea, choice buttons, and (for `typed`/`both` DPs) a textarea +
  "Say it" submit. **Deliberately not captioned** — `buildOverlayScript`'s read-aloud text
  combines the prompt + all options into one TTS-only accessibility string with no clean
  visual equivalent (the prompt/options are already fully visible as a heading + buttons).
- `renderDialogOverlay` (private) — modal, multi-page NPC/companion dialog (portrait +
  speaker name + page text + Next/Done). Speaks each page once (`speakOverlayOnce`) and
  captions it (`showCaption`); speaker resolved via `personalize(page.speaker ?? dialog.speaker, names)`.
- `renderCelebration(container, chapterTitle, onReflect, onHub)` — Courage Feather trophy,
  Flicker/player lessons, achievement checklist and quote from `contentConfig.celebration`.
- `renderJourneyReflection(container, reflection, onContinue)` — renders a
  `JourneyReflection`: summary, strengths, growth edges, per-step child/parent/practice
  insights, parent coach notes, closing disclaimer.
- `renderParentGate(container, onPass, onFail)` — 4-digit PIN gate. First use stores
  SHA-256 hash in `localStorage["trunorth_pin_hash"]`; 3 failures → 30s lockout + `onFail`.
- `renderTrustScreen(container, onContinue)` — safety promises list; continue sets
  `trunorth_trust_seen` (caller side).
- Types: `CounselorPanelData { title, child, parent, together? }`, `CoPlayStep = "discuss" | "choose"`.

## `screens.ts`

- `renderLanding(container, onPlay, onPlayTogether, onAuth)` — landing card with Play,
  Play Together, demo hint, and parent Login / Create Account buttons.
- `renderAuthForm(container, mode, onSuccess, onBack)` — email+password form calling
  `signIn`/`signUp` (Supabase Auth, ADR-003); on `signUp`'s `needsEmailConfirm` shows a
  "check your email" notice instead of navigating.
- `renderOnboarding(container, onComplete)` — 3 steps: companion archetype
  (dragon/fox/sprite), companion name (default from `appConfig.defaults`), avatar skin tone;
  returns collected profile data.
- `renderScenarioHub(container, completedChapters, playMode, onSelectSolo, onSelectTogether, onParentCoach, onBack)` —
  child scenario cards (done/together badges, age + minutes) from `SCENARIOS` (now 2:
  ch2 The Little Dragon Who Wouldn't Stop Guarding, ch1 Everbright Meadow); thumbnails are grid canvases
  (`createGridThumbnail`) when the start scene binds a `gridMapId`, PNG zone thumbs
  otherwise; parent-audience card wired to the PIN-gated coach corner.
- `renderCheckin(container, scenario, companionName, companionArchetype, ageBand,
  childName, onDone, onBack)` — pre-level check-in between hub and `startScenario`.
  Renders 3 questions from `questionsForChapter(scenario.id)` (`src/counselor/checkin.ts`),
  one card at a time: tappable options (0–2 pts, instant) or an "in your own words" input —
  sanitized + `checkTypedSafety`-checked **immediately** on submit (a distress/blocked
  answer finalizes instantly, same as before); a clean typed answer queues into
  `pendingTyped` instead of scoring right away. Once every question is answered, if
  anything is pending, a brief "{companion} is thinking…" card shows while one
  `scoreCheckinBatch` call (ADR: see [safety-companion-pipeline.md](./safety-companion-pipeline.md))
  scores the whole batch together — LLM-backed when `ANTHROPIC_API_KEY` is set AND the
  session is logged in, offline heuristic otherwise/on failure. **2026-07-20:** the live
  path also returns a personalized `greeting` (by `childName`, referencing the answers) —
  shown on the results screen in an emphasized `.checkin-greeting` style in place of the
  generic `checkinCompanionLine` when present — and a per-question `reason`, which is
  `console.log`ged only (never rendered — verification aid, not a UI feature). Ends on a
  compass result screen (bright/steady/gentle label, 10-dot 0–10 starting-point scale,
  companion line or live greeting) → `onDone(CheckinRecord)`; "Skip and start playing" →
  `onDone(null)`. **2026-07-23:** the results screen's line is also mirrored into
  `captions.ts` (`showCaption(companionName, lineText, true)` — persistent, since this
  screen stays up until the child taps "Start"; `screens.ts` had been the one screen the
  original captions wiring missed entirely, being separate from `GameView.ts`), cleared
  explicitly on the "Start" button before `onDone(result)`.
- `isAuthenticated()` / `logout()` — thin wrappers over `auth.ts`'s `isAuthenticated`/`signOut`.
- Local `type Screen = "landing" | "login" | "register"` — matches `main.ts`'s `AppScreen`
  (this doc previously noted a stale `"dashboard"` variant that no longer exists; `typecheck`
  is currently a clean 0 errors, contradicting the "9 known errors" note elsewhere — code wins).

## `captions.ts` (new 2026-07-20, timing bug found + fixed same day, repositioned
2026-07-21, `screens.ts` check-in coverage gap closed 2026-07-23)

Persistent, translucent, bottom-center captions pill — shows text whenever a character
speaks. `showCaption(speaker, text, persistent = false)` (creates the element lazily on
first call, appended directly to `document.body`; prefixes `${speaker}: ` when given) and
`clearCaption()`.

- **Lives outside `#app` on purpose.** Every screen's render function starts with
  `container.innerHTML = ""`, tearing down the whole subtree — a captions node appended
  inside `#app` would be destroyed on the very next re-render (and `renderGameView` in
  particular rebuilds on every phase/meter update). A `document.body`-level element
  sidesteps that entirely.
- **Independent of the TTS voice toggle** (`src/audio/speech.ts`'s `isVoiceEnabled()`) —
  deliberately not hooked into `speakLine` itself, which early-returns when voice is off.
  Captions are a separate visual channel; a session with voice muted should still get them.
- **CSS** (`.speech-captions` / `.speech-captions.visible`, `global.css`): **bottom-center**
  (`left: 50%; transform: translateX(-50%); bottom: 28px` — moved from bottom-right on a
  second "still not showing" report, see below), small pill shape (`border-radius: 999px`,
  14px text) rather than a card — deliberately reads as a subtitle, not a competing UI
  panel, per the "make sure it's not too distracting" ask. `pointer-events: none` (never
  blocks clicks/taps underneath), translucent dark background, `z-index: 101` (above the
  modal `.overlay` layer at 100, so a caption stays legible even during a dialog pop-up).

### The `persistent` flag — why it exists

**Original bug:** `renderGameView` cleared the caption on every render that didn't
currently show a bubble or dialog. That's correct for dialogs (their presence is a real,
stable condition across renders) but wrong for the companion bubble —
`SceneEngine.resolveDecision` sets phase `consequence` then, **synchronously, no
intervening delay**, `exploring` (same function call, nothing awaited but a `store.save`).
So the one render pass where the bubble condition was briefly true could last single-digit
milliseconds, often already gone by the *next* render. A user report ("captions aren't
showing") traced back to this; confirmed via a `MutationObserver` instrumenting the
element's `class` attribute with timestamps, not just eyeballing screenshots — the class
was already gone within ~500ms of the click, correlating exactly with the phase's
near-instant `consequence → exploring` flip.

**Fix:** two independent lifetimes, chosen by the caller via `persistent`:
- **Non-persistent (bubble, the default)** — `showCaption` starts a `setTimeout` using
  `appConfig.timing.captionMinVisibleMs` (new, default 4500ms, env
  `VITE_CAPTION_MIN_VISIBLE_MS`) that calls `clearCaption()` when it fires; a new call
  resets the timer. This is the actual floor on how long a line stays up — deliberately
  decoupled from the underlying phase, which is not a reliable duration signal.
- **Persistent (stage-object dialogs)** — no timer at all; the dialog staying open *is*
  the "still speaking" condition, so it's cleared explicitly instead, from `closeDialog()`
  in `main.ts`, when the player actually dismisses the dialog.
- The old per-render `captionSpoken` boolean + blanket `clearCaption()` at the end of
  `renderGameView` was **removed entirely** — it was the bug, not a redundant guard.

- **Callers:** `GameView.ts`'s companion-bubble render — `showCaption(companionName,
  companionLine)` (non-persistent) — and `renderDialogOverlay` — `showCaption(speaker,
  pageText, true)` (persistent), once per page. `screens.ts`'s check-in `renderResult()`
  — `showCaption(companionName, lineText, true)` (persistent; added 2026-07-23, see below)
  — is the third caller. `main.ts`'s `closeDialog()` calls `clearCaption()` directly, and
  `renderResult()`'s "Start" button does the same before `onDone(result)`. `main.ts`'s
  `navigate()` still calls `clearCaption()` whenever leaving the game screen entirely,
  alongside the pre-existing `stopSpeaking()` call.
- **Not captioned on purpose:** the decision/discuss-prompt read-aloud scripts
  (`buildOverlayScript`, `discussPrompt`) — TTS-only accessibility narration of content
  that's already fully visible as structured UI (a heading + option buttons), not a
  single natural "character says X" line.
- **Verified in-browser** (Chrome automation, `MutationObserver`-timestamped, not just
  screenshots): the bubble caption's `visible` class was added immediately and held for
  the full ~4.5s window before auto-clearing; the dialog caption held past 7s while the
  dialog stayed open and cleared the instant "Done" was clicked.
- **Re-verified 2026-07-21** after a second "still not showing" report (this time paired
  with the bottom-center reposition): `localStorage.clear()` + full reload, instrumented
  *before* the first click so the whole session was captured, replayed all the way from
  landing through onboarding to a fresh decision. Both the scene-opening companion line
  and the decision's consequence line captioned correctly in sequence at the new position,
  confirmed by both the instrumented timestamps and a direct screenshot at the caption's
  new location — not just one cherry-picked example this time.
- **Third gap, closed 2026-07-23:** the check-in results screen (`screens.ts`) was never
  wired up at all — it's a separate screen from `GameView.ts`, which the original caption
  work never touched. User reported it as "the wording that comes after the initial
  questionnaire." Fixed by adding `renderResult()` as a third caller (persistent, cleared
  on "Start"). Verified in-browser: answered the check-in (one typed answer to reach a
  live/heuristic-scored result), confirmed the caption showed the exact placement
  line, held for the full ~23s of manual interaction with no premature timeout (proving
  the persistent path, not the timer path, fired), and cleared the instant "Start" was
  clicked with no stale text carrying into gameplay.

## `childrenScreen.ts`

- `renderChildren(container, onContinue, onSignOut)` — the post-login parent screen
  (`main.ts`'s `"children"` `AppScreen`, reached after sign-in/sign-up, or directly from
  landing if already authenticated). Lists child profiles (`GET /api/children`), an
  add-child form (name ≤30 chars, age band select) → `POST /api/children` → refetch,
  generic **Continue** → hub (`onContinue()`, no name), **Sign Out** → `signOut()` then
  `onSignOut()`. **2026-07-20:** each child row also has its own **"Play as {name}"**
  button (`onContinue(child.display_name)`) — `onContinue`'s signature is now
  `(childName?: string) => void`. This is the one place a real child name enters
  `gameState.profile.childDisplayName` (`main.ts`'s `"children"` case sets it before
  navigating), which the check-in's LLM greeting (see `safety-companion-pipeline.md`) uses
  to address the child by name — without it, every session defaults to the hardcoded
  placeholder `"Nova"` from `createInitialGameState`.

## `auth.ts` (rewritten 2026-07-20 for Supabase Auth — ADR-003)

- Wraps `@supabase/supabase-js` (`src/lib/supabase.ts`, dynamically imported so it never
  loads on the guest/demo golden path — see bundle-size note in
  [server-auth-supabase.md](./server-auth-supabase.md)). No more custom JWT or localStorage
  session — supabase-js owns its own session storage; this module keeps a **sync** token/user
  cache (`initAuth()` hydrates it via `getSession()` + subscribes to `onAuthStateChange`) so
  existing sync callers (`getToken()` — companion client bearer, Play Together auth check)
  don't need to become async.
- `initAuth()` — call once at boot (skipped in demo mode); also purges the legacy
  `trunorth_token`/`trunorth_user` localStorage keys from the pre-Supabase auth.
- `getToken()` / `getUser()` / `isAuthenticated()` — sync reads of the cache.
- `signIn(email, password)` / `signUp(email, password) → {needsEmailConfirm}` / `signOut()` —
  async, delegate to Supabase Auth; all throw/no-op gracefully when Supabase is unconfigured.
- `hashPin(pin)` / `verifyPin(pin, hash)` — unchanged, SHA-256 via WebCrypto, used by the
  parent gate (a separate local PIN mechanism, not part of the Supabase migration).
