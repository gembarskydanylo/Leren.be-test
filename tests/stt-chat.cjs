// TEST-017: AI chat microphone → recorded audio → speech-to-text worker → editable text → chat request.
// Runs app/ in Chromium with a fake microphone; both workers are mocked (no real network, no real voice).
const assert = require("assert"), fs = require("fs"), path = require("path"), http = require("http");
const root = path.join(__dirname, "..", "app");
(async () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  assert(app.includes('const STT_ENDPOINT='), "STT endpoint constant");
  assert(/function recordVoice\(/.test(app), "recorder");
  assert(app.includes('job=recordVoice({'), "AI chat mic uses the recorder first");
  assert(app.includes('job=listenLong({'), "browser recogniser kept as fallback");
  console.log("PASS: stt-chat static");
  let chromium; try { ({ chromium } = require("playwright")); } catch { console.log("SKIP: browser part (Playwright is not installed)"); return; }
  const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff": "font/woff", ".m4a": "audio/mp4", ".webmanifest": "application/json", ".jpg": "image/jpeg" };
  const server = http.createServer((q, r) => { let f = path.join(root, decodeURIComponent(new URL(q.url, "http://x").pathname)); if (!f.startsWith(root) || !fs.existsSync(f)) { r.statusCode = 404; return r.end(); } if (fs.statSync(f).isDirectory()) f = path.join(f, "index.html"); r.setHeader("content-type", types[path.extname(f)] || "application/octet-stream"); fs.createReadStream(f).pipe(r); });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  let browser; try { browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] }); } catch { console.log("SKIP: no Chromium"); server.close(); return; }
  const release = app.match(/RELEASE_VERSION="(\d+)"/)[1];
  const run = async ({ stt, label }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block", bypassCSP: true, permissions: ["microphone"] });
    const page = await ctx.newPage(), errors = [], sttCalls = [], aiCalls = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => {
      const u = r.request().url();
      if (u.startsWith("https://leren-stt.gembarsky-d.workers.dev/")) { sttCalls.push({ url: u, type: r.request().headers()["content-type"], size: (r.request().postDataBuffer() || Buffer.alloc(0)).length }); return r.fulfill(stt); }
      if (u.startsWith("https://leren-ai.gembarsky-d.workers.dev/")) { const b = JSON.parse(r.request().postData() || "{}"); aiCalls.push(b); return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(b.mode === "memo" ? { memory: "" } : { reply: "Hallo! Hoe gaat het?", reply_nl: "Hallo! Hoe gaat het?", translation: "Привіт! Як справи?", correction: null }) }); }
      return r.abort();
    });
    await page.addInitScript((r) => { if (sessionStorage.getItem("seeded")) return; sessionStorage.setItem("seeded", "1"); localStorage.clear(); for (const [k, v] of Object.entries({ leren_release_seen: JSON.stringify(r), poly_ui: "uk", leren_home_v1: "path", leren_welcome_seen: "true", leren_onboarding_language_v1: "1", leren_ai_consent18: "true" })) localStorage.setItem(k, v); }, release);
    await page.goto("http://127.0.0.1:" + server.address().port + "/index.html");
    await page.waitForFunction(() => typeof aiStart === "function", null, { timeout: 20000 });
    await page.evaluate(() => { setView("games"); aiStart(); });
    await page.waitForTimeout(1500);
    if (process.env.DEBUG_STT) { console.log(await page.evaluate(() => [...document.querySelectorAll(".g-mic-btn")].map((b) => [b.hidden, b.offsetParent && b.offsetParent.className, b.closest("[hidden]") && b.closest("[hidden]").id, getComputedStyle(b).display]))); await page.screenshot({ path: "/tmp/stt.png" }); }
    await page.waitForSelector(".g-mic-btn", { timeout: 15000 });
    await page.waitForFunction(() => document.body.innerText.includes("Hallo! Hoe gaat het?"), null, { timeout: 15000 });
    const mic = page.locator(".g-mic-btn").first();
    await mic.click();
    await page.waitForTimeout(1600);
    const recLabel = await mic.textContent();
    assert(recLabel.includes("Готово") && /\d:\d\d/.test(recLabel), label + ": recording state shows Done and a timer: " + recLabel);
    await mic.click({ force: true }); // the button pulses while recording
    return { ctx, page, errors, sttCalls, aiCalls, mic };
  };
  try {
    // 1. Ukrainian speech comes back as Ukrainian text and is sent to the chat unchanged
    let t = await run({ label: "uk", stt: { status: 200, contentType: "application/json", body: JSON.stringify({ text: "Привіт, як твої справи?", lang: "uk" }) } });
    const input = t.page.locator("form.g-type input").first();
    await t.page.waitForFunction(() => { const i = document.querySelector("form.g-type input"); return i && i.value === "Привіт, як твої справи?"; }, null, { timeout: 10000 });
    assert.equal(t.sttCalls.length, 1, "one STT request");
    assert(/[?&]ui=uk&target=nl/.test(t.sttCalls[0].url), "languages passed: " + t.sttCalls[0].url);
    assert(/^audio\//.test(t.sttCalls[0].type) && t.sttCalls[0].size > 800, "audio body " + t.sttCalls[0].type + " " + t.sttCalls[0].size);
    assert(await t.mic.isEnabled(), "mic usable again");
    const before = t.aiCalls.length;
    await t.page.locator("form.g-type button[type=submit]").first().click();
    await t.page.waitForTimeout(800);
    const sent = t.aiCalls.slice(before).find((b) => b.mode === "chat");
    assert(sent, "chat request sent");
    assert.equal(sent.messages[sent.messages.length - 1].content, "Привіт, як твої справи?", "Ukrainian text reaches the AI unchanged");
    assert.deepEqual(t.errors, [], "no page errors");
    await t.ctx.close();
    console.log("PASS: Ukrainian voice → Ukrainian text → AI chat");

    // 2. Server failure: message for the learner, typing stays possible, mic re-enabled
    t = await run({ label: "fail", stt: { status: 502, contentType: "application/json", body: JSON.stringify({ error: "stt" }) } });
    await t.page.waitForFunction(() => document.body.innerText.includes("Не вдалося розпізнати"), null, { timeout: 10000 });
    assert(await t.mic.isEnabled(), "mic re-enabled after failure");
    assert(await t.page.locator("form.g-type").first().isVisible(), "typing field visible");
    assert.deepEqual(t.errors, []);
    await t.ctx.close();
    console.log("PASS: STT failure falls back to typing");

    // 3. Too many voice messages
    t = await run({ label: "429", stt: { status: 429, contentType: "application/json", body: JSON.stringify({ error: "slow" }) } });
    await t.page.waitForFunction(() => document.body.innerText.includes("Забагато голосових"), null, { timeout: 10000 });
    await t.ctx.close();
    console.log("PASS: rate limit message");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
