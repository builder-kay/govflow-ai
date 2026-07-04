import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getAdminSecret } from "@/lib/admin-auth";

type LoginPayload = {
  password?: string;
};

export async function POST(request: NextRequest) {
  const secret = getAdminSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "Admin auth is not configured. Set RELAY_OPS_SECRET." },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as LoginPayload;
  const password = body.password?.trim();
  if (!password || password !== secret) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: secret,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
