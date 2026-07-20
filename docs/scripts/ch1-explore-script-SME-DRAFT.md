# TruNorth — child-facing copy for SME / Vandy review

> **Status: SME DRAFT — not approved.** Every line below is child-facing and is gated by
> spec §8.6 ("no chapter locks until the SME reviews scenarios, option bands, coaching
> lines, and the typed rubric"). None of it should reach a real child before sign-off.
>
> **This file replaces the earlier Ch.1-only version.** It now covers everything written or
> rewritten across the last ~40 hours of work that still needs a first SME pass: all of
> Chapter 1, all of Chapter 2, the personalization pattern, and the cross-cutting
> distress/error copy. Where copy predates this arc and was already reviewed, it's noted as
> such rather than repeated.

---

## Contents

1. [How the loop reads in play](#how-the-loop-reads-in-play)
2. [Personalization — {name} / {companion}](#personalization--name--companion)
3. [Chapter 1 — Everbright Meadow](#chapter-1--everbright-meadow)
4. [Chapter 2 — The Little Dragon Who Wouldn't Stop Guarding](#chapter-2--the-little-dragon-who-wouldnt-stop-guarding)
5. [Cross-cutting: distress, error, and fallback copy](#cross-cutting-distress-error-and-fallback-copy)
6. [Open questions for the SME](#open-questions-for-the-sme)

---

## How the loop reads in play

1. The companion says the goal out loud on arrival (spoken, not a HUD label).
2. The child walks around and examines 2–4 things (each worth a point; finding everything
   pays a bonus).
3. What they learn sets up the decision.
4. The decision plays as before.

**Audience:** ages 5–7 (Ch.1 and Ch.2 both currently target this band — see the open
question on age-band targeting below).

---

## Personalization — {name} / {companion}

Every line below that shows `{name}` or `{companion}` is a live token, not a placeholder to
fill in by hand — the game substitutes the child's own name and their companion's chosen
name at runtime (e.g. a child named Aisha with a dragon named Sparky sees "Hey Aisha —
Sparky's already worried"). If a child skips naming, it falls back to "explorer" / "your
companion" rather than ever showing "undefined."

**What to review:** does the sentence still read naturally in both positions — with a name
inserted, and with the "explorer" / "your companion" fallback?

---

## Chapter 1 — Everbright Meadow

> **Companion:** Flicker (the dragon). **What changed:** Chapter 1 used to be walk-to-a-
> hitbox → answer a question. Each scene now opens with a spoken goal, and has 2–4 things
> the child can walk to and examine. What they find gives them context for the decision, so
> the choice is reached by understanding rather than by bumping into a trigger. Goals were
> also rewritten a second pass to be warmer, spoken aloud, and to use the child's own name.
>
> **What to review:** is the language right for a 5-year-old? Does the emotional framing
> hold? Is anything leading, shaming, or clinical? Does Flicker ever claim to know what the
> child feels rather than describing what he sees?

### Scene e1 — Someone is sitting alone

**Flicker's opening line (the goal):**

> Hey {name} — someone's crying over by the bench. Come on, let's go see if they're okay.

**Things the child can find and examine:**

**A half-made flower crown** — *obj_flower_crown / dlg_flower_crown*
> **Flicker (1/2):** Someone was weaving this... and then just stopped. The petals are still fresh.
> **Flicker (2/2):** Whoever made it wanted to give it to somebody, I think.

**A ball, sitting still** — *obj_lonely_ball / dlg_lonely_ball*
> **Flicker (1/2):** A ball nobody's throwing. That's a pretty lonely sound — nothing at all.
> **Flicker (2/2):** Everyone ran off to play something else. Someone got left behind.

**The deer is watching something** — *obj_deer_tracks / dlg_deer_tracks*
> **Deer (1/2):** The deer says the new kid — Jamie — has been sitting by the bench since morning.
> **Deer (2/2):** Nobody's said hello yet. Not once, all day.

**A meadow signpost** — *obj_meadow_sign / dlg_meadow_welcome*
> **Flicker (1/2):** Welcome to Everbright Meadow! This signpost marks the start of our adventure. See the trail? It winds past the pond and up to the North Gate.
> **Flicker (2/2):** If you ever spot someone sitting alone, it's worth a closer look. A little kindness goes a long way out here.

**Then the decision:** `dp_leftout_bench` *(existing copy, previously reviewed, unchanged)*

---

### Scene e2 — The trail north

**Flicker's opening line (the goal):**

> The trail goes north from here. Let's not rush it — I want to see what's along the way.

**Things the child can find and examine:**

**The pond's edge** — *obj_pond_edge / dlg_pond_edge*
> **Flicker (1/2):** Look at the water — you and Jamie, side by side.
> **Flicker (2/2):** An hour ago there was only one of you in that reflection.

**Stacked stones** — *obj_trail_stones / dlg_trail_stones*
> **Flicker (1/2):** Someone stacked these to show the way for whoever came next.
> **Flicker (2/2):** Kindness leaves a trail too. You just left one.

---

### Scene e2a — A shy friend

**Flicker's opening line (the goal):**

> Someone's hiding out here, {name}, and I think they're scared. Let's go find them — gently.

**Things the child can find and examine:**

**A rustling bush** — *obj_hiding_bush / dlg_hiding_bush*
> **Flicker (1/2):** The leaves keep moving. Someone's tucked in there, holding very still.
> **Flicker (2/2):** They're not hiding from us. I think they're hiding from being seen at all.

**A dropped hat** — *obj_dropped_hat / dlg_dropped_hat*
> **Flicker (1/2):** A hat, dropped in a hurry. Someone left somewhere fast.
> **Flicker (2/2):** Running away from a crowd usually means the crowd felt too big.

**Then the decision:** `dp_reassure_shy` — *new this arc, full text below*

> **Prompt:** "The rabbit friend feels shy about joining. What do you say?"
> - **[strong]** "It's okay to feel shy — let's go together, I'll stay right by you."
> - **[partial]** "Come on, you'll be fine once we start."
> - **[poor]** "Hurry up, everyone is already waiting!"

---

### Scene e2b — The last flower

**Flicker's opening line (the goal):**

> Everyone's been picking flowers here. Let's go see what's left before we take any.

**Things the child can find and examine:**

**The flower patch** — *obj_flower_patch / dlg_flower_patch*
> **Flicker (1/2):** One sun-flower left in the whole patch. Just the one.
> **Flicker (2/2):** Two of you want it. That's the tricky part, isn't it?

**An empty basket** — *obj_empty_basket / dlg_empty_basket*
> **Flicker (1/2):** Someone's basket, still empty. They waited their turn and missed out.
> **Flicker (2/2):** Waiting politely doesn't always work out. Somebody has to notice.

**Then the decision:** `dp_share_flower` — *new this arc, full text below*

> **Prompt:** "You both reach for the last sunflower at the same time. What do you do?"
> - **[strong]** "Let's take turns — you smell it first, then we share it together."
> - **[partial]** "Here, you can have it."
> - **[poor]** "I grabbed it first — it's already mine!"

---

### Scene e2c — The crown comes apart

**Flicker's opening line (the goal):**

> Something got knocked over back here. Come on — let's find out what happened.

**Things the child can find and examine:**

**The flower crown, come apart** — *obj_broken_crown / dlg_broken_crown*
> **Flicker (1/2):** Oh no — the crown. It's come apart at the seam.
> **Flicker (2/2):** Accidents happen fast. What comes next is the part you choose.

**Scattered petals** — *obj_scattered_petals / dlg_scattered_petals*
> **Flicker (1/2):** Petals everywhere. Someone's heart sank right here.
> **Flicker (2/2):** The petals can be gathered up. So can the feeling, mostly.

**Then the decision:** `dp_repair_oops` — *new this arc, full text below*

> **Prompt:** "Oops — you knocked over the deer friend's flower crown by accident. They look sad. What do you do?"
> - **[strong]** "I'm sorry I knocked it over. Can we fix it together?"
> - **[partial]** "Sorry, it was an accident."
> - **[poor]** "It wasn't my fault — you were already too close."

---

### Scene e3 — Asking a grown-up

**Flicker's opening line (the goal):**

> This one feels too big for just us, {name}. Let's go find a grown-up who can help.

**Things the child can find and examine:**

**A little bell** — *obj_help_bell / dlg_help_bell*
> **Flicker (1/2):** A bell for when you need a grown-up. Someone put it here on purpose.
> **Flicker (2/2):** Ringing it isn't giving up. It's knowing what you need.

**A note on the bench** — *obj_bench_note / dlg_bench_note*
> **Flicker (1/2):** The note says: 'Back soon — ask anyone if you need me.'
> **Flicker (2/2):** Grown-ups leave notes like that because they WANT to be asked.

**Then the decision:** `dp_ask_grownup` *(existing copy, previously reviewed; only the scoring
changed — it now scores the "ask for help" skill instead of nothing)*

> **Prompt:** "The grown-up asks if anyone needs help. What do you say?"
> - **[strong]** "Jamie felt left out earlier. We invited them — can you check in too?"
> - **[partial]** "We're fine, thanks!"
> - **[poor]** "Nothing. Don't tell anyone."

---

### Chapter 1 celebration screen

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

## Chapter 2 — The Little Dragon Who Wouldn't Stop Guarding

> **Companion:** Wize (the owl mentor). **Also present:** Flicker — here Flicker is a small,
> anxious Guardian Dragon character *in the story* (distinct from the Ch.1 companion of the
> same name), who physically blocks the path until the golden-path finish. **What's new this
> arc:** each of w1–w6 got a spoken goal + 2 new discovery objects (12 dialogs total, all
> Wize-voiced); w7 got a short goal. This is the same explore→discover→decide treatment Ch.1
> got, applied here for the first time.
>
> **What to review:** does Wize's voice feel distinct from Flicker's (Ch.1)? Is the "worry as
> a companion, not a flaw to fix" framing right for a 5–7 audience? Does any line read as
> minimizing a child's real anxiety?

### Scene w1 — The quest begins

**Wize's opening line (the goal):**

> I'm already nervous and we haven't even started. Stay with me, {name} — let's look around before we decide anything.

**A star-legend scroll** — *obj_star_notice / dlg_star_legend*
> **Wize (1/3):** Ah, a traveler! This old scroll tells the legend of the Star Crystals — five of them, scattered across Everbright, waiting for someone brave enough to gather them.
> **Wize (2/3):** Many explorers bring a Guardian Dragon along. Its worry isn't a flaw — it's a job. The trick is learning when to listen and when to keep walking anyway.
> **Wize (3/3):** When you reach the Sky Festival stage, look back at how far you've come. The crystals shine brightest for the ones who felt nervous and went anyway.

**Fresh tracks in the moss** — *obj_paw_prints / dlg_paw_prints*
> **Wize (1/2):** Someone padded through here not long ago — the moss is still pressed flat.
> **Wize (2/2):** Tracks don't tell you what happened. They just make you wonder. That's a question, not a fear.

**A bush, rustling on its own** — *obj_rustling_bush / dlg_rustling_bush*
> **Wize (1/2):** Something's moving in there. Could be the wind. Could be a rabbit. Could be nothing at all.
> **Wize (2/2):** {companion} wants to guess the scariest answer first. I'd rather go look and let the bush tell us.

**Then the decision:** `dp_quest_start` *(existing DP, predates this arc)*

---

### Scene w2 — The worry cloud

**Wize's opening line (the goal):**

> That worry cloud isn't going anywhere on its own. Come on, let's go see what's actually there.

**A hat, blown off mid-run** — *obj_windblown_hat / dlg_windblown_hat*
> **Wize (1/2):** A little hat, blown off and left behind. Whoever wore it kept walking anyway.
> **Wize (2/2):** Sometimes you lose something small on the way to somewhere new. That's alright.

**A scrap of paper in the branches** — *obj_torn_note / dlg_torn_note*
> **Wize (1/2):** A scrap of paper, caught on a branch. Only one word survived: 'curious.'
> **Wize (2/2):** Maybe someone left it on purpose — a little reminder for whoever walks by next.

**Then the decision:** `dp_investigate` *(existing DP, predates this arc)*

---

### Scene w3 — The worry-flowers

**Wize's opening line (the goal):**

> These worry-flowers look strange up close. Let's go take a proper look, {name} — before I talk us into running.

**Tiny worry-flowers** — *obj_worry_patch / dlg_worry_patch*
> **Wize (1/2):** These flowers are small today. Yesterday one of them was as tall as {companion}.
> **Wize (2/2):** Worry-flowers grow when you yank at them and shrink when you just look closely. Funny plants.

**An empty gathering basket** — *obj_gathering_basket / dlg_gathering_basket*
> **Wize (1/2):** An empty basket, sitting in the grass. Somebody meant to fill it and got distracted.
> **Wize (2/2):** Maybe by a worry-flower. Maybe by something more interesting. Baskets can wait.

**Then the decision:** `dp_fact_sort` *(existing DP, predates this arc)*

---

### Scene w4 — The valley of welcome

**Wize's opening line (the goal):**

> Some Guardian Dragons got left behind on the hills. Let's walk the valley first and see what a real welcome looks like.

**An old welcome bell** — *obj_welcome_bell / dlg_welcome_bell*
> **Wize (1/2):** An old bell, a little rusty, still hanging where someone hung it.
> **Wize (2/2):** It used to ring whenever a Guardian Dragon was invited to sit close. Quiet today — but it still works.

**Scattered petals** — *obj_petals_on_wind / dlg_petals_on_wind*
> **Wize (1/2):** Petals, scattered like something got knocked over in a hurry.
> **Wize (2/2):** Or maybe someone was just twirling. Not every mess means something went wrong.

**Then the decision:** `dp_choose_path` *(existing DP, predates this arc)*

---

### Scene w5 — The memory crystals

**Wize's opening line (the goal):**

> These crystals are trying to show us something, {name}. Let's walk through and see what I've been remembering.

**A glowing, half-unrolled scroll** — *obj_memory_scroll / dlg_memory_scroll*
> **Wize (1/2):** A scroll, half-unrolled, glowing faintly like the crystals around it.
> **Wize (2/2):** It lists every time a Guardian Dragon kept someone safe. {companion}'s name is on it more than once.

**A faded note** — *obj_faded_memory_note / dlg_faded_memory_note*
> **Wize (1/2):** A note, the ink almost gone: 'Not broken. Just doing the job.'
> **Wize (2/2):** I don't know who wrote it. But it sounds like something worth remembering.

**Then the decision:** `dp_crossing` *(existing DP, predates this arc)*

---

### Scene w6 — Before the stage

**Wize's opening line (the goal):**

> The stage is close now, and I'm the loudest I've ever been. Let's look around together before we climb.

**A festival crown, finished and waiting** — *obj_ready_crown / dlg_ready_crown*
> **Wize (1/2):** A crown of mountain flowers, finished and waiting for whoever reaches the stage.
> **Wize (2/2):** It doesn't ask if you're scared. It just waits for you to arrive.

**The festival bell** — *obj_festival_bell / dlg_festival_bell*
> **Wize (1/2):** The festival bell — it rings once for every explorer who steps onto the stage.
> **Wize (2/2):** Nervous or not. {companion} included. Especially {companion}.

**Then the decision:** `dp_breathe` *(existing DP, predates this arc)*

---

### Scene w7 — The stage

**Wize's opening line (the goal):**

> One more step, {name}. Let's walk out onto that stage together.

This scene is a short walk to the finish line (`obj_festival_finish`) — no new discovery
dialogs, golden-path completion only.

---

### Chapter 2 celebration screen

**Trophy:** ⭐ Star Crystal

> **Today Flicker (the Guardian Dragon) learned:** "I don't have to stop my child every time I feel scared — I can walk beside them."
>
> **Today you learned:** "I can feel nervous and still take the next step with Flicker."

**Achievements listed:**
- Asked Flicker curious questions
- Inspected a worry-flower
- Welcomed Flicker beside you
- Thanked Flicker for helping
- Took festival steps while nervous
- Earned a Star Crystal

**Closing line:**

> "The secret isn't getting rid of your Guardian. It's learning how to listen to them."

---

## Cross-cutting: distress, error, and fallback copy

These lines aren't tied to one chapter — they can surface at any point in either chapter,
depending on what the child says or whether the AI companion service is briefly unreachable.
None of these have been reviewed yet.

### Distress-aware resume (spec §17D / §9.6)

Shown when a returning child's *previous* session ended with a flagged distress moment,
instead of the standard cheerful welcome-back.

> **Opening:** "Last time, some big feelings came up. I'm really glad you're back. We can keep going, or just sit here together for a bit — whatever feels right."
>
> **If the child chooses to sit for a moment:** "Okay. We'll just be here together for a moment. There's no rush at all — I'm right beside you."
>
> **Buttons:** "Let's keep going" / "Just sit here for a bit" / "I'm ready now"

### In-session distress line (pre-level check-in)

Shown if a child's typed check-in answer trips the distress filter.

> "Those feelings sound really big and really important. Please tell a trusted grown-up how you're feeling — you deserve caring help in the real world too."

### Pre-level check-in placement lines

Said by the companion based on how the child answers 3 opening questions (sets a 0–10
starting point, doesn't gate anything):

> **Bright start:** "{companion} does a happy loop in the air! 'A bright start — your compass is glowing. Let's go!'"
>
> **Steady start:** "{companion} nods warmly. 'A steady start. We'll take this adventure one step at a time — together.'"
>
> **Gentle start:** "{companion} snuggles closer. 'Sounds like today feels a little heavy. That's okay — we'll go gently, and I'm right beside you the whole way.'"

### API-failure line (spec §17D)

Shown in-character during the single auto-retry if the AI companion service is briefly
unreachable — never a raw error or a spinner:

> "My words got a little tangled — let me try that again!"

### Generic decision fallback

Last-resort line if a decision point has no authored per-choice response (should be rare —
most DPs have hand-written responses per band):

> "You're doing your best — let's keep going together."

---

## Also needing sign-off (predates this file, tracked here for completeness)

| Copy | Where | Status |
|---|---|---|
| `dp_leftout_bench`, `dp_ask_grownup` prompts/options | Ch.1 | Previously reviewed |
| `dp_quest_start`, `dp_investigate`, `dp_fact_sort`, `dp_choose_path`, `dp_crossing`, `dp_breathe` | Ch.2 | Predates this arc — not re-reviewed as part of this pass |

---

## Open questions for the SME

1. **Flicker/Wize's voice on the discoveries.** Both interpret what they see rather than
   staying purely descriptive ("Someone's heart sank right here" / "Its worry isn't a flaw —
   it's a job"). Is that the right level of narration for 5–7, or should they stay more
   descriptive and let the child draw the conclusion?
2. **The deer speaks in Ch.1 e1.** It's the only non-companion voice in either chapter's
   discoveries. Keep, or move that line to Flicker for consistency?
3. **"Accidents happen fast. What comes next is the part you choose."** (Ch.1 e2c) — is this
   too close to instructing the child what the lesson is before they've made the choice?
4. **Ch.2's "worry as a companion, not a flaw" framing.** Wize repeatedly reframes Flicker's
   anxiety as useful ("its worry isn't a flaw — it's a job"). Is this the right message for a
   child who may see their *own* anxiety in Flicker, or does it risk normalizing worry rather
   than helping a child move through it?
5. **Age-band check.** Sentence length and vocabulary are aimed at 5–7 in both chapters —
   flag anything too advanced. (Note: the master spec structures ch1=5–7 / ch2=8–10; the
   code currently defaults both to 5–7. That's a separate, already-flagged product decision,
   not something this copy review needs to resolve — but it may affect how you read Ch.2's
   vocabulary level.)
6. **Distress and error copy tone.** Do the distress-resume, in-session-distress, and
   API-failure lines feel calm and safe rather than clinical or alarming?
