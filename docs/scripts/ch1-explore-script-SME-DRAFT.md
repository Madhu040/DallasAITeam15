# Chapter 1 — new script for SME / Vandy review

> **Status: SME DRAFT — not approved.** Every line below is child-facing and is gated by
> spec §8.6 ("no chapter locks until the SME reviews scenarios, option bands, coaching
> lines, and the typed rubric"). None of it should reach a real child before sign-off.
>
> **Audience:** ages 5–7. **Companion:** Flicker (the dragon).
> **What changed:** Chapter 1 used to be walk-to-a-hitbox → answer a question. Each scene
> now opens with a spoken goal, and has 2–4 things the child can walk to and examine.
> What they find gives them the context for the decision, so the choice is reached by
> understanding rather than by bumping into a trigger.
>
> **What to review:** is the language right for a 5-year-old? Does the emotional framing
> hold? Is anything leading, shaming, or clinical? Does Flicker ever claim to know what the
> child feels rather than describing what he sees?

---

## How the loop reads in play

1. Flicker says the goal out loud on arrival.
2. The child walks around and examines things (each worth a point; finding everything pays a bonus).
3. What they learn sets up the decision.
4. The decision plays as before.

---

## Scene e1 — Someone is sitting alone

**Flicker's opening line (the goal):**

> I heard someone sniffling over by the bench. Let's look around and figure out who it is.

**Things the child can find and examine:**

### A half-made flower crown
*Object id:* `obj_flower_crown` · *dialog:* `dlg_flower_crown`

> **Flicker (1/2):** Someone was weaving this... and then just stopped. The petals are still fresh.

> **Flicker (2/2):** Whoever made it wanted to give it to somebody, I think.

### A ball, sitting still
*Object id:* `obj_lonely_ball` · *dialog:* `dlg_lonely_ball`

> **Flicker (1/2):** A ball nobody's throwing. That's a pretty lonely sound — nothing at all.

> **Flicker (2/2):** Everyone ran off to play something else. Someone got left behind.

### The deer is watching something
*Object id:* `obj_deer_tracks` · *dialog:* `dlg_deer_tracks`

> **Deer (1/2):** The deer says the new kid — Jamie — has been sitting by the bench since morning.

> **Deer (2/2):** Nobody's said hello yet. Not once, all day.

### obj_meadow_sign
*Object id:* `obj_meadow_sign` · *dialog:* `dlg_meadow_welcome`

> **Flicker (1/2):** Welcome to Everbright Meadow! This signpost marks the start of our adventure. See the trail? It winds past the pond and up to the North Gate.

> **Flicker (2/2):** If you ever spot someone sitting alone, it's worth a closer look. A little kindness goes a long way out here.

**Then the decision:** `dp_leftout_bench` *(existing copy, unchanged)*

---

## Scene e2 — The trail north

**Flicker's opening line (the goal):**

> The trail heads north from here. Let's see what's along the way before we go.

**Things the child can find and examine:**

### The pond's edge
*Object id:* `obj_pond_edge` · *dialog:* `dlg_pond_edge`

> **Flicker (1/2):** Look at the water — you and Jamie, side by side.

> **Flicker (2/2):** An hour ago there was only one of you in that reflection.

### Stacked stones
*Object id:* `obj_trail_stones` · *dialog:* `dlg_trail_stones`

> **Flicker (1/2):** Someone stacked these to show the way for whoever came next.

> **Flicker (2/2):** Kindness leaves a trail too. You just left one.

---

## Scene e2a — A shy friend

**Flicker's opening line (the goal):**

> Someone's hiding nearby, and they seem scared. Let's find them — gently.

**Things the child can find and examine:**

### A rustling bush
*Object id:* `obj_hiding_bush` · *dialog:* `dlg_hiding_bush`

> **Flicker (1/2):** The leaves keep moving. Someone's tucked in there, holding very still.

> **Flicker (2/2):** They're not hiding from us. I think they're hiding from being seen at all.

### A dropped hat
*Object id:* `obj_dropped_hat` · *dialog:* `dlg_dropped_hat`

> **Flicker (1/2):** A hat, dropped in a hurry. Someone left somewhere fast.

> **Flicker (2/2):** Running away from a crowd usually means the crowd felt too big.

**Then the decision:** `dp_reassure_shy` *(existing copy, unchanged)*

---

## Scene e2b — The last flower

**Flicker's opening line (the goal):**

> Everyone's been gathering flowers. Let's find out what's left before we pick.

**Things the child can find and examine:**

### The flower patch
*Object id:* `obj_flower_patch` · *dialog:* `dlg_flower_patch`

> **Flicker (1/2):** One sun-flower left in the whole patch. Just the one.

> **Flicker (2/2):** Two of you want it. That's the tricky part, isn't it?

### An empty basket
*Object id:* `obj_empty_basket` · *dialog:* `dlg_empty_basket`

> **Flicker (1/2):** Someone's basket, still empty. They waited their turn and missed out.

> **Flicker (2/2):** Waiting politely doesn't always work out. Somebody has to notice.

**Then the decision:** `dp_share_flower` *(existing copy, unchanged)*

---

## Scene e2c — The crown comes apart

**Flicker's opening line (the goal):**

> Something got knocked over back here. Let's find out what happened.

**Things the child can find and examine:**

### The flower crown, come apart
*Object id:* `obj_broken_crown` · *dialog:* `dlg_broken_crown`

> **Flicker (1/2):** Oh no — the crown. It's come apart at the seam.

> **Flicker (2/2):** Accidents happen fast. What comes next is the part you choose.

### Scattered petals
*Object id:* `obj_scattered_petals` · *dialog:* `dlg_scattered_petals`

> **Flicker (1/2):** Petals everywhere. Someone's heart sank right here.

> **Flicker (2/2):** The petals can be gathered up. So can the feeling, mostly.

**Then the decision:** `dp_repair_oops` *(existing copy, unchanged)*

---

## Scene e3 — Asking a grown-up

**Flicker's opening line (the goal):**

> This one feels too big for just us. Let's find a grown-up who can help.

**Things the child can find and examine:**

### A little bell
*Object id:* `obj_help_bell` · *dialog:* `dlg_help_bell`

> **Flicker (1/2):** A bell for when you need a grown-up. Someone put it here on purpose.

> **Flicker (2/2):** Ringing it isn't giving up. It's knowing what you need.

### A note on the bench
*Object id:* `obj_bench_note` · *dialog:* `dlg_bench_note`

> **Flicker (1/2):** The note says: 'Back soon — ask anyone if you need me.'

> **Flicker (2/2):** Grown-ups leave notes like that because they WANT to be asked.

**Then the decision:** `dp_ask_grownup` *(existing copy, unchanged)*

---

## Chapter 1 celebration screen

Previously this screen showed **Chapter 2's** text — a child who finished Chapter 1 was
congratulated for "Inspected a worry-flower" and "Took festival steps while nervous", about
a character who was not in the chapter. This is the replacement copy.

**Trophy:** 🌟 Friendship Star

> **Today Flicker learned:** "I watched you make room for someone who felt left out. That took a kind heart."
>
> **Today you learned:** "I can notice when someone feels alone — and do something about it."

**Achievements listed:**

- Invited Jamie to play
- Helped a shy friend feel braver
- Took turns instead of keeping it all
- Said sorry and helped fix it
- Asked a grown-up for help
- Earned a Friendship Star

**Closing line:**

> "Being kind isn't something you are. It's something you do, one moment at a time."

*Note: this line was written deliberately to avoid identity-framing — §9.8 forbids telling a
child who they **are** ("you're so kind", "that's your superpower") because it lands as
pressure. It describes the action instead. Please check it still reads warmly.*

---

## Also needing sign-off (carried from earlier work)

| Copy | Where | Status |
|---|---|---|
| Distress re-entry lines | `src/counselor/checkin.ts` — `RESUME_DISTRESS` | 🔒 SME draft |
| The 3 newer Ch.1 decision points | `dp_reassure_shy`, `dp_share_flower`, `dp_repair_oops` | 🔒 SME draft |
| Ch.2 narrative | The Little Dragon Who Wouldn't Stop Guarding | 🔒 SME draft |
| API-failure line | "My words got a little tangled — let me try that again!" | 🔒 SME draft |

---

## Open questions for the SME

1. **Flicker's voice on the discoveries.** He currently interprets what he sees ("Someone's
   heart sank right here"). Is that the right level of narration for 5–7, or should he stay
   more descriptive and let the child draw the conclusion?
2. **The deer speaks in e1.** It's the only non-companion voice in the discoveries. Keep,
   or move that line to Flicker for consistency?
3. **"Accidents happen fast. What comes next is the part you choose."** (e2c) — is this too
   close to instructing the child what the lesson is before they've made the choice?
4. **Age-band check.** Sentence length and vocabulary are aimed at 5–7. Flag anything too
   advanced.
