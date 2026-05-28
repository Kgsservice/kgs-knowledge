/**
 * KGS Knowledge Management System v23 — Phase 5A.2b-i
 * Service Worker — Offline support + caching
 * ────────────────────────────────────────────
 * Strategy:
 *   - App shell (HTML/CSS/CDN libs): Cache-first
 *   - Firebase Storage files: Network-first with cache fallback
 *   - Realtime DB: Always network (real-time data)
 *   - Page navigation: Cache-first fallback to index
 */

const CACHE_VERSION = 'kgs-kms-v23-2026-05-28-5A2b-i';
const APP_SHELL = [
  './',
  './knowledge-base-v23.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

/* ── INSTALL: precache app shell ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL.map(url => new Request(url, { mode: 'no-cors' }))))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Precache failed:', err))
  );
});

/* ── ACTIVATE: clean old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── FETCH: route by URL pattern ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't cache Firebase Auth, RTDB, or Storage write operations
  if (
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com') ||
    url.hostname.includes('firebasedatabase.app') ||
    request.method !== 'GET'
  ) {
    return; // Pass through to network
  }

  // Firebase Storage downloads: network-first with cache fallback
  if (url.hostname.includes('firebasestorage.googleapis.com') ||
      url.hostname.includes('firebasestorage.app')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // App shell + CDN: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && response.ok && response.type !== 'error') {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for navigation
        if (request.mode === 'navigate') {
          return caches.match('./knowledge-base-v23.html');
        }
      });
    })
  );
});

/* ── MESSAGE: handle commands from app ── */
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data === 'CLEAR_CACHE') {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  }
});
