// ================================================================
//  NASS Branch Tracker — Monthly SLA Summary Report
//  Runs on the 1st of each month at 07:00 UTC via pg_cron.
//  Computes last month's statistics and emails a branded summary.
//
//  Required secrets (same as overdue-alerts):
//    RESEND_API_KEY, RESEND_FROM_EMAIL, ALERT_TO_EMAIL, CRON_SECRET
// ================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL              = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY            = Deno.env.get('RESEND_API_KEY') ?? '';
const RESEND_FROM               = Deno.env.get('RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev';
const ALERT_TO                  = Deno.env.get('ALERT_TO_EMAIL')   ?? 'nassbranch01@gmail.com';
const CRON_SECRET               = Deno.env.get('CRON_SECRET')       ?? '';
const APP_URL = 'https://anasfalau.github.io/NASS-BRANCH-DOCUMENT-TRACKER/';

Deno.serve(async (req) => {
  // ── Auth ─────────────────────────────────────────────────────────
  const cronHdr = req.headers.get('x-cron-secret') ?? '';
  const auth    = req.headers.get('Authorization') ?? '';
  const isCron  = CRON_SECRET && cronHdr === CRON_SECRET;
  const isJwt   = auth.startsWith('Bearer ');
  if (!isCron && !isJwt) return resp({ error: 'Unauthorized' }, 401);

  if (!isCron && isJwt) {
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await sb.auth.getUser(auth.replace('Bearer ', ''));
    if (error) return resp({ error: 'Unauthorized' }, 401);
  }

  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // ── Date range: last calendar month ──────────────────────────
    const now       = new Date();
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastOfLastMonth  = new Date(firstOfThisMonth.getTime() - 1);

    const rangeStart = firstOfLastMonth.toISOString().split('T')[0];
    const rangeEnd   = lastOfLastMonth.toISOString().split('T')[0];
    const monthLabel = firstOfLastMonth.toLocaleDateString('en-GB', {
      month: 'long', year: 'numeric',
    });

    // ── Fetch all records received in the month ───────────────────
    const { data: received, error: recErr } = await sb
      .from('nass_records')
      .select('file_ref,subject,officer,status,due_date,date_moved,delay_flag')
      .gte('date_received', rangeStart)
      .lte('date_received', rangeEnd);
    if (recErr) throw recErr;

    const total      = received?.length ?? 0;
    const completed  = (received ?? []).filter(r =>
      ['Completed', 'Filed'].includes(r.status ?? '')).length;
    const stillActive = (received ?? []).filter(r =>
      !['Completed', 'Filed', 'Cancelled'].includes(r.status ?? '')).length;
    const overdue    = (received ?? []).filter(r =>
      r.delay_flag === 'OVERDUE' &&
      !['Completed', 'Filed', 'Cancelled'].includes(r.status ?? '')).length;
    const onTimePct  = total > 0
      ? Math.round(((total - overdue) / total) * 100) : 100;

    // ── Officer workload (active records this month by officer) ───
    const officerMap: Record<string, number> = {};
    (received ?? []).forEach(r => {
      if (r.officer && !['Completed', 'Filed', 'Cancelled'].includes(r.status ?? '')) {
        officerMap[r.officer] = (officerMap[r.officer] ?? 0) + 1;
      }
    });
    const officerRows = Object.entries(officerMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // ── Overdue records still outstanding ─────────────────────────
    const { data: overdueAll } = await sb
      .from('nass_records')
      .select('file_ref,subject,officer,due_date,status')
      .not('status', 'in', '("Completed","Filed","Cancelled")')
      .eq('delay_flag', 'OVERDUE')
      .order('due_date', { ascending: true })
      .limit(15);

    const dateStr = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });

    const html = buildEmail({
      monthLabel, dateStr, total, completed, stillActive, overdue, onTimePct,
      officerRows, overdueAll: overdueAll ?? [],
    });

    if (!RESEND_API_KEY) {
      return new Response(html, { headers: { 'content-type': 'text/html' } });
    }

    const subject = `NASS Branch — Monthly SLA Report · ${monthLabel}`;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: RESEND_FROM, to: [ALERT_TO], subject, html }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    const rj = await res.json();
    return resp({ sent: true, month: monthLabel, total, completed, overdue, resend_id: rj.id });

  } catch (err) {
    console.error('monthly-sla-report error:', err);
    return resp({ error: String(err) }, 500);
  }
});

// ── Helpers ───────────────────────────────────────────────────────
function esc(s: unknown) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function fmtDate(v: string) {
  if (!v) return '—';
  const p = v.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : v;
}
function daysOver(d: string) {
  const due = new Date(d); due.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.max(0, Math.round((today.getTime() - due.getTime()) / 86_400_000));
}

function buildEmail(p: {
  monthLabel: string; dateStr: string;
  total: number; completed: number; stillActive: number;
  overdue: number; onTimePct: number;
  officerRows: [string, number][];
  overdueAll: Record<string, string>[];
}) {
  const rate = p.total > 0 ? `${Math.round((p.completed / p.total) * 100)}%` : 'N/A';

  const statCards = [
    { n: p.total,       l: 'Received',   c: '#002655' },
    { n: p.completed,   l: 'Completed',  c: '#1a7a3c' },
    { n: p.stillActive, l: 'Still Active', c: '#0055aa' },
    { n: p.overdue,     l: 'Overdue',    c: '#b81c2e' },
    { n: `${p.onTimePct}%`, l: 'SLA Met', c: p.onTimePct >= 80 ? '#1a7a3c' : '#e65100' },
  ].map(s => `
    <td style="text-align:center;padding:16px 10px;background:#fff;border-radius:8px;border-top:3px solid ${s.c}">
      <div style="font-size:26px;font-weight:800;color:${s.c};line-height:1">${esc(String(s.n))}</div>
      <div style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#5a6375;margin-top:5px">${esc(s.l)}</div>
    </td>`).join('<td style="width:8px"></td>');

  const officerTrs = p.officerRows.length === 0
    ? '<tr><td colspan="2" style="text-align:center;color:#888;padding:14px">No active records.</td></tr>'
    : p.officerRows.map(([off, cnt]) => `
      <tr>
        <td style="padding:8px 12px;font-size:13px;border-bottom:1px solid #e8eaf0">${esc(off)}</td>
        <td style="padding:8px 12px;font-size:13px;text-align:center;border-bottom:1px solid #e8eaf0;font-weight:700;color:#003366">${cnt}</td>
      </tr>`).join('');

  const overdueRows = p.overdueAll.length === 0
    ? '<tr><td colspan="4" style="text-align:center;color:#888;padding:14px">No overdue records.</td></tr>'
    : p.overdueAll.map(r => {
        const days = r.due_date ? daysOver(r.due_date) : 0;
        const urgency = days >= 14 ? '#b81c2e' : days >= 7 ? '#e65100' : '#f9a825';
        return `<tr>
          <td style="padding:9px 12px;font-size:12px;border-bottom:1px solid #e8eaf0;white-space:nowrap">${esc(r.file_ref ?? '—')}</td>
          <td style="padding:9px 12px;font-size:12px;border-bottom:1px solid #e8eaf0">${esc((r.subject ?? '').slice(0,70))}${(r.subject ?? '').length > 70 ? '…' : ''}</td>
          <td style="padding:9px 12px;font-size:12px;border-bottom:1px solid #e8eaf0;white-space:nowrap">${esc(r.officer ?? '—')}</td>
          <td style="padding:9px 12px;font-size:12px;text-align:center;border-bottom:1px solid #e8eaf0">
            <span style="background:${urgency}1a;color:${urgency};font-weight:700;padding:2px 8px;border-radius:12px">${days}d</span>
          </td></tr>`;
      }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef1f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f6;padding:32px 16px">
<tr><td align="center">
<table width="660" cellpadding="0" cellspacing="0" style="max-width:660px;width:100%;background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.10);overflow:hidden">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#002655,#004080);padding:28px 32px">
    <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:6px">Nigerian Navy — NASS Branch</div>
    <div style="font-size:20px;font-weight:800;color:#fff">Monthly SLA Report</div>
    <div style="font-size:13px;color:rgba(255,255,255,.7);margin-top:4px">${esc(p.monthLabel)} &nbsp;·&nbsp; Generated ${esc(p.dateStr)}</div>
  </td></tr>

  <!-- Summary Rate Banner -->
  <tr><td style="background:${p.onTimePct >= 80 ? '#d0f0e0' : '#fde8e8'};border-left:4px solid ${p.onTimePct >= 80 ? '#1a7a3c' : '#b81c2e'};padding:14px 32px">
    <span style="font-size:14px;font-weight:700;color:${p.onTimePct >= 80 ? '#0d6e35' : '#b81c2e'}">
      ${p.onTimePct >= 80 ? '✅' : '⚠'} SLA compliance: ${esc(String(p.onTimePct))}% — ${rate} of records received completed within SLA.
    </span>
  </td></tr>

  <!-- Stat Cards -->
  <tr><td style="padding:24px 32px 0">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa;border-radius:8px;padding:12px">
      <tr>${statCards}</tr>
    </table>
  </td></tr>

  <!-- Officer Workload -->
  <tr><td style="padding:24px 32px 0">
    <div style="font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#5a6375;margin-bottom:10px">Active Records by Officer</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8eaf0;border-radius:8px;overflow:hidden">
      <thead><tr style="background:#f4f6fa">
        <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.05em;color:#5a6375;border-bottom:2px solid #dce1ea">Officer</th>
        <th style="padding:8px 12px;text-align:center;font-size:11px;font-weight:700;letter-spacing:.05em;color:#5a6375;border-bottom:2px solid #dce1ea">Active Records</th>
      </tr></thead>
      <tbody>${officerTrs}</tbody>
    </table>
  </td></tr>

  <!-- Outstanding Overdue -->
  <tr><td style="padding:24px 32px">
    <div style="font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#5a6375;margin-bottom:10px">⏰ Currently Overdue Records (Top 15)</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8eaf0;border-radius:8px;overflow:hidden">
      <thead><tr style="background:#fde8e8">
        <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#5a6375;border-bottom:2px solid #dce1ea">File Ref</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#5a6375;border-bottom:2px solid #dce1ea">Subject</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#5a6375;border-bottom:2px solid #dce1ea">Officer</th>
        <th style="padding:8px 12px;text-align:center;font-size:11px;font-weight:700;color:#5a6375;border-bottom:2px solid #dce1ea">Days Over</th>
      </tr></thead>
      <tbody>${overdueRows}</tbody>
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding:0 32px 28px;text-align:center">
    <a href="${APP_URL}" style="display:inline-block;background:#002655;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:.03em">Open NASS Tracker ↗</a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f7f9fc;padding:16px 32px;text-align:center;border-top:1px solid #e8eaf0">
    <div style="font-size:11px;color:#9aa3b0">Automated monthly SLA report from NASS Branch Document Workflow Tracker.<br>Naval Headquarters, Abuja.</div>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

function resp(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
