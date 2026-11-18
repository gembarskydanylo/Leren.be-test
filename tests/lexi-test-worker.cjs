// TEST-034 · The separate test Worker for Lexi can never become the production one, and the local test server never
// talks to production. Static checks of tools/lexi-test-worker.toml, the Worker code with the test variables (mocked
// model, no key, no network) and tools/lexi-test-server.cjs. Nothing is deployed and no AI is called.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), {spawn} = require('node:child_process');
const ROOT = path.join(__dirname, '..');
(async () => {
 // ---- configuration
 const toml = fs.readFileSync(path.join(ROOT, 'tools/lexi-test-worker.toml'), 'utf8').split('\n').filter(l => !/^\s*#/.test(l)).join('\n');
 const v = k => (toml.match(new RegExp('^' + k + '\\s*=\\s*"([^"]*)"', 'm')) || [])[1];
 assert.equal(v('name'), 'leren-ai-test', 'own Worker name');
 assert.notEqual(v('name'), 'leren-ai');
 assert.equal(v('main'), 'ai-worker.js', 'same code as production: no second AI engine');
 assert.match(toml, /^keep_vars = false/m, 'every deploy resets the variables');
 assert.equal(v('AI_OFF'), '1', 'switched off after every deploy');
 assert.equal(v('MODEL'), 'claude-haiku-5-5');
 assert.ok(+v('DAILY_LIMIT') <= 60 && +v('DAILY_IP_LIMIT') <= 150, 'test limits are not above production');
 const origins = v('ALLOWED_ORIGINS').split(',').map(s => s.trim());
 assert.deepEqual(origins, ['http://localhost:8765'], 'only the local test server');
 assert.doesNotMatch(toml, /^\s*(route|routes|custom_domain|account_id)\b/m, 'no route on lerenbe.com, no account baked in');
 assert.doesNotMatch(toml, /leren-ai-rate|ANTHROPIC_KEY\s*=|RATE_SALT\s*=|firebase/i, 'no production KV, no secrets, no Firebase');
 const ids = [...toml.matchAll(/namespace_id\s*=\s*"(\d+)"/g)].map(m => m[1]);
 assert.equal(ids.length, 3); for (const id of ids) assert.ok(!['1001', '1002', '1003', '1004'].includes(id), 'own rate counters, not production ' + id);
 const limit = n => +(toml.split('name = "' + n + '"')[1] || '').match(/limit = (\d+)/)[1];
 assert.ok(limit('PER_IP') <= 12 && limit('IP_CEIL') <= 40 && limit('ALL') <= 300, 'per-minute limits not above production');
 assert.doesNotMatch(toml, /name = "ERRS"/, 'no app error reports on the test Worker');
 for (const f of fs.readdirSync(path.join(ROOT, '.github/workflows'))) assert.doesNotMatch(fs.readFileSync(path.join(ROOT, '.github/workflows', f), 'utf8'), /lexi-test-worker|wrangler/, f + ' must not deploy any Worker');
 console.log('PASS: config — own name, same code, off after every deploy, own limits and counters, localhost origin only, no secrets / KV / Firebase / route, no workflow deploys it');

 // ---- the Worker code with the test variables
 const src = fs.readFileSync(path.join(ROOT, 'tools/ai-worker.js'), 'utf8');
 const worker = (await import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'))).default, real = globalThis.fetch;
 const kv = () => { const m = new Map(); return {async get(k) { return m.get(k) ?? null }, async put(k, x) { m.set(k, x) }} };
 const testEnv = {PROVIDER: 'anthropic', ANTHROPIC_KEY: 'sk-test', RATE_SALT: 'salt', AI_OFF: '0', ALLOWED_ORIGINS: v('ALLOWED_ORIGINS'), MODEL: v('MODEL'), RATE: kv()};
 const prodEnv = {PROVIDER: 'anthropic', ANTHROPIC_KEY: 'sk-test', RATE: kv()};
 let calls = 0;
 async function call(env, origin) {
  globalThis.fetch = async (u, o) => { calls++; assert.equal(JSON.parse(o.body).model, env.MODEL || 'claude-haiku-5-5'); return {ok: true, status: 200, json: async () => ({stop_reason: 'end_turn', content: [{type: 'text', text: JSON.stringify({learner_in_target: 'Ik woon in Gent.', reply: 'Leuk!', translation: 'Класно!', correction: null})}]})} };
  try {
   const r = await worker.fetch(new Request('https://w.example/', {method: 'POST', headers: {Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.7', 'X-Leren-Device': 'b'.repeat(24)}, body: JSON.stringify({mode: 'chat', target: 'nl', lang: 'uk', char: 'lexi', messages: [{role: 'user', content: 'Ik woon in Gent.'}]})}), env, {waitUntil() {}});
   return {status: r.status, allow: r.headers.get('access-control-allow-origin'), json: await r.json()};
  } finally { globalThis.fetch = real }
 }
 let r = await call(testEnv, 'http://localhost:8765'); assert.equal(r.status, 200); assert.equal(r.allow, 'http://localhost:8765'); assert.equal(r.json.reply, 'Leuk!');
 for (const o of ['https://lerenbe.com', 'https://www.lerenbe.com', 'https://gembarskydanylo.github.io', 'null', '']) { const n = calls; r = await call(testEnv, o); assert.equal(r.status, 403, 'test Worker refuses ' + o); assert.equal(calls, n, 'no model call for ' + o) }
 r = await call({...testEnv, AI_OFF: '1'}, 'http://localhost:8765'); assert.equal(r.status, 503); assert.equal(r.json.error, 'off', 'switch');
 r = await call({...testEnv, ALLOWED_ORIGINS: '*'}, 'https://evil.example'); assert.equal(r.status, 403, 'a malformed list never means «everyone»');
 // production behaviour unchanged (no ALLOWED_ORIGINS)
 r = await call(prodEnv, 'https://lerenbe.com'); assert.equal(r.status, 200); assert.equal(r.allow, 'https://lerenbe.com');
 r = await call(prodEnv, 'https://gembarskydanylo.github.io'); assert.equal(r.status, 403, 'production still refuses the beta');
 console.log('PASS: Worker — the test variables allow only localhost:8765, AI_OFF stops it, a bad list is not a wildcard; production origins unchanged');

 // ---- local test server
 const run = (envx, port) => new Promise(res => { const p = spawn(process.execPath, [path.join(ROOT, 'tools/lexi-test-server.cjs')], {env: {...process.env, PORT: String(port), ...envx}}); let out = ''; p.stdout.on('data', d => { out += d; if (out.includes('LerenBe test server')) res({p, out}) }); p.stderr.on('data', d => out += d); p.on('exit', code => res({p, code, out})) });
 let s = await run({LEXI_TEST_WORKER: 'https://leren-ai.gembarsky-d.workers.dev/'}, 18766); assert.equal(s.code, 1, 'refuses the production Worker'); assert.match(s.out, /never the production/);
 s = await run({LEXI_TEST_WORKER: 'https://example.com/'}, 18766); assert.equal(s.code, 1, 'refuses any other host');
 s = await run({LEXI_TEST_WORKER: ''}, 18765);
 try {
  const B = 'http://127.0.0.1:18765';
  assert.equal((await fetch(B + '/app/')).status, 200);
  assert.equal((await fetch(B + '/tools/ai-worker.js')).status, 404, 'only app/ is served');
  assert.equal((await fetch(B + '/app/..%2ftools/ai-worker.js')).status, 404, 'no path escape');
  assert.match(await (await fetch(B + '/lexi-test.html')).text(), /leren_ai_endpoint/);
  r = await fetch(B + '/lexi-test-ai/', {method: 'POST', headers: {'content-type': 'application/json', origin: 'http://localhost:18765'}, body: '{}'});
  assert.equal(r.status, 503); assert.equal((await r.json()).error, 'off', 'without a test Worker the proxy is off');
  r = await fetch(B + '/lexi-test-ai/', {method: 'POST', headers: {origin: 'https://evil.example'}, body: '{}'}); assert.equal(r.status, 403);
  r = await fetch(B + '/lexi-test-ai/', {method: 'POST', headers: {origin: 'http://localhost:18765'}, body: 'x'.repeat(70000)}); assert.equal(r.status, 413);
 } finally { s.p.kill() }
 console.log('PASS: test server — serves app/ only, refuses production or unknown Workers, proxy off without a test Worker, other origins and big bodies refused');
})().catch(e => { console.error(e); process.exit(1) });
