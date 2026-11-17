// Copied from Leren.be (production) 257ea19 in TEST-031; in this repository the app snapshot is app/, so the app checks read app/modules.
// Limits and API-error behaviour of tools/ai-worker.js, with mocked KV, rate-limit bindings and model API.
// No key, no network. Run: node tests/ai-worker-limits.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const IP = "203.0.113.77", DEV_A = "aaaaaaaaaaaaaaaaaaaaaaaa", DEV_B = "bbbbbbbbbbbbbbbbbbbbbbbb", DEV_C = "cccccccccccccccccccccccc";
const ORIGIN = "https://lerenbe.com";

function makeKV({broken = false} = {}) {
  const m = new Map(), log = {puts: 0, gets: 0};
  return {m, log,
    async get(k) { log.gets++; if (broken) throw new Error("kv down"); return m.get(k) ?? null; },
    async put(k, v) { log.puts++; if (broken) throw new Error("kv down"); m.set(k, v); }};
}
function makeLimiter(max, {fail = false} = {}) {
  const counts = new Map(), keys = [];
  return {keys, async limit({key}) { if (fail) throw new Error("limiter down"); keys.push(key); const n = (counts.get(key) || 0) + 1; counts.set(key, n); return {success: n <= max}; }};
}
const modelOk = reply => async () => ({ok: true, status: 200, json: async () => ({stop_reason: "end_turn", content: [{type: "text", text: JSON.stringify(reply)}]})});
const CHAT = {learner_in_target: "Ik heb een test.", reply: "Veel succes!", translation: "Успіхів!", correction: {has_error: false, original: "", corrected: "", explanation: ""}};
const ASK = {answer: "Це «het huis».", examples: []};

async function load() {
  const src = fs.readFileSync(path.join(__dirname, "../tools/ai-worker.js"), "utf8");
  return (await import("data:text/javascript;base64," + Buffer.from(src).toString("base64"))).default;
}
function post(body, {device = DEV_A, ip = IP, origin = ORIGIN, raw} = {}) {
  const headers = {Origin: origin, "Content-Type": "application/json", "CF-Connecting-IP": ip};
  if (device) headers["X-Leren-Device"] = device;
  return new Request("https://leren-ai.example/", {method: "POST", headers, body: raw ?? JSON.stringify(body)});
}
const chatBody = (text = "Ik heb een test.") => ({mode: "chat", target: "nl", lang: "uk", level: "a11", messages: [{role: "user", content: text}]});
const baseEnv = (extra = {}) => ({PROVIDER: "anthropic", ANTHROPIC_KEY: "sk-test-secret", RATE: makeKV(), ...extra});

(async () => {
  const worker = await load();
  const realFetch = globalThis.fetch;
  const withModel = async (impl, fn) => { globalThis.fetch = impl; try { return await fn(); } finally { globalThis.fetch = realFetch; } };
  const send = (env, req) => worker.fetch(req, env, {waitUntil() {}});
  const tests = [];
  const t = (name, fn) => tests.push([name, fn]);

  t("forbidden origin and method", async () => {
    const env = baseEnv();
    assert.equal((await send(env, post(chatBody(), {origin: "https://evil.example"}))).status, 403);
    assert.equal((await send(env, new Request("https://x/", {method: "GET", headers: {Origin: ORIGIN}}))).status, 403);
  });

  t("CORS exposes Retry-After and allows the device header", async () => {
    const r = await send(baseEnv(), new Request("https://x/", {method: "OPTIONS", headers: {Origin: ORIGIN}}));
    assert.match(r.headers.get("Access-Control-Allow-Headers"), /X-Leren-Device/);
    assert.match(r.headers.get("Access-Control-Expose-Headers"), /Retry-After/);
  });

  t("neither the IP address nor the device code is stored or sent to a limiter in clear", async () => {
    const env = baseEnv({PER_IP: makeLimiter(99), IP_CEIL: makeLimiter(99), ALL: makeLimiter(99)});
    await withModel(modelOk(CHAT), async () => assert.equal((await send(env, post(chatBody()))).status, 200));
    const seen = JSON.stringify([...env.RATE.m.entries(), env.PER_IP.keys, env.IP_CEIL.keys, env.ALL.keys]);
    assert.ok(env.RATE.m.size === 1, "one KV record per network and day");
    assert.doesNotMatch(seen, new RegExp(IP.replace(/\./g, "\\.")));
    assert.doesNotMatch(seen, new RegExp(DEV_A));
    assert.doesNotMatch(seen, /sk-test-secret/);
    for (const key of [...env.RATE.m.keys()]) assert.match(key, /^\d{4}-\d{2}-\d{2}:[0-9a-f]{24}$/);
  });

  t("hashes are stable per visitor and differ between visitors", async () => {
    const env = baseEnv({PER_IP: makeLimiter(99)});
    await withModel(modelOk(CHAT), async () => {
      await send(env, post(chatBody(), {device: DEV_A}));
      await send(env, post(chatBody(), {device: DEV_A}));
      await send(env, post(chatBody(), {device: DEV_B}));
    });
    const k = env.PER_IP.keys; assert.equal(k[0], k[1]); assert.notEqual(k[0], k[2]);
    assert.equal(k[0].split(":")[0], k[2].split(":")[0], "same network part, different device part");
  });

  t("learners on one Wi-Fi do not use up each other's daily messages", async () => {
    const env = baseEnv({DAILY_LIMIT: "3", DAILY_IP_LIMIT: "8"});
    await withModel(modelOk(CHAT), async () => {
      for (let i = 0; i < 3; i++) assert.equal((await send(env, post(chatBody(), {device: DEV_A}))).status, 200);
      const blocked = await send(env, post(chatBody(), {device: DEV_A}));
      assert.equal(blocked.status, 429);
      const j = await blocked.json();
      assert.equal(j.error, "limit"); assert.equal(j.scope, "device");
      assert.ok(j.retry_after >= 1 && j.retry_after <= 86400);
      assert.equal(blocked.headers.get("Retry-After"), String(j.retry_after));
      assert.ok(new Date(j.reset_at).getTime() > Date.now(), "reset time is in the future");
      assert.equal(new Date(j.reset_at).getUTCHours(), 0);
      assert.equal((await send(env, post(chatBody(), {device: DEV_B}))).status, 200, "the next learner is not blocked");
    });
  });

  t("a bot rotating device codes is stopped by the network ceiling", async () => {
    const env = baseEnv({DAILY_LIMIT: "3", DAILY_IP_LIMIT: "8"});
    let ok = 0, scope = "";
    await withModel(modelOk(CHAT), async () => {
      for (let i = 0; i < 30; i++) {
        const dev = "rotating" + String(i).padStart(16, "0");
        const r = await send(env, post(chatBody(), {device: dev}));
        if (r.status === 200) ok++; else { scope = (await r.json()).scope; break; }
      }
    });
    assert.equal(ok, 8); assert.equal(scope, "network");
  });

  t("default limits: 60 per device, 150 per network", async () => {
    const env = baseEnv();
    await withModel(modelOk(CHAT), async () => {
      let n = 0; while (n < 100) { const r = await send(env, post(chatBody(), {device: DEV_A})); if (r.status !== 200) { assert.equal((await r.json()).scope, "device"); break; } n++; }
      assert.equal(n, 60);
    });
  });

  t("a broken DAILY_LIMIT value does not switch the limit off", async () => {
    for (const bad of ["abc", "0", "-5", "", "NaN"]) {
      const env = baseEnv({DAILY_LIMIT: bad});
      await withModel(modelOk(CHAT), async () => {
        let n = 0; while (n < 100) { const r = await send(env, post(chatBody(), {device: DEV_A})); if (r.status !== 200) break; n++; }
        assert.equal(n, 60, "fallback 60 for DAILY_LIMIT=" + JSON.stringify(bad));
      });
    }
  });

  t("failed model calls are not counted: retry costs nothing", async () => {
    const env = baseEnv({DAILY_LIMIT: "2"});
    const failures = [
      async () => ({ok: false, status: 500, json: async () => ({error: "boom"})}),
      async () => ({ok: true, status: 200, json: async () => ({stop_reason: "refusal", content: []})}),
      async () => ({ok: true, status: 200, json: async () => ({stop_reason: "end_turn", content: [{type: "text", text: "not json"}]})}),
      async () => ({ok: true, status: 200, json: async () => ({stop_reason: "end_turn", content: [{type: "text", text: JSON.stringify({reply: ""})}]})}),
      async () => { const e = new Error("aborted"); e.name = "AbortError"; throw e; }
    ];
    for (const f of failures) await withModel(f, async () => assert.ok([502, 504].includes((await send(env, post(chatBody()))).status)));
    const stored = JSON.parse([...env.RATE.m.values()][0] || '{"n":0,"d":{}}');
    assert.equal(stored.n, 0, "every reserved message was given back"); assert.ok(Object.values(stored.d).every(v => v === 0));
    await withModel(modelOk(CHAT), async () => {
      assert.equal((await send(env, post(chatBody()))).status, 200);
      assert.equal((await send(env, post(chatBody()))).status, 200);
      assert.equal((await send(env, post(chatBody()))).status, 429, "only the two delivered replies were counted");
    });
  });

  t("API error responses", async () => {
    const env = baseEnv();
    const call = async (impl, body = chatBody()) => withModel(impl, async () => { const r = await send(env, post(body)); return [r.status, await r.json()]; });
    assert.deepEqual(await call(async () => ({ok: false, status: 529, json: async () => ({})})), [502, {error: "ai"}]);
    assert.deepEqual(await call(async () => ({ok: true, status: 200, json: async () => ({stop_reason: "refusal", content: []})})), [502, {error: "refusal"}]);
    assert.deepEqual(await call(async () => ({ok: true, status: 200, json: async () => ({content: [{type: "text", text: "{}"}]})})), [502, {error: "format"}]);
    assert.deepEqual(await call(async () => { const e = new Error("x"); e.name = "AbortError"; throw e; }), [504, {error: "timeout"}]);
    assert.deepEqual(await call(async () => { throw new TypeError("network"); }), [502, {error: "ai"}]);
    assert.deepEqual(await call(modelOk({answer: "", examples: []}), {mode: "ask", messages: [{role: "user", content: "Wat is huis?"}]}), [502, {error: "format"}]);
  });

  t("bad bodies are rejected without touching the daily counter", async () => {
    const env = baseEnv();
    await withModel(modelOk(CHAT), async () => {
      assert.equal((await send(env, post(null, {raw: "{bad"}))).status, 400);
      assert.equal((await send(env, post(null, {raw: "[]"}))).status, 400);
      assert.equal((await send(env, post(null, {raw: JSON.stringify({mode: "chat", pad: "x".repeat(70000)})}))).status, 413);
      assert.equal((await send(env, post({mode: "ask", messages: []}))).status, 400);
    });
    assert.equal(env.RATE.log.puts, 0);
  });

  t("reports use the per-minute guard but never the daily message quota", async () => {
    const env = baseEnv({DAILY_LIMIT: "1"});
    for (let i = 0; i < 5; i++) assert.equal((await send(env, post({mode: "report", kind: "chat", text: "?"}))).status, 200);
    assert.equal(env.RATE.log.puts, 0);
    await withModel(modelOk(CHAT), async () => assert.equal((await send(env, post(chatBody()))).status, 200));
  });

  t("minute limit says how long to wait; it counts failed requests too", async () => {
    const env = baseEnv({PER_IP: makeLimiter(2)});
    await withModel(async () => ({ok: false, status: 500, json: async () => ({})}), async () => {
      assert.equal((await send(env, post(chatBody()))).status, 502);
      assert.equal((await send(env, post(chatBody()))).status, 502);
      const r = await send(env, post(chatBody()));
      assert.equal(r.status, 429); assert.deepEqual(await r.json(), {error: "slow", retry_after: 60}); assert.equal(r.headers.get("Retry-After"), "60");
    });
  });

  t("a limiter that fails closes the door; a missing binding does not", async () => {
    await withModel(modelOk(CHAT), async () => {
      assert.equal((await send(baseEnv({PER_IP: makeLimiter(5, {fail: true})}), post(chatBody()))).status, 429);
      assert.equal((await send(baseEnv({ALL: makeLimiter(5, {fail: true})}), post(chatBody()))).status, 429);
      assert.equal((await send(baseEnv(), post(chatBody()))).status, 200);
    });
  });

  t("one device cannot starve its neighbours per minute; the network ceiling still applies", async () => {
    const env = baseEnv({PER_IP: makeLimiter(2), IP_CEIL: makeLimiter(4)});
    await withModel(modelOk(CHAT), async () => {
      assert.equal((await send(env, post(chatBody(), {device: DEV_A}))).status, 200);
      assert.equal((await send(env, post(chatBody(), {device: DEV_A}))).status, 200);
      assert.equal((await send(env, post(chatBody(), {device: DEV_A}))).status, 429);
      assert.equal((await send(env, post(chatBody(), {device: DEV_B}))).status, 200, "other device on the same IP");
      assert.equal((await send(env, post(chatBody(), {device: DEV_B}))).status, 200);
      assert.equal((await send(env, post(chatBody(), {device: DEV_C}))).status, 429, "network ceiling: 4 requests passed on this IP already (the one refused per device does not count)");
    });
  });

  t("old app versions without a device code share one bucket per network", async () => {
    const env = baseEnv({DAILY_LIMIT: "2"});
    await withModel(modelOk(CHAT), async () => {
      assert.equal((await send(env, post(chatBody(), {device: ""}))).status, 200);
      assert.equal((await send(env, post(chatBody(), {device: "short"}))).status, 200, "invalid code is ignored");
      assert.equal((await send(env, post(chatBody(), {device: ""}))).status, 429);
      assert.equal((await send(env, post(chatBody(), {device: DEV_A}))).status, 200);
    });
  });

  t("KV outage fails open for the daily count only", async () => {
    const env = baseEnv({RATE: makeKV({broken: true}), PER_IP: makeLimiter(1)});
    await withModel(modelOk(CHAT), async () => {
      assert.equal((await send(env, post(chatBody()))).status, 200);
      assert.equal((await send(env, post(chatBody()))).status, 429, "the minute limiter still works");
    });
  });

  t("memo and ask replies count like chat replies; empty memo does not", async () => {
    const env = baseEnv({DAILY_LIMIT: "2"});
    await withModel(modelOk({memory: "• Naam: Anna"}), async () => assert.equal((await send(env, post({mode: "memo", memory: "", messages: [{role: "user", content: "Ik ben Anna."}, {role: "assistant", content: "Hallo!"}]}))).status, 200));
    await withModel(modelOk(ASK), async () => assert.equal((await send(env, post({mode: "ask", messages: [{role: "user", content: "Wat is huis?"}]}))).status, 200));
    await withModel(modelOk(CHAT), async () => assert.equal((await send(env, post(chatBody()))).status, 429));
  });

  t("a burst at normal pace cannot pass the daily limit (message reserved before the model call)", async () => {
    const env = baseEnv({DAILY_LIMIT: "3"});
    const slow = async () => { await new Promise(r => setTimeout(r, 200)); return modelOk(CHAT)(); };
    await withModel(slow, async () => {
      const ps = [];
      for (let i = 0; i < 8; i++) { ps.push(send(env, post(chatBody()))); await new Promise(r => setTimeout(r, 5)); }
      const st = (await Promise.all(ps)).map(r => r.status);
      assert.equal(st.filter(s => s === 200).length, 3, "statuses " + st.join(","));
    });
  });

  t("emergency switch", async () => assert.equal((await send(baseEnv({AI_OFF: "1"}), post(chatBody()))).status, 503));

  t("the Worker gives up before the app does (25 s < 30 s) and the daily/KV code never exposes keys", async () => {
    const src = fs.readFileSync(path.join(__dirname, "../tools/ai-worker.js"), "utf8");
    assert.match(src, /setTimeout\(\(\) => ctl\.abort\(\), 25000\)/);
    const core = fs.readFileSync(path.join(__dirname, "../app/modules/ai-coach/core.js"), "utf8");
    assert.match(core, /options\.timeout\|\|30000/);
  });

  // ---- app side: device header, wait information ----
  t("app: random device code is created once, kept on the device and sent as a header", async () => {
    const store = new Map();
    const ctx = vm.createContext({console, AbortController, setTimeout, clearTimeout, localStorage: {getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v)}, crypto: require("node:crypto").webcrypto});
    vm.runInContext(fs.readFileSync(path.join(__dirname, "../app/modules/ai-coach/core.js"), "utf8"), ctx);
    const api = ctx.LerenAICoach, h1 = api.headers(), h2 = api.headers();
    assert.match(h1["X-Leren-Device"], /^[0-9a-f]{32}$/); assert.equal(h1["X-Leren-Device"], h2["X-Leren-Device"]);
    assert.equal(store.get("leren_ai_device"), h1["X-Leren-Device"]);
    let sent; await api.request("u", {mode: "chat"}, {fetch: async (u, o) => { sent = o; return {ok: true, json: async () => ({reply: "x"})}; }});
    assert.equal(sent.headers["X-Leren-Device"], h1["X-Leren-Device"]);
    const blocked = {ok: false, status: 429, json: async () => ({error: "limit", scope: "device", retry_after: 3600, reset_at: "2030-01-01T00:00:00.000Z"})};
    await assert.rejects(api.request("u", {}, {fetch: async () => blocked}), e => e.code === "limit" && e.wait.kind === "day" && e.wait.at.toISOString() === "2030-01-01T00:00:00.000Z");
    await assert.rejects(api.request("u", {}, {fetch: async () => ({ok: false, status: 429, json: async () => ({error: "slow", retry_after: 60})})}), e => e.wait.kind === "minute" && e.wait.seconds === 60);
    await assert.rejects(api.request("u", {}, {fetch: async () => ({ok: false, status: 429, json: async () => ({error: "limit", scope: "network", retry_after: 5})})}), e => e.wait.kind === "network");
    await assert.rejects(api.request("u", {}, {fetch: async () => ({ok: false, status: 502, json: async () => ({error: "ai"})})}), e => e.code === "network" && e.wait === null);
  });

  t("app: without storage the header is simply omitted", async () => {
    const ctx = vm.createContext({console, AbortController, setTimeout, clearTimeout});
    vm.runInContext(fs.readFileSync(path.join(__dirname, "../app/modules/ai-coach/core.js"), "utf8"), ctx);
    assert.deepEqual({...ctx.LerenAICoach.headers()}, {"Content-Type": "application/json"});
  });

  let failed = 0;
  for (const [name, fn] of tests) {
    try { await fn(); console.log("PASS", name); } catch (e) { failed++; console.error("FAIL", name, "\n ", e && e.stack ? e.stack.split("\n").slice(0, 4).join("\n  ") : e); }
  }
  if (failed) { process.exitCode = 1; return; }
  console.log("PASS: " + tests.length + " limit and API-error checks (hashed visitors, shared Wi-Fi, daily count only for delivered replies, retry-after, KV/limiter outages)");
})();
