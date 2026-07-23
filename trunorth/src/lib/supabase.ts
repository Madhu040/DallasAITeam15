/**
 * Shared browser-side Supabase client (ADR-003).
 *
 * One lazy singleton for the whole client: parent auth today, Storage (level/zone
 * images) tomorrow — extend this module rather than creating more clients.
 *
 * The SDK is dynamically imported (not a static `import`) for two reasons:
 *  - it's never constructed in demo mode or when the env vars are missing — the
 *    offline demo (`?demo=1`) must make zero external requests, enforced by
 *    tests/e2e/demo-mode.spec.ts;
 *  - keeping `@supabase/supabase-js` (~35 KB gz) out of the main entry chunk keeps
 *    guest/demo play — the golden path — under the spec §19 bundle budget. It only
 *    loads (as a separate chunk) the first time a parent opens the login screen.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { isDemoMode } from "../config/app.js";

function viteEnv(key: string): string {
  const env = import.meta.env as Record<string, string | boolean | undefined>;
  const value = env[key];
  return value === undefined ? "" : String(value);
}

const supabaseUrl = viteEnv("VITE_SUPABASE_URL");
const supabaseAnonKey = viteEnv("VITE_SUPABASE_ANON_KEY");

let clientPromise: Promise<SupabaseClient> | null = null;

/** True when the build has Supabase credentials (demo mode still disables the client). */
export function isSupabaseConfigured(): boolean {
  return supabaseUrl !== "" && supabaseAnonKey !== "";
}

/**
 * Lazy singleton. Resolves to `null` when unconfigured or in demo mode —
 * callers must treat `null` as "Supabase features unavailable", not an error.
 */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured() || isDemoMode()) return null;
  clientPromise ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(supabaseUrl, supabaseAnonKey),
  );
  return clientPromise;
}
