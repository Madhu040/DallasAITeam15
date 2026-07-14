/** Full-body illustrated characters (SVG) — TruNorth concept art style */

export type CharacterId =
  | "avatar"
  | "companion_dragon"
  | "companion_fox"
  | "companion_sprite"
  | "robin"
  | "leftout"
  | "hothead"
  | "grownup"
  | "worry_cloud"
  | "helper_bear"
  | "helper_fox"
  | "helper_rabbit"
  | "helper_deer"
  | "wize";

export type ExpressionKey = "neutral" | "worried" | "happy" | "glow" | "sad" | "calm";

const SKIN: Record<string, string> = {
  tone_1: "#f5d0b0",
  tone_2: "#e0ac69",
  tone_3: "#8d5524",
  tone_4: "#6b3f1f",
  tone_5: "#4a2c14",
};

const PURPLE = "#7b2cbf";
const PURPLE_DARK = "#5a189a";
const GOLD = "#ffd60a";
const FLICKER_RED = "#c1121f";
const FLICKER_DARK = "#780000";
const FLICKER_BELLY = "#ffba08";
const WIZE_BROWN = "#6b4226";
const WIZE_CREAM = "#f5e6d3";
const WIZE_GOLD = "#d4a373";

function expressionOffset(expr?: string): string {
  if (expr?.includes("worried") || expr?.includes("sad")) return "worried";
  if (expr?.includes("glow") || expr?.includes("excited") || expr?.includes("relieved") || expr?.includes("happy")) return "happy";
  if (expr?.includes("calm")) return "calm";
  return "neutral";
}

export function renderFullBodyCharacter(opts: {
  id: string;
  assetRef?: string;
  expression?: string;
  skinTone?: string;
  companionArchetype?: string;
  size?: number;
}): string {
  const expr = expressionOffset(opts.expression);
  const size = opts.size ?? 140;
  const key = resolveCharacterKey(opts.id, opts.assetRef, opts.companionArchetype);

  switch (key) {
    case "companion_dragon":
      return dragonSvg(expr, size);
    case "wize":
      return wizeSvg(expr, size);
    case "companion_fox":
      return foxSvg(expr, size);
    case "companion_sprite":
      return spriteSvg(expr, size);
    case "helper_bear":
      return bearSvg(expr, size);
    case "helper_fox":
      return helperFoxSvg(expr, size);
    case "helper_rabbit":
      return rabbitSvg(expr, size);
    case "helper_deer":
      return deerSvg(expr, size);
    case "robin":
      return robinSvg(expr, size);
    case "leftout":
      return rabbitSvg(expr, size);
    case "hothead":
      return bearSvg(expr, size);
    case "grownup":
      return grownupSvg(expr, size);
    case "worry_cloud":
      return cloudSvg(expr, size);
    case "avatar":
    default:
      return avatarSvg(expr, size, SKIN[opts.skinTone ?? "tone_3"] ?? SKIN.tone_3);
  }
}

function resolveCharacterKey(id: string, assetRef?: string, archetype?: string): CharacterId {
  if (id === "worry_cloud" || assetRef?.includes("worry")) return "worry_cloud";
  if (id === "wize" || assetRef?.includes("wize")) return "wize";
  if (id === "companion" || assetRef?.includes("companion")) {
    if (archetype === "companion_dragon") return "companion_dragon";
    return archetype === "companion_sprite" ? "companion_sprite" : "companion_fox";
  }
  if (id === "helper_bear" || assetRef?.includes("bear")) return "helper_bear";
  if (id === "helper_fox" || assetRef?.includes("helper_fox")) return "helper_fox";
  if (id === "helper_rabbit" || assetRef?.includes("rabbit")) return "helper_rabbit";
  if (id === "helper_deer" || assetRef?.includes("deer")) return "helper_deer";
  if (id === "robin" || assetRef?.includes("robin")) return "robin";
  if (id === "leftout" || assetRef?.includes("leftout")) return "helper_rabbit";
  if (id === "hothead" || assetRef?.includes("hothead")) return "helper_bear";
  if (id === "grownup" || assetRef?.includes("grownup")) return "grownup";
  if (id === "avatar" || assetRef?.includes("avatar")) return "avatar";
  return "avatar";
}

function face(expr: string, cx: number, cy: number): string {
  const browY = expr === "worried" ? cy - 6 : cy - 4;
  const mouth =
    expr === "happy" || expr === "glow"
      ? `<path d="M${cx - 6} ${cy + 8} Q${cx} ${cy + 14} ${cx + 6} ${cy + 8}" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>`
      : expr === "worried" || expr === "sad"
        ? `<path d="M${cx - 6} ${cy + 12} Q${cx} ${cy + 6} ${cx + 6} ${cy + 12}" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>`
        : `<line x1="${cx - 5}" y1="${cy + 10}" x2="${cx + 5}" y2="${cy + 10}" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>`;
  return `
    <circle cx="${cx - 6}" cy="${cy}" r="2.5" fill="#2d2d2d"/>
    <circle cx="${cx + 6}" cy="${cy}" r="2.5" fill="#2d2d2d"/>
    <path d="M${cx - 10} ${browY} Q${cx - 6} ${browY - (expr === "worried" ? 3 : 0)} ${cx - 2} ${browY}" fill="none" stroke="#2d2d2d" stroke-width="1.5"/>
    <path d="M${cx + 2} ${browY} Q${cx + 6} ${browY - (expr === "worried" ? 3 : 0)} ${cx + 10} ${browY}" fill="none" stroke="#2d2d2d" stroke-width="1.5"/>
    ${mouth}
  `;
}

/** Protagonist — purple hoodie, star backpack, curly puff hair */
function avatarSvg(expr: string, size: number, skin: string): string {
  const glow = expr === "happy" ? `<circle cx="50" cy="50" r="48" fill="${GOLD}" opacity="0.3"/>` : "";
  return `<svg viewBox="0 0 100 160" width="${size}" height="${size * 1.6}" aria-hidden="true">
    ${glow}
    <rect x="32" y="118" width="12" height="32" rx="6" fill="#3d5a80"/>
    <rect x="56" y="118" width="12" height="32" rx="6" fill="#3d5a80"/>
    <ellipse cx="38" cy="152" rx="10" ry="5" fill="${PURPLE_DARK}"/>
    <ellipse cx="62" cy="152" rx="10" ry="5" fill="${PURPLE_DARK}"/>
    <rect x="28" y="70" width="44" height="52" rx="14" fill="${PURPLE}"/>
    <rect x="34" y="78" width="32" height="18" rx="6" fill="${PURPLE_DARK}" opacity="0.5"/>
    <rect x="68" y="72" width="18" height="44" rx="8" fill="${PURPLE_DARK}"/>
    <circle cx="77" cy="88" r="7" fill="${GOLD}"/>
    <text x="77" y="91" text-anchor="middle" font-size="8" fill="${PURPLE_DARK}">★</text>
    <rect x="12" y="74" width="16" height="36" rx="8" fill="${skin}"/>
    <rect x="72" y="74" width="16" height="36" rx="8" fill="${skin}"/>
    <circle cx="50" cy="42" r="26" fill="${skin}"/>
    <ellipse cx="50" cy="18" rx="22" ry="16" fill="#2d2d2d"/>
    <circle cx="50" cy="14" r="10" fill="#2d2d2d"/>
    <rect x="38" y="8" width="24" height="6" rx="3" fill="${PURPLE}"/>
    ${face(expr, 50, 44)}
  </svg>`;
}

/** Flicker — little red Guardian Dragon with gold belly and sparks */
function dragonSvg(expr: string, size: number): string {
  const glow = expr === "happy" ? `<circle cx="50" cy="70" r="46" fill="${GOLD}" opacity="0.35"/>` : "";
  const sparks =
    expr === "worried"
      ? `<circle cx="18" cy="70" r="3" fill="${GOLD}"/><circle cx="82" cy="66" r="2.5" fill="${GOLD}"/><circle cx="22" cy="90" r="2" fill="#ff6b35"/>`
      : "";
  return `<svg viewBox="0 0 100 160" width="${size}" height="${size * 1.6}" aria-hidden="true">
    ${glow}
    <path d="M8 95 Q4 70 20 60 Q30 80 18 105 Z" fill="#ff9e00" opacity="0.9"/>
    <path d="M92 95 Q96 70 80 60 Q70 80 82 105 Z" fill="#ff9e00" opacity="0.9"/>
    <ellipse cx="50" cy="110" rx="22" ry="28" fill="${FLICKER_RED}"/>
    <ellipse cx="50" cy="118" rx="14" ry="16" fill="${FLICKER_BELLY}"/>
    <circle cx="50" cy="48" r="24" fill="${FLICKER_RED}"/>
    <polygon points="34,32 30,8 44,24" fill="${FLICKER_DARK}"/>
    <polygon points="66,32 70,8 56,24" fill="${FLICKER_DARK}"/>
    <ellipse cx="50" cy="58" rx="10" ry="8" fill="${FLICKER_BELLY}"/>
    ${face(expr, 50, 46)}
    <circle cx="42" cy="100" r="3" fill="${FLICKER_BELLY}"/>
    <circle cx="50" cy="104" r="3" fill="${FLICKER_BELLY}"/>
    <circle cx="58" cy="100" r="3" fill="${FLICKER_BELLY}"/>
    ${sparks}
  </svg>`;
}

/** Wize — gentle mentor owl who glides down from the oak */
function wizeSvg(expr: string, size: number): string {
  return `<svg viewBox="0 0 100 160" width="${size}" height="${size * 1.6}" aria-hidden="true">
    <ellipse cx="50" cy="145" rx="22" ry="6" fill="#3d2914" opacity="0.25"/>
    <path d="M18 70 Q8 50 22 42 Q32 62 24 78 Z" fill="${WIZE_GOLD}" opacity="0.85"/>
    <path d="M82 70 Q92 50 78 42 Q68 62 76 78 Z" fill="${WIZE_GOLD}" opacity="0.85"/>
    <ellipse cx="50" cy="105" rx="26" ry="32" fill="${WIZE_BROWN}"/>
    <ellipse cx="50" cy="112" rx="16" ry="18" fill="${WIZE_CREAM}"/>
    <circle cx="50" cy="48" r="26" fill="${WIZE_BROWN}"/>
    <circle cx="38" cy="46" r="10" fill="${WIZE_CREAM}"/>
    <circle cx="62" cy="46" r="10" fill="${WIZE_CREAM}"/>
    <circle cx="38" cy="46" r="4" fill="#2d2d2d"/>
    <circle cx="62" cy="46" r="4" fill="#2d2d2d"/>
    <polygon points="50,54 44,62 56,62" fill="#e09f3e"/>
    <path d="M28 28 Q38 12 50 22 Q62 12 72 28" fill="none" stroke="${WIZE_GOLD}" stroke-width="3"/>
    ${expr === "happy" || expr === "calm" ? `<path d="M40 68 Q50 74 60 68" fill="none" stroke="#3d3d3d" stroke-width="2" stroke-linecap="round"/>` : ""}
  </svg>`;
}

function bearSvg(expr: string, size: number): string {
  return `<svg viewBox="0 0 100 160" width="${size}" height="${size * 1.6}" aria-hidden="true">
    <ellipse cx="50" cy="130" rx="24" ry="8" fill="#5c4033" opacity="0.3"/>
    <rect x="34" y="118" width="12" height="28" rx="6" fill="#6b4423"/>
    <rect x="54" y="118" width="12" height="28" rx="6" fill="#6b4423"/>
    <ellipse cx="50" cy="92" rx="30" ry="36" fill="#8b5e3c"/>
    <ellipse cx="50" cy="100" rx="18" ry="20" fill="#c49a6c"/>
    <circle cx="28" cy="38" r="12" fill="#8b5e3c"/>
    <circle cx="72" cy="38" r="12" fill="#8b5e3c"/>
    <circle cx="50" cy="44" r="28" fill="#8b5e3c"/>
    <ellipse cx="50" cy="56" rx="14" ry="12" fill="#c49a6c"/>
    <circle cx="50" cy="52" r="5" fill="#5c4033"/>
    ${face(expr, 50, 42)}
  </svg>`;
}

function helperFoxSvg(expr: string, size: number): string {
  return `<svg viewBox="0 0 100 160" width="${size}" height="${size * 1.6}" aria-hidden="true">
    <rect x="34" y="118" width="10" height="28" rx="5" fill="#c45c26"/>
    <rect x="56" y="118" width="10" height="28" rx="5" fill="#c45c26"/>
    <rect x="30" y="78" width="40" height="44" rx="12" fill="#2d6a4f"/>
    <ellipse cx="50" cy="95" rx="18" ry="22" fill="#e76f51"/>
    <ellipse cx="50" cy="42" rx="26" ry="24" fill="#e76f51"/>
    <polygon points="28,28 22,4 42,20" fill="#e76f51"/>
    <polygon points="72,28 78,4 58,20" fill="#e76f51"/>
    <ellipse cx="50" cy="52" rx="12" ry="10" fill="#faf8f5"/>
    ${face(expr, 50, 42)}
  </svg>`;
}

function rabbitSvg(expr: string, size: number): string {
  return `<svg viewBox="0 0 100 160" width="${size}" height="${size * 1.6}" aria-hidden="true">
    <rect x="34" y="118" width="10" height="28" rx="5" fill="#6c757d"/>
    <rect x="56" y="118" width="10" height="28" rx="5" fill="#6c757d"/>
    <rect x="30" y="78" width="40" height="44" rx="12" fill="#f4a6c8"/>
    <ellipse cx="50" cy="95" rx="20" ry="24" fill="#dee2e6"/>
    <ellipse cx="50" cy="48" rx="22" ry="20" fill="#dee2e6"/>
    <ellipse cx="38" cy="12" rx="6" ry="22" fill="#dee2e6"/>
    <ellipse cx="62" cy="12" rx="6" ry="22" fill="#dee2e6"/>
    <ellipse cx="38" cy="14" rx="3" ry="14" fill="#f4a6c8"/>
    <ellipse cx="62" cy="14" rx="3" ry="14" fill="#f4a6c8"/>
    ${face(expr, 50, 50)}
  </svg>`;
}

function deerSvg(expr: string, size: number): string {
  return `<svg viewBox="0 0 100 160" width="${size}" height="${size * 1.6}" aria-hidden="true">
    <rect x="36" y="118" width="8" height="30" rx="4" fill="#a68a64"/>
    <rect x="56" y="118" width="8" height="30" rx="4" fill="#a68a64"/>
    <ellipse cx="50" cy="92" rx="22" ry="30" fill="#c9a66b"/>
    <ellipse cx="50" cy="48" rx="20" ry="18" fill="#c9a66b"/>
    <path d="M36 20 L30 0 M36 20 L42 0 M64 20 L58 0 M64 20 L70 0" stroke="#8b6914" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="50" cy="56" rx="10" ry="8" fill="#f5e6d3"/>
    ${face(expr, 50, 46)}
  </svg>`;
}

function foxSvg(expr: string, size: number): string {
  return helperFoxSvg(expr, size);
}

function spriteSvg(expr: string, size: number): string {
  return dragonSvg(expr, size);
}

function robinSvg(expr: string, size: number): string {
  return helperFoxSvg(expr, size);
}

function kidSvg(expr: string, size: number, shirt: string, pants: string): string {
  return avatarSvg(expr, size, "#c68642");
}

function grownupSvg(expr: string, size: number): string {
  return `<svg viewBox="0 0 100 170" width="${size}" height="${size * 1.7}" aria-hidden="true">
    <rect x="34" y="120" width="12" height="36" rx="6" fill="#264653"/>
    <rect x="54" y="120" width="12" height="36" rx="6" fill="#264653"/>
    <rect x="28" y="70" width="44" height="56" rx="10" fill="#2a9d8f"/>
    <rect x="10" y="74" width="16" height="40" rx="8" fill="#c68642"/>
    <rect x="74" y="74" width="16" height="40" rx="8" fill="#c68642"/>
    <circle cx="50" cy="40" r="26" fill="#c68642"/>
    <path d="M24 36 Q24 12 50 10 Q76 12 76 36" fill="#5c3317"/>
    ${face(expr, 50, 42)}
  </svg>`;
}

function cloudSvg(expr: string, size: number): string {
  const opacity = expr === "happy" ? 0.35 : 0.85;
  return `<svg viewBox="0 0 120 70" width="${size}" height="${size * 0.55}" aria-hidden="true">
    <ellipse cx="40" cy="40" rx="28" ry="20" fill="#9d4edd" opacity="${opacity}"/>
    <ellipse cx="70" cy="36" rx="32" ry="24" fill="#c77dff" opacity="${opacity}"/>
    <ellipse cx="95" cy="42" rx="20" ry="16" fill="#9d4edd" opacity="${opacity}"/>
  </svg>`;
}
