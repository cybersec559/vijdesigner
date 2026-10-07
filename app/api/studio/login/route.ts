import { NextResponse } from "next/server";
import {
  STUDIO_COOKIE,
  createSessionToken,
  passwordsMatch,
  sessionCookieOptions,
  studioConfigured,
} from "@/lib/studio-auth";

export async function POST(request: Request) {
  if (!studioConfigured()) {
    return NextResponse.json(
      { error: "Set STUDIO_PASSWORD in .env.local, then restart the dev server." },
      { status: 503 },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const password =
    body &&
    typeof body === "object" &&
    "password" in body &&
    typeof body.password === "string"
      ? body.password
      : "";
  const expected = process.env.STUDIO_PASSWORD ?? "";
  if (!passwordsMatch(password, expected)) {
    return NextResponse.json(
      { error: "That password does not open the studio." },
      { status: 401 },
    );
  }

  const token = createSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Set STUDIO_PASSWORD in .env.local, then restart the dev server." },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(STUDIO_COOKIE, token, sessionCookieOptions());
  return response;
}
