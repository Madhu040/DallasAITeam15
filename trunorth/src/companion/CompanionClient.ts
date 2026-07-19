import type { CompanionRequest, CompanionResponse } from "../types/index.js";
import showcaseBundle from "../../content/demo/showcase.bundle.json";
import { insightForStep } from "../counselor/insights.js";
import { scoreTypedResponse } from "../counselor/typedScoring.js";
import { appConfig } from "../config/app.js";

export interface CompanionClient {
  request(req: CompanionRequest): Promise<CompanionResponse>;
}

export class LiveCompanionClient implements CompanionClient {
  constructor(private apiUrl: string, private token?: string) {}

  async request(req: CompanionRequest): Promise<CompanionResponse> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;

    const res = await fetch(`${this.apiUrl}/api/companion`, {
      method: "POST",
      headers,
      body: JSON.stringify(req),
    });

    if (!res.ok) throw new Error("Companion request failed");
    return res.json() as Promise<CompanionResponse>;
  }
}

export class DemoCompanionClient implements CompanionClient {
  async request(req: CompanionRequest): Promise<CompanionResponse> {
    await new Promise((r) => setTimeout(r, appConfig.timing.demoCompanionDelayMs));

    const score = scoreTypedResponse(req.childInput, req.typedRubricRef);
    const band = score.band;
    const key = `${req.sceneId}:${req.decisionPointId}:${band}`;
    const bundle = showcaseBundle as {
      responses: Record<string, CompanionResponse>;
    };

    const canned = bundle.responses[key];
    const insight = insightForStep(req.decisionPointId, band);

    if (canned) {
      return {
        ...canned,
        matchedCriterion: score.matchedCriterion ?? canned.matchedCriterion,
        counselorInsight: insight.forChild,
        parentTip: insight.forParent,
      };
    }

    return {
      scoreBand: band,
      skill: insight.skillFocus === "general" ? "empathy" : insight.skillFocus,
      matchedCriterion: score.matchedCriterion,
      confidence: 1,
      companionLine: insight.forChild.slice(0, 140),
      counselorInsight: insight.forChild,
      parentTip: insight.forParent,
      redirect: false,
      safetyFlag: "none",
    };
  }
}
