import type { CheckinScoreRequest, CheckinScoreResponse } from "../types/index.js";
import { scoreCheckinTextLocally } from "../counselor/checkin.js";
import { appConfig } from "../config/app.js";

/**
 * Scores a batch of pre-level check-in answers (spec: replaces the pure keyword
 * heuristic with a live LLM call when configured). Mirrors `CompanionClient`'s
 * Live/Demo split. Only answers that already passed `checkTypedSafety` client-side
 * are ever sent here — safety filtering itself is never deferred to this call.
 */
export interface CheckinScorer {
  score(req: CheckinScoreRequest): Promise<CheckinScoreResponse>;
}

export class LiveCheckinScorer implements CheckinScorer {
  constructor(
    private apiUrl: string,
    private token?: string,
  ) {}

  async score(req: CheckinScoreRequest): Promise<CheckinScoreResponse> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;

    const res = await fetch(`${this.apiUrl}/api/checkin/score`, {
      method: "POST",
      headers,
      body: JSON.stringify(req),
    });

    if (!res.ok) throw new Error(`Checkin score request failed (${res.status})`);
    return (await res.json()) as CheckinScoreResponse;
  }
}

export class DemoCheckinScorer implements CheckinScorer {
  async score(req: CheckinScoreRequest): Promise<CheckinScoreResponse> {
    await new Promise((r) => setTimeout(r, appConfig.timing.demoCompanionDelayMs));
    return {
      scores: req.answers.map((a) => ({ questionId: a.questionId, points: scoreCheckinTextLocally(a.text) })),
    };
  }
}

export interface CheckinBatchResult {
  scores: Map<string, { points: 0 | 1 | 2; reason?: string }>;
  /** Personalized LLM greeting — present only on the live, authenticated, filter-passed path. */
  greeting?: string;
}

/**
 * Scores `pending` typed answers as one batch, gracefully degrading to the local
 * heuristic per-item — a network failure, a bad response shape, or the model
 * dropping a question never leaves any answer unscored. `reason`/`greeting` are simply
 * absent on any fallback path — their mere presence is itself a live-vs-offline signal.
 */
export async function scoreCheckinBatch(
  scorer: CheckinScorer,
  req: CheckinScoreRequest,
): Promise<CheckinBatchResult> {
  if (req.answers.length === 0) return { scores: new Map() };

  try {
    const res = await scorer.score(req);
    const scores = new Map(res.scores.map((s) => [s.questionId, { points: s.points, reason: s.reason }] as const));
    for (const item of req.answers) {
      if (!scores.has(item.questionId)) {
        scores.set(item.questionId, { points: scoreCheckinTextLocally(item.text), reason: undefined });
      }
    }
    return { scores, greeting: res.greeting };
  } catch {
    return {
      scores: new Map(
        req.answers.map((item) => [item.questionId, { points: scoreCheckinTextLocally(item.text) }] as const),
      ),
    };
  }
}
