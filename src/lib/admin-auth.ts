import { randomBytes } from "crypto";
import type { NextRequest } from "next/server";
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-admin";

export const ADMIN_SESSION_COOKIE = "govflow-admin-session";
const ADMIN_SESSION_HOURS = 12;

type AdminUserRow = {
  id: string;
  username: string;
  display_name: string | null;
};

type AdminSessionRow = {
  id: string;
  admin_user_id: string;
  session_token: string;
  expires_at: string;
  revoked_at: string | null;
};

export interface AdminSessionInfo {
  sessionId: string;
  userId: string;
  username: string;
  displayName?: string;
  token: string;
  expiresAt: string;
}

export function isAdminSqlConfigured(): boolean {
  return hasSupabaseAdminConfig;
}

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<AdminUserRow | null> {
  if (!hasSupabaseAdminConfig) return null;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.rpc("verify_admin_login", {
    p_username: username,
    p_password: password,
  });
  if (error) {
    throw new Error(error.message);
  }
  const rows = (data || []) as AdminUserRow[];
  return rows[0] || null;
}

export async function createAdminSession(userId: string): Promise<AdminSessionInfo> {
  if (!hasSupabaseAdminConfig) {
    throw new Error("Admin SQL auth requires Supabase admin config.");
  }
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_HOURS * 60 * 60 * 1000).toISOString();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("admin_sessions")
    .insert({
      admin_user_id: userId,
      session_token: token,
      expires_at: expiresAt,
    })
    .select("id, admin_user_id, session_token, expires_at, revoked_at")
    .single<AdminSessionRow>();

  if (error || !data) {
    throw new Error(error?.message || "Could not create admin session.");
  }

  const { data: userData, error: userError } = await supabase
    .from("admin_users")
    .select("username, display_name")
    .eq("id", userId)
    .maybeSingle<{ username: string; display_name: string | null }>();
  if (userError || !userData) {
    throw new Error(userError?.message || "Could not resolve admin profile.");
  }

  return {
    sessionId: data.id,
    userId: data.admin_user_id,
    username: userData.username,
    displayName: userData.display_name ?? undefined,
    token: data.session_token,
    expiresAt: data.expires_at,
  };
}

export async function getAdminSessionFromRequest(
  request: NextRequest
): Promise<AdminSessionInfo | null> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value?.trim();
  if (!token || !hasSupabaseAdminConfig) return null;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("admin_sessions")
    .select("id, admin_user_id, session_token, expires_at, revoked_at")
    .eq("session_token", token)
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle<AdminSessionRow>();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) return null;

  const { data: userData, error: userError } = await supabase
    .from("admin_users")
    .select("username, display_name")
    .eq("id", data.admin_user_id)
    .maybeSingle<{ username: string; display_name: string | null }>();
  if (userError || !userData) {
    throw new Error(userError?.message || "Could not resolve admin profile.");
  }

  void supabase
    .from("admin_sessions")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", data.id);

  return {
    sessionId: data.id,
    userId: data.admin_user_id,
    username: userData.username,
    displayName: userData.display_name ?? undefined,
    token: data.session_token,
    expiresAt: data.expires_at,
  };
}

export async function isAdminAuthorized(request: NextRequest): Promise<boolean> {
  const session = await getAdminSessionFromRequest(request);
  return Boolean(session);
}

export async function revokeAdminSession(token: string): Promise<void> {
  if (!hasSupabaseAdminConfig) return;
  const supabase = getSupabaseAdminClient();
  await supabase
    .from("admin_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("session_token", token);
}
