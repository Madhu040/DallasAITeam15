/** Discussion prompts for parent–child Together Mode at each decision point */

const DISCUSS_PROMPTS: Record<string, string> = {
  dp_leftout_bench:
    "In the Meadow of Curiosity, a friend sits alone. What feeling might they have? Tell each other before you pick.",
  dp_ask_grownup:
    "When is it okay to ask a grown-up for help? Share a time you asked for help together.",
  dp_robin_encounter:
    "In the Cave of Purpose, your friend looks worried. What might they be afraid of? Name the feeling out loud.",
  dp_robin_ladder:
    "Your friend is scared to take the next step. What is one small brave step you could take together?",
  dp_climb_celebration:
    "Robin made it up! What did it take to get there? Celebrate the brave steps you noticed.",
  dp_hothead_calm:
    "In the Forest of Questions, murky feelings cloud the water. What helps your body calm down when you feel that way?",
  dp_friendship_repair:
    "A friendship got hurt. What does a good repair sound like? Practice one kind sentence together.",
};

export function discussPrompt(decisionPointId: string): string {
  return (
    DISCUSS_PROMPTS[decisionPointId] ??
    "What might the character be feeling? Talk it through together before you choose."
  );
}
