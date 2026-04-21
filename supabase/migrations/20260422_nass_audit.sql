-- ================================================================
--  NASS Branch Tracker — Audit / Change History
--  Phase 4 analytics & automation — 2026-04-21
--
--  Logs key field changes on nass_records:
--    created  — new record inserted
--    status   — status field changed
--    location — location field changed
--    officer  — officer field changed
--    action   — last_action field changed
--    updated  — other fields changed (remarks, sla, dates, etc.)
-- ================================================================

-- ── Audit table ───────────────────────────────────────────────────
create table if not exists public.nass_audit (
  id           uuid primary key default gen_random_uuid(),
  record_id    uuid references public.nass_records(id) on delete cascade not null,
  user_email   text,
  action       text not null,   -- created | status | location | officer | action | updated
  old_val      text,
  new_val      text,
  changed_at   timestamptz default now()
);

-- Index for fast per-record history lookup
create index if not exists nass_audit_record_id_idx
  on public.nass_audit(record_id, changed_at desc);

-- RLS: authenticated users can read; only trigger (service role) writes
alter table public.nass_audit enable row level security;

drop policy if exists "audit_select" on public.nass_audit;
create policy "audit_select"
  on public.nass_audit
  for select
  to authenticated
  using (true);

-- ── Trigger function ─────────────────────────────────────────────
create or replace function public.nass_record_audit()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  _email text;
  _logged boolean := false;
begin
  -- Resolve the current user's email from nass_profiles
  select email into _email
  from public.nass_profiles
  where user_id = auth.uid()
  limit 1;

  if _email is null then _email := 'system'; end if;

  if TG_OP = 'INSERT' then
    insert into public.nass_audit(record_id, user_email, action, old_val, new_val)
    values (NEW.id, _email, 'created', null, left(NEW.subject, 120));

  elsif TG_OP = 'UPDATE' then
    -- Log each changed key field individually
    if OLD.status is distinct from NEW.status then
      insert into public.nass_audit(record_id, user_email, action, old_val, new_val)
      values (NEW.id, _email, 'status', OLD.status, NEW.status);
      _logged := true;
    end if;

    if OLD.location is distinct from NEW.location then
      insert into public.nass_audit(record_id, user_email, action, old_val, new_val)
      values (NEW.id, _email, 'location', OLD.location, NEW.location);
      _logged := true;
    end if;

    if OLD.officer is distinct from NEW.officer then
      insert into public.nass_audit(record_id, user_email, action, old_val, new_val)
      values (NEW.id, _email, 'officer', OLD.officer, NEW.officer);
      _logged := true;
    end if;

    if OLD.last_action is distinct from NEW.last_action then
      insert into public.nass_audit(record_id, user_email, action, old_val, new_val)
      values (NEW.id, _email, 'action', OLD.last_action, NEW.last_action);
      _logged := true;
    end if;

    -- If only non-key fields changed (remarks, sla, dates…) log a generic update
    if not _logged then
      insert into public.nass_audit(record_id, user_email, action, old_val, new_val)
      values (NEW.id, _email, 'updated', null, null);
    end if;
  end if;

  return NEW;
end;
$$;

-- ── Attach trigger ────────────────────────────────────────────────
drop trigger if exists nass_record_audit_trigger on public.nass_records;
create trigger nass_record_audit_trigger
  after insert or update on public.nass_records
  for each row execute function public.nass_record_audit();
