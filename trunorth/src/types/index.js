export function createDefaultMeters() {
    const skills = [
        "empathy", "calm", "courage", "self_worth",
        "adapting_to_change", "friendship_repair", "worry_brave",
    ];
    return Object.fromEntries(skills.map((s) => [s, { fill: 0, level: 1 }]));
}
export function createInitialGameState(demoMode = false) {
    return {
        version: 1,
        profile: {
            ageBand: "8-10",
            chapterId: "ch2",
            avatar: { skinTone: "tone_3", hair: "hair_curly" },
            companionName: "Pip",
            companionArchetype: "companion_fox",
            baselineStrength: "empathy",
        },
        progress: {
            currentSceneId: "w1",
            chaptersUnlocked: ["ch1", "ch2", "ch3"],
            chaptersCompleted: [],
            browniePoints: 0,
            kindnessSparksFound: {},
        },
        meters: createDefaultMeters(),
        companion: { level: 1, appearanceRef: "companion_fox_base" },
        emotionalResidue: {},
        parentGate: { lastPassedChapter: null },
        flags: { demoMode, lastSafetyFlag: null, onboardingComplete: false, playMode: "solo" },
        eventLog: [],
    };
}
