import type { GameState, Scene, SceneCollectible } from "../types/index.js";

/**
 * Kindness Sparks — the replayable micro-loop (spec §7.6).
 *
 * The problem this solves: Chapter 1 shipped with **one** collectible across six scenes,
 * so every scene was walk-to-trigger → answer → next scene. That reads as a quiz, not a
 * world. §7.1 asks for brownie points scattered for "immediate, low-stakes fun", and §7.6
 * asks for a few of them to sit behind kind actions or exploration.
 *
 * Two rules from the spec that shape everything here:
 *
 * - **Never required to progress.** A child who beelines to the decision still finishes the
 *   chapter with the full experience. Sparks are optional delight, never a gate.
 * - **Not maxed on a first play.** The celebration shows "you found 4 of 6" precisely so a
 *   second run is "find what I missed" — intrinsic motivation, not "play again".
 */

/** Has this decision point been resolved in the `strong` band? */
function resolvedStrongly(state: GameState, decisionPointId: string): boolean {
  return state.eventLog.some(
    (e) => e.decisionPointId === decisionPointId && e.scoreBand === "strong",
  );
}

/**
 * The sparks currently visible in a scene. Ungated sparks are always present; gated ones
 * appear only once their kind action has happened (§7.6).
 */
export function visibleSparks(scene: Scene, state: GameState): SceneCollectible[] {
  return scene.collectibles.filter((c) => !c.gate || resolvedStrongly(state, c.gate));
}

/** Total sparks discoverable in a chapter — the denominator in "found 4 of 6". */
export function chapterSparkTotal(scenes: Scene[], chapterId: string): number {
  return scenes
    .filter((s) => s.chapterId === chapterId)
    .reduce((total, s) => total + s.collectibles.length, 0);
}

/** How many the child actually found in this chapter. */
export function chapterSparksFound(
  scenes: Scene[],
  chapterId: string,
  state: GameState,
): number {
  const sceneIds = new Set(scenes.filter((s) => s.chapterId === chapterId).map((s) => s.id));
  let found = 0;
  for (const [sceneId, ids] of Object.entries(state.progress.kindnessSparksFound)) {
    if (sceneIds.has(sceneId)) found += ids.length;
  }
  return found;
}
