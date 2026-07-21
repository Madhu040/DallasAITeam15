import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";
import { getServiceClient, isSupabaseConfigured } from "./db/supabase.js";
import { verifySupabaseToken } from "./auth/supabase.js";
import { companionRoutes } from "./routes/companion.js";
import { togetherRoutes } from "./routes/together.js";
import { serverConfig } from "./config.js";
import type { AuthUser } from "../src/types/index.js";

type Variables = { user: AuthUser };

const app = new Hono<{ Variables: Variables }>();

app.use("*", cors({
  origin: (origin) => {
    if (!origin) return serverConfig.corsOrigins[0] ?? "*";
    if (serverConfig.corsOrigins.includes(origin)) return origin;
    // Dev / LAN: allow phones opening http://192.168.x.x:5173
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
    if (/^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin)) {
      return origin;
    }
    return serverConfig.corsOrigins[0] ?? origin;
  },
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.get("/api/health", (c) =>
  c.json({
    status: "ok",
    service: "trunorth",
    timestamp: new Date().toISOString(),
    config: {
      companionModel: serverConfig.companion.model,
      hasApiKey: Boolean(serverConfig.companion.apiKey),
    },
  }),
);

app.get("/api/health/supabase", async (c) => {
  if (!isSupabaseConfigured()) {
    return c.json({ configured: false, reachable: false });
  }
  try {
    const { error } = await getServiceClient()
      .from("child_profiles")
      .select("id", { count: "exact", head: true });
    if (error) return c.json({ configured: true, reachable: false, error: error.message });
    return c.json({ configured: true, reachable: true });
  } catch (err) {
    return c.json({
      configured: true,
      reachable: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// --- Parent Auth (Supabase Auth; parent-only, children never authenticate directly) ---
// Register/login/session refresh are handled client-side by supabase-js against
// Supabase Auth directly — this API only verifies the resulting access token.

app.get("/api/auth/me", async (c) => {
  const auth = c.req.header("Authorization");
  if (!auth?.startsWith("Bearer ")) return c.json({ error: "Unauthorized" }, 401);

  const user = await verifySupabaseToken(auth.slice(7));
  if (!user) return c.json({ error: "Invalid token" }, 401);
  return c.json({ user });
});

// Auth middleware for protected routes
const authMiddleware = async (c: Context<{ Variables: Variables }>, next: () => Promise<void>) => {
  const auth = c.req.header("Authorization");
  if (!auth?.startsWith("Bearer ")) return c.json({ error: "Unauthorized" }, 401);

  const user = await verifySupabaseToken(auth.slice(7));
  if (!user) return c.json({ error: "Invalid token" }, 401);

  c.set("user", user);
  await next();
};

// --- Child Profiles (parent-managed, Supabase Postgres) ---
// The service-role key bypasses RLS, so every query below scopes explicitly by
// parent_id — RLS (supabase/migrations/0001_children_progress.sql) is a safety net,
// not the only enforcement.

interface ChildRow {
  id: string;
  display_name: string;
  age_band: string;
  avatar_json: Record<string, unknown>;
  created_at: string;
}

app.get("/api/children", authMiddleware, async (c) => {
  const user = c.get("user");
  const { data, error } = await getServiceClient()
    .from("child_profiles")
    .select("id, display_name, age_band, avatar_json, created_at")
    .eq("parent_id", user.id)
    .returns<ChildRow[]>();

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ data });
});

app.post("/api/children", authMiddleware, async (c) => {
  const user = c.get("user");
  const { displayName, ageBand, avatarJson } = await c.req.json<{
    displayName: string; ageBand: string; avatarJson?: string;
  }>();

  if (!displayName || displayName.length > 30) {
    return c.json({ error: "Display name required (max 30 chars)" }, 400);
  }

  const { data, error } = await getServiceClient()
    .from("child_profiles")
    .insert({
      parent_id: user.id,
      display_name: displayName,
      age_band: ageBand ?? "8-10",
      avatar_json: avatarJson ? JSON.parse(avatarJson) : {},
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) return c.json({ error: error?.message ?? "Failed to create child" }, 500);

  const { error: auditError } = await getServiceClient()
    .from("audit_logs")
    .insert({ actor_id: user.id, action: "child_profile.create", resource_id: data.id });
  if (auditError) console.error("audit_logs insert failed:", auditError.message);

  return c.json({ id: data.id, displayName, ageBand: ageBand ?? "8-10" }, 201);
});

// --- Remote Progress (parent-authenticated, Supabase Postgres) ---

app.get("/api/progress/:childId", authMiddleware, async (c) => {
  const user = c.get("user");
  const childId = c.req.param("childId");

  const { data: child } = await getServiceClient()
    .from("child_profiles")
    .select("id")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();
  if (!child) return c.json({ error: "Not found" }, 404);

  const { data: row } = await getServiceClient()
    .from("progress")
    .select("game_state_json, updated_at")
    .eq("child_id", childId)
    .maybeSingle<{ game_state_json: unknown; updated_at: string }>();

  if (!row) return c.json({ data: null });
  return c.json({ data: row.game_state_json, updatedAt: row.updated_at });
});

app.put("/api/progress/:childId", authMiddleware, async (c) => {
  const user = c.get("user");
  const childId = c.req.param("childId");
  const { gameState } = await c.req.json<{ gameState: unknown }>();

  const { data: child } = await getServiceClient()
    .from("child_profiles")
    .select("id")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();
  if (!child) return c.json({ error: "Not found" }, 404);

  const { error } = await getServiceClient()
    .from("progress")
    .upsert({ child_id: childId, game_state_json: gameState, updated_at: new Date().toISOString() });

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ ok: true });
});

app.route("/api", companionRoutes);
app.route("/api", togetherRoutes);

export { app };
