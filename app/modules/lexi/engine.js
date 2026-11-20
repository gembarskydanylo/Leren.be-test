/* LerenBe 3.0 · Lexi — the one AI tutor of the app (TEST-031).
 * Not a second AI stack: requests go through LerenAICoach.request (deadline, device header, 429 parsing) to the existing
 * worker (tools/ai-worker.js). This module only decides WHAT is sent and HOW answers and failures look to the UI:
 *  - one identity (char "lexi") for every AI request: chat, questions, hints, translations, notes, reports;
 *  - five scenarios on the same engine: free, grammar, roleplay, lesson, speaking;
 *  - a minimal learning context (interface language, studied language, level, topic, lesson, the learner's answer),
 *    whitelisted and clipped; anything else (names, e-mail, account, progress numbers that are not learning data) is dropped;
 *  - one list of states and error codes for the UI (docs/LEXI-UI-CONTRACT.md);
 *  - the beta snapshot never calls the production AI (same rule as Firebase: production services only on lerenbe.com
 *    without <meta name="leren-env" content="beta">); a local endpoint on localhost stays available for tests.
 * No storage of its own: conversation history lives in the caller's memory only; voice is never recorded or uploaded
 * (the browser's speech recognition returns text; only that text is sent). */
(() => {
 'use strict';
 const NAME = 'Lexi', CHAR = 'lexi';
 // Studied languages that really work end to end (curriculum, worker grammar, speech). German is not part of the app.
 const TARGETS = {
  nl: {tag: 'nl-BE', name: 'Nederlands', roleplay: true},
  fr: {tag: 'fr-BE', name: 'Français', roleplay: true},
  en: {tag: 'en-GB', name: 'English', roleplay: true}
 };
 // Languages Lexi explains in (= interface languages). Speech recognition tags for questions asked in that language.
 const UI = {uk: {tag: 'uk-UA'}, en: {tag: 'en-GB'}, fr: {tag: 'fr-BE'}, ar: {tag: 'ar-SA', rtl: true}};
 const LEVELS = ['a11', 'a12', 'a21'];
 // Real-life situations. The value is the worker's scene id (older ids stay valid for old routes and the A1.1 exam).
 const ROLEPLAYS = {shop: 'super', school: 'school', work: 'werk', doctor: 'huisarts', transport: 'station', municipality: 'gemeente'};
 const LEGACY_SCENES = ['cafe', 'super', 'huisarts', 'apotheek', 'gemeente', 'station', 'buren', 'school', 'werk', 'exam11'];
 const SCENARIOS = {
  free: {mode: 'chat', style: 'talk'},
  grammar: {mode: 'ask'},
  roleplay: {mode: 'chat', style: 'teacher', scene: true},
  lesson: {mode: 'ask', focus: 'lesson'},
  speaking: {mode: 'chat', style: 'slow', voice: true}
 };
 const STATES = ['welcome', 'listening', 'thinking', 'speaking', 'correct', 'incorrect', 'offline', 'error', 'idle'];
 // Error codes the UI shows; `retry` says whether the same request may simply be sent again.
 const ERRORS = {
  offline: {retry: true}, beta: {retry: false}, unavailable: {retry: false}, timeout: {retry: true}, network: {retry: true},
  limit: {retry: false}, slow: {retry: true}, format: {retry: true}, refusal: {retry: false}, off: {retry: false},
  tooLong: {retry: false}, empty: {retry: false}
 };
 const LIMITS = {chat: 300, ask: 600, exam: 1600, history: 12, topic: 60, lesson: 80, answer: 200, question: 200, expected: 200};
 // TEST-042 Lesson Help: what kind of exercise the learner is on (anything else is dropped).
 const KINDS = ['study', 'quiz', 'build', 'listen', 'write', 'talk'];
 // What the worker keeps of one message (tools/ai-worker.js maxLen). The voice note with other transcriptions must fit
 // inside it whole, or the worker cuts its closing "]" and the learner's sentence reaches the model with half a note (TEST-038).
 const WORKER_MAX = {chat: 400, ask: 600, exam: 1600};
 // Worker error bodies ({error}) → the engine's codes, so a slow model is "timeout" and a bad answer "format", not "no internet".
 const WORKER_ERRORS = {timeout: 'timeout', format: 'format', refusal: 'refusal', off: 'off', slow: 'slow', limit: 'limit', forbidden: 'unavailable', 'too big': 'tooLong', empty: 'empty', 'bad json': 'format', 'bad request': 'format', 'bad body': 'format'};
 const T = {
  timeout: {uk: 'Lexi не встиг відповісти. Спробуй ще раз.', en: 'Lexi took too long to answer. Try again.', fr: 'Lexi a mis trop de temps à répondre. Réessaie.', ar: 'تأخّر Lexi في الرد. حاول مرة أخرى.'},
  network: {uk: 'Немає зв’язку з Lexi. Перевір інтернет і спробуй ще раз.', en: 'Can’t reach Lexi. Check your connection and try again.', fr: 'Impossible de joindre Lexi. Vérifie ta connexion et réessaie.', ar: 'تعذّر الوصول إلى Lexi. تحقّق من الاتصال وحاول مرة أخرى.'},
  offline: {uk: 'Ти офлайн. Lexi працює лише з інтернетом; уроки й повторення доступні й без нього.', en: 'You are offline. Lexi needs the internet; lessons and review still work.', fr: 'Tu es hors ligne. Lexi a besoin d’internet ; les leçons et les révisions fonctionnent toujours.', ar: 'أنت غير متصل. يحتاج Lexi إلى الإنترنت؛ الدروس والمراجعة تعمل دونه.'},
  beta: {uk: 'У тестовій версії Lexi вимкнений: тут немає з’єднання з AI.', en: 'Lexi is switched off in this test version: there is no AI connection here.', fr: 'Lexi est désactivé dans cette version de test : pas de connexion à l’IA ici.', ar: 'Lexi متوقف في هذه النسخة التجريبية: لا يوجد اتصال بالذكاء الاصطناعي هنا.'},
  unavailable: {uk: 'Lexi зараз недоступний.', en: 'Lexi is not available right now.', fr: 'Lexi n’est pas disponible pour le moment.', ar: 'Lexi غير متاح الآن.'},
  format: {uk: 'Lexi відповів незрозуміло. Спробуй ще раз.', en: 'Lexi’s answer came out garbled. Try again.', fr: 'La réponse de Lexi est illisible. Réessaie.', ar: 'جاء رد Lexi غير مفهوم. حاول مرة أخرى.'},
  refusal: {uk: 'Lexi не може відповісти на це. Спробуй інше питання про мову.', en: 'Lexi can’t answer that. Try another language question.', fr: 'Lexi ne peut pas répondre à cela. Essaie une autre question de langue.', ar: 'لا يستطيع Lexi الإجابة عن هذا. جرّب سؤالاً آخر عن اللغة.'},
  off: {uk: 'Lexi тимчасово вимкнений. Спробуй пізніше.', en: 'Lexi is paused for now. Try later.', fr: 'Lexi est en pause. Réessaie plus tard.', ar: 'Lexi متوقف مؤقتاً. حاول لاحقاً.'},
  slow: {uk: 'Забагато повідомлень за хвилину. Зачекай трохи.', en: 'Too many messages this minute. Wait a moment.', fr: 'Trop de messages cette minute. Attends un peu.', ar: 'رسائل كثيرة في هذه الدقيقة. انتظر قليلاً.'},
  limit: {uk: 'Ліміт розмов з Lexi на сьогодні вичерпано.', en: 'You’ve reached today’s limit for Lexi.', fr: 'Tu as atteint la limite du jour pour Lexi.', ar: 'وصلت إلى حدّ اليوم مع Lexi.'},
  tooLong: {uk: 'Повідомлення задовге. Скороти його.', en: 'The message is too long. Make it shorter.', fr: 'Le message est trop long. Raccourcis-le.', ar: 'الرسالة طويلة جداً. اختصرها.'},
  empty: {uk: 'Напиши повідомлення.', en: 'Write a message.', fr: 'Écris un message.', ar: 'اكتب رسالة.'}
 };
 const clip = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim().slice(0, n);
 const pick = (v, list, d) => list.includes(v) ? v : d;
 const words = a => (Array.isArray(a) ? a : []).slice(0, 8).map(x => clip(x, 80)).filter(Boolean);

 let cfg = {endpoint: '', production: () => false, local: () => false, online: () => (typeof navigator === 'undefined' || navigator.onLine !== false), fetch: null};
 function configure(o) { cfg = {...cfg, ...(o || {})}; return api }
 // Where Lexi may run. A local endpoint (tests, tools/ai-worker.js under wrangler dev) is allowed on localhost only.
 function availability() {
  if (!cfg.online()) return {ok: false, code: 'offline'};
  if (cfg.local() && cfg.endpoint) return {ok: true, endpoint: cfg.endpoint, local: true};
  if (!cfg.production()) return {ok: false, code: 'beta'};
  if (!cfg.endpoint) return {ok: false, code: 'unavailable'};
  return {ok: true, endpoint: cfg.endpoint};
 }

 // The learning context Lexi gets — nothing else. Unknown or missing values fall back to safe defaults.
 function context(raw) {
  const r = raw && typeof raw === 'object' ? raw : {};
  const target = pick(r.target, Object.keys(TARGETS), 'nl'), ui = pick(r.ui, Object.keys(UI), 'uk');
  // Explanations are in the interface language, also when it is the studied one (then the worker keeps them very simple);
  // never a silent switch to Ukrainian (TEST-041). `explain` is a future separate choice; unsupported values fall back to `ui`.
  return {ui, explain: pick(r.explain, Object.keys(UI), ui), target, level: pick(r.level, LEVELS, 'a11'), topic: clip(r.topic, LIMITS.topic), lesson: clip(r.lesson, LIMITS.lesson),
   question: clip(r.question, LIMITS.question), answer: clip(r.answer, LIMITS.answer)};
 }
 // Learning data the app already sends for personal examples (weak words, recent corrections, words to review).
 function profile(ctx, learning, help) {
  const l = learning && typeof learning === 'object' ? learning : {}, p = {level: ctx.level}, h = help && typeof help === 'object' ? help : {};
  if (ctx.topic) p.topic = ctx.topic;
  if (ctx.lesson) p.lesson = ctx.lesson;
  if (ctx.question) p.question = ctx.question;
  if (ctx.answer) p.answer = ctx.answer;
  // Lesson Help (host-side, never from the learner's account): exercise type and the course's sample answer; the host sends the sample only once the learner has answered.
  if (KINDS.includes(h.kind)) p.kind = h.kind;
  if (clip(h.expected, LIMITS.expected)) p.expected = clip(h.expected, LIMITS.expected);
  if (Number.isFinite(l.learned)) p.learned = Math.max(0, Math.min(100000, Math.round(l.learned)));
  for (const k of ['weak', 'mistakes', 'review', 'mastered']) { const w = words(l[k]); if (w.length) p[k] = w }
  return p;
 }
 function scenario(id) { return SCENARIOS[id] ? id : 'free' }
 // Body of one request for the worker. `messages`: [{role:'user'|'assistant', content, alts?}] (oldest first).
 function body(id, rawCtx, messages, extra = {}) {
  const sc = SCENARIOS[scenario(id)], ctx = context(rawCtx), exam = extra.scene === 'exam11' || extra.focus === 'exam11' || extra.focus === 'exam12';
  const max = sc.mode === 'chat' ? LIMITS.chat : exam ? LIMITS.exam : LIMITS.ask;
  const room = sc.mode === 'chat' ? WORKER_MAX.chat : exam ? WORKER_MAX.exam : WORKER_MAX.ask;
  const spoken = (text, alts) => { // keep as many alternatives as fit; the note is always complete or absent
   let list = (Array.isArray(alts) ? alts.slice(1, 4) : []).map(a => clip(a, 120)).filter(Boolean);
   for (; list.length; list.pop()) { const out = text + '\n[spoken; other possible transcriptions: ' + list.join(' | ') + ']'; if (out.length <= room) return out }
   return text;
  };
  const msgs = (Array.isArray(messages) ? messages : []).filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
   .slice(-LIMITS.history).map(m => ({role: m.role, content: m.role === 'user' && Array.isArray(m.alts) && m.alts.length > 1 ? spoken(m.content.slice(0, max), m.alts) : m.content.slice(0, max)}));
  const b = {mode: sc.mode, target: ctx.target, lang: ctx.explain, level: ctx.level, char: CHAR, scenario: scenario(id), profile: profile(ctx, extra.learning, extra.help), messages: msgs};
  if (sc.style) b.style = extra.style && ['talk', 'teacher', 'slow', 'exam'].includes(extra.style) ? extra.style : sc.style;
  const scene = extra.scene && (ROLEPLAYS[extra.scene] || (LEGACY_SCENES.includes(extra.scene) ? extra.scene : null));
  if (sc.mode === 'chat' && scene) b.scene = scene;
  if (sc.focus || extra.focus) b.focus = extra.focus && ['exam11', 'exam12', 'lesson'].includes(extra.focus) ? extra.focus : sc.focus;
  if (extra.exam && typeof extra.exam === 'object') b.exam = extra.exam;
  if (typeof extra.memory === 'string' && extra.memory) b.memory = clip(extra.memory, 600);
  return b;
 }
 function fail(code, extra) { const e = new Error(code); e.code = code; if (extra) Object.assign(e, extra); return e }
 // Normalised answers. chat → {kind:'chat', reply, translation, correction|null, verdict:'correct'|'incorrect'|null}
 //                    ask  → {kind:'ask', answer, examples:[{lang,text,translation}]}
 function normalize(mode, d, lastUser) {
  if (!d || typeof d !== 'object') throw fail('format');
  if (mode === 'ask') {
   if (typeof d.answer !== 'string' || !d.answer.trim()) throw fail('format');
   const ex = (Array.isArray(d.examples) ? d.examples : []).filter(e => e && typeof e.text === 'string' && e.text.trim() && TARGETS[e.lang]).slice(0, 3)
    .map(e => ({lang: e.lang, text: e.text.slice(0, 300), translation: typeof e.translation === 'string' ? e.translation.slice(0, 400) : ''}));
   return {kind: 'ask', answer: d.answer.trim().slice(0, 1500), examples: ex};
  }
  const reply = typeof d.reply === 'string' && d.reply.trim() ? d.reply : typeof d.reply_nl === 'string' ? d.reply_nl : '';
  if (!reply.trim()) throw fail('format');
  const c = d.correction, norm = s => String(s || '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const fix = c && typeof c === 'object' && c.has_error !== false && typeof c.corrected === 'string' && c.corrected.trim() && (!lastUser || norm(c.corrected) !== norm(lastUser))
   ? {original: String(c.original || lastUser || '').slice(0, 300), corrected: c.corrected.slice(0, 300), explanation: typeof c.explanation === 'string' ? c.explanation.slice(0, 300) : '', severity: c.severity === 'major' ? 'major' : 'minor'} : null;
  return {kind: 'chat', reply: reply.trim().slice(0, 600), translation: typeof d.translation === 'string' ? d.translation.trim().slice(0, 600) : '', correction: fix, verdict: lastUser ? (fix ? 'incorrect' : 'correct') : null};
 }
 const listeners = new Set();
 function on(fn) { listeners.add(fn); return () => listeners.delete(fn) }
 function emit(type, detail) { for (const fn of [...listeners]) { try { fn({type, ...detail}) } catch (e) {} } }
 // One request. Resolves with a normalised answer or rejects with {code, wait?, data?}; emits thinking → result state.
 async function send(id, rawCtx, messages, extra = {}) {
  const av = availability(); if (!av.ok) { emit('state', {state: av.code === 'offline' ? 'offline' : 'error', code: av.code, scenario: scenario(id)}); throw fail(av.code) }
  const b = body(id, rawCtx, messages, extra), last = [...b.messages].reverse().find(m => m.role === 'user');
  const stop = code => { emit('state', {state: 'error', code, scenario: b.scenario}); return fail(code) };
  if (b.mode !== 'chat' && !last) throw stop('empty');
  const raw = (Array.isArray(messages) ? messages : []).filter(m => m && m.role === 'user').pop();
  const max = b.mode === 'chat' ? LIMITS.chat : b.focus === 'exam11' || b.focus === 'exam12' ? LIMITS.exam : LIMITS.ask;
  if (raw && typeof raw.content === 'string' && raw.content.length > max) throw stop('tooLong');
  emit('state', {state: 'thinking', scenario: b.scenario});
  let data;
  try { data = await globalThis.LerenAICoach.request(av.endpoint, b, {timeout: extra.timeout || (b.mode === 'chat' ? 30000 : 45000), fetch: cfg.fetch || undefined}) }
  catch (e) {
   const said = e.data && typeof e.data.error === 'string' ? WORKER_ERRORS[e.data.error] : '';
   const code = e.code === 'timeout' ? 'timeout' : e.code === 'limit' ? (said === 'slow' ? 'slow' : 'limit') : e.code === 'format' ? 'format'
    : said && said !== 'slow' && said !== 'limit' ? said : !cfg.online() ? 'offline' : 'network';
   emit('state', {state: code === 'offline' ? 'offline' : 'error', code, scenario: b.scenario}); throw fail(code, {wait: e.wait || null, data: e.data || null});
  }
  let out; try { out = normalize(b.mode, data, raw && b.mode === 'chat' ? raw.content : '') } catch (e) { emit('state', {state: 'error', code: 'format', scenario: b.scenario}); throw e }
  emit('state', {state: out.verdict || (out.kind === 'ask' ? 'idle' : 'idle'), scenario: b.scenario});
  return out;
 }
 // Fire-and-forget calls that keep the worker's own shapes: notes about the learner and reports of AI answers.
 async function memo(rawCtx, messages, memory) {
  const av = availability(); if (!av.ok) return null; const ctx = context(rawCtx);
  try { const d = await globalThis.LerenAICoach.request(av.endpoint, {mode: 'memo', target: ctx.target, lang: ctx.explain, char: CHAR, memory: clip(memory, 600), messages: body('free', ctx, messages).messages}, {timeout: 30000, fetch: cfg.fetch || undefined}); return typeof d.memory === 'string' ? d.memory.trim().slice(0, 600) : null } catch (e) { return null }
 }
 async function report(rawCtx, kind, text) {
  const av = availability(); if (!av.ok) return false; const ctx = context(rawCtx);
  try { await globalThis.LerenAICoach.request(av.endpoint, {mode: 'report', kind: clip(kind, 10), target: ctx.target, lang: ctx.explain, char: CHAR, text: String(text || '').slice(0, 1500)}, {timeout: 15000, fetch: cfg.fetch || undefined}); return true } catch (e) { return false }
 }
 function message(code, ui) { const m = T[code] || T.network; return m[ui] || m.en }
 // Voice: what this browser can do. Nothing is recorded: recognition gives text, which the learner checks before sending.
 function voice() {
  const g = globalThis; return {listen: !!(g.SpeechRecognition || g.webkitSpeechRecognition), speak: !!(g.speechSynthesis && g.SpeechSynthesisUtterance)};
 }
 function speechTag(lang) { return (TARGETS[lang] || UI[lang] || TARGETS.nl).tag }
 const api = {NAME, CHAR, TARGETS, UI, LEVELS, ROLEPLAYS, SCENARIOS, STATES, ERRORS, LIMITS, WORKER_MAX, configure, availability, context, profile, body, normalize, send, memo, report, message, voice, speechTag, on, emit, scenario};
 globalThis.LerenLexi = api;
})();
