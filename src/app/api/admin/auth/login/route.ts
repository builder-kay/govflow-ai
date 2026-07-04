import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  isAdminSqlConfigured,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

type LoginPayload = {
  username?: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  if (!isAdminSqlConfigured()) {
    return NextResponse.json(
      { error: "Admin SQL auth is not configured. Connect Supabase service role." },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as LoginPayload;
  const username = body.username?.trim().toLowerCase();
  const password = body.password?.trim();
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const adminUser = await verifyAdminCredentials(username, password);
  if (!adminUser) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }
  const session = await createAdminSession(adminUser.id);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: session.token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
