import type { User } from "@supabase/supabase-js";
import { phoneToEmailAlias } from "@/lib/auth-identifiers";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type AuthUserLookup = {
  id: string;
  email: string | null;
};

async function lookupFromAuthSchema(aliasEmail: string): Promise<AuthUserLookup | null> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .schema("auth")
    .from("users")
    .select("id, email")
    .eq("email", aliasEmail)
    .maybeSingle<AuthUserLookup>();

  if (!error) return data ?? null;
  return null;
}

async function lookupFromListUsers(aliasEmail: string): Promise<AuthUserLookup | null> {
  const admin = getSupabaseAdminClient();
  const perPage = 200;
  const maxPages = 50;

  for (let page = 1; page <= maxPages; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(error.message);
    const users = data.users || [];
    const match = users.find((user: User) => user.email?.toLowerCase() === aliasEmail);
    if (match) {
      return { id: match.id, email: match.email ?? null };
    }
    if (users.length < perPage) break;
  }

  return null;
}

export async function getAuthUserByPhone(phone: string): Promise<AuthUserLookup | null> {
  const aliasEmail = phoneToEmailAlias(phone).toLowerCase();
  const fromAuthSchema = await lookupFromAuthSchema(aliasEmail);
  if (fromAuthSchema) return fromAuthSchema;
  return lookupFromListUsers(aliasEmail);
}
