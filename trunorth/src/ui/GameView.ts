import type { DecisionPoint, GameState, Scene, ScenePhase } from "../types/index.js";
import { getDecisionPoint } from "../content/index.js";
import { renderFullBodyCharacter } from "../render/characters.js";
import type { JourneyReflection } from "../counselor/insights.js";
import { discussPrompt } from "../counselor/coPlay.js";
import { zoneFromBackground, zoneForChapter } from "../content/zones.js";
import { isGridDebug, resolveGridLevel } from "../content/gridLevels.js";
import { renderGridBackground } from "../render/gridBackground.js";
import { contentConfig } from "../config/content.js";
import { isSpeechSupported, isVoiceEnabled, setVoiceEnabled, speakLine, stopSpeaking } from "../audio/speech.js";

export interface CounselorPanelData {
  title: string;
  child: string;
  parent: string;
  together?: string;
}

export type CoPlayStep = "discuss" | "choose";

export function renderGameView(
  container: HTMLElement,
  state: GameState,
  scene: Scene | null,
  phase: ScenePhase,
  companionLine: string | null,
  activeDecisionId: string | null,
  counselor: CounselorPanelData | null,
  onChoice: (dpId: string, optionId: string, parentReflection?: string) => void,
  onTyped: (dpId: string, text: string, parentReflection?: string) => void,
  onTrigger: (target: string) => void,
  togetherMode = false,
  coPlayStep: CoPlayStep = "discuss",
  onCoPlayReady?: () => void,
  onWorldReady?: (viewport: HTMLElement, scene: Scene, exploring: boolean) => void,
): void {
  container.innerHTML = "";

  const root = document.createElement("div");
  root.className = "game-root";

  const viewport = document.createElement("div");
  viewport.className = "game-viewport";
  viewport.setAttribute("role", "main");
  viewport.setAttribute("aria-label", "TruNorth game scene");

  if (state.flags.demoMode) {
    const pill = document.createElement("div");
    pill.className = "demo-pill";
    pill.textContent = "Demo Mode";
    viewport.appendChild(pill);
  }

  if (togetherMode) {
    const togetherPill = document.createElement("div");
    togetherPill.className = "together-pill";
    togetherPill.textContent = "Playing Together";
    viewport.appendChild(togetherPill);
  }

  const brownie = document.createElement("div");
  brownie.className = "brownie-counter crystal-counter";
  brownie.setAttribute("aria-label", `Crystals collected: ${state.progress.browniePoints}`);
  brownie.textContent = `💎 ${state.progress.browniePoints}`;
  viewport.appendChild(brownie);

  const gridLevel = scene ? resolveGridLevel(scene) : null;

  const stageTag = document.createElement("div");
  stageTag.className = "stage-tag";
  const zone = scene ? (zoneFromBackground(scene.background) ?? zoneForChapter(scene.chapterId)) : null;
  stageTag.textContent = gridLevel?.name ?? zone?.name ?? "SCENE";
  viewport.appendChild(stageTag);

  const hud = document.createElement("div");
  hud.className = "hud";
  hud.setAttribute("role", "group");
  hud.setAttribute("aria-label", "Skill meters");
  for (const skill of ["empathy", "calm", "courage"] as const) {
    const meter = document.createElement("div");
    meter.className = "meter";
    meter.setAttribute("aria-label", `${skill} level ${state.meters[skill].level}`);
    const icons: Record<string, string> = { empathy: "❤️", calm: "🌊", courage: "⭐" };
    meter.textContent = icons[skill] ?? "●";
    hud.appendChild(meter);
  }
  viewport.appendChild(hud);

  if (isSpeechSupported()) {
    const voiceToggle = document.createElement("button");
    voiceToggle.className = "voice-toggle";
    const syncVoiceToggle = () => {
      const on = isVoiceEnabled();
      voiceToggle.textContent = on ? "🔊" : "🔇";
      voiceToggle.setAttribute("aria-label", on ? "Turn companion voice off" : "Turn companion voice on");
      voiceToggle.setAttribute("aria-pressed", String(on));
    };
    syncVoiceToggle();
    voiceToggle.onclick = () => {
      setVoiceEnabled(!isVoiceEnabled());
      syncVoiceToggle();
    };
    viewport.appendChild(voiceToggle);
  }

  if (scene) {
    const zoneMeta = zoneFromBackground(scene.background) ?? zoneForChapter(scene.chapterId);
    if (gridLevel) {
      renderGridBackground(viewport, gridLevel, isGridDebug());
    } else {
      const bg = document.createElement("div");
      const legacyClass = scene.background.includes("treehouse")
        ? "treehouse"
        : scene.background.includes("classroom")
          ? "classroom"
          : scene.background.includes("playground")
            ? "playground"
            : "";
      bg.className = `scene-bg zone-${zoneMeta.id}${legacyClass ? ` ${legacyClass}` : ""}`;
      bg.style.backgroundImage = `url(${zoneMeta.image})`;
      viewport.appendChild(bg);
    }

    const sign = document.createElement("div");
    sign.className = "zone-sign";
    sign.textContent = gridLevel?.name ?? zoneMeta.name;
    viewport.appendChild(sign);

    for (const ch of scene.characters) {
      const el = document.createElement("div");
      el.className = "character full-body";
      el.dataset.charId = ch.id;
      const [x, y] = ch.position;
      el.style.left = `${(x / 1920) * 100}%`;
      el.style.top = `${(y / 1080) * 100}%`;
      el.style.zIndex = String(10 + Math.floor(y / 20));
      el.style.setProperty("--char-size", ch.id === "worry_cloud" ? "120" : "110");

      const sprite = document.createElement("div");
      sprite.className = `char-fullbody ${ch.id}${
        ch.expression?.includes("glow") || ch.expression?.includes("excited") ? " glow" : ""
      }`;
      sprite.innerHTML = renderFullBodyCharacter({
        id: ch.id,
        assetRef: ch.assetRef,
        expression: ch.expression,
        skinTone: state.profile.avatar.skinTone,
        companionArchetype: state.profile.companionArchetype,
        size: ch.id === "worry_cloud" ? 120 : 110,
      });
      el.appendChild(sprite);

      const label = document.createElement("div");
      label.className = "char-label";
      label.textContent =
        ch.id === "companion"
          ? state.profile.companionName
          : ch.id === "avatar"
            ? "You"
            : ch.id === "wize"
              ? "Wize"
              : ch.id === "leftout"
                ? "Friend"
                : ch.id === "hothead"
                  ? "Friend"
                  : ch.id === "grownup"
                    ? "Grown-up"
                    : ch.id === "helper_bear"
                      ? "Bear"
                      : ch.id === "helper_deer"
                        ? "Deer"
                        : ch.id === "worry_cloud"
                          ? ""
                          : ch.id === "robin"
                            ? "Fox"
                            : ch.id.charAt(0).toUpperCase() + ch.id.slice(1);
      if (label.textContent) el.appendChild(label);

      if (companionLine && ch.id === "companion" && (phase === "consequence" || phase === "awaitingCompanion")) {
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.textContent = companionLine;
        el.appendChild(bubble);
      }

      viewport.appendChild(el);
    }

    for (const item of scene.collectibles) {
      const spark = document.createElement("div");
      spark.className = "world-collectible";
      spark.dataset.collectibleId = item.id;
      spark.style.left = `${(item.position[0] / 1920) * 100}%`;
      spark.style.top = `${(item.position[1] / 1080) * 100}%`;
      spark.setAttribute("aria-label", "Kindness spark");
      spark.textContent = "✨";
      viewport.appendChild(spark);
    }

    if (phase === "exploring") {
      for (const trigger of scene.triggers) {
        const zone = document.createElement("button");
        zone.className = "trigger-zone";
        zone.dataset.target = trigger.target;
        zone.setAttribute("aria-label", "Interact with hot spot");
        const [x, y, w, h] = trigger.bounds;
        zone.style.left = `${(x / 1920) * 100}%`;
        zone.style.top = `${(y / 1080) * 100}%`;
        zone.style.width = `${(w / 1920) * 100}%`;
        zone.style.height = `${(h / 1080) * 100}%`;
        zone.onclick = () => onTrigger(trigger.target);
        viewport.appendChild(zone);
      }
    }

    if (scene.narration) {
      const narr = document.createElement("div");
      narr.className = "narration-bar";
      narr.textContent = scene.narration;
      viewport.appendChild(narr);
    }

    onWorldReady?.(viewport, scene, phase === "exploring");
  }

  if (phase === "awaitingCompanion") {
    const thinking = document.createElement("div");
    thinking.className = "companion-thinking";
    thinking.textContent = `${state.profile.companionName} is reflecting with you...`;
    viewport.appendChild(thinking);
  }

  root.appendChild(viewport);

  if (counselor && (phase === "consequence" || phase === "decision" || phase === "exploring")) {
    root.appendChild(buildCounselorPanel(counselor));
  }

  container.appendChild(root);

  if ((phase === "decision" || phase === "encounter") && activeDecisionId) {
    renderDecisionOverlay(
      container,
      activeDecisionId,
      onChoice,
      onTyped,
      togetherMode,
      coPlayStep,
      onCoPlayReady,
    );
  } else {
    lastSpokenOverlayKey = null;
  }
}

/** Re-renders happen on every phase/meter update; only read each pop-up aloud once. */
let lastSpokenOverlayKey: string | null = null;

function speakOverlayOnce(key: string, text: string): void {
  if (lastSpokenOverlayKey === key) return;
  lastSpokenOverlayKey = key;
  speakLine(text);
}

function buildCounselorPanel(counselor: CounselorPanelData): HTMLElement {
  const panel = document.createElement("aside");
  panel.className = "counselor-panel";
  panel.setAttribute("aria-label", "Counselor insight");
  panel.innerHTML = `
    <div class="counselor-badge">SEL Coach Insight</div>
    <h3>${escapeText(counselor.title)}</h3>
    <p class="counselor-child"><strong>For you:</strong> ${escapeText(counselor.child)}</p>
    ${counselor.parent ? `<p class="counselor-parent"><strong>For grown-ups:</strong> ${escapeText(counselor.parent)}</p>` : ""}
    ${counselor.together ? `<p class="counselor-together"><strong>Try together:</strong> ${escapeText(counselor.together)}</p>` : ""}
    <p class="counselor-note">Supportive guidance — not a clinical diagnosis.</p>
  `;
  return panel;
}

function escapeText(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderDecisionOverlay(
  container: HTMLElement,
  decisionId: string,
  onChoice: (dpId: string, optionId: string, parentReflection?: string) => void,
  onTyped: (dpId: string, text: string, parentReflection?: string) => void,
  togetherMode = false,
  coPlayStep: CoPlayStep = "discuss",
  onCoPlayReady?: () => void,
): void {
  const dp = getDecisionPoint(decisionId);
  if (!dp) return;

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", togetherMode ? "Talk and choose together" : "Make a choice");

  const panel = document.createElement("div");
  panel.className = "choice-panel";

  if (togetherMode && coPlayStep === "discuss") {
    const badge = document.createElement("div");
    badge.className = "coplay-badge";
    badge.textContent = "Step 1 · Talk together";
    panel.appendChild(badge);

    const discuss = document.createElement("p");
    discuss.className = "coplay-discuss";
    discuss.textContent = discussPrompt(decisionId);
    panel.appendChild(discuss);

    const ready = document.createElement("button");
    ready.className = "btn-primary coplay-ready";
    ready.textContent = "We're ready to choose";
    ready.onclick = () => {
      stopSpeaking();
      onCoPlayReady?.();
    };
    panel.appendChild(ready);

    overlay.appendChild(panel);
    container.appendChild(overlay);
    speakOverlayOnce(`${decisionId}:discuss`, discussPrompt(decisionId));
    return;
  }

  if (togetherMode) {
    const badge = document.createElement("div");
    badge.className = "coplay-badge";
    badge.textContent = "Step 2 · Pick together";
    panel.appendChild(badge);
  }

  const title = document.createElement("h2");
  title.textContent = dp.prompt;
  panel.appendChild(title);

  let parentNote: HTMLTextAreaElement | null = null;
  if (togetherMode) {
    parentNote = document.createElement("textarea");
    parentNote.className = "typed-input coplay-parent-note";
    parentNote.placeholder = "Parent: what did you notice? (optional)";
    parentNote.setAttribute("aria-label", "Parent reflection");
    parentNote.rows = 2;
    panel.appendChild(parentNote);
  }

  if (dp.options) {
    for (const opt of dp.options) {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = opt.label;
      btn.onclick = () => {
        stopSpeaking();
        onChoice(decisionId, opt.id, parentNote?.value.trim() || undefined);
      };
      panel.appendChild(btn);
    }
  }

  if (dp.inputMode === "typed" || dp.inputMode === "both") {
    const input = document.createElement("textarea");
    input.className = "typed-input";
    input.placeholder = togetherMode ? "Type what you'd say together..." : "Type what you'd say...";
    input.setAttribute("aria-label", "Type your response");
    input.rows = 2;
    panel.appendChild(input);

    const submit = document.createElement("button");
    submit.className = "typed-submit";
    submit.textContent = "Say it";
    submit.onclick = () => {
      const text = input.value.trim();
      if (text) {
        stopSpeaking();
        onTyped(decisionId, text, parentNote?.value.trim() || undefined);
      }
    };
    panel.appendChild(submit);
  }

  overlay.appendChild(panel);
  container.appendChild(overlay);
  speakOverlayOnce(`${decisionId}:choose`, buildOverlayScript(dp));
}

/** Spoken version of a decision pop-up: the prompt, then each option in order. */
function buildOverlayScript(dp: DecisionPoint): string {
  const parts: string[] = [dp.prompt];
  if (dp.options && dp.options.length > 0) {
    const ordinals = ["First choice", "Second choice", "Third choice", "Fourth choice"];
    parts.push("Your choices are:");
    dp.options.forEach((opt, i) => {
      parts.push(`${ordinals[i] ?? `Choice ${i + 1}`}: ${opt.label}.`);
    });
  }
  if (dp.inputMode === "typed" || dp.inputMode === "both") {
    parts.push(dp.options?.length ? "Or type your own answer." : "Type what you would say.");
  }
  return parts.join(" ");
}

export function renderCelebration(
  container: HTMLElement,
  chapterTitle: string,
  onReflect: () => void,
  onHub: () => void,
): void {
  container.innerHTML = "";
  const overlay = document.createElement("div");
  overlay.className = "overlay celebration-overlay";
  const celeb = document.createElement("div");
  celeb.className = "celebration mountain-celebration";
  const celebCfg = contentConfig.celebration;
  celeb.style.backgroundImage = `url(${celebCfg.backgroundImage})`;
  celeb.innerHTML = `
    <div class="celebration-content">
      <div class="celebration-trophy">${escapeText(celebCfg.trophyLabel)}</div>
      <h1>${escapeText(celebCfg.title)}</h1>
      <p class="celebration-zone">${escapeText(chapterTitle)}</p>
      <p class="celebration-lessons"><strong>Today Flicker learned:</strong> “${escapeText(celebCfg.flickerLesson)}”</p>
      <p class="celebration-lessons"><strong>Today you learned:</strong> “${escapeText(celebCfg.playerLesson)}”</p>
      <ul class="achievement-checklist">
        ${contentConfig.achievementChecklist.map((item) => `<li>✓ ${item}</li>`).join("")}
      </ul>
      <p class="celebration-quote">${escapeText(celebCfg.quote)}</p>
    </div>
  `;

  const reflectBtn = document.createElement("button");
  reflectBtn.className = "btn-primary";
  reflectBtn.style.maxWidth = "260px";
  reflectBtn.style.margin = "0 auto 10px";
  reflectBtn.textContent = "See counselor insights";
  reflectBtn.onclick = onReflect;
  celeb.appendChild(reflectBtn);

  const hubBtn = document.createElement("button");
  hubBtn.className = "btn-secondary";
  hubBtn.style.maxWidth = "260px";
  hubBtn.style.margin = "0 auto";
  hubBtn.textContent = "Back to scenarios";
  hubBtn.onclick = onHub;
  celeb.appendChild(hubBtn);

  overlay.appendChild(celeb);
  container.appendChild(overlay);
}

export function renderJourneyReflection(
  container: HTMLElement,
  reflection: JourneyReflection,
  onContinue: () => void,
): void {
  container.innerHTML = "";
  const surface = document.createElement("div");
  surface.className = "parent-surface reflection-surface";

  const card = document.createElement("div");
  card.className = "parent-card reflection-card";
  card.innerHTML = `
    <div class="counselor-badge">Journey Reflection</div>
    <h1>How this adventure went</h1>
    <p>${escapeText(reflection.summary)}</p>
    <h3>Strengths noticed</h3>
    <ul>${reflection.strengths.map((s) => `<li>${escapeText(s)}</li>`).join("")}</ul>
    <h3>Growth edges</h3>
    <ul>${reflection.growthEdges.map((s) => `<li>${escapeText(s)}</li>`).join("")}</ul>
    <h3>Step-by-step insights</h3>
  `;

  for (const step of reflection.stepInsights) {
    const block = document.createElement("div");
    block.className = "insight-block";
    block.innerHTML = `
      <h4>${escapeText(step.title)}</h4>
      <p><strong>Child:</strong> ${escapeText(step.forChild)}</p>
      <p><strong>Parent coaching:</strong> ${escapeText(step.forParent)}</p>
      <p class="practice"><strong>Try at home:</strong> ${escapeText(step.practiceTip)}</p>
    `;
    card.appendChild(block);
  }

  const coaching = document.createElement("div");
  coaching.innerHTML = `<h3>Parent coach notes</h3><ul>${reflection.parentCoaching.map((c) => `<li>${escapeText(c)}</li>`).join("")}</ul>
    <p class="counselor-note">${escapeText(reflection.closingNote)}</p>`;
  card.appendChild(coaching);

  const btn = document.createElement("button");
  btn.className = "btn-primary";
  btn.textContent = "Return to scenario hub";
  btn.onclick = onContinue;
  card.appendChild(btn);

  surface.appendChild(card);
  container.appendChild(surface);
}

export function renderParentGate(
  container: HTMLElement,
  onPass: () => void,
  onFail: () => void,
): void {
  container.innerHTML = "";
  const surface = document.createElement("div");
  surface.className = "parent-surface";

  const card = document.createElement("div");
  card.className = "parent-card";
  card.innerHTML = `
    <h1>Parent Gate</h1>
    <p>Enter the 4-digit PIN to open parent tools and reflections.</p>
  `;

  const storedHash = localStorage.getItem("trunorth_pin_hash");
  let fails = 0;

  const input = document.createElement("input");
  input.type = "password";
  input.maxLength = 4;
  input.pattern = "[0-9]{4}";
  input.placeholder = "••••";
  input.style.cssText = "width:100%;padding:12px;font-size:24px;text-align:center;letter-spacing:8px;border-radius:8px;border:1px solid #555;background:#2d3142;color:white;margin-bottom:12px;";
  card.appendChild(input);

  const error = document.createElement("div");
  error.className = "error-msg";
  card.appendChild(error);

  const btn = document.createElement("button");
  btn.className = "btn-primary";
  btn.textContent = "Unlock";
  btn.onclick = async () => {
    if (!storedHash) {
      const hash = await import("./auth.js").then((m) => m.hashPin(input.value));
      localStorage.setItem("trunorth_pin_hash", hash);
      onPass();
      return;
    }
    const valid = await import("./auth.js").then((m) => m.verifyPin(input.value, storedHash));
    if (valid) {
      onPass();
    } else {
      fails++;
      error.textContent = `Incorrect PIN (${fails}/3)`;
      if (fails >= 3) {
        error.textContent = "Too many attempts. Please wait.";
        btn.disabled = true;
        setTimeout(() => { btn.disabled = false; fails = 0; error.textContent = ""; }, 30000);
        onFail();
      }
    }
  };
  card.appendChild(btn);

  surface.appendChild(card);
  container.appendChild(surface);
}

export function renderTrustScreen(container: HTMLElement, onContinue: () => void): void {
  container.innerHTML = "";
  const surface = document.createElement("div");
  surface.className = "parent-surface";
  const card = document.createElement("div");
  card.className = "parent-card";
  card.innerHTML = `
    <h1>Trust & Safety</h1>
    <p>TruNorth is designed with your child's safety in mind:</p>
    <ul style="color:#b0b3c0;line-height:1.8;margin-bottom:20px;padding-left:20px;">
      <li>The companion is a fixed character — no open chat</li>
      <li>Counselor-style insights are SEL coaching, not clinical therapy</li>
      <li>No real-world meetups or personal info collection</li>
      <li>All AI calls are server-side — no API keys in the browser</li>
      <li>If something feels really hard, a trusted grown-up can help</li>
    </ul>
  `;
  const btn = document.createElement("button");
  btn.className = "btn-primary";
  btn.textContent = "I understand — continue";
  btn.onclick = onContinue;
  card.appendChild(btn);
  surface.appendChild(card);
  container.appendChild(surface);
}
