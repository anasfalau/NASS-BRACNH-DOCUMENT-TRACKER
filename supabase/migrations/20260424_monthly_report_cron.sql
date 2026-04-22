-- ================================================================
--  NASS Branch Tracker — Monthly SLA Report pg_cron schedule
--  Runs on the 1st of each month at 07:00 UTC.
--  Calls the monthly-sla-report Edge Function with CRON_SECRET.
--
--  Prerequisites:
--    • pg_cron and pg_net extensions enabled (same as overdue-alerts)
--    • CRON_SECRET stored via:
--        ALTER DATABASE postgres SET app.cron_secret = '<secret>';
-- ================================================================

-- Remove any existing schedule before re-creating (idempotent)
select cron.unschedule('nass-monthly-sla-report');

-- Schedule: 07:00 UTC on the 1st of every month
select cron.schedule(
  'nass-monthly-sla-report',
  '0 7 1 * *',
  $$
    select net.http_post(
      url     := 'https://sblqmpmawkogbbzzkwxt.supabase.co/functions/v1/monthly-sla-report',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'x-cron-secret', current_setting('app.cron_secret')
      ),
      body    := '{}'::jsonb
    );
  $$
);
