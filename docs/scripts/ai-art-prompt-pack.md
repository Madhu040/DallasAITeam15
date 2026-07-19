# TruNorth — AI art prompt pack

Copy-friendly prompts for **Nano Banana** (Gemini 2.5 Flash Image) or **Midjourney**, covering
every character, background, and object the game references. Interactive version with one-click
copy: published as a private artifact (ask Madhu for the link).

> **Attach the Style Bible to the front of every prompt.** The interactive version does this
> automatically; when copying from this file, paste the Style Bible first, then the specific
> prompt.
>
> **Tools:** Nano Banana for characters (it keeps the same character across expressions);
> Midjourney for backgrounds/objects (`--ar`, `--sref` are Midjourney-only — delete them for
> Nano Banana). **Provenance:** log tool + prompt + date per final image → this is the ADR-005
> record (owner/art decision).

---

## 0 · The Style Bible — prepend to everything

```
Clean 2D cartoon illustration for a children's educational game, ages 5-7. Soft rounded
shapes, thick clean dark outlines, warm flat colors with gentle soft shading, cozy
storybook feel, friendly and non-scary, high readability, bright and hopeful. Cohesive
consistent style, simple and uncluttered.
```

---

## 1 · Characters — Nano Banana

Generate the neutral version first, then use the follow-up line to get the other expressions
*as the same character* (spec §17B.3 wants three states each; the avatar also needs 5 skin tones).

### Flicker — the worried little dragon (the star)
```
A small friendly cartoon dragon named Flicker. Chubby round body, bright red scales, soft
golden-yellow belly, tiny stubby wings, small curved horns, big gentle expressive eyes.
Lovable and a little anxious, never scary. Full body, front view, standing, centered, plain
flat white background, no text.
```
**Then:** "Same dragon, exact same design — three versions side by side: 1) calm neutral, 2) worried and anxious, 3) happy with a soft warm glow."

### Nova — the player avatar
```
A cheerful cartoon child explorer named Nova, about 7 years old, wearing a purple explorer
shirt and a small backpack, dark skin, black hair with a headband, warm friendly smile. Full
body, front view, standing, centered, plain flat white background, no text.
```
**Then:** "Same child, same outfit and pose — give me 5 versions with different skin tones, light to deep."

### Wize — the owl mentor
```
A wise, gentle cartoon owl named Wize. Rounded brown body, soft feathers, big friendly
spectacled eyes, calm and kind expression, a caring mentor character. Full body, front view,
standing, centered, plain flat white background, no text.
```

### Jamie — the shy, left-out friend
```
A sweet shy cartoon rabbit child named Jamie, soft white fur, wearing a gentle pink outfit,
big hopeful eyes, sitting slightly hunched and a little lonely but sweet and approachable.
Full body, front view, centered, plain flat white background, no text.
```
**Then:** "Same rabbit — a second version smiling and happy, standing up."

### Deer — the gentle helper
```
A gentle young cartoon deer with soft brown fur, small rounded antlers, big kind calm eyes,
friendly standing pose. Full body, front view, centered, plain flat white background, no text.
```

### Grown-up — the park helper
```
A warm, approachable cartoon grown-up park helper, simple casual clothes, kind reassuring
smile, welcoming open posture, safe and trustworthy. Full body, front view, centered, plain
flat white background, no text.
```

### Worry Cloud — anxiety, made gentle
```
A small soft grey cartoon storm cloud with a gentle worried little face, rounded and fluffy,
a bit sad but NOT scary or threatening, sympathetic. Centered, plain flat white background,
no text.
```
**Careful:** this represents a 5-year-old's anxiety — soft and huggable, never frightening.

### Alternate companions — fox & sprite (onboarding options)
```
Two friendly cartoon companion creatures for a kids' game, side by side, same style: 1) a
soft orange fox cub with a fluffy tail and bright kind eyes; 2) a tiny glowing forest sprite
with gentle wings and a warm friendly face. Full body, front view, plain flat white
background, no text.
```

---

## 2 · Backgrounds — Midjourney

Top-down cozy-game view, no characters. Generate **Everbright Meadow first**, take its
`--sref` code, and add it to the other four so the whole world matches.

### Everbright Meadow (Ch.1 — the showcase ground)
```
Top-down bird's-eye view of a sunny green meadow for a cozy adventure game. A winding dirt
path, a small blue pond with reeds and a soft reflection, scattered round friendly trees,
patches of wildflowers, a little wooden bench, soft rolling grass. Warm morning light, no
characters, no text, no UI. --ar 16:9
```

### Forest of Questions (Ch.2 w1–w2)
```
Top-down bird's-eye view of a soft magical forest for a cozy kids' game. Tall friendly
rounded trees, dappled warm light through the canopy, a gentle winding path, small wooden
signposts, a sense of gentle curiosity. No characters, no text, no UI. --ar 16:9
```

### Meadow of Curiosity (Ch.2 w3–w4)
```
Top-down bird's-eye view of a bright wildflower meadow for a cozy kids' game. Oversized
colorful blooms, fluttering butterflies, a gentle little stream, soft grass, a warm sense of
wonder and discovery. No characters, no text, no UI. --ar 16:9
```

### Cave of Purpose (Ch.2 w5)
```
Top-down bird's-eye view of a warm glowing crystal cave for a cozy kids' game. Soft purple
and gold light, friendly glowing crystals, gentle rounded stalactites, a safe cozy inviting
interior — magical, never dark or scary. No characters, no text, no UI. --ar 16:9
```

### Mountain Festival (Ch.2 w6–w7)
```
Top-down bird's-eye view of a festive mountaintop at dusk for a cozy kids' game. Warm glowing
lanterns, colorful bunting, a small stage, celebration lights, a gentle starry sky, joyful
and warm. No characters, no text, no UI. --ar 16:9
```

---

## 3 · Objects & props — Midjourney

Generate as sheets, cut each item out. Add the same `--sref` code as the backgrounds.

### Meadow objects — sheet A
```
A set of small cartoon game objects for a kids' game, arranged in a neat grid on a plain flat
white background, each clearly separated with space around it: a half-made flower crown, a
lonely ball, a small stack of trail stones, a little wooden signpost, a wooden bench, a small
golden bell. Top-down 3/4 view, consistent cozy style, no text. --ar 1:1
```

### Emotional-beat objects — sheet B
```
A set of small cartoon game objects for a kids' game, arranged in a neat grid on a plain flat
white background, each clearly separated: a leafy green bush, a dropped hat, a patch of
flowers with one tall sunflower, an empty woven basket, a broken-apart flower crown, a small
pile of scattered petals, a folded paper note. Top-down 3/4 view, consistent cozy style, no
text. --ar 1:1
```

### Collectibles & rewards
```
A set of small glowing cartoon game reward icons on a plain flat white background, clearly
separated: a sparkling kindness spark (warm golden star-sparkle), a shining Friendship Star
badge, a glowing purple Star Crystal gem, a small blue diamond. Bright, magical,
collectible-looking, consistent cozy style, no text. --ar 1:1
```

### Waypoints — gate, arch, finish, scroll
```
A set of small cartoon game landmark objects on a plain flat white background, clearly
separated: a friendly wooden gate marked as a path forward, a colorful flower-covered
celebration arch, a cheerful checkered finish flag, an old rolled paper scroll. Top-down 3/4
view, consistent cozy style, no text. --ar 1:1
```

---

## 4 · UI & meters — Midjourney (optional, lower priority)

### Skill meter icons
```
A set of three simple round cartoon skill-badge icons for a kids' game, on a plain flat white
background, clearly separated: a warm red heart for Empathy, a calm blue water-wave for Calm,
a bright golden star for Courage. Soft rounded, thick clean outlines, glossy and friendly,
consistent style, no text. --ar 1:1
```

---

## The one rule that makes or breaks this

**Lock the style, then freeze it** (spec §10.1). Generate Flicker and one background first,
get them perfect, then reuse them as the reference for everything else — "same style as
before" in Nano Banana, the same `--sref` code in Midjourney. Skip that and you get 30
mismatched styles that look worse together than the current placeholders. Consistency beats
individual polish.

## Where the finished PNGs go

`trunorth/public/assets/{characters,backgrounds,objects}/` — see that folder's `README.md`
for exact filenames. The game reads them through the `assetRef → file` manifest (spec §10.3)
and falls back to the code-drawn placeholder for any file not yet present, so you can drop
them in one at a time without breaking the offline demo.
