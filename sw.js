/* Leren.be offline cache. Relative paths support GitHub Pages project sites. */
const CACHE_NAME = "leren-be-v89";
const APP_FILES = ["./modules/learning-path/core.js?v=89","./modules/learning-path/ui.js?v=89","./modules/learning-path/style.css?v=89","./modules/daily-learning/index.html","./course-curriculum.js?v=87", "./modules/clock/clock.js", "./", "./index.html", "./manifest.webmanifest", "./favicon-32.png", "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./privacy.html", "./fonts/nunito.woff", "./fonts/unbounded.woff", "./dict/nl.json", "./img/chars/peter.webp", "./img/chars/peter-wow.webp", "./img/chars/peter-think.webp", "./img/chars/peter-sad.webp", "./img/chars/dafna.webp", "./img/chars/dafna-wow.webp", "./img/chars/dafna-think.webp", "./img/chars/dafna-sad.webp", "./modules/clock/widget.html", "./modules/clock/widget.js", "./modules/diphthongs/widget.js", "./modules/diphthongs/widget.html", "./modules/diphthongs/widget.css", "./modules/diphthongs/words.json"];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_FILES);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => (key.startsWith("polyglot-leren-")||key.startsWith("leren-be-")) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith("/sw.js") || request.cache === "no-store") return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        // no-cache: revalidate with the server, so a reload right after a deploy never gets a 10-minute-old page from the HTTP cache
        let response = await fetch(request.url, {cache: "no-cache", credentials: "same-origin"});
        if (response.redirected) response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
        }
        return response;
      } catch (_) {
        return (await caches.match(request)) || (await caches.match("./index.html")) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});

// Daily reminder pushes (sent by .github/workflows/reminders.yml)
self.addEventListener("push", event => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (_) { d = {body: event.data ? event.data.text() : ""}; }
  event.waitUntil(self.registration.showNotification(d.title || "Leren.be", {
    body: d.body || "",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    tag: "leren-daily",
    renotify: false,
    data: {url: d.url || "./"}
  }));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || "./", self.registration.scope).href;
  event.waitUntil((async () => {
    const all = await clients.matchAll({type: "window", includeUncontrolled: true});
    for (const c of all) { if (c.url.startsWith(self.registration.scope)) { await c.focus(); return; } }
    await clients.openWindow(url);
  })());
});
