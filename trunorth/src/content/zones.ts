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
    id: "meadow",
    name: "Meadow of Curiosity",
    tagline: "Explore, wonder, and welcome others.",
    image: "/assets/zones/meadow.png",
    chapterIds: ["ch1"],
  },
  {
    id: "cave",
    name: "Cave of Purpose",
    tagline: "Discover your gifts and take brave steps.",
    image: "/assets/zones/cave.png",
    chapterIds: ["ch2"],
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
  "Asked questions",
  "Stayed curious",
  "Welcomed yourself",
  "Found your purpose",
  "Used your tools",
  "Never gave up!",
] as const;

export function zoneForChapter(chapterId: string): ZoneMeta {
  return ZONES.find((z) => z.chapterIds.includes(chapterId)) ?? ZONES[0];
}

export function zoneFromBackground(background: string): ZoneMeta | null {
  const key = background.replace("bg_", "");
  return ZONES.find((z) => z.id === key) ?? null;
}
