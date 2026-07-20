# Art assets

Drop your generated PNGs here using these exact filenames. The game reads them through
the asset manifest (`src/content/assetManifest.ts`); until a file exists, the code-drawn
sprite / emoji placeholder is used, so the offline demo never breaks if a file is missing.

**Rules**
- PNG, transparent background for characters and objects; backgrounds can be opaque.
- Keep each file small (< ~300 kB) — the CI bundle budget (`npm run audit:bundle`) enforces it.
- Never delete a placeholder path from the code; the manifest falls back to it.

## characters/  (transparent PNG, front-facing full body)
flicker.png            flicker-worried.png     flicker-happy.png
nova-light-fair.png … nova-deep-brown.png   ← the Explorer, one per skin tone (see below)
wize.png   jamie.png   deer.png   grownup.png   worry-cloud.png
companion-fox.png      companion-sprite.png

### The Explorer (avatar) — 5 skin tones
The child picks 1 of 5 skin tones at onboarding, so the avatar needs one PNG per tone
(a single fixed PNG would erase that choice). `AVATAR_FILES` in `assetManifest.ts` maps
each tone to its file — keep these names in sync with that map:

    tone_1  #f5d0b0 (light / fair)          nova-light-fair.png
    tone_2  #e0ac69 (light tan)             nova-light-tan.png
    tone_3  #8d5524 (medium brown)          nova-warm-medium.png        ← onboarding default
    tone_4  #6b3f1f (medium-dark brown)     nova-warm-medium-brown.png
    tone_5  #4a2c14 (deep brown)            nova-deep-brown.png

#### Canonical design — the five must be the *same child*

**Locked:** plain **purple** headband · **no backpack, no props, no badges** · purple
long-sleeve shirt · blue trousers · brown shoes. Nothing varies between the five except
skin tone (and hair shade following it naturally).

Purple + no-backpack is canon because it's what most of the set already is, and because at
the in-world sprite size (~110px tall) fine props like a compass badge don't read anyway —
they just make the child look like a different person each time the tone changes.

**Current set vs. canon** (`npm run test:unit` guards tone order/spread, not accessories):

| file | tone | status |
|---|---|---|
| `nova-light-fair.png` | tone_1 | ✅ on canon — keep |
| `nova-light-tan.png` | tone_2 | ❌ green headband **+ backpack & compass** — regenerate |
| `nova-warm-medium.png` | tone_3 | ✅ on canon — keep |
| `nova-warm-medium-brown.png` | tone_4 | ❌ blue headband — regenerate (and go darker, below) |
| `nova-deep-brown.png` | tone_5 | ❌ backpack & compass — regenerate (and go darker, below) |

⚠️ **Also push the deep end darker.** Measured face tones run luminance 202 → 181 → 152 →
130 → **100**. The palette these represent goes down to `#4a2c14` (≈45), so the set is
compressed toward light and the darkest tones are under-served — which matters, because
representation is the entire reason there are five. Aim tone_4 near `#6b3f1f` and tone_5
near `#4a2c14` rather than the current medium browns.

**Nano Banana / Midjourney prompt** — run once per tone, changing **only** the bracketed
skin phrase. Reuse the same `--seed` (or a character reference) so it stays one child:

> A cheerful young explorer child named Nova, full body head-to-toe, standing front-facing
> with a friendly confident smile. Plain purple long-sleeve shirt, a thin plain purple
> headband, blue trousers, simple brown shoes. **No backpack, no bag, no compass, no badges,
> no props of any kind — empty hands.** Soft painted 2D storybook cartoon style, gentle
> cel-shading, warm lighting, rounded proportions, big friendly eyes — a children's
> picture-book look for ages 5–7, matching a set of storybook animal characters.
> **Skin tone: [light fair #f5d0b0 | light tan #e0ac69 | medium brown #8d5524 |
> medium-dark brown #6b3f1f | deep brown #4a2c14]**, with hair shade following naturally.
> Centered with a little padding, plain flat background, clean edges for a transparent
> cutout. No text, no watermark.

Export each transparent (or on plain white, then cut out), tight-cropped like the other
characters. After dropping files in, run `npm run test:unit` — `tests/unit/avatarTones.test.ts`
fails if the tones stop darkening in order, sit too close together, drift lighter at the deep
end, or lose their alpha. To add or re-point a tone, edit `AVATAR_FILES` in
`src/content/assetManifest.ts`; an unmapped tone (or a file that fails to load) falls back to
the tone-aware SVG.

## backgrounds/  (16:9, opaque)
everbright-meadow.png  forest-of-questions.png  meadow-of-curiosity.png
cave-of-purpose.png    mountain-festival.png

## objects/  (transparent PNG, one per file — cut out from the Midjourney sheets)
flower-crown.png  ball.png  trail-stones.png  signpost.png  bench.png  bell.png
bush.png  dropped-hat.png  flower-patch.png  basket.png  broken-crown.png
petals.png  note.png  gate.png  arch.png  finish-flag.png  scroll.png
