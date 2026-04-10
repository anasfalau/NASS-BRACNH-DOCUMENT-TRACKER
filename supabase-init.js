// ================================================================
//  NASS Branch Tracker — Supabase Integration Layer
//  ① Paste your Project URL and anon key from:
//     Supabase Dashboard → Settings → API
// ================================================================
const SUPABASE_URL     = 'https://sblqmpmawkogbbzzkwxt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibHFtcG1hd2tvZ2Jienprd3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MDQwMTYsImV4cCI6MjA5MTM4MDAxNn0.U5Fgn2HZ7nYizr81P2Ba2j-EEmG2MTq3zFT79d--GcM';

const NASS_KEYS = [
  'nassRows', 'nassOfficers', 'nassStatuses',
  'nassLocations', 'nassActions', 'nassFileIndex'
];

// ── Bootstrap ──────────────────────────────────────────────────
(async function init() {
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window._sb = sb;

  const { data: { session } } = await sb.auth.getSession();

  if (!session) {
    hide('nass-loading');
    show('nass-login');
    bindLoginForm(sb);
    return;
  }

  // ── Authenticated: pull data then boot app ──────────────────
  await pullData(sb);
  await loadScript('app.js');

  // Wrap saveData so every write also syncs to Supabase
  const _origSave = window.saveData;
  window.saveData = function () {
    _origSave();          // writes to localStorage (synchronous)
    pushData(sb);         // syncs to Supabase   (async / background)
  };

  // Show user info in topbar
  const userEl = document.getElementById('nass-user-email');
  if (userEl) userEl.textContent = session.user.email;
  show('nass-user-wrap');
  hide('nass-loading');
})();

// ── Supabase data helpers ───────────────────────────────────────
async function pullData(sb) {
  const { data, error } = await sb.from('nass_settings').select('key, value');
  if (error) { console.error('[NASS] Pull error:', error); return; }
  (data || []).forEach(({ key, value }) =>
    localStorage.setItem(key, JSON.stringify(value))
  );
}

async function pushData(sb) {
  const payload = NASS_KEYS
    .map(key => {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      try { return { key, value: JSON.parse(raw) }; }
      catch (e) { return null; }
    })
    .filter(Boolean);

  if (!payload.length) return;
  const { error } = await sb
    .from('nass_settings')
    .upsert(payload, { onConflict: 'key' });
  if (error) console.error('[NASS] Push error:', error);
}

// ── Auth helpers ────────────────────────────────────────────────
function bindLoginForm(sb) {
  document.getElementById('nass-login-form')
    .addEventListener('submit', async function (e) {
      e.preventDefault();
      const email    = document.getElementById('nass-email').value.trim();
      const password = document.getElementById('nass-password').value;
      const errEl    = document.getElementById('nass-login-err');
      const btn      = document.getElementById('nass-login-btn');
      errEl.textContent = '';
      btn.disabled     = true;
      btn.textContent  = 'Signing in…';

      const { error } = await sb.auth.signInWithPassword({ email, password });

      if (error) {
        errEl.textContent = error.message;
        btn.disabled    = false;
        btn.textContent = 'Sign In';
      } else {
        window.location.reload();
      }
    });
}

function nassLogout() {
  window._sb.auth.signOut().then(() => window.location.reload());
}

// ── DOM helpers ─────────────────────────────────────────────────
function show(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
}
function hide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s   = document.createElement('script');
    s.src     = src + '?_=' + Date.now();
    s.onload  = resolve;
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.body.appendChild(s);
  });
}
