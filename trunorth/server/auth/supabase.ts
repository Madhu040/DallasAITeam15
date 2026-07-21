/**
 * Verifies Supabase-issued access tokens (ADR-003) and maps them to the app's
 * `AuthUser` shape. Every Supabase Auth user is treated as a parent — children
 * never authenticate directly (spec: children are profiles owned by a parent row).
 *
 * Two verification modes, selected by `SUPABASE_JWT_SECRET`:
 *  - set (legacy projects, shared HS256 secret): local `jwtVerify`, no network call.
 *  - empty (current projects, asymmetric signing keys): `createRemoteJWKSet` against
 *    the project's JWKS endpoint. jose caches the key set in-module, so this costs a
 *    network round-trip only on the first verification (and on key rotation), not
 *    per request.
 */

import { createRemoteJWKSet, jwtVerify } from "jose";
import type { AuthUser } from "../../src/types/index.js";
import { serverConfig } from "../config.js";

let hs256Secret: Uint8Array | null = null;
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getHs256Secret(): Uint8Array {
  hs256Secret ??= new TextEncoder().encode(serverConfig.supabase.jwtSecret);
  return hs256Secret;
}

function getJwks(): ReturnType<typeof createRemoteJWKSet> {
  jwks ??= createRemoteJWKSet(
    new URL(serverConfig.supabase.jwksUrl || `${serverConfig.supabase.url}/auth/v1/.well-known/jwks.json`),
  );
  return jwks;
}

export async function verifySupabaseToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = serverConfig.supabase.jwtSecret
      ? await jwtVerify(token, getHs256Secret())
      : await jwtVerify(token, getJwks());

    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return { id: payload.sub, email: payload.email, role: "parent" };
  } catch {
    return null;
  }
}
