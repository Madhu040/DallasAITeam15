/**
 * Shared content/layout configuration (zones, golden path labels).
 * Image paths and copy live here so art swaps don’t require hunting through UI code.
 */

export interface ZoneConfig {
  id: string;
  name: string;
  tagline: string;
  image: string;
  chapterIds: string[];
}

export const contentConfig = {
  zones: [
    {
      id: "forest",
      name: "Forest of Questions",
      tagline: "Anxiety gets quieter when it feels heard.",
      image: "/assets/zones/forest.png",
      chapterIds: ["ch2"],
    },
    {
      id: "bridge",
      name: "Valley of Welcome",
      tagline: "Invite your protector to walk beside you.",
      image: "/assets/zones/meadow.png",
      chapterIds: ["ch3"],
    },
    {
      id: "mountain",
      name: "Mountain of Helpers",
      tagline: "We can do hard things together.",
      image: "/assets/zones/mountain.png",
      chapterIds: ["ch4"],
    },
    {
      id: "meadow",
      name: "Everbright Meadow",
      tagline: "Practice welcoming others.",
      image: "/assets/zones/meadow.png",
      chapterIds: ["ch1"],
    },
    {
      id: "cave",
      name: "Cave of Purpose",
      tagline: "Your guardian has a job — listen with care.",
      image: "/assets/zones/cave.png",
      chapterIds: [],
    },
  ] as ZoneConfig[],
  achievementChecklist: [
    "Said YES to the adventure with Flicker",
    "Looked carefully at the Singing Bridge",
    "Sorted facts, maybes, and stories",
    "Breathed with Flicker while nervous",
    "Chose to keep going",
    "Earned Courage Feather #1",
  ] as const,
  celebrations: {
    ch1: {
      backgroundImage: "/assets/zones/meadow.png",
      trophyLabel: "🌟 Friendship Star",
      title: "Adventure Complete",
      companionName: "Flicker",
      companionLesson: "I watched you make room for someone who felt left out. That took a kind heart.",
      playerLesson: "I can notice when someone feels alone — and do something about it.",
      achievements: [
        "Invited Jamie to play",
        "Helped a shy friend feel braver",
        "Took turns instead of keeping it all",
        "Said sorry and helped fix it",
        "Asked a grown-up for help",
        "Earned a Friendship Star",
      ],
      quote: "Being kind isn't something you are. It's something you do, one moment at a time.",
    },
    ch2: {
      backgroundImage: "/assets/zones/forest.png",
      trophyLabel: "👀 Look Carefully",
      title: "Forest Phase Complete!",
      companionName: "Flicker",
      companionLesson: "Thank you for listening when I shouted STOP — looking carefully helps us both.",
      playerLesson: "I can thank my Worry Dragon and check facts before I decide.",
      achievements: [
        "Said YES to the Shimmer Crystal quest",
        "Looked carefully at the Singing Bridge",
        "Sorted FACT, MAYBE, and STORY",
        "Ready for the Valley of Welcome",
      ],
      quote: "Worry is information — looking carefully comes next.",
    },
    ch3: {
      backgroundImage: "/assets/zones/meadow.png",
      trophyLabel: "💨 Calm Body",
      title: "Valley Phase Complete!",
      companionName: "Flicker",
      companionLesson: "My body still felt scared — and you helped me breathe anyway.",
      playerLesson: "I can calm my body and still choose to keep going.",
      achievements: [
        "Breathed with Flicker five times",
        "Remembered Flicker has a purpose",
        "Chose KEEP GOING while nervous",
        "Ready for the Mountain of Helpers",
      ],
      quote: "Feeling nervous isn't a stop sign — it's your Worry Dragon asking you to pay attention.",
    },
    ch4: {
      backgroundImage: "/assets/zones/mountain.png",
      trophyLabel: "🪶 Courage Feather #1",
      title: "Bridge Crossed!",
      companionName: "Flicker",
      companionLesson: "I don't have to stop my child every time I feel scared — I can walk beside them.",
      playerLesson: "I can feel nervous and still take the next step.",
      achievements: [
        "Took careful steps across the bridge",
        "Kept going while still nervous",
        "Reached the Shimmer Crystal",
        "Earned Courage Feather #1",
      ],
      quote: "Today wasn't about proving there was nothing to fear — it was learning you can feel afraid and still keep walking.",
    },
  },
} as const;

export type CelebrationConfig =
  (typeof contentConfig.celebrations)[keyof typeof contentConfig.celebrations];

/** Falls back to ch4 (Courage Feather finale) for any chapter without authored copy. */
export function celebrationFor(chapterId: string): CelebrationConfig {
  const table = contentConfig.celebrations as Record<string, CelebrationConfig | undefined>;
  return table[chapterId] ?? contentConfig.celebrations.ch4;
}
