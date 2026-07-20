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

**Keep the five visually identical apart from skin tone** — same outfit, same accessories.
The first set drifted (headband colour varies purple/green/blue, and 2 of the 5 gained a
green backpack + compass the others don't have), which reads as a different child per tone
rather than the same child. Regenerate with a fixed seed / character reference to tighten.

**Nano Banana / Midjourney prompt** — run once per tone, changing only the skin phrase,
and keep the same character/style so it's clearly the same kid (in Midjourney reuse the
same `--seed`, or use "same character" refs):

> A cheerful young explorer child named Nova, full body head-to-toe, standing front-facing
> with a friendly confident smile. Purple long-sleeve shirt with a thin headband, blue
> trousers, simple shoes. Soft painted 2D storybook cartoon style, gentle cel-shading,
> warm lighting, rounded proportions, big friendly eyes — a children's picture-book look
> for ages 5–7, matching a set of storybook animal characters. **Skin tone: <light fair |
> light tan | medium brown | medium-dark brown | deep brown>.** Centered with a little
> padding, plain flat background, clean edges for a transparent cutout. No text, no watermark.

Export each transparent (or on plain white, then cut out), tight-cropped like the other
characters. To add or re-point a tone, edit `AVATAR_FILES` in `src/content/assetManifest.ts`;
an unmapped tone (or a file that fails to load) falls back to the tone-aware SVG.

## backgrounds/  (16:9, opaque)
everbright-meadow.png  forest-of-questions.png  meadow-of-curiosity.png
cave-of-purpose.png    mountain-festival.png

## objects/  (transparent PNG, one per file — cut out from the Midjourney sheets)
flower-crown.png  ball.png  trail-stones.png  signpost.png  bench.png  bell.png
bush.png  dropped-hat.png  flower-patch.png  basket.png  broken-crown.png
petals.png  note.png  gate.png  arch.png  finish-flag.png  scroll.png
