// ================================================================
//  NASS Branch Tracker — Supabase Integration Layer
// ================================================================
const SUPABASE_URL      = 'https://sblqmpmawkogbbzzkwxt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibHFtcG1hd2tvZ2Jienprd3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MDQwMTYsImV4cCI6MjA5MTM4MDAxNn0.U5Fgn2HZ7nYizr81P2Ba2j-EEmG2MTq3zFT79d--GcM';

const CONFIG_KEYS = ['nassOfficers', 'nassStatuses', 'nassLocations', 'nassActions', 'nassFileIndex'];

// Parallel array to `rows` — stores the Supabase UUID for each record.
var rowIds = [];

// ── Bootstrap ──────────────────────────────────────────────────
(async function init() {
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession:    true,   // save token to localStorage
      autoRefreshToken:  true,   // silently renew before expiry
      detectSessionInUrl: false, // not needed for email/password auth
      storage:           window.localStorage
    }
  });
  window._sb = sb;

  // Step 1 — read whatever token is in localStorage
  let { data: { session } } = await sb.auth.getSession();

  // Step 2 — if token is expired (or expiring within 60 s), try a silent refresh
  //           This handles the "came back after >1 hour" case without re-login
  if (session) {
    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
    if (expiresAt < Date.now() + 60000) {
      const { data: refreshed } = await sb.auth.refreshSession();
      session = refreshed?.session ?? null;
    }
  }

  if (!session) {
    hide('nass-loading');
    show('nass-login');
    bindLoginForm(sb);
    return;
  }

  // Pull latest data from Supabase, then load app
  try {
  await pullData(sb);
  await loadScript('app.js');

  // Sync rowIds with current rows
  rowIds = JSON.parse(localStorage.getItem('nassRowIds') || '[]');
  while (rowIds.length < rows.length) rowIds.push(null);

  // Proxy rows so push/splice keep rowIds aligned automatically
  applyRowsProxy();

  // Wrap loadData to re-proxy rows after each reload from localStorage
  const _origLoad = loadData;
  loadData = function () {
    _origLoad();
    rowIds = JSON.parse(localStorage.getItem('nassRowIds') || '[]');
    applyRowsProxy();
  };

  // ── Broadcast channel ─────────────────────────────────────────
  // IMPORTANT: subscribe() is awaited so the websocket is confirmed
  // open before we ever call nassChannel.send().
  const nassChannel = sb.channel('nass-broadcast', {
    config: { broadcast: { self: false } }
  });

  nassChannel.on('broadcast', { event: 'data-changed' }, async function () {
    await pullData(sb);
    if (typeof loadData === 'function') loadData();
    if (!isModalOpen() && typeof refresh === 'function') refresh();
  });

  // Wait for SUBSCRIBED — hard 6 s timeout so a stalled socket never freezes the app
  await new Promise((resolve) => {
    const bail = setTimeout(resolve, 6000);
    nassChannel.subscribe((status) => {
      console.log('[NASS] Channel:', status);
      if (status === 'SUBSCRIBED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        clearTimeout(bail);
        resolve();
      }
    });
  });

  // Wrap saveData: write to localStorage → push to Supabase → notify peers
  const _origSave = window.saveData;
  window.saveData = async function () {
    _origSave();                  // synchronous localStorage write
    await pushData(sb);           // push to Supabase (awaited so errors surface)
    try {
      await nassChannel.send({ type: 'broadcast', event: 'data-changed', payload: {} });
    } catch (e) {
      console.warn('[NASS] Broadcast send failed:', e);
    }
  };

  // ── Google Drive token persistence ───────────────────────────
  // GIS Token Client stores the access token only in the memory var _gTok.
  // On every page refresh _gTok is undefined → Google prompts for login again.
  // Fix: restore _gTok from localStorage on load, and intercept its setter
  // so every new token is automatically saved (tokens last ~1 hour).
  initGoogleTokenPersistence();

  // Re-sync when the user returns to this browser tab
  document.addEventListener('visibilitychange', async function () {
    if (document.visibilityState !== 'visible') return;
    await pullData(sb);
    if (typeof loadData === 'function') loadData();
    if (!isModalOpen() && typeof refresh === 'function') refresh();
  });

  // Show topbar user info and reveal the app
  const userEl = document.getElementById('nass-user-email');
  if (userEl) userEl.textContent = session.user.email;
  show('nass-user-wrap');

  } catch (err) {
    console.error('[NASS] Init error:', err);
  } finally {
    hide('nass-loading'); // always runs — spinner never freezes
  }

})();

// ── Proxy helper ────────────────────────────────────────────────
function applyRowsProxy() {
  rows = new Proxy(rows, {
    get(target, prop) {
      if (prop === 'push') {
        return function (...items) {
          items.forEach(() => rowIds.push(null));
          localStorage.setItem('nassRowIds', JSON.stringify(rowIds));
          return Array.prototype.push.apply(target, items);
        };
      }
      if (prop === 'splice') {
        return function (start, deleteCount, ...items) {
          rowIds.splice(start, deleteCount, ...new Array(items.length).fill(null));
          localStorage.setItem('nassRowIds', JSON.stringify(rowIds));
          return Array.prototype.splice.call(target, start, deleteCount, ...items);
        };
      }
      return Reflect.get(target, prop);
    },
    set(target, prop, value) {
      return Reflect.set(target, prop, value);
    }
  });
}

// ── Modal state helper ──────────────────────────────────────────
function isModalOpen() {
  const edit   = document.getElementById('mbg');
  const detail = document.getElementById('detail-mbg');
  return (edit   && edit.classList.contains('open')) ||
         (detail && detail.classList.contains('open'));
}

// ── pullData ────────────────────────────────────────────────────
// Fetch all records from nass_records + config from nass_settings
// into localStorage. On first run (empty table), migrates from the
// old nass_settings blob automatically.
async function pullData(sb) {
  const { data: records, error: recErr } = await sb
    .from('nass_records')
    .select('*')
    .order('sort_order', { ascending: true });

  if (recErr) {
    console.error('[NASS] Pull error:', recErr.message);
  } else if (records.length > 0) {
    const newRows = records.map(rec => [
      '',
      rec.file_ref      || '',
      rec.subject       || '',
      rec.location      || '',
      rec.officer       || '',
      rec.last_action   || '',
      rec.date_received || '',
      rec.date_moved    || '',
      rec.sla           || '',
      rec.due_date      || '',
      rec.status        || 'Active',
      rec.delay_flag    || 'ON TIME',
      rec.remarks       || '',
      rec.updated_by    || '',   // [13] audit
      rec.updated_at    || ''    // [14] audit
    ]);
    localStorage.setItem('nassRows',   JSON.stringify(newRows));
    localStorage.setItem('nassRowIds', JSON.stringify(records.map(r => r.id)));
  } else {
    await migrateFromSettings(sb);
  }

  // Fetch config lists
  const { data: settings } = await sb
    .from('nass_settings')
    .select('key, value');
  (settings || [])
    .filter(({ key }) => CONFIG_KEYS.includes(key))
    .forEach(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)));
}

// ── migrateFromSettings ─────────────────────────────────────────
// One-time: copy existing nassRows blob → individual nass_records rows.
async function migrateFromSettings(sb) {
  const { data, error } = await sb
    .from('nass_settings')
    .select('value')
    .eq('key', 'nassRows')
    .maybeSingle();

  if (error || !data?.value?.length) return;

  const inserts = data.value.map((r, i) => ({
    sort_order: i,
    file_ref:      r[1]  || '',
    subject:       r[2]  || '',
    location:      r[3]  || '',
    officer:       r[4]  || '',
    last_action:   r[5]  || '',
    date_received: r[6]  || '',
    date_moved:    r[7]  || '',
    sla:           r[8]  || '',
    due_date:      r[9]  || '',
    status:        r[10] || 'Active',
    delay_flag:    r[11] || 'ON TIME',
    remarks:       r[12] || ''
  }));

  const { data: inserted, error: insErr } = await sb
    .from('nass_records')
    .insert(inserts)
    .select('id, sort_order');

  if (insErr) { console.error('[NASS] Migration error:', insErr.message); return; }

  const ids      = [...inserted].sort((a, b) => a.sort_order - b.sort_order).map(r => r.id);
  const newRows  = data.value.map(r => [...r.slice(0, 13), '', '']);
  localStorage.setItem('nassRows',   JSON.stringify(newRows));
  localStorage.setItem('nassRowIds', JSON.stringify(ids));
  console.log('[NASS] Migrated', inserts.length, 'records.');
}

// ── pushData ────────────────────────────────────────────────────
// Persist current rows to Supabase.
//   • New records (no UUID)  → INSERT  → UUID written back to rowIds
//   • Existing records (UUID) → UPSERT  → fields updated in place
//   • Orphaned records        → DELETE  → rows removed from DB
async function pushData(sb) {
  const { data: { session } } = await sb.auth.getSession();
  const userEmail = session?.user?.email || 'unknown';
  const now       = new Date().toISOString();
  const curRows   = JSON.parse(localStorage.getItem('nassRows') || '[]');

  const toInsert = [];  // { index, rec }
  const toUpsert = [];  // rec (has id)

  curRows.forEach((r, i) => {
    const rec = {
      sort_order:    i,
      file_ref:      r[1]  || '',
      subject:       r[2]  || '',
      location:      r[3]  || '',
      officer:       r[4]  || '',
      last_action:   r[5]  || '',
      date_received: r[6]  || '',
      date_moved:    r[7]  || '',
      sla:           r[8]  || '',
      due_date:      r[9]  || '',
      status:        r[10] || 'Active',
      delay_flag:    r[11] || 'ON TIME',
      remarks:       r[12] || '',
      updated_by:    userEmail,
      updated_at:    now
    };
    if (rowIds[i]) {
      toUpsert.push({ ...rec, id: rowIds[i] });
    } else {
      toInsert.push({ index: i, rec });
    }
  });

  // INSERT new records and capture their UUIDs
  if (toInsert.length) {
    const { data: ins, error: insErr } = await sb
      .from('nass_records')
      .insert(toInsert.map(x => x.rec))
      .select('id, sort_order');
    if (insErr) {
      console.error('[NASS] Insert error:', insErr.message);
    } else if (ins) {
      ins.forEach(rec => { rowIds[rec.sort_order] = rec.id; });
    }
  }

  // UPSERT existing records
  if (toUpsert.length) {
    const { error: upErr } = await sb
      .from('nass_records')
      .upsert(toUpsert, { onConflict: 'id' });
    if (upErr) console.error('[NASS] Upsert error:', upErr.message);
  }

  // Save updated rowIds (with newly assigned UUIDs)
  localStorage.setItem('nassRowIds', JSON.stringify(rowIds));

  // DELETE orphaned records (rows deleted locally but still in DB)
  const liveIds = new Set(rowIds.filter(Boolean));
  const { data: allRecs } = await sb.from('nass_records').select('id');
  const orphans = (allRecs || []).map(r => r.id).filter(id => !liveIds.has(id));
  if (orphans.length) {
    const { error: delErr } = await sb.from('nass_records').delete().in('id', orphans);
    if (delErr) console.error('[NASS] Delete error:', delErr.message);
  }

  // Push config lists to nass_settings
  const payload = CONFIG_KEYS.map(key => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try { return { key, value: JSON.parse(raw) }; } catch (e) { return null; }
  }).filter(Boolean);

  if (payload.length) {
    const { error: cfgErr } = await sb
      .from('nass_settings')
      .upsert(payload, { onConflict: 'key' });
    if (cfgErr) console.error('[NASS] Config push error:', cfgErr.message);
  }
}

// ── Google Drive token persistence ─────────────────────────────
function initGoogleTokenPersistence() {
  const TOKEN_KEY  = 'nass_gdrive_token';
  const EXPIRY_KEY = 'nass_gdrive_expiry';

  // Restore a still-valid token so _gwithToken skips the OAuth prompt
  const stored = localStorage.getItem(TOKEN_KEY);
  const expiry = parseInt(localStorage.getItem(EXPIRY_KEY) || '0', 10);
  if (stored && expiry > Date.now() + 60000) {
    window._gTok = stored;
    console.log('[Drive] Token restored — valid for ~' +
      Math.round((expiry - Date.now()) / 60000) + ' min');
  }

  // Poll every 3 s: when app.js receives a new GIS token (_gTok changes),
  // save it to localStorage immediately.
  // Polling is used instead of Object.defineProperty because var-declared
  // globals are non-configurable and defineProperty would throw a TypeError.
  let lastSeen = window._gTok || null;
  setInterval(function () {
    const current = window._gTok;
    if (current && current !== lastSeen) {
      lastSeen = current;
      localStorage.setItem(TOKEN_KEY,  current);
      localStorage.setItem(EXPIRY_KEY, (Date.now() + 55 * 60 * 1000).toString());
      console.log('[Drive] New token saved to storage');
    }
  }, 3000);
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
      btn.disabled    = true;
      btn.textContent = 'Signing in…';
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
  // Clear Google Drive token so the next user has to authenticate freshly
  localStorage.removeItem('nass_gdrive_token');
  localStorage.removeItem('nass_gdrive_expiry');
  window._gTok = null;
  window._sb.auth.signOut().then(() => window.location.reload());
}

// ── DOM helpers ─────────────────────────────────────────────────
function show(id) { const el = document.getElementById(id); if (el) el.style.display = 'flex'; }
function hide(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s   = document.createElement('script');
    s.src     = src + '?_=' + Date.now();
    s.onload  = resolve;
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.body.appendChild(s);
  });
}
