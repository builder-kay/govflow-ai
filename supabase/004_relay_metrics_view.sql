-- 004_relay_metrics_view.sql
-- Optional reporting view for pilot success metrics.

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
