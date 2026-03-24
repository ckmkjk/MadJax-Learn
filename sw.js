// ===== SERVICE WORKER — OFFLINE CACHING =====
const CACHE_NAME = 'madjax-v1';
const APP_SHELL = [
  '/MadJax-Learn/',
  '/MadJax-Learn/index.html',
  '/MadJax-Learn/css/main.css',
  '/MadJax-Learn/css/player-select.css',
  '/MadJax-Learn/css/hub.css',
  '/MadJax-Learn/css/games.css',
  '/MadJax-Learn/js/app.js',
  '/MadJax-Learn/js/storage.js',
  '/MadJax-Learn/js/audio.js',
  '/MadJax-Learn/js/avatars.js',
  '/MadJax-Learn/js/firebase-config.js',
  '/MadJax-Learn/js/firebase-sync.js',
  '/MadJax-Learn/data/words.js',
  '/MadJax-Learn/data/stories.js',
  '/MadJax-Learn/data/patterns.js',
  '/MadJax-Learn/js/games/ring-rush.js',
  '/MadJax-Learn/js/games/number-blaster.js',
  '/MadJax-Learn/js/games/speed-duel.js',
  '/MadJax-Learn/js/games/word-builder.js',
  '/MadJax-Learn/js/games/story-sprint.js',
  '/MadJax-Learn/js/games/letter-splash.js',
  '/MadJax-Learn/js/games/pattern-portal.js',
  '/MadJax-Learn/js/games/memory-matrix.js',
  '/MadJax-Learn/js/games/maze-runner.js',
  '/MadJax-Learn/js/games/ring-run.js',
];

const FIREBASE_CDN_CACHE = 'madjax-firebase-v1';

// Pre-cache app shell on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Clean old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE_NAME && k !== FIREBASE_CDN_CACHE)
        .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy: cache-first for app, network-first for Firebase
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Firebase database requests — network only (don't cache data)
  if (url.hostname.includes('firebaseio.com')) {
    return;
  }

  // Firebase SDK from CDN — network-first, cache fallback
  if (url.hostname === 'www.gstatic.com' && url.pathname.includes('firebasejs')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(FIREBASE_CDN_CACHE).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Google Fonts — network-first, cache fallback
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // App shell — cache-first, network fallback
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
