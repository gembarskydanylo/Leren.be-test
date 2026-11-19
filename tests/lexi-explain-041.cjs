// TEST-041 · Explanation language: interface language by default, same-language learners get simple
// explanations in that language, never a silent switch to Ukrainian; a separate `explain` choice is honoured.
// Engine + worker code under ROOT (default: this repository), mocked model only.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const ROOT = process.env.ROOT || path.join(__dirname, '..');
const kv = () => { const m = new Map(); return {async get(k) { return m.get(k) ?? null }, async put(k, v) { m.set(k, v) }} };
const LANG = {uk: 'Ukrainian', en: 'English', fr: 'French', ar: 'Arabic'};
(async () => {
 const src = fs.readFileSync(path.join(ROOT, 'tools/ai-worker.js'), 'utf8');
 const worker = (await import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'))).default;
 const store = new Map(), ctx = vm.createContext({console, AbortController, setTimeout, clearTimeout, Promise, Error, URL, crypto: require('node:crypto').webcrypto,
  localStorage: {getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v))}});
 ctx.globalThis = ctx;
 for (const f of ['app/modules/ai-coach/core.js', 'app/modules/lexi/engine.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, {filename: f});
 const L = ctx.LerenLexi, real = globalThis.fetch; let seen = null, body = null;
 L.configure({endpoint: 'http://localhost:8765/ai', local: () => true, production: () => false, online: () => true, fetch: async (u, o) => {
  body = JSON.parse(o.body);
  globalThis.fetch = async (_, mo) => { seen = JSON.parse(mo.body); const ask = body.mode === 'ask'; return {ok: true, status: 200, json: async () => ({stop_reason: 'end_turn', content: [{type: 'text', text: JSON.stringify(ask ? {answer: 'A', examples: []} : {reply: 'Ok', translation: 'T', learner_in_target: '', correction: null})}]})} };
  try { return await worker.fetch(new Request('https://w.example/', {method: 'POST', headers: {...o.headers, Origin: 'http://localhost:8765'}, body: o.body}), {PROVIDER: 'anthropic', ANTHROPIC_KEY: 'k', RATE: kv()}, {waitUntil() {}}) } finally { globalThis.fetch = real }
 }});
 let n = 0;
 for (const ui of ['uk', 'en', 'fr', 'ar']) for (const target of ['nl', 'fr', 'en']) for (const id of ['free', 'grammar', 'roleplay', 'lesson', 'speaking']) {
  await L.send(id, {ui, target}, [{role: 'user', content: 'Hallo'}], id === 'roleplay' ? {scene: 'shop'} : {});
  assert.equal(body.lang, ui, `${ui}/${target}/${id}: explanation language = interface language`);
  assert.match(seen.system, new RegExp('\\b' + LANG[ui] + '\\b'), `${ui}/${target}/${id}: prompt names ${LANG[ui]}`);
  if (ui !== 'uk') assert.doesNotMatch(seen.system, /\bUkrainian\b/, `${ui}/${target}/${id}: no automatic switch to Ukrainian`);
  const same = ui === target;
  if (same) { assert.match(seen.system, /SAME LANGUAGE[\s\S]*VERY simple/, `${ui}/${target}: simple same-language explanations`); assert.doesNotMatch(seen.system, /\bUkrainian\b/, `${ui}/${target}: no switch to Ukrainian`) }
  else assert.doesNotMatch(seen.system, /SAME LANGUAGE/, `${ui}/${target}: no same-language rule`);
  n++;
 }
 // future: a separate explanation-language choice, validated; unknown → interface language
 await L.send('grammar', {ui: 'en', target: 'nl', explain: 'ar'}, [{role: 'user', content: 'de of het?'}]); assert.equal(body.lang, 'ar');
 await L.send('grammar', {ui: 'fr', target: 'nl', explain: 'de'}, [{role: 'user', content: 'de of het?'}]); assert.equal(body.lang, 'fr', 'unsupported explain → interface');
 await L.send('grammar', {target: 'nl'}, [{role: 'user', content: 'de of het?'}]); assert.equal(body.lang, 'uk', 'no interface language at all → Ukrainian default');
 // memory notes and reports carry the same explanation language
 await L.memo({ui: 'en', target: 'en'}, [{role: 'user', content: 'Hi'}], ''); assert.equal(body.mode, 'memo'); assert.equal(body.lang, 'en', 'memo: en/en stays English');
 await L.report({ui: 'fr', target: 'fr'}, 'chat', 'x'); assert.equal(body.lang, 'fr', 'report: fr/fr stays French');
 assert.equal(n, 60, '60 combinations');
 console.log(`PASS: ${n} combinations (4 interface × 3 studied × 5 scenarios): explanations in the interface language; en/en and fr/fr get simple same-language explanations; explain override validated`);
})().catch(e => { console.error('FAIL:', e.message); process.exit(1) });
