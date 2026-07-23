/**
 * Persistent on-screen captions for spoken lines (the companion's speech bubble text,
 * NPC/companion stage-object dialog pages) — a visual channel independent of the TTS
 * voice toggle (`src/audio/speech.ts`), so a session with voice off, or a player who
 * can't hear it, still sees what's being "said."
 *
 * Lives outside the `#app` container: every screen fully replaces `#app`'s contents on
 * render (`container.innerHTML = ""`), so a node appended there would be torn down on
 * the very next re-render. This element is appended once, lazily, directly to
 * `document.body` instead, and just has its text updated/cleared from then on.
 */

import { appConfig } from "../config/app.js";

let el: HTMLDivElement | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function ensureElement(): HTMLDivElement {
  if (!el) {
    el = document.createElement("div");
    el.id = "speech-captions";
    el.className = "speech-captions";
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  return el;
}

function clearHideTimer(): void {
  if (hideTimer !== null) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

/**
 * Show (or update) the caption. `speaker` is prefixed when given (e.g. dialog NPCs).
 *
 * `persistent` (default false) controls how the caption disappears:
 *  - `false` (the companion speech bubble) — the underlying game phase that triggers a
 *    bubble is transient (`consequence`/`awaitingCompanion` can flip to `exploring` within
 *    a single render pass — see `SceneEngine.resolveDecision`), far too fast for a caption
 *    to actually be read if it were tied 1:1 to that phase. Instead it auto-hides after a
 *    fixed minimum readable duration, reset on every new line.
 *  - `true` (stage-object dialog pages) — the dialog stays open until the player
 *    dismisses it, so there is a real, checkable "still speaking" condition; the caller
 *    clears it explicitly when the dialog actually closes instead of on a timer.
 */
export function showCaption(
  speaker: string | undefined | null,
  text: string,
  persistent = false,
): void {
  if (!text.trim()) {
    clearCaption();
    return;
  }
  const node = ensureElement();
  node.textContent = speaker ? `${speaker}: ${text}` : text;
  node.classList.add("visible");

  clearHideTimer();
  if (!persistent) {
    hideTimer = setTimeout(clearCaption, appConfig.timing.captionMinVisibleMs);
  }
}

export function clearCaption(): void {
  clearHideTimer();
  el?.classList.remove("visible");
}
