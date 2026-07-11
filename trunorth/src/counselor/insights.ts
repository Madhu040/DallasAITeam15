import type { GameEvent, GameState, ScoreBand, SkillId } from "../types/index.js";

export interface CounselorInsight {
  title: string;
  forChild: string;
  forParent: string;
  skillFocus: SkillId | "general";
  practiceTip: string;
  strengthNoted: string;
}

export interface JourneyReflection {
  summary: string;
  strengths: string[];
  growthEdges: string[];
  stepInsights: CounselorInsight[];
  parentCoaching: string[];
  closingNote: string;
}

const STEP_INSIGHTS: Record<string, Record<ScoreBand, CounselorInsight>> = {
  dp_leftout_bench: {
    strong: {
      title: "Inclusion as courage",
      forChild: "You noticed someone feeling alone and made room for them. That is empathy in action — your heart saw what your eyes noticed.",
      forParent: "Your child practiced perspective-taking and social invitation. Reinforce by naming the skill: “You saw Jamie’s feeling and offered belonging.”",
      skillFocus: "empathy",
      practiceTip: "At home, ask: “Who might feel left out today, and what’s one small welcome we could offer?”",
      strengthNoted: "Social awareness + kind initiative",
    },
    partial: {
      title: "Quiet presence still counts",
      forChild: "Sitting nearby can be a gentle start. Next time, a short invitation can help the feeling of belonging grow even more.",
      forParent: "Your child showed soft support. Coach the next step: a simple script like “Want to join us?” builds confidence.",
      skillFocus: "empathy",
      practiceTip: "Role-play a 5-second invitation together.",
      strengthNoted: "Respectful presence",
    },
    poor: {
      title: "Feelings we miss can be repaired",
      forChild: "Everyone misses cues sometimes. What matters is turning back and trying a kinder choice — that is how friendship muscles grow.",
      forParent: "Avoid shame. Reflect: “What might Jamie have felt?” Then practice a repair invitation together.",
      skillFocus: "friendship_repair",
      practiceTip: "Use a do-over: “Let’s try that scene again with a welcome.”",
      strengthNoted: "Willingness to retry",
    },
  },
  dp_ask_grownup: {
    strong: {
      title: "Asking for help is strength",
      forChild: "You shared what happened with a trusted grown-up. That keeps everyone safer and shows real courage.",
      forParent: "Celebrate help-seeking. Children who can loop in adults build resilience and reduce secrecy around hard moments.",
      skillFocus: "courage",
      practiceTip: "Name 2–3 trusted adults your child can go to at school and home.",
      strengthNoted: "Help-seeking + advocacy",
    },
    partial: {
      title: "It’s okay to start small",
      forChild: "Saying you’re fine is common. When something felt big for a friend, telling a grown-up can be another brave option.",
      forParent: "Normalize that kids often minimize. Invite check-ins: “Was there anything today that needed a grown-up’s help?”",
      skillFocus: "courage",
      practiceTip: "Practice a short share script at dinner.",
      strengthNoted: "Self-regulation",
    },
    poor: {
      title: "Secrets that hurt need light",
      forChild: "Some feelings are private, but if someone is hurting or left out, a trusted grown-up should know. You’re not tattling — you’re caring.",
      forParent: "Gently correct secrecy norms. Distinguish privacy from safety: “We don’t keep hurts as secrets.”",
      skillFocus: "courage",
      practiceTip: "Create a family phrase: “Hard things get help.”",
      strengthNoted: "Openness to guidance",
    },
  },
  dp_robin_encounter: {
    strong: {
      title: "Gentle approach builds trust",
      forChild: "You walked over kindly. Soft hellos help worried friends feel safer.",
      forParent: "Your child used approach behavior with emotional attunement — a foundation for secure peer bonds.",
      skillFocus: "empathy",
      practiceTip: "Notice and praise soft approaches in real life.",
      strengthNoted: "Warm initiation",
    },
    partial: {
      title: "Waiting can be thoughtful",
      forChild: "Waiting shows care. When you’re ready, a hello can open the door.",
      forParent: "Support pacing while encouraging a next micro-step toward connection.",
      skillFocus: "empathy",
      practiceTip: "Count to three, then practice a greeting.",
      strengthNoted: "Thoughtfulness",
    },
    poor: {
      title: "We can turn toward each other",
      forChild: "It’s okay to feel unsure. Let’s try a kind hello together.",
      forParent: "Model approach without pressure. Co-regulate first, then invite contact.",
      skillFocus: "empathy",
      practiceTip: "Do a side-by-side greeting practice.",
      strengthNoted: "Capacity to repair",
    },
  },
  dp_robin_ladder: {
    strong: {
      title: "Naming fear shrinks it",
      forChild: "You said it was okay to feel scared and offered to try one step together. That is worry-and-brave working as a team.",
      forParent: "This is classic exposure-with-support: validate emotion, then scaffold a small step. Excellent co-regulation modeling.",
      skillFocus: "worry_brave",
      practiceTip: "Use “name it → normalize it → next tiny step” for homework or new activities.",
      strengthNoted: "Emotional validation + scaffolding",
    },
    partial: {
      title: "Different plans can still care",
      forChild: "Wanting another plan is okay. Staying near Robin still shows friendship.",
      forParent: "Partial responses often protect the child’s own anxiety. Affirm care, then explore one brave micro-step.",
      skillFocus: "worry_brave",
      practiceTip: "Ask: “What’s the smallest brave step that still feels kind?”",
      strengthNoted: "Boundary awareness",
    },
    poor: {
      title: "Pressure isn’t the same as courage",
      forChild: "Pushing someone can make worry bigger. Bravery grows when we go slowly together.",
      forParent: "Redirect from minimization (“it’s not high”) to validation. Kids learn courage from felt safety, not force.",
      skillFocus: "worry_brave",
      practiceTip: "Repair script: “I rushed you. Want to try the first step with me?”",
      strengthNoted: "Openness to correction",
    },
  },
  dp_climb_celebration: {
    strong: {
      title: "Shared courage sticks",
      forChild: "You climbed together. Bravery feels brighter when we share it.",
      forParent: "Celebrate process over outcome: effort, pacing, and partnership.",
      skillFocus: "courage",
      practiceTip: "Family ritual: name one brave moment each evening.",
      strengthNoted: "Persistence + partnership",
    },
    partial: {
      title: "One rung at a time",
      forChild: "Each tap is progress. Keep going — you’re building brave muscles.",
      forParent: "Chunking goals reduces overwhelm. Keep praising incremental progress.",
      skillFocus: "worry_brave",
      practiceTip: "Break tasks into three visible steps.",
      strengthNoted: "Incremental effort",
    },
    poor: {
      title: "Tries still count",
      forChild: "Every try matters. Let’s tap together again.",
      forParent: "Keep the emotional tone warm; avoid performance pressure.",
      skillFocus: "courage",
      practiceTip: "Cheer the attempt, not only completion.",
      strengthNoted: "Willingness to continue",
    },
  },
  dp_hothead_calm: {
    strong: {
      title: "Calm is a skill, not a switch",
      forChild: "You helped Alex breathe before talking. That gives big feelings a soft landing.",
      forParent: "Your child practiced co-regulation — a core emotion-regulation skill linked to healthier conflict outcomes.",
      skillFocus: "calm",
      practiceTip: "Family calm kit: breathe, sip water, name the feeling, then talk.",
      strengthNoted: "Co-regulation leadership",
    },
    partial: {
      title: "Space can be kindness",
      forChild: "Giving space shows respect. Checking back later completes the care.",
      forParent: "Space helps, but reconnect afterward so the peer doesn’t feel abandoned.",
      skillFocus: "calm",
      practiceTip: "Agree on a “check-back” time after cool-downs.",
      strengthNoted: "Respect for emotional pacing",
    },
    poor: {
      title: "Shame heats anger up",
      forChild: "Calling feelings dramatic can hurt. Calm words help the fire cool.",
      forParent: "Minimize dismissive language. Model: “Your mad is real. Let’s cool first.”",
      skillFocus: "calm",
      practiceTip: "Replace judgment with feeling labels.",
      strengthNoted: "Ability to course-correct",
    },
  },
  dp_friendship_repair: {
    strong: {
      title: "Repair restores belonging",
      forChild: "You invited a kinder rematch. Friendships get stronger after honest repair.",
      forParent: "Repair language builds secure peer relationships and reduces lingering resentment.",
      skillFocus: "friendship_repair",
      practiceTip: "Practice: “I’m sorry for ___. Next time I’ll ___.”",
      strengthNoted: "Restorative communication",
    },
    partial: {
      title: "Timing matters in repair",
      forChild: "Waiting until tomorrow can be wise. Keeping the door open is still friendship.",
      forParent: "Honor pacing while ensuring the relationship isn’t left in limbo.",
      skillFocus: "friendship_repair",
      practiceTip: "Schedule a gentle reconnect.",
      strengthNoted: "Emotional timing",
    },
    poor: {
      title: "Exclusion isn’t repair",
      forChild: "Pushing someone away after a hard moment can make both hearts heavier. Let’s try a kinder door.",
      forParent: "Guide away from punitive exclusion. Focus on accountability + re-inclusion.",
      skillFocus: "friendship_repair",
      practiceTip: "Rewrite the ending with a repair invitation.",
      strengthNoted: "Capacity for guided repair",
    },
  },
};

export function insightForStep(decisionPointId: string, band: ScoreBand): CounselorInsight {
  const byBand = STEP_INSIGHTS[decisionPointId];
  if (byBand?.[band]) return byBand[band];
  return {
    title: "A meaningful step",
    forChild: "You practiced an important feeling skill. Every choice teaches your heart something new.",
    forParent: "Reflect together on what your child noticed, felt, and chose. Curiosity beats criticism.",
    skillFocus: "general",
    practiceTip: "Ask: “What felt hard? What felt kind?”",
    strengthNoted: "Engagement with growth",
  };
}

export function buildJourneyReflection(state: GameState): JourneyReflection {
  const events = state.eventLog;
  const stepInsights = events.map((e) => insightForStep(e.decisionPointId, e.scoreBand));

  const strongCount = events.filter((e) => e.scoreBand === "strong").length;
  const poorCount = events.filter((e) => e.scoreBand === "poor").length;

  const strengths = [...new Set(stepInsights.map((s) => s.strengthNoted))];
  const growthEdges = stepInsights
    .filter((_, i) => events[i]?.scoreBand !== "strong")
    .map((s) => s.title);

  const parentCoaching = [
    "Lead with curiosity: “What was that character feeling?” before “What should you have done?”",
    "Celebrate process skills (naming feelings, asking for help, repairing) more than perfect outcomes.",
    "If big feelings show up after play, co-regulate first — then reflect for 2–3 minutes max for younger kids.",
    "TruNorth is SEL practice, not therapy. If worries persist or intensify, consult a trusted pediatric or mental-health professional.",
  ];

  if (poorCount > 0) {
    parentCoaching.unshift(
      "Your child practiced repair after a harder choice — that resilience is more valuable than a flawless path.",
    );
  }

  const summary =
    strongCount >= Math.max(1, events.length - 1)
      ? `${state.profile.companionName} noticed lots of kind, brave choices. Your child’s emotional muscles got a strong workout today.`
      : `This journey had learning turns — and that’s healthy. Growth often shows up in the retries, not only the wins.`;

  return {
    summary,
    strengths: strengths.slice(0, 5),
    growthEdges: growthEdges.length ? [...new Set(growthEdges)].slice(0, 4) : ["Keep practicing calm check-ins"],
    stepInsights,
    parentCoaching,
    closingNote:
      "You are not alone in this. Small daily conversations about feelings build lifelong emotional health — one kind step at a time.",
  };
}

export function childFacingLine(insight: CounselorInsight, companionName: string): string {
  return `${companionName}: ${insight.forChild}`;
}
