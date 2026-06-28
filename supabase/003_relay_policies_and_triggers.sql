-- 003_relay_policies_and_triggers.sql
-- RLS + update triggers for Relay tables.

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
