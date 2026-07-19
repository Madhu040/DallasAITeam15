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
      name: "Everbright",
      tagline: "Curiosity, kindness, and courage — one step at a time.",
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
      id: "mountain",
      name: "Mountain of Helpers",
      tagline: "You are stronger together. Keep following your True North.",
      image: "/assets/zones/mountain.png",
      chapterIds: [],
    },
  ] as ZoneConfig[],
  achievementChecklist: [
    "Asked Flicker curious questions",
    "Inspected a worry-flower",
    "Welcomed Flicker beside you",
    "Thanked Flicker for helping",
    "Took festival steps while nervous",
    "Earned a Star Crystal",
  ] as const,
  celebration: {
    backgroundImage: "/assets/zones/mountain.png",
    trophyLabel: "⭐ Star Crystal",
    title: "Adventure Complete",
    flickerLesson: "I don't have to stop my child every time I feel scared — I can walk beside them.",
    playerLesson: "I can feel nervous and still take the next step with Flicker.",
    quote: "The secret isn't getting rid of your Guardian. It's learning how to listen to them.",
  },
} as const;
