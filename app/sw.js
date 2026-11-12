/* Leren.be offline cache. Relative paths support GitHub Pages project sites. */
const CACHE_NAME = "leren-be-v226";
const APP_FILES = ["./course-curriculum.js?v=178", "./modules/card-art/art.js?v=147", "./modules/card-art/people.js?v=135", "./modules/card-art/food.js?v=135", "./modules/card-art/things.js?v=135", "./modules/card-art/places.js?v=135", "./modules/card-art/more-people.js?v=135", "./modules/card-art/more-things.js?v=135", "./modules/emoji/cards.js?v=146", "./modules/emoji/variants.js?v=147", "./modules/emoji/renderer.js?v=177", "./modules/clock/clock.js?v=198", "./modules/exam/exam-core.js?v=176", "./modules/exam/exam11.js?v=176", "./modules/exam/exam12-data.js?v=173", "./modules/exam/exam12.js?v=177", "./", "./index.html", "./app.js?v=226", "./boot.js?v=193", "./manifest.webmanifest", "./favicon-32.png", "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./privacy.html", "./reviews.html", "./learn-life.html", "./modules/learn-life/style.css?v=2", "./learn-life-story.html", "./modules/learn-life/story.css?v=3", "./modules/learn-life/story-ui.mjs?v=3", "./modules/learn-life/story-engine.mjs?v=2", "./modules/learn-life/stories/index.mjs?v=3", "./modules/learn-life/stories/first-day.mjs?v=2", "./modules/learn-life/data.mjs?v=2", "./modules/learn-life/engine.mjs", "./modules/learn-life/ui.mjs?v=2", "./reviews.css?v=2", "./reviews.js?v=4", "./fonts/nunito.woff", "./fonts/unbounded.woff", "./dict/nl.json", "./img/chars/peter.webp", "./img/chars/peter-wow.webp", "./img/chars/peter-think.webp", "./img/chars/peter-sad.webp", "./img/chars/dafna.webp", "./img/chars/dafna-wow.webp", "./img/chars/dafna-think.webp", "./img/chars/dafna-sad.webp", "./modules/clock/widget.html", "./modules/clock/widget.js?v=198", "./modules/diphthongs/widget.js?v=176", "./modules/diphthongs/widget.html?v=87", "./modules/diphthongs/widget.css?v=87", "./modules/diphthongs/words.json?v=87", "./img/topics/birthday.svg", "./img/topics/comm.svg", "./img/topics/contact.svg", "./img/topics/dag.svg", "./img/topics/food.svg", "./img/topics/forms.svg", "./img/topics/grammar.svg", "./img/topics/grammar2.svg", "./img/topics/health.svg", "./img/topics/holiday.svg", "./img/topics/nums.svg", "./img/topics/opening.svg", "./img/topics/past.svg", "./img/topics/people.svg", "./img/topics/plans.svg", "./img/topics/reading.svg", "./img/topics/service.svg", "./img/topics/shopping.svg", "./img/topics/travel.svg", "./img/topics/travelTime.svg", "./img/topics/wonen.svg", "./img/topics/daily.svg", "./img/topics/work.svg", "./img/topics/a2work.svg", "./img/topics/a2wonen.svg", "./img/topics/a2zorg.svg", "./img/topics/a2admin.svg", "./img/topics/a2school.svg", "./img/topics/a2geld.svg", "./img/topics/a2nieuws.svg", "./img/topics/a2samen.svg", "./img/topics/a2gram.svg", "./img/topics/zorg.svg", "./img/topics/stad.svg", "./img/topics/school.svg", "./img/topics/vrijetijd.svg", "./img/topics/sociaal.svg", "./img/topics/future.svg", "./modules/diphthongs/lesson-core.js?v=87", "./modules/sync/merge.js?v=210", "./modules/review/srs.js?v=175", "./modules/insights/core.js?v=174", "./modules/courses/registry.js?v=3", "./modules/learning-path/core.js?v=210", "./modules/courses/en.js?v=3", "./modules/courses/en12.js?v=2", "./modules/courses/en-exam.js?v=1", "./modules/courses/en-exam12.js?v=1", "./modules/courses/fr.js?v=2", "./modules/course-player/exam.js?v=3", "./modules/course-player/ui.js?v=8", "./modules/course-player/style.css?v=5", "./modules/rewards/core.js?v=174", "./modules/companion/ui.js?v=116", "./modules/rewards/gifts.js?v=174", "./modules/rewards/ui.js?v=179", "./modules/learning-path/invitation.js?v=2", "./modules/learning-path/invitation.css?v=1", "./modules/learning-path/ui.js?v=213", "./modules/home-v2/ui.js?v=2", "./modules/home-v2/style.css?v=2", "./img/home/hero-cat-v196-320.webp", "./img/home/home-visuals.json", "./modules/dialogues/translations.js?v=177", "./modules/learning-path/style.css?v=195", "./modules/rewards/style.css?v=102", "./modules/companion/style.css?v=102", "./img/mascot/student-cat-v1.png", "./img/mascot/level-a11.webp", "./img/mascot/level-a12.webp", "./img/mascot/level-a2.webp", "./audio/nl/pronunciation-v105/7dc692a9.m4a", "./audio/nl/pronunciation-v105/c79493aa.m4a", "./audio/nl-f/pronunciation-v105/7dc692a9.m4a", "./audio/nl-f/pronunciation-v105/c79493aa.m4a", "./modules/focused-home/ui.js?v=209", "./modules/desktop-home/ui.js?v=150", "./modules/desktop-home/style.css?v=151", "./modules/focused-home/style.css?v=207", "./modules/test-library/ui.js?v=180", "./modules/test-library/style.css?v=109", "./img/tests/first-steps-v109.webp", "./img/tests/everyday-v109.webp", "./img/tests/practice-v109.webp", "./modules/game-gallery/style.css?v=111", "./img/games/story-v111.webp", "./img/games/ai-v111.webp", "./img/games/ask-v111.webp", "./img/games/dlg-v111.webp", "./img/games/rp-v111.webp", "./img/games/sp-v111.webp", "./img/games/bl-v111.webp", "./img/games/mm-v111.webp", "./img/games/dc-v111.webp", "./img/games/md-v111.webp", "./img/games/om-v111.webp", "./img/games/ks-v111.webp", "./modules/lesson-conversation/content.js?v=174", "./modules/lesson-conversation/core.js?v=112", "./modules/lesson-conversation/ui.js?v=112", "./modules/ai-coach/core.js?v=169", "./modules/ai-coach/ui.js?v=169", "./modules/word-builder/art.js?v=150", "./modules/word-builder/game.js?v=172", "./modules/word-builder/style.css?v=172", "./img/games/wb-v114.webp", "./modules/kamer/game.js?v=198", "./modules/kamer/style.css?v=195", "./img/games/kamer-v186.webp", "./img/games/kamer1-v196.jpg", "./splash.js?v=205"];

APP_FILES.push("./modules/home-showcase/ui.js?v=223", "./modules/home-showcase/style.css?v=219", "./img/home/hero-cat-v196.png", "./img/chars/peter-card.webp", "./img/chars/dafna-card.webp");
// TEST-017: HERO pictures (img/home/home-hero-*.webp) are not precached — each device caches only the one it shows.
// This note also changes the worker bytes, so installed test copies re-fetch img/home/home-visuals.json with the approved art.
APP_FILES.push("./img/learning-path/wake-cat-v1.png");
APP_FILES.push("./img/mascot/fill-gap-cat.png");
for (const f of ["kb-been.png", "kb-bonnetje.png", "kb-boter.png", "kb-confituur.png", "kb-cornflakes.png", "kb-dochter.png", "kb-havermout.png", "kb-kassa.png", "kb-ketchup.png", "kb-kinderen.png", "kb-knie.png", "kb-krant.png", "kb-margarine.png", "kb-mayonaise.png", "kb-melk.png", "kb-melkproducten.png", "kb-moeder.png", "kb-muesli.png", "kb-oom.png", "kb-tante.png", "kb-teen.png", "kb-vader.png", "kb-voet.png", "kb-volkoren.png", "kb-vrouw.png", "kb-witbrood.png", "kb-yoghurt.png", "kb-zoetbeleg.png"]) APP_FILES.push("./img/emoji/" + f);
for (const f of ["card-1f170.png", "card-1f17f.png", "card-1f195.png", "card-1f303.png", "card-1f304.png", "card-1f305.png", "card-1f30d.png", "card-1f321.png", "card-1f32c.png", "card-1f337.png", "card-1f33f.png", "card-1f342.png", "card-1f34f.png", "card-1f354.png", "card-1f372.png", "card-1f374.png", "card-1f37b.png", "card-1f386.png", "card-1f388.png", "card-1f393.png", "card-1f39f.png", "card-1f3a9.png", "card-1f3ab.png", "card-1f3ac.png", "card-1f3b5.png", "card-1f3c3.png", "card-1f3ca.png", "card-1f3cb.png", "card-1f3d6.png", "card-1f3d8.png", "card-1f3e7.png", "card-1f3f7.png", "card-1f404.png", "card-1f407.png", "card-1f415.png", "card-1f416.png", "card-1f418.png", "card-1f41c.png", "card-1f422.png", "card-1f440.png", "card-1f441.png", "card-1f442.png", "card-1f443.png", "card-1f444.png", "card-1f445.png", "card-1f446.png", "card-1f449.png", "card-1f44b.png", "card-1f44c.png", "card-1f44d.png", "card-1f44e.png", "card-1f454.png", "card-1f464.png", "card-1f465.png", "card-1f466.png", "card-1f467.png", "card-1f468-200d-1f3eb.png", "card-1f468-200d-1f469-200d-1f467.png", "card-1f468.png", "card-1f469-200d-1f9b0.png", "card-1f469.png", "card-1f46a.png", "card-1f46b.png", "card-1f46d.png", "card-1f46e.png", "card-1f474.png", "card-1f47b.png", "card-1f483.png", "card-1f48a.png", "card-1f48c.png", "card-1f490.png", "card-1f492.png", "card-1f4a1.png", "card-1f4a7.png", "card-1f4ac.png", "card-1f4b5.png", "card-1f4b6.png", "card-1f4b8.png", "card-1f4bc.png", "card-1f4c2.png", "card-1f4c4.png", "card-1f4ca.png", "card-1f4cd.png", "card-1f4ce.png", "card-1f4cf.png", "card-1f4d1.png", "card-1f4dc.png", "card-1f4dd.png", "card-1f4e4.png", "card-1f4e5.png", "card-1f4e6.png", "card-1f4e7.png", "card-1f4e9.png", "card-1f4ec.png", "card-1f4f8.png", "card-1f4fa.png", "card-1f4fc.png", "card-1f501.png", "card-1f502.png", "card-1f507.png", "card-1f50d.png", "card-1f50e.png", "card-1f513.png", "card-1f51a.png", "card-1f51c.png", "card-1f51f.png", "card-1f520.png", "card-1f524.png", "card-1f525.png", "card-1f527.png", "card-1f52a.png", "card-1f52e.png", "card-1f53c.png", "card-1f550.png", "card-1f554.png", "card-1f556.png", "card-1f558.png", "card-1f559.png", "card-1f55b.png", "card-1f55c.png", "card-1f55e.png", "card-1f560.png", "card-1f562.png", "card-1f563.png", "card-1f564.png", "card-1f570.png", "card-1f573.png", "card-1f590.png", "card-1f5b1.png", "card-1f5e3.png", "card-1f600.png", "card-1f60a.png", "card-1f60b.png", "card-1f60c.png", "card-1f614.png", "card-1f616.png", "card-1f61e.png", "card-1f634.png", "card-1f637.png", "card-1f642.png", "card-1f645.png", "card-1f647.png", "card-1f64b-200d-2642.png", "card-1f64f.png", "card-1f682.png", "card-1f68a.png", "card-1f68f.png", "card-1f69a.png", "card-1f6a7.png", "card-1f6ab.png", "card-1f6b4.png", "card-1f6b6.png", "card-1f6bd.png", "card-1f6bf.png", "card-1f6c1.png", "card-1f6c2.png", "card-1f6cb.png", "card-1f6cd.png", "card-1f6d1.png", "card-1f6e0.png", "card-1f6e4.png", "card-1f912.png", "card-1f914.png", "card-1f915.png", "card-1f91d.png", "card-1f91e.png", "card-1f922.png", "card-1f926.png", "card-1f927.png", "card-1f932.png", "card-1f937-200d-2642.png", "card-1f937.png", "card-1f942.png", "card-1f944.png", "card-1f961.png", "card-1f9b5.png", "card-1f9b6.png", "card-1f9b7.png", "card-1f9c3.png", "card-1f9ca.png", "card-1f9d1-200d-1f33e.png", "card-1f9d1-200d-1f4bc.png", "card-1f9d1-200d-1f91d-200d-1f9d1.png", "card-1f9d1.png", "card-1f9d2.png", "card-1f9e0.png", "card-1f9f3.png", "card-1f9f4.png", "card-1f9f9.png", "card-1f9fa.png", "card-1f9fd.png", "card-1f9fe.png", "card-1fa7a.png", "card-1faa5.png", "card-1faaa.png", "card-1fac1.png", "card-1fac3.png", "card-1fad9.png", "card-2139.png", "card-21a9.png", "card-21aa.png", "card-23ee.png", "card-23f2.png", "card-23f3.png", "card-2696.png", "card-26a0.png", "card-26bd.png", "card-26d4.png", "card-26f5.png", "card-270b.png", "card-270d.png", "card-270f.png", "card-2764.png", "card-2795.png", "card-9ed2-677f.png", "fx-1f306.png", "fx-1f319.png", "fx-1f324.png", "fx-1f327.png", "fx-1f331.png", "fx-1f333.png", "fx-1f338.png", "fx-1f345.png", "fx-1f347.png", "fx-1f34c.png", "fx-1f34e.png", "fx-1f353.png", "fx-1f355.png", "fx-1f35a.png", "fx-1f35d.png", "fx-1f35e.png", "fx-1f35f.png", "fx-1f36a.png", "fx-1f36b.png", "fx-1f36c.png", "fx-1f36e.png", "fx-1f373.png", "fx-1f375.png", "fx-1f377.png", "fx-1f37a.png", "fx-1f37d.png", "fx-1f381.png", "fx-1f382.png", "fx-1f389.png", "fx-1f392.png", "fx-1f3a7.png", "fx-1f3af.png", "fx-1f3c1.png", "fx-1f3d9.png", "fx-1f3db.png", "fx-1f3e0.png", "fx-1f3e1.png", "fx-1f3e2.png", "fx-1f3e5.png", "fx-1f3e6.png", "fx-1f3e8.png", "fx-1f3ea.png", "fx-1f3eb.png", "fx-1f408.png", "fx-1f41f.png", "fx-1f426.png", "fx-1f430.png", "fx-1f434.png", "fx-1f453.png", "fx-1f455.png", "fx-1f456.png", "fx-1f457.png", "fx-1f45c.png", "fx-1f45f.png", "fx-1f475.png", "fx-1f477.png", "fx-1f487.png", "fx-1f4a8.png", "fx-1f4aa.png", "fx-1f4b0.png", "fx-1f4b3.png", "fx-1f4bb.png", "fx-1f4c5.png", "fx-1f4c6.png", "fx-1f4cb.png", "fx-1f4d2.png", "fx-1f4d3.png", "fx-1f4d6.png", "fx-1f4da.png", "fx-1f4de.png", "fx-1f4e8.png", "fx-1f4ee.png", "fx-1f4f0.png", "fx-1f4f1.png", "fx-1f504.png", "fx-1f511.png", "fx-1f512.png", "fx-1f522.png", "fx-1f535.png", "fx-1f552.png", "fx-1f5d3.png", "fx-1f5fa.png", "fx-1f64b.png", "fx-1f686.png", "fx-1f689.png", "fx-1f68b.png", "fx-1f68c.png", "fx-1f697.png", "fx-1f6a6.png", "fx-1f6aa.png", "fx-1f6b2.png", "fx-1f6b8.png", "fx-1f6cf.png", "fx-1f6d2.png", "fx-1f6d7.png", "fx-1f6e3.png", "fx-1f917.png", "fx-1f935.png", "fx-1f950.png", "fx-1f952.png", "fx-1f953.png", "fx-1f954.png", "fx-1f956.png", "fx-1f957.png", "fx-1f95b.png", "fx-1f963.png", "fx-1f964.png", "fx-1f966.png", "fx-1f969.png", "fx-1f96a.png", "fx-1f96b.png", "fx-1f9c0.png", "fx-1f9c2.png", "fx-1f9c5.png", "fx-1f9c8.png", "fx-1f9cd.png", "fx-1f9ce.png", "fx-1f9d1-200d-1f373.png", "fx-1f9d1-200d-2695.png", "fx-1f9e2.png", "fx-1f9e3.png", "fx-1f9e4.png", "fx-1f9e5.png", "fx-1f9e6.png", "fx-1f9e9.png", "fx-1f9f6.png", "fx-1fa91.png", "fx-1fa9f.png", "fx-1fad8.png", "fx-231a.png", "fx-231b.png", "fx-23f0.png", "fx-23f1.png", "fx-23f8.png", "fx-2600.png", "fx-2602.png", "fx-2615.png", "fx-261d.png", "fx-26a1.png", "fx-26ea.png", "fx-2705.png", "fx-2709.png", "fx-2728.png", "fx-2744.png", "fx-274c.png", "fx-2753.png", "fx-2757.png", "fx-2b06.png", "fx-30-20e3.png", "fx-31-20e3.png", "fx-32-20e3.png", "fx-33-20e3.png", "fx-34-20e3.png", "fx-35-20e3.png", "fx-36-20e3.png", "fx-37-20e3.png", "fx-38-20e3.png", "fx-39-20e3.png"]) APP_FILES.push("./img/emoji/" + f);
for (const group of ["cat", "learn", "animal", "games", "weather", "places", "symbol", "travel", "food", "status", "clothes"]) {
  const count = group === "food" ? 40 : 20;
  for (let i = 1; i <= count; i++) {
    APP_FILES.push("./img/emoji/" + group + "-" + String(i).padStart(2, "0") + ".png");
  }
}

// Errors inside the service worker never reach the page: report them like the page does (POST /errors on lerenbe.com,
// at most 5 different ones while this worker runs; only technical text).
const swErrSeen = new Set();
function swReport(msg, stack) {
  msg = String(msg == null ? "" : msg).slice(0, 300);
  if (!/^(www\.)?lerenbe\.com$/.test(self.location.hostname) || !msg || swErrSeen.size >= 5 || swErrSeen.has(msg)) return;
  swErrSeen.add(msg);
  try {
    fetch("https://leren-ai.gembarsky-d.workers.dev/errors", {method: "POST", headers: {"Content-Type": "text/plain"},
      body: JSON.stringify({kind: "sw", msg, src: CACHE_NAME, stack: String(stack || "").slice(0, 1500), v: CACHE_NAME.replace(/\D+/g, ""), page: "sw.js",
        online: self.navigator ? self.navigator.onLine : true, ua: self.navigator ? String(self.navigator.userAgent).slice(0, 200) : ""})}).catch(() => {});
  } catch (_) {}
}
self.addEventListener("error", e => swReport(e.message, e.error && e.error.stack));
self.addEventListener("unhandledrejection", e => swReport(e.reason && e.reason.message || e.reason, e.reason && e.reason.stack));

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Install the app shell atomically; optional media must not block updates.
    const critical = ["./", "./index.html", "./app.js?v=226", "./boot.js?v=193", "./course-curriculum.js?v=178", "./manifest.webmanifest"];
    await cache.addAll(critical);
    const optional = APP_FILES.filter(file => !critical.includes(file));
    // Bound concurrent downloads to avoid overwhelming mobile connections.
    for (let i = 0; i < optional.length; i += 20) {
      await Promise.allSettled(optional.slice(i, i + 20).map(file => cache.add(file)));
    }
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
  // Version checks must reach the server, including after an older worker cached sw.js.
  if (url.pathname.endsWith("/sw.js") || request.cache === "no-store") return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        // no-cache: revalidate with the server, so a reload right after a deploy never gets a 10-minute-old page from the HTTP cache
        let response = await fetch(request.url, {cache: "no-cache", credentials: "same-origin"});
        if (response.redirected) response = await fetch(request);
        if (response && response.status === 200) { // not 206: audio is fetched in ranges, and a partial response cannot be cached
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone()).catch(() => {});
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
      if (response && response.status === 200) { // not 206: audio is fetched in ranges, and a partial response cannot be cached
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone()).catch(() => {});
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
  event.waitUntil(self.registration.showNotification(d.title || "lerenbe.com", {
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
// scenes-begin
APP_FILES.push("./img/scenes/bod_14.webp");
APP_FILES.push("./img/scenes/bod_15.webp");
APP_FILES.push("./img/scenes/bod_16.webp");
APP_FILES.push("./img/scenes/bod_17.webp");
APP_FILES.push("./img/scenes/clk_1.webp");
APP_FILES.push("./img/scenes/clk_10.webp");
APP_FILES.push("./img/scenes/clk_11.webp");
APP_FILES.push("./img/scenes/clk_12.webp");
APP_FILES.push("./img/scenes/clk_13.webp");
APP_FILES.push("./img/scenes/clk_14.webp");
APP_FILES.push("./img/scenes/clk_15.webp");
APP_FILES.push("./img/scenes/clk_2.webp");
APP_FILES.push("./img/scenes/clk_3.webp");
APP_FILES.push("./img/scenes/clk_4.webp");
APP_FILES.push("./img/scenes/clk_5.webp");
APP_FILES.push("./img/scenes/clk_6.webp");
APP_FILES.push("./img/scenes/clk_7.webp");
APP_FILES.push("./img/scenes/clk_8.webp");
APP_FILES.push("./img/scenes/clk_9.webp");
APP_FILES.push("./img/scenes/col_1.webp");
APP_FILES.push("./img/scenes/col_10.webp");
APP_FILES.push("./img/scenes/col_11.webp");
APP_FILES.push("./img/scenes/col_2.webp");
APP_FILES.push("./img/scenes/col_3.webp");
APP_FILES.push("./img/scenes/col_4.webp");
APP_FILES.push("./img/scenes/col_5.webp");
APP_FILES.push("./img/scenes/col_6.webp");
APP_FILES.push("./img/scenes/col_7.webp");
APP_FILES.push("./img/scenes/col_8.webp");
APP_FILES.push("./img/scenes/col_9.webp");
APP_FILES.push("./img/scenes/course_ex10_16.webp");
APP_FILES.push("./img/scenes/course_kt_31.webp");
APP_FILES.push("./img/scenes/course_kt_32.webp");
APP_FILES.push("./img/scenes/course_kt_33.webp");
APP_FILES.push("./img/scenes/course_kt_34.webp");
APP_FILES.push("./img/scenes/course_kt_35.webp");
APP_FILES.push("./img/scenes/course_kt_36.webp");
APP_FILES.push("./img/scenes/course_kt_37.webp");
APP_FILES.push("./img/scenes/course_kt_38.webp");
APP_FILES.push("./img/scenes/course_kt_39.webp");
APP_FILES.push("./img/scenes/course_kt_40.webp");
APP_FILES.push("./img/scenes/course_kt_41.webp");
APP_FILES.push("./img/scenes/course_kt_42.webp");
APP_FILES.push("./img/scenes/course_kt_43.webp");
APP_FILES.push("./img/scenes/course_pt_klachten_1.webp");
APP_FILES.push("./img/scenes/course_pt_klachten_2.webp");
APP_FILES.push("./img/scenes/course_pt_klachten_3.webp");
APP_FILES.push("./img/scenes/course_pt_klachten_4.webp");
APP_FILES.push("./img/scenes/course_pt_klachten_5.webp");
APP_FILES.push("./img/scenes/course_pt_klachten_6.webp");
APP_FILES.push("./img/scenes/course_up_1.webp");
APP_FILES.push("./img/scenes/course_up_10.webp");
APP_FILES.push("./img/scenes/course_up_11.webp");
APP_FILES.push("./img/scenes/course_up_12.webp");
APP_FILES.push("./img/scenes/course_up_13.webp");
APP_FILES.push("./img/scenes/course_up_14.webp");
APP_FILES.push("./img/scenes/course_up_15.webp");
APP_FILES.push("./img/scenes/course_up_2.webp");
APP_FILES.push("./img/scenes/course_up_3.webp");
APP_FILES.push("./img/scenes/course_up_4.webp");
APP_FILES.push("./img/scenes/course_up_5.webp");
APP_FILES.push("./img/scenes/course_up_6.webp");
APP_FILES.push("./img/scenes/course_up_7.webp");
APP_FILES.push("./img/scenes/course_up_8.webp");
APP_FILES.push("./img/scenes/course_up_9.webp");
APP_FILES.push("./img/scenes/cvo_6.webp");
APP_FILES.push("./img/scenes/d_1.webp");
APP_FILES.push("./img/scenes/d_2.webp");
APP_FILES.push("./img/scenes/d_3.webp");
APP_FILES.push("./img/scenes/d_4.webp");
APP_FILES.push("./img/scenes/d_5.webp");
APP_FILES.push("./img/scenes/d_6.webp");
APP_FILES.push("./img/scenes/d_7.webp");
APP_FILES.push("./img/scenes/doc_14.webp");
APP_FILES.push("./img/scenes/doc_15.webp");
APP_FILES.push("./img/scenes/doc_18.webp");
APP_FILES.push("./img/scenes/doc_3.webp");
APP_FILES.push("./img/scenes/doc_5.webp");
APP_FILES.push("./img/scenes/doc_6.webp");
APP_FILES.push("./img/scenes/k1_acht.webp");
APP_FILES.push("./img/scenes/k1_bed.webp");
APP_FILES.push("./img/scenes/k1_been.webp");
APP_FILES.push("./img/scenes/k1_ben.webp");
APP_FILES.push("./img/scenes/k1_bom.webp");
APP_FILES.push("./img/scenes/k1_boom.webp");
APP_FILES.push("./img/scenes/k1_boot.webp");
APP_FILES.push("./img/scenes/k1_bus.webp");
APP_FILES.push("./img/scenes/k1_doos.webp");
APP_FILES.push("./img/scenes/k1_graag.webp");
APP_FILES.push("./img/scenes/k1_heb.webp");
APP_FILES.push("./img/scenes/k1_heet.webp");
APP_FILES.push("./img/scenes/k1_jas.webp");
APP_FILES.push("./img/scenes/k1_kaas.webp");
APP_FILES.push("./img/scenes/k1_kat.webp");
APP_FILES.push("./img/scenes/k1_kom.webp");
APP_FILES.push("./img/scenes/k1_maan.webp");
APP_FILES.push("./img/scenes/k1_mag.webp");
APP_FILES.push("./img/scenes/k1_man.webp");
APP_FILES.push("./img/scenes/k1_melk.webp");
APP_FILES.push("./img/scenes/k1_naar.webp");
APP_FILES.push("./img/scenes/k1_op.webp");
APP_FILES.push("./img/scenes/k1_pen.webp");
APP_FILES.push("./img/scenes/k1_raam.webp");
APP_FILES.push("./img/scenes/k1_school.webp");
APP_FILES.push("./img/scenes/k1_spreek.webp");
APP_FILES.push("./img/scenes/k1_taal.webp");
APP_FILES.push("./img/scenes/k1_tram.webp");
APP_FILES.push("./img/scenes/k1_twee.webp");
APP_FILES.push("./img/scenes/k1_uur.webp");
APP_FILES.push("./img/scenes/k1_vis.webp");
APP_FILES.push("./img/scenes/k1_vraag.webp");
APP_FILES.push("./img/scenes/k1_was.webp");
APP_FILES.push("./img/scenes/k1_woon.webp");
APP_FILES.push("./img/scenes/k1_zee.webp");
APP_FILES.push("./img/scenes/k1_zes.webp");
APP_FILES.push("./img/scenes/k1_zon.webp");
APP_FILES.push("./img/scenes/k1_zoon.webp");
APP_FILES.push("./img/scenes/k1_zwem.webp");
APP_FILES.push("./img/scenes/k2_appel.webp");
APP_FILES.push("./img/scenes/k2_bellen.webp");
APP_FILES.push("./img/scenes/k2_bomen.webp");
APP_FILES.push("./img/scenes/k2_bommen.webp");
APP_FILES.push("./img/scenes/k2_eten.webp");
APP_FILES.push("./img/scenes/k2_hebben.webp");
APP_FILES.push("./img/scenes/k2_katten.webp");
APP_FILES.push("./img/scenes/k2_koffie.webp");
APP_FILES.push("./img/scenes/k2_komen.webp");
APP_FILES.push("./img/scenes/k2_kopen.webp");
APP_FILES.push("./img/scenes/k2_kussen.webp");
APP_FILES.push("./img/scenes/k2_leren.webp");
APP_FILES.push("./img/scenes/k2_letter.webp");
APP_FILES.push("./img/scenes/k2_lezen.webp");
APP_FILES.push("./img/scenes/k2_liggen.webp");
APP_FILES.push("./img/scenes/k2_lopen.webp");
APP_FILES.push("./img/scenes/k2_maken.webp");
APP_FILES.push("./img/scenes/k2_mannen.webp");
APP_FILES.push("./img/scenes/k2_nemen.webp");
APP_FILES.push("./img/scenes/k2_pakken.webp");
APP_FILES.push("./img/scenes/k2_rennen.webp");
APP_FILES.push("./img/scenes/k2_samen.webp");
APP_FILES.push("./img/scenes/k2_slapen.webp");
APP_FILES.push("./img/scenes/k2_sokken.webp");
APP_FILES.push("./img/scenes/k2_spelen.webp");
APP_FILES.push("./img/scenes/k2_spreken.webp");
APP_FILES.push("./img/scenes/k2_stoppen.webp");
APP_FILES.push("./img/scenes/k2_talen.webp");
APP_FILES.push("./img/scenes/k2_vragen.webp");
APP_FILES.push("./img/scenes/k2_wassen.webp");
APP_FILES.push("./img/scenes/k2_wonen.webp");
APP_FILES.push("./img/scenes/k2_zeven.webp");
APP_FILES.push("./img/scenes/k2_zitten.webp");
APP_FILES.push("./img/scenes/k2_zonen.webp");
APP_FILES.push("./img/scenes/k2_zwemmen.webp");
APP_FILES.push("./img/scenes/k3_bellen.webp");
APP_FILES.push("./img/scenes/k3_eten.webp");
APP_FILES.push("./img/scenes/k3_halen.webp");
APP_FILES.push("./img/scenes/k3_hebben.webp");
APP_FILES.push("./img/scenes/k3_heten.webp");
APP_FILES.push("./img/scenes/k3_kopen.webp");
APP_FILES.push("./img/scenes/k3_leren.webp");
APP_FILES.push("./img/scenes/k3_liggen.webp");
APP_FILES.push("./img/scenes/k3_lopen.webp");
APP_FILES.push("./img/scenes/k3_maken.webp");
APP_FILES.push("./img/scenes/k3_nemen.webp");
APP_FILES.push("./img/scenes/k3_pakken.webp");
APP_FILES.push("./img/scenes/k3_praten.webp");
APP_FILES.push("./img/scenes/k3_rennen.webp");
APP_FILES.push("./img/scenes/k3_slapen.webp");
APP_FILES.push("./img/scenes/k3_spelen.webp");
APP_FILES.push("./img/scenes/k3_spreken.webp");
APP_FILES.push("./img/scenes/k3_stoppen.webp");
APP_FILES.push("./img/scenes/k3_vragen.webp");
APP_FILES.push("./img/scenes/k3_wassen.webp");
APP_FILES.push("./img/scenes/k3_wonen.webp");
APP_FILES.push("./img/scenes/k3_zetten.webp");
APP_FILES.push("./img/scenes/k3_zitten.webp");
APP_FILES.push("./img/scenes/k3_zwemmen.webp");
APP_FILES.push("./img/scenes/kl_10.webp");
APP_FILES.push("./img/scenes/kl_11.webp");
APP_FILES.push("./img/scenes/kl_12.webp");
APP_FILES.push("./img/scenes/kl_13.webp");
APP_FILES.push("./img/scenes/kl_14.webp");
APP_FILES.push("./img/scenes/kl_3.webp");
APP_FILES.push("./img/scenes/kl_4.webp");
APP_FILES.push("./img/scenes/kl_5.webp");
APP_FILES.push("./img/scenes/kl_6.webp");
APP_FILES.push("./img/scenes/kl_7.webp");
APP_FILES.push("./img/scenes/kl_8.webp");
APP_FILES.push("./img/scenes/kl_9.webp");
APP_FILES.push("./img/scenes/kt_1.webp");
APP_FILES.push("./img/scenes/kt_10.webp");
APP_FILES.push("./img/scenes/kt_11.webp");
APP_FILES.push("./img/scenes/kt_12.webp");
APP_FILES.push("./img/scenes/kt_13.webp");
APP_FILES.push("./img/scenes/kt_14.webp");
APP_FILES.push("./img/scenes/kt_15.webp");
APP_FILES.push("./img/scenes/kt_16.webp");
APP_FILES.push("./img/scenes/kt_17.webp");
APP_FILES.push("./img/scenes/kt_18.webp");
APP_FILES.push("./img/scenes/kt_19.webp");
APP_FILES.push("./img/scenes/kt_2.webp");
APP_FILES.push("./img/scenes/kt_20.webp");
APP_FILES.push("./img/scenes/kt_21.webp");
APP_FILES.push("./img/scenes/kt_22.webp");
APP_FILES.push("./img/scenes/kt_23.webp");
APP_FILES.push("./img/scenes/kt_24.webp");
APP_FILES.push("./img/scenes/kt_25.webp");
APP_FILES.push("./img/scenes/kt_26.webp");
APP_FILES.push("./img/scenes/kt_27.webp");
APP_FILES.push("./img/scenes/kt_28.webp");
APP_FILES.push("./img/scenes/kt_29.webp");
APP_FILES.push("./img/scenes/kt_3.webp");
APP_FILES.push("./img/scenes/kt_30.webp");
APP_FILES.push("./img/scenes/kt_4.webp");
APP_FILES.push("./img/scenes/kt_5.webp");
APP_FILES.push("./img/scenes/kt_6.webp");
APP_FILES.push("./img/scenes/kt_7.webp");
APP_FILES.push("./img/scenes/kt_8.webp");
APP_FILES.push("./img/scenes/kt_9.webp");
APP_FILES.push("./img/scenes/mon_1.webp");
APP_FILES.push("./img/scenes/mon_10.webp");
APP_FILES.push("./img/scenes/mon_11.webp");
APP_FILES.push("./img/scenes/mon_12.webp");
APP_FILES.push("./img/scenes/mon_2.webp");
APP_FILES.push("./img/scenes/mon_3.webp");
APP_FILES.push("./img/scenes/mon_4.webp");
APP_FILES.push("./img/scenes/mon_5.webp");
APP_FILES.push("./img/scenes/mon_6.webp");
APP_FILES.push("./img/scenes/mon_7.webp");
APP_FILES.push("./img/scenes/mon_8.webp");
APP_FILES.push("./img/scenes/mon_9.webp");
APP_FILES.push("./img/scenes/mv_1.webp");
APP_FILES.push("./img/scenes/mv_12.webp");
APP_FILES.push("./img/scenes/mv_6.webp");
APP_FILES.push("./img/scenes/num_11.webp");
APP_FILES.push("./img/scenes/num_12.webp");
APP_FILES.push("./img/scenes/num_13.webp");
APP_FILES.push("./img/scenes/num_14.webp");
APP_FILES.push("./img/scenes/num_15.webp");
APP_FILES.push("./img/scenes/num_16.webp");
APP_FILES.push("./img/scenes/num_17.webp");
APP_FILES.push("./img/scenes/num_18.webp");
APP_FILES.push("./modules/scenes/map.js?v=165");
// scenes-end
