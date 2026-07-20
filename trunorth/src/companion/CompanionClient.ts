import type { CompanionRequest, CompanionResponse } from "../types/index.js";

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
