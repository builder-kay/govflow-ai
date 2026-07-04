-- 005_admin_portal_auth.sql
-- SQL-backed admin authentication for /tumiwura.
-- Run after 003_relay_policies_and_triggers.sql.

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  display_name text,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.admin_users (id) on delete cascade,
  session_token text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists admin_sessions_token_idx on public.admin_sessions (session_token);
create index if not exists admin_sessions_expires_at_idx on public.admin_sessions (expires_at);
create index if not exists admin_sessions_admin_user_id_idx on public.admin_sessions (admin_user_id);

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at
before update on public.admin_users
for each row
execute function public.set_updated_at();

create or replace function public.verify_admin_login(p_username text, p_password text)
returns table (
  id uuid,
  username text,
  display_name text
)
language sql
security definer
set search_path = public
as $$
  select au.id, au.username, au.display_name
  from public.admin_users au
  where au.is_active = true
    and lower(au.username) = lower(trim(p_username))
    and au.password_hash = extensions.crypt(p_password, au.password_hash)
  limit 1;
$$;

revoke all on function public.verify_admin_login(text, text) from public;

-- Seed one admin user (change values before running):
-- insert into public.admin_users (username, display_name, password_hash)
-- values ('tumiwura', 'Tumiwura Admin', extensions.crypt('change-this-password', extensions.gen_salt('bf')));
