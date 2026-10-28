/* Leren.be offline cache. Relative paths support GitHub Pages project sites. */
const CACHE_NAME = "leren-desktop-preview-213";
const APP_FILES = ["./course-curriculum.js?v=121", "./modules/card-art/art.js?v=137", "./modules/card-art/people.js?v=135", "./modules/card-art/food.js?v=135", "./modules/card-art/things.js?v=135", "./modules/card-art/places.js?v=135", "./modules/card-art/more-people.js?v=135", "./modules/card-art/more-things.js?v=135", "./modules/emoji/cards.js?v=142", "./modules/emoji/renderer.js?v=142", "./modules/clock/clock.js?v=213", "./modules/exam/exam11.js?v=101", "./", "./index.html", "./manifest.webmanifest", "./favicon-32.png", "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./privacy.html", "./fonts/nunito.woff", "./fonts/unbounded.woff", "./dict/nl.json", "./img/chars/peter.webp", "./img/chars/peter-wow.webp", "./img/chars/peter-think.webp", "./img/chars/peter-sad.webp", "./img/chars/dafna.webp", "./img/chars/dafna-wow.webp", "./img/chars/dafna-think.webp", "./img/chars/dafna-sad.webp", "./modules/clock/widget.html?v=213", "./modules/clock/widget.js?v=213", "./modules/diphthongs/widget.js?v=87", "./modules/diphthongs/widget.html?v=87", "./modules/diphthongs/widget.css?v=87", "./modules/diphthongs/words.json?v=87", "./img/topics/birthday.svg", "./img/topics/comm.svg", "./img/topics/contact.svg", "./img/topics/dag.svg", "./img/topics/food.svg", "./img/topics/forms.svg", "./img/topics/grammar.svg", "./img/topics/grammar2.svg", "./img/topics/health.svg", "./img/topics/holiday.svg", "./img/topics/nums.svg", "./img/topics/opening.svg", "./img/topics/past.svg", "./img/topics/people.svg", "./img/topics/plans.svg", "./img/topics/reading.svg", "./img/topics/service.svg", "./img/topics/shopping.svg", "./img/topics/travel.svg", "./img/topics/travelTime.svg", "./img/topics/wonen.svg", "./modules/diphthongs/lesson-core.js?v=87", "./modules/learning-path/core.js?v=102", "./modules/rewards/core.js?v=102", "./modules/companion/ui.js?v=116", "./modules/rewards/gifts.js?v=102", "./modules/rewards/ui.js?v=102", "./modules/learning-path/ui.js?v=213", "./modules/learning-path/style.css?v=141", "./modules/rewards/style.css?v=102", "./modules/companion/style.css?v=102", "./img/mascot/student-cat-v1.png", "./audio/nl/pronunciation-v105/7dc692a9.m4a", "./audio/nl/pronunciation-v105/c79493aa.m4a", "./audio/nl-f/pronunciation-v105/7dc692a9.m4a", "./audio/nl-f/pronunciation-v105/c79493aa.m4a", "./modules/focused-home/ui.js?v=213", "./modules/focused-home/style.css?v=142", "./modules/test-library/ui.js?v=109", "./modules/test-library/style.css?v=109", "./img/tests/first-steps-v109.webp", "./img/tests/everyday-v109.webp", "./img/tests/practice-v109.webp", "./modules/game-gallery/style.css?v=111", "./img/games/story-v111.webp", "./img/games/ai-v111.webp", "./img/games/ask-v111.webp", "./img/games/dlg-v111.webp", "./img/games/rp-v111.webp", "./img/games/sp-v111.webp", "./img/games/bl-v111.webp", "./img/games/mm-v111.webp", "./img/games/dc-v111.webp", "./img/games/md-v111.webp", "./img/games/om-v111.webp", "./img/games/ks-v111.webp", "./modules/lesson-conversation/content.js?v=112", "./modules/lesson-conversation/core.js?v=112", "./modules/lesson-conversation/ui.js?v=112", "./modules/ai-coach/core.js?v=112", "./modules/ai-coach/ui.js?v=112", "./modules/word-builder/art.js?v=115", "./modules/word-builder/game.js?v=114", "./modules/word-builder/style.css?v=113", "./img/games/wb-v114.webp", "./modules/desktop-home/ui.js?v=209", "./modules/desktop-home/style.css?v=212"];

APP_FILES.push("./img/learning-path/wake-cat-v1.png");
APP_FILES.push("./img/mascot/fill-gap-cat.png");
for (const f of ["card-1f501.png", "card-1f91d.png", "card-1f5e3.png", "card-1f4dd.png", "card-23f3.png", "card-1f469.png", "card-1f48a.png", "card-1f64b.png", "card-1f468.png", "card-1f6b6.png", "card-1f4da.png", "card-1f4d6.png", "card-1f372.png", "card-1f645.png", "card-1f6cd.png", "card-1f9b5.png", "card-1f44b.png", "card-1f305.png", "card-1f44d.png", "card-1f4bc.png", "card-1f4ac.png", "card-1f465.png", "card-1f6aa.png", "card-1f4a1.png", "card-1f9fe.png", "card-1f4fa.png", "card-1f3c3.png", "card-1f443.png", "card-1f9b6.png", "card-1f937.png", "card-1f4cd.png", "card-270d.png", "card-1f449.png", "card-1f9f9.png", "card-1f4e7.png", "card-1f4cb.png", "card-1fa91.png", "card-1f4f0.png", "card-1f4aa.png", "card-1f9cd.png", "card-1f64f.png", "card-1f9d1.png", "card-1f9d2.png", "card-1f6cf.png", "card-1f321.png", "card-1f389.png", "card-1f3ac.png", "card-1f4c4.png", "card-1f392.png", "card-1f4bb.png", "card-1f9fa.png", "card-1f442.png", "card-1f637.png", "card-1f9f4.png", "card-1fa7a.png", "card-1f3f7.png", "card-1f306.png", "card-1f464.png", "card-1f9d1-200d-1f91d-200d-1f9d1.png", "card-1f3a9.png", "card-1f46a.png", "card-1f467.png", "card-1f393.png", "card-1f6cb.png", "card-1f68f.png", "card-1f342.png", "card-1f6ab.png", "card-1f4f1.png", "card-1f454.png", "card-1f6bf.png", "card-1f3ca.png", "card-26bd.png", "card-1f374.png", "card-1f44e.png", "card-1f614.png", "card-1f9b7.png", "card-270b.png", "card-261d.png", "card-1fac1.png", "card-1f32c.png", "card-1f944.png", "card-1f4a7.png", "card-1f961.png", "card-1f4e6.png", "card-1f6e0.png", "card-1f590.png", "card-1f642.png", "card-1f468-200d-1f469-200d-1f467.png", "card-1f466.png", "card-1f474.png", "card-1f6c1.png", "card-1f3d8.png", "card-1f4b6.png", "card-1f3ab.png", "card-23ee.png", "card-1f304.png", "card-1f550.png", "card-1f556.png", "card-1f558.png", "card-1f382.png", "card-1f6c2.png", "card-1fa9f.png", "card-1f9fd.png", "card-1f3e7.png", "card-1f4e5.png", "card-1f3d6.png", "card-1fad9.png", "card-1f51a.png", "card-1f6b4.png", "card-1f483.png", "card-1f4f8.png", "card-1f490.png", "card-1f441.png", "card-1f444.png", "card-1fac3.png", "card-1f922.png", "card-1f61e.png", "card-1f445.png", "card-1f60b.png", "card-1f4b8.png", "card-1f513.png", "card-1f932.png", "card-1f354.png", "card-1f34f.png", "card-1f440.png", "card-1f9e0.png", "card-1f50d.png", "card-1f4ce.png", "card-1f4e4.png", "card-1f647.png", "card-1f917.png", "card-1f44c.png", "card-1f937-200d-2642.png", "card-1f64b-200d-2642.png", "card-1f446.png", "card-1f524.png", "card-1f170.png", "card-1f520.png", "card-1f469-200d-1f9b0.png", "card-1f475.png", "card-1f935.png", "card-1f9d1-200d-2695.png", "card-1f487.png", "card-1f9d1-200d-1f373.png", "card-1f477.png", "card-1f46e.png", "card-1f9d1-200d-1f33e.png", "card-1f415.png", "card-1f404.png", "card-1f416.png", "card-1f6bd.png", "card-1f9ca.png", "card-1f30d.png", "card-21aa.png", "card-1f51f.png", "card-1f525.png", "card-23f2.png", "card-1f55b.png", "card-1f55c.png", "card-1f55e.png", "card-1f554.png", "card-1f560.png", "card-1f562.png", "card-1f559.png", "card-1f563.png", "card-1f564.png", "card-1f39f.png", "card-1f68a.png", "card-1f17f.png", "card-1f6e4.png", "card-1f388.png", "card-1f942.png", "card-1f502.png", "card-1f507.png", "card-1f4fc.png", "card-1faaa.png", "card-1f4d1.png", "card-1f4dc.png", "card-1f468-200d-1f3eb.png", "card-270f.png", "card-1f4d3.png", "card-9ed2-677f.png", "card-1f4b5.png", "card-1faa5.png", "card-21a9.png", "card-26d4.png", "card-1f47b.png", "card-1f3cb.png", "card-1f3a7.png", "card-1f37b.png", "card-1f52e.png", "card-1f51c.png", "card-26f5.png", "card-1f3b5.png", "card-1f337.png", "card-1f46b.png", "card-1f303.png", "card-1f492.png", "card-1f9ce.png", "card-1f616.png", "card-1f48c.png", "card-1f41c.png", "card-1f195.png", "card-1f407.png", "card-1f60c.png", "card-1f33f.png", "card-1f52a.png", "card-2795.png", "card-1f4ca.png", "card-1f9c3.png", "card-1f4d2.png", "card-1f527.png", "card-26a0.png", "card-1f50e.png", "card-1f91e.png", "card-1f926.png", "card-1f386.png", "card-1f570.png", "card-1f46d.png", "card-1f9f3.png", "card-1f453.png", "card-2696.png", "card-1f4cf.png", "card-1f573.png", "card-1f6d1.png", "card-1f69a.png", "card-1f9d1-200d-1f4bc.png", "card-1f53c.png", "card-1f6d7.png", "card-1f4ec.png", "card-1f4e9.png", "card-1f4c2.png", "card-1f6a7.png", "card-2139.png", "card-1f5b1.png", "card-1f682.png", "card-1f60a.png", "card-1f600.png", "card-1f914.png", "card-1f634.png", "card-1f927.png", "card-1f915.png", "card-1f912.png", "card-274c.png", "card-2757.png", "card-2764.png", "card-1f535.png", "card-1f522.png", "card-1f964.png", "card-1f426.png", "card-1f434.png", "card-1f418.png", "card-1f422.png"]) APP_FILES.push("./img/emoji/" + f);
for (const group of ["cat", "learn", "animal", "games", "weather", "places", "symbol", "travel", "food", "status", "clothes"]) {
  const count = group === "food" ? 40 : 20;
  for (let i = 1; i <= count; i++) {
    APP_FILES.push("./img/emoji/" + group + "-" + String(i).padStart(2, "0") + ".png");
  }
}

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
    await Promise.all(keys.filter(key => key.startsWith("leren-desktop-preview-") && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Version checks must reach the server, including after an older worker cached sw.js.
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
