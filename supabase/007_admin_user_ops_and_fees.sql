-- 007_admin_user_ops_and_fees.sql
-- Fee configuration table for Agent services.

create table if not exists public.relay_service_fees (
  service_type text primary key check (service_type in ('passport')),
  fee_ghs numeric(10, 2) not null check (fee_ghs > 0),
  updated_at timestamptz not null default now()
);

drop trigger if exists relay_service_fees_set_updated_at on public.relay_service_fees;
create trigger relay_service_fees_set_updated_at
before update on public.relay_service_fees
for each row
execute function public.set_updated_at();

insert into public.relay_service_fees (service_type, fee_ghs)
values ('passport', 280)
on conflict (service_type) do nothing;
