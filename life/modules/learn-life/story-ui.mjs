// UI of LerenBe LIFE stories (learn-life-story.html?s=<story>), on LIFE Engine 2.0. Three help levels, switchable
// any time without losing progress:
//  🟢 learn    — translations, hints, the phrase to say is shown, slower voice
//  🟡 practice — Dutch text without translations (translation on request), say the phrase from its meaning
//  🔴 real     — the character just talks at normal speed; text only on request, no translations, no sample
// Voices: recorded Azure clips (audio/nl = male, audio/nl-f = female, same hash as app.js), device voice as fallback.
import {STORIES, ROADMAP, storyById} from './stories/index.mjs?v=3';
import {createStorySession, recordXp, XP_PER_STEP} from './story-engine.mjs?v=2';
import {loadVisuals, sceneVisual, storyCover, characterImage, characterAlt, protagonistId, empty} from './visuals.mjs?v=2';

const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n };
const btn = (label, fn, cls = 'ls-btn') => { const b = el('button', cls, label); b.type = 'button'; b.onclick = fn; return b };
const store = (() => { try { const k = '__ls'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return localStorage } catch { return {getItem: () => null, setItem: () => {}} } })();
const shuffle = a => { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]] } return x };

// ---- voice
const norm = t => String(t || '').trim().replace(/\s+/g, ' ').toLowerCase();
const hash = t => { let h = 0x811c9dc5; const s = norm(t); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0 } return h.toString(16).padStart(8, '0') };
const DIRS = {m: 'audio/nl/', f: 'audio/nl-f/'}, REC = {m: new Set(), f: new Set()};
for (const k in DIRS) { try { fetch(DIRS[k] + 'manifest.json', {cache: 'no-cache'}).then(r => r.ok ? r.json() : []).then(a => { if (Array.isArray(a)) a.forEach(h => REC[k].add(h)) }).catch(() => {}) } catch {} }
const RATE = {learn: .85, practice: .95, real: 1};
// One voice at a time. A tap (🔊, 🐢, a new line) stops what is playing and speaks now; the story's own lines
// (the learner's answer → the character's reaction → the next line) are queued so none cuts another off.
// Leaving a scene stops all sound and empties the queue. A missing or broken recording falls back to the device
// voice once (only if it is still the current line), so the story never waits for audio.
let audio = null, queue = [];
function stopAudio() { queue = []; try { globalThis.speechSynthesis?.cancel() } catch {} try { audio?.pause() } catch {} audio = null }
const busy = () => !!audio && !audio.paused && !audio.ended;
function playNext() { const n = queue.shift(); if (n) say(n[0], n[1], false, true) }
function tts(text, rate) {
 try { const s = globalThis.speechSynthesis; if (!s || !globalThis.SpeechSynthesisUtterance) return;
  const u = new SpeechSynthesisUtterance(text); u.lang = 'nl-BE'; u.rate = rate;
  const v = s.getVoices(); u.voice = v.find(x => x.lang?.toLowerCase() === 'nl-be') || v.find(x => x.lang?.toLowerCase().startsWith('nl')) || null;
  s.cancel(); s.speak(u) } catch {}
}
function say(text, voice = 'm', slow = false, queued = false) {
 const h = hash(text), other = voice === 'f' ? 'm' : 'f', k = REC[voice].has(h) ? voice : REC[other].has(h) ? other : null;
 const rate = slow ? .7 : RATE[session.state.mode];
 globalThis.__lsSaid = (globalThis.__lsSaid || []).concat(text);
 globalThis.__lsVoices = (globalThis.__lsVoices || []).concat(k || 'tts');
 if (queued) { try { globalThis.speechSynthesis?.cancel() } catch {} try { audio?.pause() } catch {} audio = null } else stopAudio();
 if (!k) { tts(text, rate * .9); return playNext() }
 try { const a = new Audio(DIRS[k] + h + '.m4a'); audio = a; a.preservesPitch = true; a.playbackRate = rate;
  a.onended = () => { if (audio === a) { audio = null; playNext() } };
  a.onerror = () => { if (audio === a) { audio = null; queue = []; tts(text, rate * .9) } };
  const p = a.play(); if (p?.catch) p.catch(() => { if (audio === a && a.paused) { audio = null; playNext() } }) } catch { audio = null; tts(text, rate) }
}
// A line of the story: after whatever the story is already saying.
function sayInTurn(text, voice) { if (busy() || queue.length) queue.push([text, voice]); else say(text, voice) }

// ---- speech recognition (Chrome / Android): checks that the words were recognised and their order, not the accent.
const Rec = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
function listenOnce(onText, onEnd) {
 if (!Rec) return false;
 try { const r = new Rec(); r.lang = 'nl-BE'; r.interimResults = false; r.maxAlternatives = 3;
  r.onresult = e => onText([...e.results[0]].map(x => x.transcript));
  r.onerror = () => onEnd(); r.onend = () => onEnd(); r.start(); return true } catch { return false }
}

// ---- state
const params = new URLSearchParams(location.search);
const story = storyById(params.get('s') || 'first-day') || STORIES[0];
const session = createStorySession(story, store);
const app = $('app');
document.title = 'LerenBe LIFE · ' + story.title + ' — lerenbe.com';
const mode = () => session.state.mode, learn = () => mode() === 'learn', real = () => mode() === 'real';
const MODE_LINE = {learn: '🟢 Початківець: переклад, підказки, повільне аудіо', practice: '🟡 Практика: переклад лише за кнопкою, фразу кажеш сам', real: '🔴 Реальне життя: природна швидкість, мінімум підказок'};

function setModeButtons() { document.querySelectorAll('.ls-mode button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode()))); document.body.dataset.mode = mode() }
document.querySelectorAll('.ls-mode button').forEach(b => b.onclick = () => { session.setMode(b.dataset.mode); setModeButtons(); if (current) renderStep(); else home() });
setModeButtons();

// ---- visuals (assets/lerenbe-life/visual-manifest.json): drawn scenes and characters when the artist's files are in;
// until then a calm placeholder with the scene icon. The stage shows the current line over the picture.
let VIS = empty(), stage = null, spoken = null, heroEmotion = 'neutral';
loadVisuals().then(m => { VIS = m; if (current) renderStage(); else home() });
const DESKTOP = globalThis.matchMedia?.('(min-width: 768px)');
function picture(pair, alt, cls, onFail) {
 const pic = el('picture', cls), src = el('source'); src.media = '(min-width: 768px)'; src.srcset = pair.desktop;
 const img = el('img'); img.src = pair.mobile; img.alt = alt; img.decoding = 'async'; img.loading = 'eager'; img.onerror = () => { pic.remove(); onFail?.() };
 pic.append(src, img); return pic;
}
// Files that failed to load in this visit (missing on the server, damaged): drawn as missing from then on.
const BROKEN = new Set();
const FACE = {neutral: '🙂', happy: '😊', thinking: '🤔', surprised: '😮'}, FEEL = {neutral: 'спокійно', happy: 'радіє', thinking: 'думає', surprised: 'здивовано'};
const HERO_ICON = {anastasia: '🙋🏻‍♀️', 'hero-male': '🙋🏻‍♂️'};
// A character whose picture is not delivered yet: a large stand-in on the same place of the stage with the
// character's name and current emotion (never a random or another character's picture).
function standIn(c) {
 const f = el('div', 'ls-stage-char ls-stage-token is-' + c.position + (c.id === spoken?.who ? ' is-speaking' : '') + (c.protagonist ? ' is-hero' : ''));
 f.dataset.character = c.id; f.dataset.emotion = c.emotion; f.dataset.fallback = 'true'; f.setAttribute('role', 'img');
 f.setAttribute('aria-label', c.name + ' — ' + FEEL[c.emotion]);
 const icon = story.cast[c.id]?.icon || HERO_ICON[c.id] || '🧑';
 const head = el('span', 'ls-token-head'); head.append(el('span', 'ls-token-icon', icon), el('span', 'ls-token-emo', FACE[c.emotion]));
 f.append(head, el('span', 'ls-token-name', c.protagonist ? c.name + ' (ти)' : c.name)); return f;
}
function renderStage() {
 if (!stage || !current) return;
 const v = sceneVisual(VIS, story.id, current.scene.id, {who: spoken?.who, emotion: spoken?.emotion, heroEmotion, placeholders: true, broken: BROKEN});
 const bg = v.background && !BROKEN.has(v.background.mobile) && !BROKEN.has(v.background.desktop) ? v.background : null;
 stage.dataset.heroEmotion = heroEmotion; stage.style.setProperty('--ls-dialogue', String(v.dialogue.reserve));
 stage.replaceChildren(); stage.classList.toggle('has-art', !!bg);
 if (bg) stage.append(picture(bg, v.alt, 'ls-stage-bg', () => { BROKEN.add(bg.mobile); BROKEN.add(bg.desktop); renderStage() }));
 else { const ph = el('div', 'ls-stage-ph'); ph.setAttribute('role', 'img'); ph.setAttribute('aria-label', v.alt || current.scene.title); ph.append(el('span', 'ls-stage-icon', current.scene.icon)); stage.append(ph) }
 for (const c of v.characters.slice(0, 3)) {
  if (!c.src) { stage.append(standIn(c)); continue }
  const img = el('img', 'ls-stage-char is-' + c.position + (c.id === spoken?.who ? ' is-speaking' : '') + (c.protagonist ? ' is-hero' : '')); img.src = c.src; img.alt = c.alt; img.dataset.character = c.id; img.dataset.emotion = c.emotion;
  img.onerror = () => { BROKEN.add(c.src); renderStage() }; stage.append(img) }
 if (spoken) {
  const c = speaker(spoken.who), box = el('div', 'ls-stage-say'), t = el('p', 'ls-nl', spoken.nl); t.lang = 'nl-BE';
  if (real() && !spoken.revealed) t.classList.add('is-hidden');
  const tools = el('span', 'ls-tools');
  tools.append(btn('🔊', () => say(spoken.nl, c.voice), 'ls-icon ls-stage-listen'), btn('🔁 Повільніше', () => say(spoken.nl, c.voice, true), 'ls-icon ls-stage-repeat'));
  if (real() && !spoken.revealed) tools.append(btn('👁 Текст', () => { spoken.revealed = true; renderStage() }, 'ls-icon'));
  tools.querySelector('.ls-stage-listen').setAttribute('aria-label', 'Послухати ще раз');
  const top = el('div', 'ls-say-top'); top.append(el('span', 'ls-who', c.icon + ' ' + c.name), tools);
  box.append(top, t);
  if (learn() && spoken.uk) box.append(el('p', 'ls-uk', spoken.uk));
  stage.append(box);
 }
}
function setHero(e) { heroEmotion = e; renderStage() }
// The character who spoke reacts to a wrong answer (surprised) without changing the line on screen.
function setSpokenEmotion(e) { if (spoken) { spoken.emotion = e; renderStage() } }
function showSpoken(who, nl, uk, emotion) { if (!who || who === 'me') return; spoken = {who, nl, uk, emotion: emotion || null}; renderStage() }

// ---- scene lifetime: timers started in a scene (reactions, retries) die with it, so nothing from an old scene
// (a late reply bubble, its voice, an answer from the microphone) can reach the next one.
let token = 0, timers = new Set();
function later(fn, ms) { const t0 = token, id = setTimeout(() => { timers.delete(id); if (t0 === token) fn() }, ms); timers.add(id); return id }
function leaveScene() { token++; for (const id of timers) clearTimeout(id); timers.clear(); stopAudio() }

// ---- home of the story
let current = null, log = null, panel = null, shown = new Set();
function home() {
 leaveScene(); stage = null;
 current = null; app.replaceChildren(); delete app.dataset.scene; delete app.dataset.step; window.scrollTo?.(0, 0);
 const hero = el('section', 'ls-hero'), cover = storyCover(VIS, story.id);
 if (cover) hero.append(picture(cover, cover.alt, 'ls-cover'));
 hero.append(el('p', 'ls-kicker', 'Історія · ' + story.level + ' · нідерландська'), el('h1', '', story.icon + ' ' + story.title), el('p', 'ls-sub', story.subtitle));
 const met = session.memory().met, cast = el('div', 'ls-cast');
 for (const [id, c] of Object.entries(story.cast)) { const p = el('span', 'ls-person' + (met[id] ? ' is-met' : '')); p.dataset.person = id; p.append(el('b', '', c.icon + ' ' + c.name + (met[id] ? ' ✓' : '')), el('small', '', met[id] ? 'вже знайомі' : c.role)); cast.append(p) }
 hero.append(cast);
 const next = session.nextScene(), xp = session.xp(), started = story.scenes.some(s => session.sceneDone(s.id));
 hero.append(btn(next ? (started ? 'Продовжити →' : 'Почати історію →') : 'Пройти ще раз →', () => start(next || story.scenes[0]), 'ls-btn ls-primary'));
 hero.append(el('p', 'ls-xp-line', '⭐ ' + xp + ' / ' + session.maxXp() + ' XP · ' + MODE_LINE[mode()]));
 app.append(hero);
 const list = el('ol', 'ls-scenes');
 session.visibleScenes().forEach((s, i) => { const li = el('li', session.sceneDone(s.id) ? 'is-done' : ''); li.dataset.scene = s.id;
  const b = btn('', () => start(s), 'ls-scene'); b.append(el('span', 'ls-scene-n', String(i + 1).padStart(2, '0')), el('span', 'ls-scene-t', s.icon + ' ' + s.title + (s.if ? ' · твій вибір' : '')), el('span', 'ls-scene-s', session.sceneDone(s.id) ? '✓ ' + session.state.best[s.id] * XP_PER_STEP + ' XP' : ''));
  li.append(b); list.append(li) });
 app.append(el('h2', 'ls-h', 'Сцени'), list);
 const sk = session.state.skills;
 if (sk.understand[1] + sk.grammar[1] + sk.speaking[1]) app.append(skillCard('Твої навички в цій історії', sk));
 if (session.state.missed.length) {
  const box = el('section', 'ls-card ls-review'); box.append(el('h2', 'ls-h', '🔁 Повтори складні фрази'));
  for (const nl of session.state.missed.slice(-8)) { const row = el('div', 'ls-review-row'); row.append(btn('🔊', () => say(nl), 'ls-icon'), el('span', '', nl)); box.append(row) }
  app.append(box);
 }
 const road = el('section', 'ls-card ls-road'); road.append(el('h2', 'ls-h', '🇧🇪 Усі історії LIFE'));
 const rl = el('ul', 'ls-road-list');
 for (const r of ROADMAP) { const li = el('li', r.ready ? 'is-ready' : '');
  const label = r.icon + ' ' + r.title;
  if (r.ready && r.id !== story.id) { const a = el('a', '', label); a.href = r.href ? 'https://lerenbe.com/' + r.href.replace('./', '') : './learn-life-story.html?s=' + r.id; li.append(a) } else li.append(el('span', '', label));
  li.append(el('small', '', r.level + (r.id === story.id ? ' · ти тут' : r.ready ? '' : ' · скоро'))); rl.append(li) }
 road.append(rl); app.append(road);
}
const SKILLS = [['understand', '👂 Розуміння'], ['grammar', '🧩 Граматика (порядок слів)'], ['speaking', '🗣️ Говоріння (слова розпізнано)']];
function skillCard(title, sk) {
 const box = el('section', 'ls-card ls-skills'); box.append(el('h2', 'ls-h', title));
 for (const [k, label] of SKILLS) { const [ok, n] = sk[k]; if (!n) continue; const row = el('div', 'ls-skill'); row.dataset.skill = k;
  const bar = el('span', 'ls-bar'), fill = el('span', 'ls-fill'); fill.style.width = Math.round(100 * ok / n) + '%'; bar.append(fill);
  row.append(el('span', 'ls-skill-l', label), bar, el('b', '', ok + ' / ' + n)); box.append(row) }
 box.append(el('p', 'ls-muted ls-small', 'Рахується перша спроба. Акцент браузер надійно оцінити не може, тому його не оцінюємо.'));
 return box;
}

// ---- a scene
function start(scene) {
 leaveScene();
 current = session.play(scene.id); app.replaceChildren(); app.dataset.scene = scene.id; window.scrollTo?.(0, 0);
 const head = el('div', 'ls-scene-head'); head.append(btn('←', home, 'ls-icon ls-back-scene'), el('h2', '', scene.icon + ' ' + scene.title), el('span', 'ls-step-n'));
 const bar = el('div', 'ls-progress'); bar.setAttribute('role', 'progressbar'); bar.setAttribute('aria-label', 'Прогрес сцени'); bar.append(el('span', 'ls-progress-fill'));
 stage = el('div', 'ls-stage'); spoken = null; heroEmotion = 'neutral';
 log = el('div', 'ls-log'); panel = el('div', 'ls-panel'); shown = new Set();
 const side = el('div', 'ls-side'); side.append(panel, log);
 const bodyEl = el('div', 'ls-scene-body'); bodyEl.append(stage, side);
 app.append(head, bar, bodyEl); renderStage(); renderStep();
}
// The learner speaks with the protagonist's voice (Anastasia → female; a story can set hero: {voice}).
const ME = {name: 'Ти', icon: '🙂', voice: story.hero?.voice === 'm' ? 'm' : 'f'};
function speaker(who) { return story.cast[who] || ME }
function bubble(who, nl, uk, {slow = false} = {}) {
 const c = speaker(who), mine = who === 'me', b = el('div', 'ls-bubble' + (mine ? ' is-me' : '') + (slow ? ' is-slow' : ''));
 if (mine) { const face = characterImage(VIS, protagonistId(VIS), {pose: 'portrait', emotion: heroEmotion}); if (face) { const img = el('img', 'ls-avatar ls-avatar-me'); img.src = face; img.alt = ''; img.onerror = () => img.remove(); b.append(img) } }
 if (!mine) { const whoEl = el('span', 'ls-who'), face = characterImage(VIS, who, {pose: 'portrait'});
  if (face) { const img = el('img', 'ls-avatar'); img.src = face; img.alt = ''; img.onerror = () => img.replaceWith(c.icon + ' '); whoEl.append(img, c.name) } else whoEl.textContent = c.icon + ' ' + c.name;
  b.append(whoEl) }
 const t = el('p', 'ls-nl', nl); t.lang = 'nl-BE'; b.append(t);
 const tools = el('span', 'ls-tools');
 if (!mine) tools.append(btn('🔊', () => say(nl, c.voice), 'ls-icon'), btn('🐢', () => say(nl, c.voice, true), 'ls-icon'));
 if (!mine && real() && !slow) { t.classList.add('is-hidden'); tools.append(btn('👁 Текст', e => { t.classList.remove('is-hidden'); e.target.remove() }, 'ls-icon ls-reveal')) }
 if (uk && (learn() || slow)) b.append(el('p', 'ls-uk', uk));
 else if (uk && mode() === 'practice' && !mine) tools.append(btn('Переклад', e => { b.insertBefore(el('p', 'ls-uk', uk), tools); e.target.remove() }, 'ls-icon ls-translate'));
 b.append(tools); log.append(b); b.scrollIntoView?.({block: 'nearest'}); return b;
}
function npc(step, key) { if (shown.has(key)) return; shown.add(key); bubble(step.who, step.nl, step.uk); showSpoken(step.who, step.nl, step.uk, step.emotion); sayInTurn(step.nl, speaker(step.who).voice) }
function feedback(ok, text) { const f = el('p', 'ls-feedback ' + (ok ? 'is-ok' : 'is-no'), (ok ? '✓ ' : '✗ ') + (text || (ok ? 'Правильно!' : 'Спробуй ще раз.'))); panel.prepend(f); return f }

function renderStep() {
 if (!current) return;
 panel.replaceChildren();
 const s = current.step;
 app.querySelector('.ls-step-n').textContent = Math.min(current.position, current.length) + ' / ' + current.length;
 { const done = s ? current.position - 1 : current.length, pct = current.length ? Math.round(100 * done / current.length) : 100, bar = app.querySelector('.ls-progress');
  if (bar) { bar.setAttribute('aria-valuenow', String(pct)); bar.firstChild.style.width = pct + '%' } }
 if (!s) return endScene();
 app.dataset.step = s.type; app.dataset.index = current.index;
 if (s.type === 'line') {
  npc(s, 'l' + current.index);
  panel.append(btn('Далі →', () => { current.next(); renderStep() }, 'ls-btn ls-primary'));
 } else if (s.type === 'reply') {
  panel.append(el('p', 'ls-prompt', s.prompt));
  s.options.forEach((o, i) => { const b = btn('', () => {
    const r = current.answer(i);
    if (r.repeat) { setHero('thinking'); bubble('me', o.nl, o.uk); const prev = lastLine(); if (prev) { bubble(prev.who, prev.nl, prev.uk, {slow: true}); showSpoken(prev.who, prev.nl, prev.uk, 'neutral'); say(prev.nl, speaker(prev.who).voice, true) }
     renderStep(); feedback(true, 'Добре, що перепитав(ла)! ' + (r.explain || 'Тепер повільніше.')); return }
    if (r.ok) { setHero('happy'); bubble('me', o.nl, o.uk); say(o.nl, ME.voice);
     if (r.react) { const re = r.react; bubble(re.who, re.nl, re.uk); showSpoken(re.who, re.nl, re.uk, re.emotion || 'happy'); sayInTurn(re.nl, speaker(re.who).voice) }
     renderStep() }
    else { setHero('thinking'); setSpokenEmotion('surprised'); b.disabled = true; b.classList.add('is-wrong'); feedback(false, r.why) }
   }, 'ls-option'); b.dataset.option = i; const nl = el('span', 'ls-opt-nl', o.nl); nl.lang = 'nl-BE'; b.append(nl); if (learn()) b.append(el('span', 'ls-opt-uk', o.uk)); panel.append(b) });
 } else if (s.type === 'listen') {
  npc(s, 'l' + current.index);
  panel.append(el('p', 'ls-prompt', '👂 ' + s.q));
  s.options.forEach((o, i) => { const b = btn(o, () => { const r = current.answer(i); if (!r) return; if (r.ok) { setHero('happy'); feedback(true, s.why); next(); } else { setHero('thinking'); setSpokenEmotion('surprised'); b.disabled = true; b.classList.add('is-wrong'); feedback(false, s.why) } }, 'ls-option'); b.dataset.option = i; panel.append(b) });
 } else if (s.type === 'find') {
  const t = current.findTarget, q = t.q || 'Waar is ' + t.nl + '?';
  if (!shown.has('f' + current.index + t.id)) { shown.add('f' + current.index + t.id); bubble(s.who, q, t.quk || 'Де ' + t.uk + '?'); showSpoken(s.who, q, t.quk || 'Де ' + t.uk + '?', 'thinking'); sayInTurn(q, speaker(s.who).voice) }
  panel.append(el('p', 'ls-prompt', s.prompt));
  const grid = el('div', 'ls-find');
  for (const it of s.items) { const b = btn('', () => { const r = current.answer(it.id);
    if (!r) return;
    if (r.ok) { b.classList.add('is-right'); say(it.nl, ME.voice); if (r.done) { setHero('happy'); feedback(true, 'Усе знайдено!'); next() } else later(renderStep, 450) }
    else { setHero('thinking'); b.classList.add('is-wrong'); later(() => b.classList.remove('is-wrong'), 600); feedback(false, 'Це ' + it.nl + (real() ? '' : ' (' + it.uk + ')') + '. Шукай: ' + t.nl + '.') } }, 'ls-item');
   b.dataset.item = it.id; b.append(el('span', 'ls-item-i', it.icon)); if (learn()) b.append(el('span', 'ls-item-l', it.uk)); b.setAttribute('aria-label', it.uk); grid.append(b) }
  panel.append(grid);
 } else if (s.type === 'say') {
  panel.append(el('p', 'ls-prompt', '🗣️ Скажи нідерландською: «' + s.uk + '»'));
  if (learn()) { const t = el('p', 'ls-say-target', s.nl); t.lang = 'nl-BE'; panel.append(t) }
  if (!real()) panel.append(btn('🔊 Послухати зразок', () => say(s.nl, ME.voice), 'ls-btn ls-sample'));
  const status = el('p', 'ls-say-status');
  if (Rec) panel.append(btn('🎤 Сказати', e => { status.textContent = 'Слухаю…'; e.target.disabled = true; const t0 = token, run = current;
   const ok = listenOnce(alts => { if (t0 !== token || run !== current) return; const r = current.answer(alts); if (!r) return; status.textContent = 'Почуто: «' + (alts[0] || '') + '»';
    if (r.ok) { setHero('happy'); bubble('me', s.nl, s.uk); feedback(true, r.why); next() } else { setHero('thinking'); feedback(false, r.why) } }, () => { e.target.disabled = false; if (status.textContent === 'Слухаю…') status.textContent = '' });
   if (!ok) { e.target.disabled = false; status.textContent = 'Мікрофон недоступний — склади фразу зі слів.' } }, 'ls-btn ls-primary ls-mic'));
  panel.append(status, btn('🧩 Скласти зі слів', () => tiles(s), 'ls-btn'));
 }
}
function next() { const b = btn('Далі →', () => renderStep(), 'ls-btn ls-primary'); panel.querySelectorAll('.ls-option,.ls-item,.ls-mic,.ls-sample').forEach(x => x.disabled = true); panel.append(b); b.focus?.() }
function lastLine() { const steps = current.scene.steps; for (let i = current.index - 1; i >= 0; i--) if (steps[i].who && steps[i].nl && steps[i].type !== 'find') return steps[i]; return null }

// Build the sentence from word tiles (no microphone, or by choice): grammar only.
function tiles(s) {
 panel.replaceChildren(el('p', 'ls-prompt', '🧩 Склади: «' + s.uk + '»'));
 const words = s.nl.split(' '), out = el('p', 'ls-tiles-out'), row = el('div', 'ls-tiles'), picked = [];
 out.lang = 'nl-BE';
 shuffle(words).forEach(w => { const b = btn(w, () => { picked.push(w); b.disabled = true; out.textContent = picked.join(' ');
   if (picked.length === words.length) { const r = current.answer({tiles: picked.join(' ')});
    if (!r) return;
    if (r.ok) { setHero('happy'); bubble('me', s.nl, s.uk); say(s.nl, ME.voice); panel.replaceChildren(); feedback(true, r.why); next() }
    else { setHero('thinking'); feedback(false, r.why); later(() => tiles(s), 1800) } } }, 'ls-tile'); row.append(b) });
 panel.append(out, row, btn('Пропустити', () => { current.skip(); renderStep() }, 'ls-btn ls-ghost'));
}

function endScene() {
 const r = current.finish(), total = recordXp(store, story.id, current.scene.id, r.xp), vis = session.visibleScenes(), nxt = vis[vis.indexOf(current.scene) + 1];
 const card = el('section', 'ls-card ls-end');
 card.append(el('h2', '', r.correct === r.total ? '🎉 Сцену пройдено!' : '✅ Сцену завершено'), el('p', 'ls-score', r.correct + ' / ' + r.total + ' з першої спроби'));
 if (r.gained) card.append(el('p', 'ls-gain', '+' + r.gained + ' XP'));
 else card.append(el('p', 'ls-muted', 'Найкращий результат цієї сцени: ' + total + ' XP'));
 card.append(skillCard('Навички в цій сцені', r.skills));
 if (nxt) card.append(btn('Наступна сцена: ' + nxt.icon + ' ' + nxt.title + ' →', () => start(nxt), 'ls-btn ls-primary'));
 else { const i = ROADMAP.findIndex(x => x.id === story.id), nr = ROADMAP.slice(i + 1).find(x => x.id !== 'fence') || null;
  card.append(el('p', 'ls-finale', '🏁 Історію «' + story.title + '» пройдено!' + (nr ? ' Наступна: ' + nr.icon + ' «' + nr.title + '»' + (nr.ready ? '' : ' — скоро.') : '')));
  if (nr?.ready) { const a = el('a', 'ls-btn ls-primary ls-next-story', 'Почати: ' + nr.icon + ' ' + nr.title + ' →'); a.href = './learn-life-story.html?s=' + nr.id; card.append(a) } }
 card.append(btn('До всіх сцен', home, 'ls-btn'));
 panel.replaceChildren(card); card.scrollIntoView?.({block: 'nearest'});
}

home();
