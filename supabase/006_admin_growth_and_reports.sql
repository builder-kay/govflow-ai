-- 006_admin_growth_and_reports.sql
-- Analytics + reported problems for Tumiwura admin console.

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
