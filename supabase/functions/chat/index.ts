// ================================================================
//  NASS Branch Tracker — AI Chat Edge Function
//  Proxies streaming Claude API requests so the API key
//  never touches the browser.
// ================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CLAUDE_API_KEY          = Deno.env.get('CLAUDE_API_KEY')!;
const SUPABASE_URL             = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // ── CORS preflight ────────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  // ── Auth gate — every call must carry a valid Supabase JWT ────
  const authHeader = req.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return json({ error: 'Missing authorization header' }, 401);
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: { user }, error: authErr } = await sb.auth.getUser(
    authHeader.replace('Bearer ', '')
  );
  if (authErr || !user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  // ── Parse body ────────────────────────────────────────────────
  let messages: { role: string; content: string }[] = [];
  let rows: unknown[][] = [];
  try {
    const body = await req.json();
    messages = body.messages ?? [];
    rows     = body.rows     ?? [];
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  // ── Build system prompt ───────────────────────────────────────
  const today  = new Date().toISOString().split('T')[0];
  const system = buildSystem(rows, today);

  // ── Call Claude API with streaming ────────────────────────────
  const claudeResp = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-opus-4-5',
      max_tokens: 1024,
      stream:     true,
      system,
      messages:   messages.slice(-12), // keep last 12 turns
    }),
  });

  if (!claudeResp.ok) {
    const errText = await claudeResp.text();
    return json({ error: errText }, claudeResp.status);
  }

  // Forward the SSE stream directly to the browser
  return new Response(claudeResp.body, {
    status:  200,
    headers: { ...CORS, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
});

// ── Helpers ───────────────────────────────────────────────────────
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function buildSystem(rows: unknown[][], today: string): string {
  const header = `You are NASS AI Assistant — the intelligent assistant embedded in the \
Nigerian Naval Headquarters (NHQ) NASS Branch Document Workflow Tracker.

Your purpose is to help branch staff quickly extract insights from the live \
document data: status of files, officer workloads, overdue tracking, location \
of correspondence, SLA compliance, and more.

Today's date: ${today}

Tone: concise, professional, military-appropriate. Use bullet points for lists. \
Cite File Ref numbers when referencing specific documents. \
Never invent file references or data that is not in the context below.`;

  if (!rows || rows.length === 0) {
    return header + '\n\nNo document data is currently loaded.';
  }

  const lines = (rows as string[][]).map((r, i) =>
    [
      `${i + 1}.`,
      `Ref:${r[1] || '—'}`,
      `Subject:${(r[2] || '—').substring(0, 80)}`,
      `Location:${r[3] || '—'}`,
      `Officer:${r[4] || '—'}`,
      `LastAction:${r[5] || '—'}`,
      `Received:${r[6] || '—'}`,
      `Moved:${r[7] || '—'}`,
      `SLA:${r[8] || '—'}`,
      `DueDate:${r[9] || '—'}`,
      `Status:${r[10] || '—'}`,
      `Flag:${r[11] || '—'}`,
      `Remarks:${(r[12] || '—').substring(0, 60)}`,
    ].join(' | ')
  ).join('\n');

  return `${header}\n\nLIVE DOCUMENT TRACKER — ${rows.length} records as of ${today}:\n${lines}`;
}
