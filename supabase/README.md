# Supabase Agent Schema Run Order

Quick start (single file):

- Run `000_bootstrap_all.sql` once on a new Supabase project.

Alternative (modular files):

Run these SQL files in order:

1. `001_relay_cases.sql`
2. `002_relay_workflow_tables.sql`
3. `003_relay_policies_and_triggers.sql`
4. `004_relay_metrics_view.sql`
5. `005_admin_portal_auth.sql`

Notes:

- `relay_schema.sql` is the earlier minimal single-table schema used for quick setup.
- The numbered files are the full schema set for the Agent pilot (cases, steps, documents, events, presence alerts, RLS, and metrics view).
- `005_admin_portal_auth.sql` adds SQL-backed `/tumiwura` admin sign-in (`admin_users`, `admin_sessions`, and `verify_admin_login`).
