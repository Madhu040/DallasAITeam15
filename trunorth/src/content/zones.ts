/** TruNorth journey zones — mapped from concept art */

export interface ZoneMeta {
  id: string;
  name: string;
  tagline: string;
  image: string;
  chapterIds: string[];
}

export const ZONES: ZoneMeta[] = [
  {
    id: "bridge",
    name: "The Singing Bridge",
    tagline: "Feel nervous — and still take the next step.",
    image: "/assets/zones/forest.png",
    chapterIds: ["ch2"],
  },
  {
    id: "meadow",
    name: "Meadow of Curiosity",
    tagline: "Explore, wonder, and welcome others.",
    image: "/assets/zones/meadow.png",
    chapterIds: ["ch1"],
  },
  {
    id: "forest",
    name: "Forest of Questions",
    tagline: "Answer with care — clear the murky water.",
    image: "/assets/zones/forest.png",
    chapterIds: ["ch3"],
  },
  {
    id: "mountain",
    name: "Mountain of Helpers",
    tagline: "You are stronger together. Keep following your True North.",
    image: "/assets/zones/mountain.png",
    chapterIds: [],
  },
];

export const ACHIEVEMENT_CHECKLIST = [
  "Thanked Flicker for noticing",
  "Checked the facts",
  "Sorted stories from truths",
  "Helped Flicker's body calm",
  "Chose to keep going",
  "Earned Courage Feather #1",
] as const;

export function zoneForChapter(chapterId: string): ZoneMeta {
  return ZONES.find((z) => z.chapterIds.includes(chapterId)) ?? ZONES[0];
}

export function zoneFromBackground(background: string): ZoneMeta | null {
  const key = background.replace("bg_", "");
  return ZONES.find((z) => z.id === key) ?? null;
}
