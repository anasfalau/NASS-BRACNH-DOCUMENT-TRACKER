-- ================================================================
--  NASS Branch Tracker — RLS for nass_audit
--  Authenticated users can read the audit log.
--  Only the trigger (runs as SECURITY DEFINER via service role)
--  can INSERT — no user-facing insert policy needed.
-- ================================================================

alter table public.nass_audit enable row level security;

drop policy if exists "audit_select" on public.nass_audit;

-- All authenticated users can read the full audit trail
create policy "audit_select"
  on public.nass_audit
  for select
  to authenticated
  using (true);
