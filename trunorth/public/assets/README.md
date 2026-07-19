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
nova.png               nova-tone1.png … nova-tone5.png
wize.png   jamie.png   deer.png   grownup.png   worry-cloud.png
companion-fox.png      companion-sprite.png

## backgrounds/  (16:9, opaque)
everbright-meadow.png  forest-of-questions.png  meadow-of-curiosity.png
cave-of-purpose.png    mountain-festival.png

## objects/  (transparent PNG, one per file — cut out from the Midjourney sheets)
flower-crown.png  ball.png  trail-stones.png  signpost.png  bench.png  bell.png
bush.png  dropped-hat.png  flower-patch.png  basket.png  broken-crown.png
petals.png  note.png  gate.png  arch.png  finish-flag.png  scroll.png
