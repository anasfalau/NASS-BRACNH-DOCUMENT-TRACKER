// ================================================================
//  NASS Branch Tracker — Overdue SLA Email Alerts
//  Called daily by pg_cron via x-cron-secret header.
//  Sends a summary email to the admin via Resend.
//
//  Required Supabase secrets (supabase secrets set --env-file .env):
//    RESEND_API_KEY          — from resend.com dashboard
//    RESEND_FROM_EMAIL       — verified sender, e.g. alerts@yourdomain.com
//                             (use "onboarding@resend.dev" for testing)
//    ALERT_TO_EMAIL          — recipient, defaults to nassbranch01@gmail.com
//    CRON_SECRET             — shared secret set in both this fn and pg_cron
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
  // ── Auth: accept cron secret OR a valid Supabase user JWT ─────
  const auth = req.headers.get('Authorization') ?? '';
  const cronHdr = req.headers.get('x-cron-secret') ?? '';

  const isCron = CRON_SECRET && cronHdr === CRON_SECRET;
  const isJwt  = auth.startsWith('Bearer ');

  if (!isCron && !isJwt) {
    return resp({ error: 'Unauthorized' }, 401);
  }

  // If JWT, validate it
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

    // ── Query overdue active records ──────────────────────────────
    const today = new Date().toISOString().split('T')[0];
    const { data: records, error } = await sb
      .from('nass_records')
      .select('file_ref,subject,officer,location,due_date,status,delay_flag')
      .not('status', 'in', '("Completed","Filed","Cancelled")')
      .not('due_date', 'is', null)
      .lt('due_date', today)
      .order('due_date', { ascending: true });

    if (error) throw error;

    if (!records || records.length === 0) {
      return resp({ message: 'No overdue records — nothing to send.' });
    }

    // ── Build HTML email ──────────────────────────────────────────
    const dateStr = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });
    const html = buildEmail(records, dateStr);

    // ── Send via Resend ───────────────────────────────────────────
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set — skipping send, returning preview.');
      return new Response(html, { headers: { 'content-type': 'text/html' } });
    }

    const subject = `NASS Branch — ${records.length} Overdue Record${records.length === 1 ? '' : 's'} · ${dateStr}`;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: RESEND_FROM, to: [ALERT_TO], subject, html }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Resend ${res.status}: ${txt}`);
    }

    const resJson = await res.json();
    return resp({ sent: true, count: records.length, resend_id: resJson.id });

  } catch (err) {
    console.error('overdue-alerts error:', err);
    return resp({ error: String(err) }, 500);
  }
});

// ── HTML email template ───────────────────────────────────────────
function esc(s: string) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fmtDate(v: string) {
  if (!v) return '—';
  const p = v.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : v;
}

function daysOver(dueDate: string): number {
  const d = new Date(dueDate);
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((today.getTime() - d.getTime()) / 86_400_000));
}

function buildEmail(records: Record<string, string>[], dateStr: string): string {
  const rows = records.map(r => {
    const days = r.due_date ? daysOver(r.due_date) : 0;
    const urgency = days >= 14 ? '#b81c2e' : days >= 7 ? '#e65100' : '#f9a825';
    return `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e8eaf0;font-size:12px;white-space:nowrap">${esc(r.file_ref ?? '—')}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8eaf0;font-size:12px">${esc((r.subject ?? '').slice(0, 90))}${(r.subject ?? '').length > 90 ? '…' : ''}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8eaf0;font-size:12px;white-space:nowrap">${esc(r.officer ?? '—')}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8eaf0;font-size:12px;white-space:nowrap">${fmtDate(r.due_date ?? '')}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8eaf0;font-size:12px;text-align:center">
          <span style="background:${urgency}1a;color:${urgency};font-weight:700;padding:2px 8px;border-radius:12px;white-space:nowrap">${days}d</span>
        </td>
      </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef1f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f6;padding:32px 16px">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#fff;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.10);overflow:hidden">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#002655,#004080);padding:28px 32px">
          <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:6px">Nigerian Navy — NASS Branch</div>
          <div style="font-size:20px;font-weight:800;color:#fff">Overdue SLA Alert</div>
          <div style="font-size:13px;color:rgba(255,255,255,.7);margin-top:4px">${esc(dateStr)}</div>
        </td></tr>
        <!-- Summary banner -->
        <tr><td style="background:#fde8e8;border-left:4px solid #b81c2e;padding:14px 32px">
          <span style="font-size:14px;font-weight:700;color:#b81c2e">⚠ ${records.length} record${records.length === 1 ? '' : 's'} past SLA deadline</span>
          <span style="font-size:12px;color:#7a3030;margin-left:10px">Immediate attention required.</span>
        </td></tr>
        <!-- Table -->
        <tr><td style="padding:24px 32px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e8eaf0;border-radius:8px;overflow:hidden">
            <thead>
              <tr style="background:#f4f6fa">
                <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.05em;color:#5a6375;border-bottom:2px solid #dce1ea">File Ref</th>
                <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.05em;color:#5a6375;border-bottom:2px solid #dce1ea">Subject</th>
                <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.05em;color:#5a6375;border-bottom:2px solid #dce1ea">Officer</th>
                <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.05em;color:#5a6375;border-bottom:2px solid #dce1ea">Due Date</th>
                <th style="padding:9px 12px;text-align:center;font-size:11px;font-weight:700;letter-spacing:.05em;color:#5a6375;border-bottom:2px solid #dce1ea">Days Over</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </td></tr>
        <!-- CTA -->
        <tr><td style="padding:0 32px 28px;text-align:center">
          <a href="${APP_URL}" style="display:inline-block;background:#002655;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:.03em">Open NASS Tracker ↗</a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f7f9fc;padding:16px 32px;text-align:center;border-top:1px solid #e8eaf0">
          <div style="font-size:11px;color:#9aa3b0">This is an automated daily alert from the NASS Branch Document Workflow Tracker.<br>Naval Headquarters, Abuja.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function resp(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
