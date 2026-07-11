/** Full-body illustrated characters (SVG) for TruNorth scenes */

export type CharacterId =
  | "avatar"
  | "companion_fox"
  | "companion_sprite"
  | "robin"
  | "leftout"
  | "hothead"
  | "grownup"
  | "worry_cloud";

export type ExpressionKey = "neutral" | "worried" | "happy" | "glow" | "sad" | "calm";

const SKIN: Record<string, string> = {
  tone_1: "#f5d0b0",
  tone_2: "#e0ac69",
  tone_3: "#c68642",
  tone_4: "#8d5524",
  tone_5: "#5c3317",
};

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
    case "companion_fox":
      return foxSvg(expr, size);
    case "companion_sprite":
      return spriteSvg(expr, size);
    case "robin":
      return robinSvg(expr, size);
    case "leftout":
      return kidSvg(expr, size, "#6c9bcf", "#2b4c7e");
    case "hothead":
      return kidSvg(expr, size, "#e76f51", "#9b2226");
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
  if (id === "companion" || assetRef?.includes("companion")) {
    return archetype === "companion_sprite" ? "companion_sprite" : "companion_fox";
  }
  if (id === "robin" || assetRef?.includes("robin")) return "robin";
  if (id === "leftout" || assetRef?.includes("leftout")) return "leftout";
  if (id === "hothead" || assetRef?.includes("hothead")) return "hothead";
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
    <circle cx="${cx - 6}" cy="${cy}" r="2.2" fill="#2d2d2d"/>
    <circle cx="${cx + 6}" cy="${cy}" r="2.2" fill="#2d2d2d"/>
    <path d="M${cx - 10} ${browY} Q${cx - 6} ${browY - (expr === "worried" ? 3 : 0)} ${cx - 2} ${browY}" fill="none" stroke="#2d2d2d" stroke-width="1.5"/>
    <path d="M${cx + 2} ${browY} Q${cx + 6} ${browY - (expr === "worried" ? 3 : 0)} ${cx + 10} ${browY}" fill="none" stroke="#2d2d2d" stroke-width="1.5"/>
    ${mouth}
  `;
}

function avatarSvg(expr: string, size: number, skin: string): string {
  const glow = expr === "happy" ? `<circle cx="50" cy="50" r="48" fill="#e9c46a" opacity="0.25"/>` : "";
  return `<svg viewBox="0 0 100 160" width="${size}" height="${size * 1.6}" aria-hidden="true">
    ${glow}
    <!-- legs -->
    <rect x="32" y="118" width="12" height="32" rx="6" fill="#3d5a80"/>
    <rect x="56" y="118" width="12" height="32" rx="6" fill="#3d5a80"/>
    <ellipse cx="38" cy="152" rx="10" ry="5" fill="#264653"/>
    <ellipse cx="62" cy="152" rx="10" ry="5" fill="#264653"/>
    <!-- body -->
    <rect x="28" y="70" width="44" height="52" rx="14" fill="#457b9d"/>
    <rect x="34" y="78" width="32" height="20" rx="6" fill="#a8dadc" opacity="0.5"/>
    <!-- arms -->
    <rect x="12" y="74" width="16" height="36" rx="8" fill="${skin}"/>
    <rect x="72" y="74" width="16" height="36" rx="8" fill="${skin}"/>
    <!-- head -->
    <circle cx="50" cy="42" r="26" fill="${skin}"/>
    <ellipse cx="50" cy="22" rx="28" ry="14" fill="#2d2d2d"/>
    <path d="M22 38 Q20 20 50 14 Q80 20 78 38" fill="#2d2d2d"/>
    ${face(expr, 50, 44)}
  </svg>`;
}

function foxSvg(expr: string, size: number): string {
  const glow = expr === "happy" ? `<circle cx="50" cy="70" r="46" fill="#e9c46a" opacity="0.3"/>` : "";
  return `<svg viewBox="0 0 100 160" width="${size}" height="${size * 1.6}" aria-hidden="true">
    ${glow}
    <!-- tail -->
    <ellipse cx="18" cy="100" rx="14" ry="28" fill="#e76f51" transform="rotate(-25 18 100)"/>
    <ellipse cx="18" cy="88" rx="6" ry="10" fill="#faf8f5" transform="rotate(-25 18 88)"/>
    <!-- legs -->
    <rect x="34" y="120" width="10" height="28" rx="5" fill="#c45c26"/>
    <rect x="56" y="120" width="10" height="28" rx="5" fill="#c45c26"/>
    <ellipse cx="39" cy="150" rx="8" ry="4" fill="#264653"/>
    <ellipse cx="61" cy="150" rx="8" ry="4" fill="#264653"/>
    <!-- body -->
    <ellipse cx="50" cy="95" rx="28" ry="34" fill="#f4a261"/>
    <ellipse cx="50" cy="102" rx="16" ry="20" fill="#faf8f5"/>
    <!-- arms -->
    <ellipse cx="22" cy="88" rx="10" ry="18" fill="#e76f51"/>
    <ellipse cx="78" cy="88" rx="10" ry="18" fill="#e76f51"/>
    <!-- head -->
    <ellipse cx="50" cy="42" rx="28" ry="26" fill="#f4a261"/>
    <polygon points="28,28 22,4 42,20" fill="#f4a261"/>
    <polygon points="72,28 78,4 58,20" fill="#f4a261"/>
    <polygon points="30,24 26,10 38,20" fill="#faf8f5"/>
    <polygon points="70,24 74,10 62,20" fill="#faf8f5"/>
    <ellipse cx="50" cy="52" rx="12" ry="10" fill="#faf8f5"/>
    ${face(expr, 50, 42)}
  </svg>`;
}

function spriteSvg(expr: string, size: number): string {
  return `<svg viewBox="0 0 100 160" width="${size}" height="${size * 1.6}" aria-hidden="true">
    <ellipse cx="50" cy="150" rx="20" ry="6" fill="#7ec8a3" opacity="0.35"/>
    <path d="M50 70 Q20 90 30 130 Q50 110 70 130 Q80 90 50 70" fill="#b8f2e6"/>
    <circle cx="50" cy="55" r="28" fill="#7ec8a3"/>
    <circle cx="50" cy="55" r="20" fill="#e8fff8"/>
    ${face(expr, 50, 55)}
    <circle cx="20" cy="40" r="4" fill="#e9c46a"/>
    <circle cx="80" cy="50" r="3" fill="#e9c46a"/>
    <circle cx="30" cy="90" r="3" fill="#e9c46a"/>
  </svg>`;
}

function robinSvg(expr: string, size: number): string {
  return `<svg viewBox="0 0 100 160" width="${size}" height="${size * 1.6}" aria-hidden="true">
    <!-- legs -->
    <rect x="40" y="118" width="6" height="28" rx="3" fill="#e9c46a"/>
    <rect x="54" y="118" width="6" height="28" rx="3" fill="#e9c46a"/>
    <ellipse cx="43" cy="148" rx="8" ry="4" fill="#264653"/>
    <ellipse cx="57" cy="148" rx="8" ry="4" fill="#264653"/>
    <!-- body -->
    <ellipse cx="50" cy="90" rx="26" ry="32" fill="#e63946"/>
    <ellipse cx="50" cy="98" rx="16" ry="18" fill="#f4a261"/>
    <!-- wing -->
    <ellipse cx="28" cy="88" rx="12" ry="22" fill="#9b2226"/>
    <ellipse cx="72" cy="88" rx="12" ry="22" fill="#9b2226"/>
    <!-- head -->
    <circle cx="50" cy="42" r="24" fill="#e63946"/>
    <polygon points="72,42 88,46 72,50" fill="#e9c46a"/>
    ${face(expr, 48, 42)}
  </svg>`;
}

function kidSvg(expr: string, size: number, shirt: string, pants: string): string {
  return `<svg viewBox="0 0 100 160" width="${size}" height="${size * 1.6}" aria-hidden="true">
    <rect x="34" y="118" width="10" height="30" rx="5" fill="${pants}"/>
    <rect x="56" y="118" width="10" height="30" rx="5" fill="${pants}"/>
    <ellipse cx="39" cy="150" rx="9" ry="4" fill="#264653"/>
    <ellipse cx="61" cy="150" rx="9" ry="4" fill="#264653"/>
    <rect x="30" y="72" width="40" height="50" rx="12" fill="${shirt}"/>
    <rect x="14" y="76" width="14" height="34" rx="7" fill="#e0ac69"/>
    <rect x="72" y="76" width="14" height="34" rx="7" fill="#e0ac69"/>
    <circle cx="50" cy="42" r="24" fill="#e0ac69"/>
    <ellipse cx="50" cy="24" rx="26" ry="12" fill="#3d3d3d"/>
    ${face(expr, 50, 44)}
  </svg>`;
}

function grownupSvg(expr: string, size: number): string {
  return `<svg viewBox="0 0 100 170" width="${size}" height="${size * 1.7}" aria-hidden="true">
    <rect x="34" y="120" width="12" height="36" rx="6" fill="#264653"/>
    <rect x="54" y="120" width="12" height="36" rx="6" fill="#264653"/>
    <ellipse cx="40" cy="158" rx="10" ry="5" fill="#1a1a2e"/>
    <ellipse cx="60" cy="158" rx="10" ry="5" fill="#1a1a2e"/>
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
    <ellipse cx="40" cy="40" rx="28" ry="20" fill="#adb5bd" opacity="${opacity}"/>
    <ellipse cx="70" cy="36" rx="32" ry="24" fill="#ced4da" opacity="${opacity}"/>
    <ellipse cx="95" cy="42" rx="20" ry="16" fill="#adb5bd" opacity="${opacity}"/>
  </svg>`;
}
