import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "../lib/supabase.js";

/** Legacy localStorage keys from the pre-Supabase bcrypt+JWT auth (removed). */
const LEGACY_TOKEN_KEY = "trunorth_token";
const LEGACY_USER_KEY = "trunorth_user";

export interface AuthUser {
  id: string;
  email: string;
}

let cachedToken: string | null = null;
let cachedUser: AuthUser | null = null;

function applySession(session: Session | null): void {
  cachedToken = session?.access_token ?? null;
  cachedUser = session?.user
    ? { id: session.user.id, email: session.user.email ?? "" }
    : null;
}

/**
 * Hydrates the sync token/user cache from any existing Supabase session and
 * subscribes to future changes (sign in/out, token refresh). Call once at
 * boot — a no-op when Supabase is unconfigured or in demo mode.
 */
export async function initAuth(): Promise<void> {
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);

  const supabase = await getSupabase();
  if (!supabase) return;

  const { data } = await supabase.auth.getSession();
  applySession(data.session);

  supabase.auth.onAuthStateChange((_event, session) => applySession(session));
}

/** Synchronous — existing callers (companion client, Play Together) read this per-request. */
export function getToken(): string | null {
  return cachedToken;
}

export function getUser(): AuthUser | null {
  return cachedUser;
}

export function isAuthenticated(): boolean {
  return cachedToken !== null;
}

export async function signIn(email: string, password: string): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) throw new Error("Sign-in is unavailable right now.");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  applySession(data.session);
}

export async function signUp(
  email: string,
  password: string,
): Promise<{ needsEmailConfirm: boolean }> {
  const supabase = await getSupabase();
  if (!supabase) throw new Error("Account creation is unavailable right now.");

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  if (data.session) {
    applySession(data.session);
    return { needsEmailConfirm: false };
  }
  return { needsEmailConfirm: true };
}

export async function signOut(): Promise<void> {
  const supabase = await getSupabase();
  if (supabase) await supabase.auth.signOut();
  applySession(null);
}

export async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(pin);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return (await hashPin(pin)) === hash;
}
