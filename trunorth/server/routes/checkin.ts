import { Hono } from "hono";
import Anthropic from "@anthropic-ai/sdk";
import { filterInput, filterOutput } from "../../src/safety/filters.js";
import { scoreCheckinTextLocally } from "../../src/counselor/checkin.js";
import { serverConfig } from "../config.js";
import { verifySupabaseToken } from "../auth/supabase.js";
import type {
  CheckinScoreRequest,
  CheckinScoreRequestItem,
  CheckinScoreResponse,
  CheckinScoreResult,
} from "../../src/types/index.js";

const { timeoutMs: TIMEOUT_MS, model: COMPANION_MODEL, apiKey } = serverConfig.companion;

const checkin = new Hono();

checkin.post("/checkin/score", async (c) => {
  const req = await c.req.json<CheckinScoreRequest>();
  const items = req.answers ?? [];

  if (!Array.isArray(items) || items.length === 0) {
    return c.json({ error: "answers required" }, 400);
  }

  // Defense in depth: the client already ran this same filter before an answer was ever
  // queued for scoring (checkTypedSafety), but the server never trusts the client — an
  // item that somehow arrives unfiltered still gets caught here, same point mapping as
  // the client's instant-block path (distress → 0, anything else blocked → 1).
  const blocked: CheckinScoreResult[] = [];
  const safe: CheckinScoreRequestItem[] = [];
  for (const item of items) {
    const filter = filterInput(item.text ?? "");
    if (!filter.allowed) {
      blocked.push({ questionId: item.questionId, points: filter.safetyFlag === "distress" ? 0 : 1 });
    } else {
      safe.push(item);
    }
  }

  if (safe.length === 0) {
    return c.json<CheckinScoreResponse>({ scores: blocked });
  }

  // The Anthropic API key is only ever spent on an authenticated (logged-in parent)
  // session — an unauthenticated check-in (the guest path, no login) always gets the
  // offline heuristic, same as when no key is configured. Pure cost/abuse control; does
  // not affect the safety filtering above, which always runs regardless of auth state.
  const auth = c.req.header("Authorization");
  const user = auth?.startsWith("Bearer ") ? await verifySupabaseToken(auth.slice(7)) : null;

  if (!apiKey || !user) {
    return c.json<CheckinScoreResponse>({ scores: [...blocked, ...scoreLocally(safe)] });
  }

  try {
    const client = new Anthropic({ apiKey });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const message = await client.messages.create({
      model: COMPANION_MODEL,
      max_tokens: 300,
      system: buildSystemPrompt(req),
      messages: [{
        role: "user",
        content: JSON.stringify(safe.map((a) => ({ questionId: a.questionId, prompt: a.prompt, answer: a.text }))),
      }],
    }, { signal: controller.signal });

    clearTimeout(timer);

    const text = message.content[0]?.type === "text" ? message.content[0].text : "";
    const { scores, greeting } = parseModelResponse(text, safe);
    return c.json<CheckinScoreResponse>({ scores: [...blocked, ...scores], greeting });
  } catch {
    return c.json<CheckinScoreResponse>({ scores: [...blocked, ...scoreLocally(safe)] });
  }
});

function buildSystemPrompt(req: CheckinScoreRequest): string {
  const childName = req.childName?.trim() || "them";
  return `You are ${req.companion.name}, a warm SEL companion in a children's app (age band ${req.ageBand}), checking in with ${childName} before they start today's adventure. ${childName === "them" ? "" : `${childName} just`} answered open-ended check-in questions in their own words.

TASK 1 — For EACH answer, rate how the child seems to be feeling RIGHT NOW on a 0-2 scale:
- 2 = calm, bright, confident, ready
- 1 = neutral, mixed, or a little uncertain
- 0 = heavy, worried, sad, or discouraged
Also give a one-sentence internal "reason" citing what in their words led to that score —
this is for the development team's own verification and is NEVER shown to the child.

Strict rules for scoring:
- Never a grade, a diagnosis, or a judgment of the child — there are no wrong answers.
- Judge only the FEELING conveyed by the words, never spelling/grammar/correctness.
- Never mention clinical terms, diagnoses, or treatment.

TASK 2 — Write ONE short, warm "greeting" (max 240 characters) in your own voice as
${req.companion.name}, saying hello to ${childName} personally. Weave in a specific detail
from EACH of their answers below — not just one of them — (in your own words, without
repeating anything scary or heavy back to them) so it feels like you were really listening
to everything they shared, not just skimming it.

Strict rules for the greeting:
- Never diagnose, label, or use clinical language (e.g. "anxiety", "therapy", "diagnosis").
- Never claim an identity ("you're the kind of kid who...", "that's your superpower") —
  stay situational and past-tense, like "I heard you say...".
- Never mention a specific point, score, or grade.
- Simple, warm, age-appropriate for age band ${req.ageBand}.

Respond ONLY with this JSON shape, scores covering every question given:
{"scores":[{"questionId":"...","points":0,"reason":"..."}],"greeting":"..."}`;
}

export function parseModelResponse(
  text: string,
  safe: CheckinScoreRequestItem[],
): { scores: CheckinScoreResult[]; greeting?: string } {
  const safeIds = new Set(safe.map((a) => a.questionId));
  let parsed: { scores?: unknown; greeting?: unknown } = {};
  try {
    parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
  } catch {
    parsed = {};
  }

  const byId = new Map<string, CheckinScoreResult>();
  const rawScores = Array.isArray(parsed.scores) ? parsed.scores as Array<Record<string, unknown>> : [];
  for (const entry of rawScores) {
    if (
      typeof entry.questionId === "string" &&
      safeIds.has(entry.questionId) &&
      (entry.points === 0 || entry.points === 1 || entry.points === 2)
    ) {
      byId.set(entry.questionId, {
        questionId: entry.questionId,
        points: entry.points,
        reason: typeof entry.reason === "string" ? entry.reason.slice(0, 200) : undefined,
      });
    }
  }

  // Anything the model dropped, mis-shaped, or scored outside 0-2 falls back to the
  // same offline heuristic used when there's no API key at all — a question is never
  // left unscored.
  const scores = safe.map((a) => byId.get(a.questionId) ?? {
    questionId: a.questionId,
    points: scoreCheckinTextLocally(a.text),
  });

  // The greeting is real free text reaching the child, unlike the points-only contract
  // this route used to have — it goes through the same output filter as the companion
  // pipeline. An unsafe or missing greeting is simply omitted; the client already falls
  // back to the existing authored placement copy whenever no greeting comes back.
  const rawGreeting = typeof parsed.greeting === "string" ? parsed.greeting.trim().slice(0, 260) : "";
  const greeting = rawGreeting && filterOutput(rawGreeting) ? rawGreeting : undefined;

  return { scores, greeting };
}

function scoreLocally(safe: CheckinScoreRequestItem[]): CheckinScoreResult[] {
  return safe.map((a) => ({ questionId: a.questionId, points: scoreCheckinTextLocally(a.text) }));
}

export { checkin as checkinRoutes };
