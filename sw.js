// ================================================================
//  NASS Branch Tracker — Service Worker
//  Strategy:
//    • App shell (HTML/CSS/JS/images) → cache-first, update in bg
//    • Supabase API / CDN calls → network-only (always live data)
//    • Offline fallback → serve cached index.html + post message
// ================================================================

const CACHE   = 'nass-tracker-v20';
const OFFLINE = 'nass-offline-v20';

const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './chat.js',
  './messenger.js',
  './supabase-init.js',
  './NN-logo.png',
  './NN-logo-transparent.png',
  './logo.png',
];

// ── Install: pre-cache app shell ──────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: purge old caches ────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE && k !== OFFLINE)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for shell, network-only for API/CDN ───────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Pass through: Supabase API, Google APIs, CDN scripts, non-GET
  if (event.request.method !== 'GET') return;
  if (url.hostname.includes('supabase.co'))     return;
  if (url.hostname.includes('googleapis.com'))  return;
  if (url.hostname.includes('accounts.google')) return;
  if (url.hostname.includes('cdn.jsdelivr'))    return;
  if (url.hostname.includes('resend.com'))      return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      // Return cached copy immediately; fetch update in background
      const networkFetch = fetch(event.request)
        .then(resp => {
          if (resp && resp.status === 200 && resp.type === 'basic') {
            // Clone synchronously — BEFORE returning resp so the body isn't
            // consumed by the browser before we hand the clone to the cache.
            try {
              const toCache = resp.clone();
              caches.open(CACHE).then(c => c.put(event.request, toCache));
            } catch (e) { /* body already used — skip cache update */ }
          }
          return resp;
        })
        .catch(() => null);

      if (cached) {
        // Warm cache hit — serve cached, refresh silently
        networkFetch; // fire-and-forget update
        return cached;
      }

      // Cache miss — try network; fallback to index.html when offline
      return networkFetch.then(resp => {
        if (resp) return resp;
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// ── Message handler: clients can trigger cache updates ────────────
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
