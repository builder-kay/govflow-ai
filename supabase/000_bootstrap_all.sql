-- 000_bootstrap_all.sql
-- Fresh Supabase bootstrap for GovFlow Agent data layer.
-- Run this once on a new Supabase project.

create extension if not exists pgcrypto;

-- =========
-- CORE TABLE
-- =========
create table if not exists public.relay_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  service_type text not null check (service_type in ('passport')),
  status text not null check (
    status in (
      'intake_received',
      'payment_pending',
      'ops_triage',
      'in_progress',
      'awaiting_user',
      'completed',
      'cancelled'
    )
  ) default 'intake_received',
  fee_ghs numeric(10, 2) not null default 0,
  payment_status text not null check (payment_status in ('unpaid', 'pending', 'paid', 'failed')) default 'unpaid',
  paystack_reference text,
  paystack_authorization_url text,
  assigned_coordinator text,
  assigned_runner text,
  sla_hours integer not null default 72,
  intake_json jsonb not null default '{}'::jsonb,
  steps_json jsonb not null default '[]'::jsonb,
  events_json jsonb not null default '[]'::jsonb,
  documents_json jsonb not null default '[]'::jsonb,
  first_action_at timestamptz,
  completed_at timestamptz,
  rework_count integer not null default 0,
  csat_score integer check (csat_score between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists relay_cases_user_id_idx on public.relay_cases (user_id);
create index if not exists relay_cases_status_idx on public.relay_cases (status);
create index if not exists relay_cases_payment_status_idx on public.relay_cases (payment_status);
create index if not exists relay_cases_created_at_idx on public.relay_cases (created_at desc);

-- ==================
-- WORKFLOW SUBTABLES
-- ==================
create table if not exists public.relay_case_steps (
  id uuid primary key default gen_random_uuid(),
  relay_case_id uuid not null references public.relay_cases (id) on delete cascade,
  title text not null,
  description text not null default '',
  assignee text not null check (assignee in ('govflow_coordinator', 'field_runner', 'user')),
  status text not null check (status in ('pending', 'in_progress', 'awaiting_user', 'completed', 'blocked')) default 'pending',
  requires_user_presence boolean not null default false,
  due_at timestamptz,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists relay_case_steps_case_id_idx on public.relay_case_steps (relay_case_id);
create index if not exists relay_case_steps_status_idx on public.relay_case_steps (status);
create index if not exists relay_case_steps_due_at_idx on public.relay_case_steps (due_at);

create table if not exists public.relay_documents (
  id uuid primary key default gen_random_uuid(),
  relay_case_id uuid not null references public.relay_cases (id) on delete cascade,
  file_name text not null,
  mime_type text not null,
  file_size bigint not null default 0,
  storage_path text,
  uploaded_by text not null default 'user' check (uploaded_by in ('user', 'coordinator', 'runner', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists relay_documents_case_id_idx on public.relay_documents (relay_case_id);
create index if not exists relay_documents_created_at_idx on public.relay_documents (created_at desc);

create table if not exists public.relay_events (
  id uuid primary key default gen_random_uuid(),
  relay_case_id uuid not null references public.relay_cases (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'case_created',
      'payment_initialized',
      'payment_confirmed',
      'ops_assigned',
      'step_updated',
      'presence_required',
      'case_completed',
      'note'
    )
  ),
  actor text not null default 'system',
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists relay_events_case_id_idx on public.relay_events (relay_case_id);
create index if not exists relay_events_type_idx on public.relay_events (event_type);
create index if not exists relay_events_created_at_idx on public.relay_events (created_at desc);

create table if not exists public.relay_presence_alerts (
  id uuid primary key default gen_random_uuid(),
  relay_case_id uuid not null references public.relay_cases (id) on delete cascade,
  relay_case_step_id uuid references public.relay_case_steps (id) on delete set null,
  status text not null check (status in ('pending', 'sent', 'failed', 'acknowledged')) default 'pending',
  channel text not null check (channel in ('sms', 'in_app', 'email')) default 'sms',
  destination text,
  scheduled_for timestamptz,
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists relay_presence_alerts_case_id_idx on public.relay_presence_alerts (relay_case_id);
create index if not exists relay_presence_alerts_status_idx on public.relay_presence_alerts (status);
create index if not exists relay_presence_alerts_scheduled_for_idx on public.relay_presence_alerts (scheduled_for);

-- ========
-- TRIGGERS
-- ========
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists relay_cases_set_updated_at on public.relay_cases;
create trigger relay_cases_set_updated_at
before update on public.relay_cases
for each row
execute function public.set_updated_at();

drop trigger if exists relay_case_steps_set_updated_at on public.relay_case_steps;
create trigger relay_case_steps_set_updated_at
before update on public.relay_case_steps
for each row
execute function public.set_updated_at();

drop trigger if exists relay_documents_set_updated_at on public.relay_documents;
create trigger relay_documents_set_updated_at
before update on public.relay_documents
for each row
execute function public.set_updated_at();

drop trigger if exists relay_presence_alerts_set_updated_at on public.relay_presence_alerts;
create trigger relay_presence_alerts_set_updated_at
before update on public.relay_presence_alerts
for each row
execute function public.set_updated_at();

-- ==========
-- RLS POLICIES
-- ==========
alter table public.relay_cases enable row level security;
alter table public.relay_case_steps enable row level security;
alter table public.relay_documents enable row level security;
alter table public.relay_events enable row level security;
alter table public.relay_presence_alerts enable row level security;

drop policy if exists relay_cases_owner_select on public.relay_cases;
create policy relay_cases_owner_select
on public.relay_cases
for select
using (auth.uid() = user_id);

drop policy if exists relay_cases_owner_insert on public.relay_cases;
create policy relay_cases_owner_insert
on public.relay_cases
for insert
with check (auth.uid() = user_id);

drop policy if exists relay_cases_owner_update on public.relay_cases;
create policy relay_cases_owner_update
on public.relay_cases
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists relay_cases_owner_delete on public.relay_cases;
create policy relay_cases_owner_delete
on public.relay_cases
for delete
using (auth.uid() = user_id);

drop policy if exists relay_case_steps_owner_select on public.relay_case_steps;
create policy relay_case_steps_owner_select
on public.relay_case_steps
for select
using (
  exists (
    select 1
    from public.relay_cases rc
    where rc.id = relay_case_steps.relay_case_id
      and rc.user_id = auth.uid()
  )
);

drop policy if exists relay_case_steps_owner_insert on public.relay_case_steps;
create policy relay_case_steps_owner_insert
on public.relay_case_steps
for insert
with check (
  exists (
    select 1
    from public.relay_cases rc
    where rc.id = relay_case_steps.relay_case_id
      and rc.user_id = auth.uid()
  )
);

drop policy if exists relay_case_steps_owner_update on public.relay_case_steps;
create policy relay_case_steps_owner_update
on public.relay_case_steps
for update
using (
  exists (
    select 1
    from public.relay_cases rc
    where rc.id = relay_case_steps.relay_case_id
      and rc.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.relay_cases rc
    where rc.id = relay_case_steps.relay_case_id
      and rc.user_id = auth.uid()
  )
);

drop policy if exists relay_documents_owner_all on public.relay_documents;
create policy relay_documents_owner_all
on public.relay_documents
for all
using (
  exists (
    select 1
    from public.relay_cases rc
    where rc.id = relay_documents.relay_case_id
      and rc.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.relay_cases rc
    where rc.id = relay_documents.relay_case_id
      and rc.user_id = auth.uid()
  )
);

drop policy if exists relay_events_owner_select on public.relay_events;
create policy relay_events_owner_select
on public.relay_events
for select
using (
  exists (
    select 1
    from public.relay_cases rc
    where rc.id = relay_events.relay_case_id
      and rc.user_id = auth.uid()
  )
);

drop policy if exists relay_events_owner_insert on public.relay_events;
create policy relay_events_owner_insert
on public.relay_events
for insert
with check (
  exists (
    select 1
    from public.relay_cases rc
    where rc.id = relay_events.relay_case_id
      and rc.user_id = auth.uid()
  )
);

drop policy if exists relay_presence_alerts_owner_all on public.relay_presence_alerts;
create policy relay_presence_alerts_owner_all
on public.relay_presence_alerts
for all
using (
  exists (
    select 1
    from public.relay_cases rc
    where rc.id = relay_presence_alerts.relay_case_id
      and rc.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.relay_cases rc
    where rc.id = relay_presence_alerts.relay_case_id
      and rc.user_id = auth.uid()
  )
);

-- =========
-- METRICS VIEW
-- =========
create or replace view public.relay_case_metrics as
select
  count(*)::int as total_cases,
  count(*) filter (where status = 'completed')::int as completed_cases,
  count(*) filter (where status = 'awaiting_user')::int as awaiting_user_cases,
  count(*) filter (where status = 'cancelled')::int as cancelled_cases,
  coalesce(avg(extract(epoch from (first_action_at - created_at)) / 3600) filter (where first_action_at is not null), 0)::numeric(10,2) as avg_first_action_hours,
  coalesce(avg(extract(epoch from (completed_at - created_at)) / 3600) filter (where completed_at is not null), 0)::numeric(10,2) as avg_completion_hours,
  coalesce(sum(rework_count), 0)::int as total_rework_incidents,
  coalesce(avg(csat_score) filter (where csat_score is not null), 0)::numeric(10,2) as avg_csat
from public.relay_cases;

-- ======================
-- ADMIN PORTAL AUTH SQL
-- ======================
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

-- Seed one admin user after running this file:
-- insert into public.admin_users (username, display_name, password_hash)
-- values ('tumiwura', 'Tumiwura Admin', extensions.crypt('change-this-password', extensions.gen_salt('bf')));

-- ==========================================
-- ADMIN ANALYTICS + REPORTED PROBLEMS TABLES
-- ==========================================
create table if not exists public.app_page_visits (
  id uuid primary key default gen_random_uuid(),
  pathname text not null,
  flow text not null default 'general',
  referrer text,
  user_agent text,
  visited_at timestamptz not null default now()
);

create index if not exists app_page_visits_pathname_idx on public.app_page_visits (pathname);
create index if not exists app_page_visits_flow_idx on public.app_page_visits (flow);
create index if not exists app_page_visits_visited_at_idx on public.app_page_visits (visited_at desc);

create table if not exists public.reported_problems (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'general',
  title text not null,
  details text not null,
  page_path text,
  contact_email text,
  status text not null check (status in ('open', 'investigating', 'resolved')) default 'open',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reported_problems_status_idx on public.reported_problems (status);
create index if not exists reported_problems_created_at_idx on public.reported_problems (created_at desc);

drop trigger if exists reported_problems_set_updated_at on public.reported_problems;
create trigger reported_problems_set_updated_at
before update on public.reported_problems
for each row
execute function public.set_updated_at();
