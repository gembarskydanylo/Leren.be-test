// TEST-031 · Lexi engine (app/modules/lexi/engine.js) with a mock AI: no network, no key.
// Context (languages, level, lesson, defaults, no extra personal data), scenarios on one engine, request shape, answers,
// every error code (timeout, API failure, rate limits, offline, beta, too long, bad format), events and voice detection.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const app = path.join(__dirname, '..', 'app');
function load(extra = {}) {
 const store = new Map(), ctx = vm.createContext({console, AbortController, setTimeout, clearTimeout, Promise, Error, URL,
  localStorage: {getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v))}, crypto: require('node:crypto').webcrypto, ...extra});
 ctx.globalThis = ctx;
 for (const f of ['modules/ai-coach/core.js', 'modules/lexi/engine.js']) vm.runInContext(fs.readFileSync(path.join(app, f), 'utf8'), ctx, {filename: f});
 return ctx;
}
const J = o => JSON.parse(JSON.stringify(o)); // objects from the vm context have other prototypes
const reply = (status, body, delay = 0) => async (url, opts) => { if (delay === Infinity) return new Promise((_, rej) => opts.signal.addEventListener('abort', () => rej(Object.assign(new Error('aborted'), {name: 'AbortError'})))); if (delay) await new Promise(r => setTimeout(r, delay)); return {ok: status < 400, status, json: async () => body} };
const CHAT_OK = {reply: 'Goed! Waar woon je?', translation: 'Добре! Де ти живеш?', correction: null};
const CHAT_FIX = {reply: 'Ah, je woont in Gent!', translation: 'А, ти живеш у Генті!', correction: {has_error: true, severity: 'minor', original: 'Ik woon op Gent', corrected: 'Ik woon in Gent.', explanation: 'Місто: «in».'}};
(async () => {
 let c = load(), L = c.LerenLexi, sent = [];
 const use = (fn, o = {}) => { sent = []; L.configure({endpoint: 'http://localhost/mock', local: () => true, production: () => false, online: () => true, ...o, fetch: async (u, opts) => { sent.push(JSON.parse(opts.body)); return fn(u, opts) }}) };

 // ---- context: only the learning context, safe defaults, supported languages only
 assert.deepEqual(Object.keys(L.TARGETS), ['nl', 'fr', 'en'], 'studied languages: nl-BE, fr-BE, English (no German in the app)');
 assert.equal(L.TARGETS.nl.tag, 'nl-BE'); assert.equal(L.TARGETS.fr.tag, 'fr-BE');
 assert.deepEqual(Object.keys(L.UI), ['uk', 'en', 'fr', 'ar']);
 const d = L.context({});
 assert.deepEqual(J(d), {ui: 'uk', explain: 'uk', target: 'nl', level: 'a11', topic: '', lesson: '', question: '', answer: ''}, 'missing context → safe defaults');
 const x = L.context({ui: 'de', target: 'de', level: 'b2', topic: 'x'.repeat(500), email: 'a@b.c', name: 'Anna', uid: 'u1', score: 900});
 assert.equal(x.target, 'nl', 'German is not offered as a working language'); assert.equal(x.ui, 'uk'); assert.equal(x.explain, 'uk'); assert.equal(x.level, 'a11'); assert.equal(x.topic.length, 60);
 assert(!('email' in x) && !('name' in x) && !('uid' in x) && !('score' in x), 'no personal data in the context');
 // TEST-041 (replaces the TEST-031 rule «never in the studied language»): explanations follow the interface language, also when
 // it is the studied one (the worker then keeps them very simple); never a silent switch to Ukrainian.
 assert.equal(L.context({ui: 'fr', target: 'fr'}).explain, 'fr', 'same language: explanations in that language, not Ukrainian');
 assert.equal(L.context({ui: 'en', target: 'nl', explain: 'ar'}).explain, 'ar', 'a separate explanation language is honoured');
 assert.equal(L.context({ui: 'en', target: 'nl', explain: 'de'}).explain, 'en', 'unsupported explain → interface language');
 assert.equal(L.context({level: 'a21'}).level, 'a21', 'A2 is a real level');

 // ---- request body: one identity, scenarios, roleplay scenes, lesson context, history, voice alternatives
 const msgs = Array.from({length: 20}, (_, i) => ({role: i % 2 ? 'assistant' : 'user', content: 'm' + i}));
 const b = L.body('free', {ui: 'en', target: 'fr', level: 'a12', topic: 'Famille'}, msgs, {learning: {weak: ['la mère'], learned: 41.6, email: 'x@y.z', name: 'Bob'}, memory: 'likes cats'});
 assert.equal(b.char, 'lexi'); assert.equal(b.mode, 'chat'); assert.equal(b.style, 'talk'); assert.equal(b.target, 'fr'); assert.equal(b.lang, 'en'); assert.equal(b.level, 'a12');
 assert.equal(b.messages.length, 12, 'last 12 messages only'); assert.equal(b.messages[11].content, 'm19');
 assert.deepEqual(J(b.profile), {level: 'a12', topic: 'Famille', learned: 42, weak: ['la mère']}, 'profile = learning data only');
 assert.deepEqual(J(Object.keys(b).sort()), ['char', 'lang', 'level', 'memory', 'messages', 'mode', 'profile', 'scenario', 'style', 'target'].sort());
 assert.equal(L.body('grammar', {}, [{role: 'user', content: 'q'}]).mode, 'ask');
 assert.equal(L.body('speaking', {}, []).style, 'slow');
 const rp = Object.entries(L.ROLEPLAYS).map(([k]) => L.body('roleplay', {target: 'fr'}, [], {scene: k}).scene);
 assert.deepEqual(rp, ['super', 'school', 'werk', 'huisarts', 'station', 'gemeente'], 'shop, school, work, doctor, transport, municipality');
 assert.equal(L.body('roleplay', {}, [], {scene: 'hack'}).scene, undefined, 'unknown scene dropped');
 const le = L.body('lesson', {lesson: 'Begroeten', question: 'Hoe heet je?', answer: 'Ik heet Anna'}, [{role: 'user', content: 'Klopt dit?'}]);
 assert.equal(le.mode, 'ask'); assert.equal(le.focus, 'lesson'); assert.deepEqual(J(le.profile), {level: 'a11', lesson: 'Begroeten', question: 'Hoe heet je?', answer: 'Ik heet Anna'});
 assert.equal(L.body('nope', {}, []).scenario, 'free', 'unknown scenario → free conversation');
 const v = L.body('speaking', {}, [{role: 'user', content: 'ik woon in gent', alts: ['ik woon in gent', 'ik wonen in gent']}]);
 assert.match(v.messages[0].content, /\[spoken; other possible transcriptions: ik wonen in gent\]$/);
 console.log('PASS: context and request — nl-BE / fr-BE / en, uk/en/fr/ar explanations, defaults, no personal data, char lexi, 5 scenarios, 6 roleplays, lesson context, 12-message window');

 // ---- answers and states
 const events = []; L.on(e => events.push(e.state + (e.code ? ':' + e.code : '')));
 use(reply(200, CHAT_FIX));
 let r = await L.send('free', {target: 'nl'}, [{role: 'user', content: 'Ik woon op Gent'}]);
 assert.equal(r.kind, 'chat'); assert.equal(r.verdict, 'incorrect'); assert.equal(r.correction.corrected, 'Ik woon in Gent.'); assert.equal(r.correction.explanation, 'Місто: «in».');
 use(reply(200, CHAT_OK)); r = await L.send('free', {}, [{role: 'user', content: 'Ik woon in Gent.'}]); assert.equal(r.verdict, 'correct'); assert.equal(r.correction, null);
 use(reply(200, {...CHAT_FIX, correction: {has_error: true, corrected: 'ik woon in gent', original: 'Ik woon in Gent'}})); r = await L.send('free', {}, [{role: 'user', content: 'Ik woon in Gent'}]);
 assert.equal(r.correction, null, 'a «correction» equal to the learner\'s text is not a mistake');
 use(reply(200, {answer: 'Het: «het huis».', examples: [{lang: 'nl', text: 'Het huis is groot.', translation: 'Будинок великий.'}, {lang: 'de', text: 'Das Haus', translation: ''}, {lang: 'nl'}]}));
 r = await L.send('grammar', {}, [{role: 'user', content: 'de of het huis?'}]); assert.equal(r.kind, 'ask'); assert.equal(r.examples.length, 1, 'only examples in a supported language');
 assert.deepEqual(events.slice(0, 4), ['thinking', 'incorrect', 'thinking', 'correct']);
 console.log('PASS: answers — correction → «incorrect», none → «correct», fake corrections ignored, examples filtered; events thinking → correct / incorrect');

 // ---- failures: each ends in one code the UI can show; nothing is sent when it cannot work
 const code = async (p, ...a) => { try { await p(...a); return 'resolved' } catch (e) { return e.code } };
 use(reply(200, CHAT_OK, Infinity)); assert.equal(await code(() => L.send('free', {}, [{role: 'user', content: 'hoi'}], {timeout: 60})), 'timeout');
 use(reply(502, {error: 'ai'})); assert.equal(await code(() => L.send('free', {}, [{role: 'user', content: 'hoi'}])), 'network', 'API failure');
 use(async () => { throw new TypeError('Failed to fetch') }); assert.equal(await code(() => L.send('free', {}, [{role: 'user', content: 'hoi'}])), 'network');
 use(reply(502, {error: 'refusal'})); assert.equal(await code(() => L.send('free', {}, [{role: 'user', content: 'hoi'}])), 'refusal');
 use(reply(503, {error: 'off'})); assert.equal(await code(() => L.send('free', {}, [{role: 'user', content: 'hoi'}])), 'off', 'emergency switch');
 use(reply(429, {error: 'slow', retry_after: 60})); let e; try { await L.send('free', {}, [{role: 'user', content: 'hoi'}]) } catch (x) { e = x } assert.equal(e.code, 'slow'); assert.equal(e.wait.kind, 'minute');
 use(reply(429, {error: 'limit', scope: 'device', retry_after: 3600, reset_at: '2030-01-01T00:00:00.000Z'})); try { await L.send('free', {}, [{role: 'user', content: 'hoi'}]) } catch (x) { e = x } assert.equal(e.code, 'limit'); assert.equal(e.wait.kind, 'day');
 use(reply(200, {nothing: 1})); assert.equal(await code(() => L.send('free', {}, [{role: 'user', content: 'hoi'}])), 'format');
 use(reply(200, CHAT_OK)); assert.equal(await code(() => L.send('free', {}, [{role: 'user', content: 'x'.repeat(301)}])), 'tooLong'); assert.equal(sent.length, 0, 'too long: nothing sent');
 assert.equal(await code(() => L.send('grammar', {}, [])), 'empty');
 use(reply(200, CHAT_OK), {online: () => false}); assert.equal(await code(() => L.send('free', {}, [{role: 'user', content: 'hoi'}])), 'offline'); assert.equal(sent.length, 0, 'offline: nothing sent');
 use(reply(200, CHAT_OK), {local: () => false, production: () => false}); assert.equal(await code(() => L.send('free', {}, [{role: 'user', content: 'hoi'}])), 'beta'); assert.equal(sent.length, 0, 'beta: production AI never called');
 assert.equal(await L.memo({}, [{role: 'user', content: 'hoi'}], ''), null); assert.equal(await L.report({}, 'chat', 'x'), false); assert.equal(sent.length, 0, 'beta: no notes, no reports');
 use(reply(200, CHAT_OK), {local: () => false, production: () => true, endpoint: ''}); assert.equal(L.availability().code, 'unavailable');
 use(reply(200, CHAT_OK), {local: () => false, production: () => true, endpoint: 'https://ai.example/'}); assert.equal(L.availability().ok, true);
 for (const k of Object.keys(L.ERRORS)) for (const ui of ['uk', 'en', 'fr', 'ar']) assert(L.message(k, ui).length > 5, 'message ' + k + ' ' + ui);
 assert(events.includes('error:timeout') && events.includes('offline:offline') && events.includes('error:beta'));
 console.log('PASS: failures — timeout, API failure, network, refusal, emergency switch, minute and daily limits, bad format, too long, empty, offline, beta (nothing sent); messages in uk/en/fr/ar');

 // ---- memory notes and reports keep the worker's shapes and Lexi's identity
 use(async (u, o) => ({ok: true, status: 200, json: async () => JSON.parse(o.body).mode === 'memo' ? {memory: '• Anna, Gent'} : {ok: true}}));
 assert.equal(await L.memo({ui: 'en'}, [{role: 'user', content: 'Ik ben Anna'}], ''), '• Anna, Gent'); assert.equal(sent[0].char, 'lexi'); assert.equal(sent[0].mode, 'memo');
 assert.equal(await L.report({}, 'chat', 'bad answer'), true); assert.equal(sent[1].mode, 'report'); assert.equal(sent[1].char, 'lexi');

 // ---- voice: detection only; recognition tags per language
 assert.deepEqual({...L.voice()}, {listen: false, speak: false});
 const c2 = load({webkitSpeechRecognition: function () {}, speechSynthesis: {}, SpeechSynthesisUtterance: function () {}});
 assert.deepEqual({...c2.LerenLexi.voice()}, {listen: true, speak: true});
 assert.equal(L.speechTag('nl'), 'nl-BE'); assert.equal(L.speechTag('fr'), 'fr-BE'); assert.equal(L.speechTag('uk'), 'uk-UA'); assert.equal(L.speechTag('xx'), 'nl-BE');
 // ---- no storage of its own
 const src = fs.readFileSync(path.join(app, 'modules/lexi/engine.js'), 'utf8');
 assert(!/localStorage|indexedDB|sessionStorage|MediaRecorder|getUserMedia/.test(src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')), 'the engine stores nothing and never records audio');
 assert(!/sk-ant-|AIza|api[_-]?key/i.test(src), 'no secrets in the frontend');
 console.log('PASS: notes and reports as Lexi; voice detection and nl-BE / fr-BE / uk-UA recognition; the engine stores nothing, records no audio, holds no secret');
})().catch(e => { console.error(e); process.exit(1) });
