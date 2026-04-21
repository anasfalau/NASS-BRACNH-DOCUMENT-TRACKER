-- ================================================================
--  NASS Branch Tracker — Daily Overdue Alert Cron Job
--  Phase 5 — 2026-04-22
--
--  Requires:
--    • pg_cron extension (enable in Supabase Dashboard → Extensions)
--    • pg_net  extension (enabled by default on Supabase)
--    • CRON_SECRET Supabase secret matching the Edge Function env var
--
--  Schedule: every day at 06:00 UTC (07:00 WAT / West Africa Time)
--
--  To set the secret:
--    supabase secrets set CRON_SECRET=<your-random-secret>
--    supabase secrets set RESEND_API_KEY=<your-resend-key>
--    supabase secrets set RESEND_FROM_EMAIL=alerts@yourdomain.com
--    supabase secrets set ALERT_TO_EMAIL=nassbranch01@gmail.com
-- ================================================================

-- Enable pg_cron (idempotent — safe to run even if already enabled)
create extension if not exists pg_cron with schema extensions;
grant usage on schema cron to postgres;

-- Remove old job if it exists (idempotent re-run)
select cron.unschedule('nass-overdue-alerts') where exists (
  select 1 from cron.job where jobname = 'nass-overdue-alerts'
);

-- Schedule daily alert at 06:00 UTC
select cron.schedule(
  'nass-overdue-alerts',
  '0 6 * * *',
  $$
  select net.http_post(
    url     := 'https://sblqmpmawkogbbzzkwxt.supabase.co/functions/v1/overdue-alerts',
    headers := jsonb_build_object(
                 'Content-Type',    'application/json',
                 'x-cron-secret',   current_setting('app.cron_secret', true)
               ),
    body    := '{}'::jsonb
  ) as request_id;
  $$
);

-- Store the cron secret as a Postgres runtime parameter so the
-- cron job above can read it without hardcoding.
-- Run this once manually after deploying:
--   ALTER DATABASE postgres SET app.cron_secret = '<your-CRON_SECRET>';
-- Or set it here (replace the placeholder):
-- ALTER DATABASE postgres SET app.cron_secret = 'REPLACE_WITH_YOUR_CRON_SECRET';
