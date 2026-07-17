# UI screens & game view

**Sources:** `trunorth/src/ui/GameView.ts`, `trunorth/src/ui/screens.ts`, `trunorth/src/ui/auth.ts`

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
    `consequence`/`awaitingCompanion`.
  - Collectible ✨ sparks (`data-collectible-id`), clickable dashed `trigger-zone` buttons while
    `exploring`, narration bar, "…is reflecting with you" indicator during `awaitingCompanion`.
  - Calls `onWorldReady(viewport, scene, exploring)` so `worldRuntime.attach` can take over movement.
  - Counselor side panel (`buildCounselorPanel`) during exploring/decision/consequence.
  - Decision overlay (`renderDecisionOverlay`) during `decision`/`encounter`.
- `renderDecisionOverlay` (private) — modal dialog. Together Mode is a two-step machine:
  step 1 "Talk together" shows `discussPrompt(dpId)` + ready button; step 2 shows the prompt,
  optional parent-reflection textarea, choice buttons, and (for `typed`/`both` DPs) a textarea +
  "Say it" submit.
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
  `apiLogin`/`apiRegister`, stores session via `setSession`.
- `renderOnboarding(container, onComplete)` — 3 steps: companion archetype
  (dragon/fox/sprite), companion name (default from `appConfig.defaults`), avatar skin tone;
  returns collected profile data.
- `renderScenarioHub(container, completedChapters, playMode, onSelectSolo, onSelectTogether, onParentCoach, onBack)` —
  child scenario cards (done/together badges, age + minutes) from `SCENARIOS` (now 2:
  ch2 Singing Bridge, ch1 Everbright Meadow); thumbnails are grid canvases
  (`createGridThumbnail`) when the start scene binds a `gridMapId`, PNG zone thumbs
  otherwise; parent-audience card wired to the PIN-gated coach corner.
- `isAuthenticated()` / `logout()` — thin wrappers over `auth.ts` (currently unused by callers).
- Local `type Screen = landing|login|register|dashboard` — **"dashboard" is not an `AppScreen`
  in `main.ts`, which is one of the open typecheck errors.**

## `auth.ts`

- `AuthSession { token, user }`; session persisted in `localStorage["trunorth_session"]`.
- `getToken` / `setSession` / `clearSession` — session helpers.
- `apiRegister(email, password)` / `apiLogin(email, password)` — POST to
  `{VITE_API_URL}/api/auth/*`, throw server `error` message on failure.
- `hashPin(pin)` / `verifyPin(pin, hash)` — SHA-256 via WebCrypto, used by the parent gate.
