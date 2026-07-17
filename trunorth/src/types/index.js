export function createDefaultMeters() {
    const skills = [
        "empathy", "calm", "courage", "self_worth",
        "adapting_to_change", "friendship_repair", "worry_brave",
    ];
    return Object.fromEntries(skills.map((s) => [s, { fill: 0, level: 1 }]));
}
