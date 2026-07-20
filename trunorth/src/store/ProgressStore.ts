import type { GameEvent, GameState, ProgressStore } from "../types/index.js";

const STORAGE_KEY = "trunorth_save_v1";

export class LocalProgressStore implements ProgressStore {
  async load(): Promise<GameState | null> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as GameState;
    } catch {
      return null;
    }
  }

  async save(state: GameState): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }

  async appendEvent(event: GameEvent): Promise<void> {
    const state = await this.load();
    if (!state) return;
    state.eventLog.push(event);
    if (state.eventLog.length > 200) {
      state.eventLog = state.eventLog.slice(-200);
    }
    await this.save(state);
  }
}
