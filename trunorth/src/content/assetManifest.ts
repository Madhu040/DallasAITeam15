/**
 * Art asset manifest — `assetRef` → real art file (spec §10.3).
 *
 * The game is authored against code-drawn placeholders (the SVG cast in
 * `src/render/characters.ts`, the emoji props in `src/content/stageObjects.ts`, the
 * canvas grid in `src/render/gridBackground.ts`). This manifest names the AI-generated
 * PNGs that *replace* those placeholders when they exist. Every lookup returns `null`
 * when there is no art, and the renderers additionally restore the placeholder if an
 * `<img>` fails to load — so the offline demo (`?demo=1`) never breaks on a missing or
 * broken file. That fallback is the whole point of routing art through one manifest.
 *
 * Deliberate omissions (kept on their placeholders on purpose):
 *   • `avatar` — the protagonist sprite is redrawn per the child's chosen skin tone
 *     (`profile.avatar.skinTone`, a real 5-way onboarding choice). A single fixed PNG
 *     (`nova.png`) would erase that choice for every child, so the avatar stays on the
 *     tone-aware SVG until per-tone art (`nova-tone1…5`) exists.
 *   • `singing-bridge`, `pond` — no art generated yet.
 *
 * All other characters are tight, background-removed cutouts (verified RGBA with
 * transparent corners, portrait bounding boxes) and are mapped below — including the deer,
 * whose earlier opaque-box export was re-cut 2026-07-19.
 *
 * Files live under `public/assets/{characters,backgrounds,objects}/` and are served at
 * `/assets/...`, matching the existing zone-image convention in `config/content.ts`.
 */

import { resolveCharacterKey, type CharacterId } from "../render/characters.js";

function assetPath(rel: string): string {
  return `/assets/${rel}`;
}

/**
 * Resolved character key → transparent full-body PNG. Keys are the same `CharacterId`
 * the SVG renderer switches on, so PNG and placeholder are always chosen for the same
 * character. `avatar` and `helper_deer` are intentionally absent (see file header).
 */
const CHARACTER_FILES: Partial<Record<CharacterId, string>> = {
  companion_dragon: "characters/flicker.png",
  companion_fox: "characters/companion-fox.png",
  companion_sprite: "characters/companion-sprite.png",
  wize: "characters/wize.png",
  grownup: "characters/grownup.png",
  worry_cloud: "characters/worry-cloud.png",
  helper_deer: "characters/deer.png",
  // Jamie, the left-out friend in Ch.1, resolves to the helper_rabbit key.
  helper_rabbit: "characters/jamie.png",
};

/** `assetRef` → cut-out prop PNG. Unlisted refs keep their emoji (`objectSprite`). */
const OBJECT_FILES: Record<string, string> = {
  flower_crown: "objects/flower-crown.png",
  play_ball: "objects/ball.png",
  trail_marker: "objects/trail-stones.png",
  sign_post: "objects/signpost.png",
  bell: "objects/bell.png",
  bush: "objects/bush.png",
  dropped_hat: "objects/dropped-hat.png",
  flower_patch: "objects/flower-patch.png",
  basket: "objects/basket.png",
  broken_crown: "objects/broken-crown.png",
  petals: "objects/petals.png",
  note: "objects/note.png",
  arch: "objects/arch.png",
  finish_flag: "objects/finish-flag.png",
  notice_scroll: "objects/scroll.png",
  bench: "objects/bench.png",
  gate: "objects/gate.png",
  // deer_friend intentionally absent — deer.png is an opaque box; keep the 🦌 emoji.
};

/** Grid-level id → 16:9 background PNG. Ids match `LEVEL_BUILDERS` in `gridLevels.ts`. */
const BACKGROUND_FILES: Record<string, string> = {
  "everbright-meadow": "backgrounds/everbright-meadow.png",
  "forest-of-questions": "backgrounds/forest-of-questions.png",
  "meadow-of-curiosity": "backgrounds/meadow-of-curiosity.png",
  "cave-of-purpose": "backgrounds/cave-of-purpose.png",
  "mountain-festival": "backgrounds/mountain-festival.png",
  // singing-bridge intentionally absent — no art yet; falls back to the canvas grid.
};

/** Full-body character art for a scene character, or `null` to use the SVG placeholder. */
export function characterImageUrl(
  id: string,
  assetRef?: string,
  companionArchetype?: string,
): string | null {
  const key = resolveCharacterKey(id, assetRef, companionArchetype);
  const file = CHARACTER_FILES[key];
  return file ? assetPath(file) : null;
}

/** Cut-out prop art for a stage object, or `null` to use the emoji placeholder. */
export function objectImageUrl(assetRef: string): string | null {
  const file = OBJECT_FILES[assetRef];
  return file ? assetPath(file) : null;
}

/** Background art for a grid level, or `null` to use the canvas grid. */
export function backgroundImageUrl(gridLevelId: string): string | null {
  const file = BACKGROUND_FILES[gridLevelId];
  return file ? assetPath(file) : null;
}
