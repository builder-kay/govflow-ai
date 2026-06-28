-- GovFlow Relay pilot schema (passport only)
-- Run in Supabase SQL editor before using Relay APIs in production.

create table if not exists public.relay_cases (
  id uuid primary key,
  user_id uuid not null,
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
  ),
  fee_ghs numeric(10,2) not null default 0,
  payment_status text not null check (payment_status in ('unpaid','pending','paid','failed')) default 'unpaid',
  paystack_reference text,
  paystack_authorization_url text,
  assigned_coordinator text,
  assigned_runner text,
  sla_hours integer not null default 72,
  intake_json jsonb not null,
  steps_json jsonb not null default '[]'::jsonb,
  events_json jsonb not null default '[]'::jsonb,
  documents_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists relay_cases_user_id_idx on public.relay_cases (user_id);
create index if not exists relay_cases_status_idx on public.relay_cases (status);
create index if not exists relay_cases_created_at_idx on public.relay_cases (created_at desc);

alter table public.relay_cases enable row level security;

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
  using (auth.uid() = user_id);
