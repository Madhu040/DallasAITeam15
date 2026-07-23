/**
 * Server-side Supabase client (ADR-003) — service-role key, so it BYPASSES RLS.
 * Every query against parent-owned tables must scope explicitly (e.g.
 * `.eq("parent_id", user.id)`); the RLS policies are only a safety net.
 *
 * PostgREST-over-HTTP (supabase-js) instead of a pg driver: no connection pool to
 * manage on Vercel Node functions, and one SDK shared with the browser client.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { serverConfig } from "../config.js";

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return serverConfig.supabase.url !== "" && serverConfig.supabase.serviceRoleKey !== "";
}

/** Lazy singleton. Throws when SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are unset. */
export function getServiceClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env",
    );
  }
  client ??= createClient(serverConfig.supabase.url, serverConfig.supabase.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
