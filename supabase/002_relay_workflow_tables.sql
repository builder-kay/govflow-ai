-- 002_relay_workflow_tables.sql
-- Normalized workflow tables for Agent operations.

create extension if not exists pgcrypto;

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
