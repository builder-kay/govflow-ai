-- 001_relay_cases.sql
-- Core Agent case table (passport pilot)

create extension if not exists pgcrypto;

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
  -- denormalized snapshots used by app APIs today
  steps_json jsonb not null default '[]'::jsonb,
  events_json jsonb not null default '[]'::jsonb,
  documents_json jsonb not null default '[]'::jsonb,
  -- pilot metrics helpers
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
