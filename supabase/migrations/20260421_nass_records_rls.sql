-- ================================================================
--  NASS Branch Tracker — Row Level Security for nass_records
--  Phase 1 security hardening — 2026-04-21
--
--  Role hierarchy (from nass_profiles):
--    viewer    → read only
--    editor    → read + insert + update
--    superuser → full access (read + insert + update + delete)
--
--  All writes from manage-users Edge Function use the service role
--  key and therefore bypass RLS — no change needed there.
-- ================================================================

-- ── Helper function ───────────────────────────────────────────────
-- Returns the current authenticated user's role from nass_profiles.
-- SECURITY DEFINER + search_path lock prevents privilege escalation.
-- Result is cached per transaction by Postgres, so the overhead of
-- reading nass_profiles is paid once per query, not per row.
create or replace function public.nass_current_role()
  returns text
  language sql
  stable
  security definer
  set search_path = public
as $$
  select coalesce(
    (select role from public.nass_profiles where user_id = auth.uid() limit 1),
    'viewer'
  );
$$;

-- ── Enable RLS ────────────────────────────────────────────────────
alter table public.nass_records enable row level security;

-- Drop any pre-existing policies so this migration is idempotent
drop policy if exists "records_select"  on public.nass_records;
drop policy if exists "records_insert"  on public.nass_records;
drop policy if exists "records_update"  on public.nass_records;
drop policy if exists "records_delete"  on public.nass_records;

-- ── Policies ──────────────────────────────────────────────────────

-- SELECT: every authenticated user can read all records
create policy "records_select"
  on public.nass_records
  for select
  to authenticated
  using (true);

-- INSERT: editor and superuser only
create policy "records_insert"
  on public.nass_records
  for insert
  to authenticated
  with check (public.nass_current_role() in ('editor', 'superuser'));

-- UPDATE: editor and superuser only
create policy "records_update"
  on public.nass_records
  for update
  to authenticated
  using  (public.nass_current_role() in ('editor', 'superuser'))
  with check (public.nass_current_role() in ('editor', 'superuser'));

-- DELETE: superuser only
create policy "records_delete"
  on public.nass_records
  for delete
  to authenticated
  using (public.nass_current_role() = 'superuser');
