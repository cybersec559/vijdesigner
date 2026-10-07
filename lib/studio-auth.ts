import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const STUDIO_COOKIE = "atelier_studio";

function studioPassword(): string | undefined {
  const password = process.env.STUDIO_PASSWORD;
  if (!password) {
    return undefined;
  }
  return password;
}

export function studioConfigured(): boolean {
  return studioPassword() !== undefined;
}

function expectedToken(): string | undefined {
  const password = studioPassword();
  if (!password) {
    return undefined;
  }
  return createHmac("sha256", password).update("atelier-studio-v1").digest("hex");
}

function digest(value: string): Buffer {
  return createHmac("sha256", "atelier-compare").update(value).digest();
}

export function passwordsMatch(given: string, expected: string): boolean {
  return timingSafeEqual(digest(given), digest(expected));
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  };
}

export async function isStudioAuthed(): Promise<boolean> {
  const token = expectedToken();
  if (!token) {
    return false;
  }
  const cookieStore = await cookies();
  const given = cookieStore.get(STUDIO_COOKIE)?.value;
  if (!given) {
    return false;
  }
  return passwordsMatch(given, token);
}

export function createSessionToken(): string | undefined {
  return expectedToken();
}
