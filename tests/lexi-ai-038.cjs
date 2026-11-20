// TEST-038 · Lexi end to end without a network: the app's engine (app/modules/lexi/engine.js + ai-coach/core.js) talks to the
// real worker code (tools/ai-worker.js) in this process; only the model API is mocked. Checks what the model really gets for
// the five scenarios × three studied languages × four explanation languages, the voice note, the error codes the learner sees
// for every worker failure, retry policy, length limits and the guard against bad model answers.
// Mock only: this says nothing about the quality of real answers (that needs the test Worker, docs/LEXI-TEST-WORKER.md).
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.join(__dirname, '..'), app = path.join(root, 'app');
const kv = () => { const m = new Map(); return {async get(k) { return m.get(k) ?? null }, async put(k, v) { m.set(k, v) }} };
const J = o => JSON.parse(JSON.stringify(o));
const LANG = {uk: 'Ukrainian', en: 'English', fr: 'French', ar: 'Arabic'};
const TNAME = {nl: /Dutch as spoken in Belgium/, fr: /French as spoken in Belgium/, en: /English \(British spelling\)/};
(async () => {
 const src = fs.readFileSync(path.join(root, 'tools/ai-worker.js'), 'utf8');
 const worker = (await import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'))).default;
 const store = new Map(), events = [];
 const ctx = vm.createContext({console, AbortController, setTimeout, clearTimeout, Promise, Error, URL, crypto: require('node:crypto').webcrypto,
  localStorage: {getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v))}});
 ctx.globalThis = ctx;
 for (const f of ['modules/ai-coach/core.js', 'modules/lexi/engine.js']) vm.runInContext(fs.readFileSync(path.join(app, f), 'utf8'), ctx, {filename: f});
 const L = ctx.LerenLexi; L.on(e => events.push(J(e)));

 // model: what the mocked Anthropic API answers; seen: what it was asked
 let model = null, seen = null, envX = {}, origin = 'http://localhost:8765';
 const realFetch = globalThis.fetch;
 const toWorker = async (url, opts) => {
  globalThis.fetch = async (u, o) => { seen = JSON.parse(o.body); return model(seen, o) };
  try {
   const r = await worker.fetch(new Request('https://leren-ai-test.example/', {method: 'POST', headers: {...opts.headers, Origin: origin, 'CF-Connecting-IP': '203.0.113.7'}, body: opts.body, signal: opts.signal}),
    {PROVIDER: 'anthropic', ANTHROPIC_KEY: 'sk-test-only', RATE: kv(), ...envX}, {waitUntil() {}});
   return r;
  } finally { globalThis.fetch = realFetch }
 };
 L.configure({endpoint: 'http://localhost:8765/ai', local: () => true, production: () => false, online: () => true, fetch: toWorker});
 const answer = o => async () => ({ok: true, status: 200, json: async () => ({stop_reason: 'end_turn', content: [{type: 'text', text: typeof o === 'string' ? o : JSON.stringify(o)}]})});
 const CHAT = {learner_in_target: '', reply: 'Goed zo!', translation: 'T', correction: {has_error: false, severity: 'minor', original: '', corrected: '', explanation: ''}};
 const ASK = {answer: 'A', examples: [{lang: 'nl', text: 'Ik ben hier.', translation: 'T'}]};

 // ---- A · 5 scenarios × 3 studied languages × 4 explanation languages: request body and the system prompt the model gets
 const SC = {free: ['chat', /Free conversation about/], grammar: ['ask', /You are Lexi/], roleplay: ['chat', /Role-play situation/], lesson: ['ask', /current lesson: «Les 1»/], speaking: ['chat', /You are Lexi/]};
 let n = 0;
 for (const [id, [mode, sys]] of Object.entries(SC)) for (const target of ['nl', 'fr', 'en']) for (const ui of ['uk', 'en', 'fr', 'ar']) {
  model = answer(mode === 'ask' ? ASK : CHAT);
  const out = await L.send(id, {ui, target, level: 'a12', lesson: 'Les 1', question: 'Hoe heet je?', answer: 'Ik heet Ana'}, [{role: 'user', content: 'Hallo, ik ben Ana.'}], id === 'roleplay' ? {scene: 'school'} : {});
  assert.equal(out.kind, mode, id);
  const expl = ui; // TEST-041: always the interface language (simple same-language explanations when ui = target)
  assert.match(seen.system, TNAME[target], `${id} ${target}/${ui}: studied language named`);
  assert.match(seen.system, new RegExp('\\b' + LANG[expl] + '\\b'), `${id} ${target}/${ui}: explanation language ${LANG[expl]}`);
  assert.match(seen.system, sys, `${id}: scenario prompt`);
  assert.match(seen.system, /A1\.2/, `${id}: level`);
  assert.equal(seen.messages.at(-1).content, 'Hallo, ik ben Ana.', 'learner text only in messages');
  assert.doesNotMatch(seen.system, /Hallo, ik ben Ana/, 'learner text never in the system prompt');
  n++;
 }
 console.log(`PASS: A — ${n} combinations (5 scenarios × nl-BE / fr-BE / en × uk / en / fr / ar): right mode, studied + explanation language, scenario, level in the system prompt`);

 // speaking → slow style, roleplay → teacher + scene, free → talk; lesson context only for lesson
 model = answer(CHAT);
 await L.send('speaking', {}, [{role: 'user', content: 'Ik ben moe.'}]); assert.match(seen.system, /(slow|short sentences|simple)/i);
 await L.send('free', {}, [{role: 'user', content: 'Hoi'}]); assert.doesNotMatch(seen.system, /Role-play situation/, 'free talk is not a roleplay');
 console.log('PASS: A2 — speaking uses the slow style; free talk is not a roleplay');

 // ---- B · voice: long transcripts with alternatives keep a complete note inside the worker limit (defect TEST-038 #1)
 const longSay = 'Ik woon sinds twee jaar in Gent en ik werk in een bakkerij in het centrum van de stad, '.repeat(4).slice(0, 300);
 const alts = [longSay, longSay.replace('bakkerij', 'bakker ij'), longSay.replace('Gent', 'gent.'), longSay.replace('stad', 'staat')];
 model = answer(CHAT);
 await L.send('speaking', {}, [{role: 'user', content: longSay, alts}]);
 let sent = seen.messages.at(-1).content;
 assert.ok(sent.length <= 400, 'within the worker chat limit: ' + sent.length);
 assert.ok(!/\[spoken/.test(sent) || /\[spoken; other possible transcriptions: [^\]]*\]$/.test(sent), 'voice note complete or absent, never cut: …' + sent.slice(-60));
 const short = ['Ik woon op Gent', 'Ik woon in Gent', 'Ik won in Gent'];
 await L.send('speaking', {}, [{role: 'user', content: short[0], alts: short}]);
 assert.match(seen.messages.at(-1).content, /\[spoken; other possible transcriptions: Ik woon in Gent \| Ik won in Gent\]$/, 'short phrase keeps its alternatives');
 // the recognizer also heard the correct sentence → a minor "correction" is an artefact, not the learner's mistake
 model = answer({...CHAT, correction: {has_error: true, severity: 'minor', original: 'Ik woon op Gent', corrected: 'Ik woon in Gent', explanation: 'x'}});
 let out = await L.send('roleplay', {}, [{role: 'user', content: short[0], alts: short}], {scene: 'shop'});
 assert.equal(out.correction, null, 'artefact correction dropped'); assert.equal(out.verdict, 'correct');
 const long2 = longSay.slice(0, 280);
 await L.send('roleplay', {}, [{role: 'user', content: long2, alts: [long2, 'Ik woon in Gent']}], {scene: 'shop'});
 sent = seen.messages.at(-1).content; assert.ok(sent.length <= 400 && (!/\[spoken/.test(sent) || sent.endsWith(']')), 'long phrase + one alternative still fits or drops the note');
 // questions (ask) asked by voice: 600-char limit
 model = answer(ASK);
 const q = 'Wat is het verschil tussen de en het? '.repeat(20).slice(0, 590);
 await L.send('grammar', {}, [{role: 'user', content: q, alts: [q, q + '?', q + '!']}]);
 sent = seen.messages.at(-1).content; assert.ok(sent.length <= 600 && (!/\[spoken/.test(sent) || sent.endsWith(']')), 'ask: note fits 600 or is dropped');
 console.log('PASS: B — voice note with other transcriptions always complete and within the worker limit (chat 400, ask 600); artefact corrections from the recognizer are dropped');

 // ---- C · every worker failure → the code the learner sees, and whether «retry» is offered (defect TEST-038 #2)
 const expectCode = async (code, f, retry) => {
  events.length = 0;
  await assert.rejects(f(), e => e.code === code, 'expected ' + code);
  assert.equal(L.ERRORS[code].retry, retry, code + ' retry');
  assert.ok(events.some(e => e.type === 'state' && e.code === code), code + ': state event for the UI');
  assert.ok(L.message(code, 'ar') && L.message(code, 'uk') !== L.message('network', 'uk') || code === 'network', code + ': own message, not «no internet»');
 };
 const chat1 = () => L.send('free', {}, [{role: 'user', content: 'Hoi'}]);
 model = async (b, o) => new Promise((_, rej) => o.signal.addEventListener('abort', () => rej(Object.assign(new Error('aborted'), {name: 'AbortError'})))); // model hangs → worker gives up at 25 s
 const realST = globalThis.setTimeout; globalThis.setTimeout = (fn, ms, ...a) => realST(fn, ms === 25000 ? 5 : ms, ...a); // worker's 25 s → 5 ms (the app's own 30 s stays)
 try { await expectCode('timeout', chat1, true) } finally { globalThis.setTimeout = realST }
 model = answer('this is not json'); await expectCode('format', chat1, true);
 model = answer({reply: ''}); await expectCode('format', chat1, true);
 model = async () => ({ok: true, status: 200, json: async () => ({stop_reason: 'refusal', content: []})}); await expectCode('refusal', chat1, false);
 model = answer(CHAT); envX = {AI_OFF: '1'}; await expectCode('off', chat1, false); envX = {};
 origin = 'https://evil.example'; await expectCode('unavailable', chat1, false); origin = 'http://localhost:8765';
 envX = {DAILY_LIMIT: '1', RATE: kv()}; await chat1(); await expectCode('limit', chat1, false); envX = {}; // second message of the day over a limit of 1
 envX = {PER_IP: {limit: async () => ({success: false})}}; await expectCode('slow', chat1, true); envX = {};
 model = async () => ({ok: false, status: 500, json: async () => ({error: {type: 'api_error'}})}); await expectCode('network', chat1, true); // upstream outage: «try again»
 console.log('PASS: C — worker timeout → timeout (retry), bad JSON / empty reply → format (retry), refusal, AI_OFF → off, foreign origin → unavailable, daily → limit, per-minute → slow (retry); none of them says «no internet» except a real network failure');

 // ---- D · length limits and empty input: refused before any request, with a state for the UI
 let calls = 0; model = async (...a) => { calls++; return answer(CHAT)(...a) };
 events.length = 0; await assert.rejects(L.send('free', {}, [{role: 'user', content: 'x'.repeat(301)}]), {code: 'tooLong'}); assert.ok(events.some(e => e.code === 'tooLong'));
 events.length = 0; await assert.rejects(L.send('grammar', {}, []), {code: 'empty'}); assert.ok(events.some(e => e.code === 'empty'), 'empty: state event (was silent)');
 await assert.rejects(L.send('grammar', {}, [{role: 'user', content: 'x'.repeat(601)}]), {code: 'tooLong'});
 model = answer(ASK); await L.send('grammar', {}, [{role: 'user', content: 'x'.repeat(1500)}], {focus: 'exam11'}); assert.equal(seen.messages.at(-1).content.length, 1500, 'exam letters up to 1600');
 assert.equal(calls, 0, 'refused input never reaches the model');
 console.log('PASS: D — 300 (chat) / 600 (question) / 1600 (exam letter) limits, empty question refused, both with a UI state and without a model call');

 // ---- E · bad model answers never reach the learner as garbage
 model = answer({reply: 'Prima', translation: 7, correction: {has_error: true, corrected: 'Hoi', original: 'Hoi'}});
 out = await L.send('roleplay', {}, [{role: 'user', content: 'Hoi'}], {scene: 'shop'});
 assert.equal(typeof out.translation, 'string', 'translation is always text'); assert.equal(L.normalize('chat', {reply: 'x', translation: {}}).translation, '', 'non-string translation dropped by the engine'); assert.equal(out.correction, null, '«correction» equal to what the learner wrote is dropped');
 model = answer({answer: 'Uitleg', examples: [{lang: 'de', text: 'Hallo'}, {lang: 'nl', text: ''}, null, {lang: 'fr', text: 'Bonjour', translation: 'Привіт'}]});
 out = await L.send('grammar', {}, [{role: 'user', content: 'Hoe zeg je hallo?'}]);
 assert.deepEqual(J(out.examples), [{lang: 'fr', text: 'Bonjour', translation: 'Привіт'}], 'examples only in studied languages, non-empty');
 assert.throws(() => L.normalize('chat', null), {code: 'format'}); assert.throws(() => L.normalize('ask', {answer: '  '}), {code: 'format'});
 console.log('PASS: E — non-string fields, self-equal corrections, examples in other languages and empty answers are filtered or rejected');

 // ---- F · retry: the same request again, no duplicate learner message, history clipped to 12
 model = answer(CHAT); const hist = Array.from({length: 20}, (_, i) => ({role: i % 2 ? 'assistant' : 'user', content: 'm' + i}));
 await L.send('free', {}, hist); assert.ok(seen.messages.length <= 13 && seen.messages.at(-1).content === 'm19' && seen.messages[0].content === 'm8', 'last 12 messages (+ opener when needed)');
 const once = JSON.stringify(seen.messages); await L.send('free', {}, hist); assert.equal(JSON.stringify(seen.messages), once, 'retry sends the same conversation');
 console.log('PASS: F — retry sends exactly the same conversation; history limited to the last 12 messages');

 // ---- G · «translate this message» follows the interface language (defect TEST-038 #3), checked in the app source
 const appSrc = fs.readFileSync(path.join(app, 'app.js'), 'utf8'), tr = appSrc.slice(appSrc.indexOf('async function aiTranslate'), appSrc.indexOf('async function aiSend'));
 assert.doesNotMatch(tr, /ui:"uk"/, 'no forced Ukrainian context'); assert.doesNotMatch(tr, /into Ukrainian/, 'no hard-coded target language');
 assert.match(tr, /lexi\(\)\.context\(ctx\)/, 'language taken from the engine context'); assert.match(tr, /c\.explain===c\.target\?"Rewrite/, 'same language → simpler words, not a translation into Ukrainian');
 console.log('PASS: G — on-demand translation goes into the interface language (uk / en / fr / ar), not always Ukrainian');
 console.log('ALL PASS (mock model; real answers not checked)');
})().catch(e => { console.error('FAIL:', e.message); process.exit(1) });
