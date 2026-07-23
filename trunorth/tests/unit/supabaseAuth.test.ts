import { describe, it, expect, beforeAll } from "vitest";
import { SignJWT } from "jose";

// HS256 path only — the JWKS branch needs a live Supabase project (network),
// so it's exercised manually (docs/context/server-auth-supabase.md) rather than here.
const JWT_SECRET = "test-secret-not-for-production";
process.env.SUPABASE_JWT_SECRET = JWT_SECRET;
process.env.SUPABASE_URL = "https://example.supabase.co";

describe("verifySupabaseToken (HS256)", () => {
  let verifySupabaseToken: typeof import("../../server/auth/supabase.js").verifySupabaseToken;

  beforeAll(async () => {
    ({ verifySupabaseToken } = await import("../../server/auth/supabase.js"));
  });

  async function signToken(payload: Record<string, unknown>): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(JWT_SECRET));
  }

  it("maps a valid Supabase-shaped token to an AuthUser", async () => {
    const token = await signToken({ sub: "user-123", email: "parent@example.com" });
    const user = await verifySupabaseToken(token);
    expect(user).toEqual({ id: "user-123", email: "parent@example.com", role: "parent" });
  });

  it("rejects a token signed with the wrong secret", async () => {
    const token = await new SignJWT({ sub: "user-123", email: "parent@example.com" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode("wrong-secret"));
    expect(await verifySupabaseToken(token)).toBeNull();
  });

  it("rejects a token missing sub/email claims", async () => {
    const token = await signToken({ role: "parent" });
    expect(await verifySupabaseToken(token)).toBeNull();
  });

  it("rejects garbage input", async () => {
    expect(await verifySupabaseToken("not-a-jwt")).toBeNull();
  });
});
