// LerenBe LIFE Engine 2.0 (pure logic, no DOM). A story has scenes; a scene has steps:
//  line   — a character speaks
//  reply  — choose what to say. Several options can be right (different but fitting answers); a right option may
//           `set` story flags (the story remembers the choice), show the character's reaction (`react`) and jump
//           (`goto` a step id). `repeat` options ask again: the character repeats slowly and may `explain` a word —
//           never a mistake.
//  listen — hear something and choose what it means
//  find   — the character names things one by one; tap the right object
//  say    — say the phrase (speech recognition) or build it from word tiles
// Scenes and steps can depend on the learner's earlier choices: `if: {flag: value}`.
// Three skills are scored separately (first try only): understanding (reply, listen, find), grammar (word order of
// what was said or built) and speaking (the words were recognised). Browser recognition cannot judge the accent, so
// there is no accent score. Scene XP = 5 per step right at the first try; the best per scene is kept and recorded in
// leren_life_xp_v1 ("<story>:<scene>" → XP), which app.js adds to the shared XP once.
// The learner's memory across stories (people met, remembered choices) lives in leren_life_memory_v1.
export const XP_PER_STEP = 5;
export const XP_KEY = 'leren_life_xp_v1';
export const MEMORY_KEY = 'leren_life_memory_v1';
export const MODES = ['learn', 'practice', 'real'];
const GRADED = new Set(['reply', 'listen', 'find', 'say']);
export const SKILL_OF = {reply: 'understand', listen: 'understand', find: 'understand'};

export const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
 .replace(/[’‘`´]/g, "'").replace(/[.,!?;:"«»“”()]/g, ' ').replace(/\s+/g, ' ').trim();
const words = (s, skip) => norm(s).split(' ').filter(w => w && !skip.has(w));

// Speaking: share of the target's words that were recognised (order-free). Grammar: the longest run of target words
// said in the right order, as a share of the target. Character names are left out (recognisers spell them differently).
export function sayCheck(target, heard, names = []) {
 const skip = new Set(names.map(norm)), want = words(target, skip), got = words(heard, skip);
 if (!want.length) return {speaking: 0, grammar: 0};
 const pool = [...got]; let hit = 0;
 for (const w of want) { const i = pool.indexOf(w); if (i >= 0) { hit++; pool.splice(i, 1) } }
 const L = Array.from({length: want.length + 1}, () => new Array(got.length + 1).fill(0));
 for (let i = 1; i <= want.length; i++) for (let j = 1; j <= got.length; j++)
  L[i][j] = want[i - 1] === got[j - 1] ? L[i - 1][j - 1] + 1 : Math.max(L[i - 1][j], L[i][j - 1]);
 return {speaking: hit / want.length, grammar: L[want.length][got.length] / want.length};
}
export const sayScore = (target, heard, names) => sayCheck(target, heard, names).speaking; // kept for older callers
export const SAY_PASS = 0.75;

export const matches = (cond, flags) => !cond || Object.entries(cond).every(([k, v]) => (flags[k] ?? null) === v);
export function gradedSteps(scene) { return scene.steps.filter(s => GRADED.has(s.type)) }

function readJSON(storage, key) { try { const o = JSON.parse(storage.getItem(key) || '{}'); return o && typeof o === 'object' && !Array.isArray(o) ? o : {} } catch { return {} } }
function writeJSON(storage, key, o) { try { storage.setItem(key, JSON.stringify(o)) } catch {} }
const cleanFlags = o => Object.fromEntries(Object.entries(o && typeof o === 'object' ? o : {}).filter(([k, v]) => /^[a-z0-9_.-]{1,60}$/i.test(k) && ['string', 'boolean', 'number'].includes(typeof v)).slice(0, 50));

export function readMemory(storage) {
 const m = readJSON(storage, MEMORY_KEY);
 return {met: cleanFlags(m.met), flags: cleanFlags(m.flags)};
}

export function createStorySession(story, storage, {mode} = {}) {
 const key = 'leren_life_story_v1_' + story.id;
 const sceneById = new Map(story.scenes.map(s => [s.id, s])), names = Object.values(story.cast || {}).map(c => c.name);
 const saved = readJSON(storage, key);
 const best = {};
 if (saved.best && typeof saved.best === 'object') for (const [id, v] of Object.entries(saved.best))
  if (sceneById.has(id) && Number.isInteger(v) && v >= 0) best[id] = Math.min(v, gradedSteps(sceneById.get(id)).length);
 const state = {
  mode: MODES.includes(mode || saved.mode) ? (mode || saved.mode) : 'learn',
  best,
  flags: cleanFlags(saved.flags),
  skills: cleanSkills(saved.skills),
  missed: Array.isArray(saved.missed) ? saved.missed.filter(x => typeof x === 'string').slice(0, 60) : []
 };
 function cleanSkills(o) { const r = {}; for (const k of ['understand', 'grammar', 'speaking']) { const v = o?.[k]; r[k] = Array.isArray(v) && v.length === 2 && v.every(Number.isInteger) && v[0] >= 0 && v[0] <= v[1] ? v : [0, 0] } return r }
 function save() { writeJSON(storage, key, state) }
 function setMode(m) { state.mode = MODES.includes(m) ? m : 'learn'; save(); return state.mode }
 function remember(people) {
  const mem = readMemory(storage); let changed = false;
  for (const p of people) if (!mem.met[p]) { mem.met[p] = true; changed = true }
  for (const [k, v] of Object.entries(state.flags)) if (mem.flags[story.id + '.' + k] !== v) { mem.flags[story.id + '.' + k] = v; changed = true }
  if (changed) writeJSON(storage, MEMORY_KEY, mem);
 }
 const visible = s => matches(s.if, state.flags);
 function visibleScenes() { return story.scenes.filter(visible) }

 function play(sceneId) {
  const scene = sceneById.get(sceneId); if (!scene) return null;
  let index = -1, findIndex = 0, firstTry = true, correct = 0, total = 0;
  const skills = {understand: [0, 0], grammar: [0, 0], speaking: [0, 0]}, people = new Set();
  const advance = from => { let i = from; while (i < scene.steps.length && !matches(scene.steps[i].if, state.flags)) i++; index = i; findIndex = 0; firstTry = true };
  const count = (skill, ok) => { skills[skill][1]++; if (ok) skills[skill][0]++ };
  advance(0);
  const run = {
   scene,
   get index() { return index },
   get position() { return scene.steps.slice(0, index + 1).filter(s => matches(s.if, state.flags)).length },
   get length() { return scene.steps.filter(s => matches(s.if, state.flags)).length },
   get step() { const s = scene.steps[index]; if (s?.who) people.add(s.who); return s || null },
   get findTarget() { const s = scene.steps[index]; return s?.type === 'find' ? s.items.find(i => i.id === s.ask[findIndex]) || null : null },
   get correct() { return correct },
   get total() { return total },
   next() { if (scene.steps[index]?.type === 'line') advance(index + 1); return run.step },
   // value: option index (reply, listen), item id (find), heard text or [alternatives] (say), {tiles: text} (say by tiles)
   answer(value) {
    const s = scene.steps[index]; if (!s || !GRADED.has(s.type)) return null;
    let ok = false, why = s.why || '', react = null, jump = null;
    if (s.type === 'reply') {
     const o = s.options[value]; if (!o) return null;
     if (o.repeat) return {ok: false, repeat: true, done: false, explain: o.explain || s.explain || ''};
     ok = !!o.ok; why = o.why || '';
     if (ok) { if (o.set) Object.assign(state.flags, cleanFlags(o.set)); react = o.react || null; jump = o.goto || null }
     else missed(s.options.find(x => x.ok)?.nl);
     if (firstTry) count('understand', ok);
    } else if (s.type === 'listen') {
     if (!Number.isInteger(value) || !s.options[value]) return null;
     ok = value === s.answer; if (!ok) missed(s.nl);
     if (firstTry) count('understand', ok);
    } else if (s.type === 'find') {
     const want = s.ask[findIndex]; ok = value === want;
     if (!ok) { missed(s.items.find(i => i.id === want)?.nl); if (firstTry) count('understand', false); firstTry = false; return {ok: false, done: false, why: ''} }
     findIndex++;
     if (findIndex < s.ask.length) return {ok: true, done: false};
     if (firstTry) count('understand', true);
    } else if (s.type === 'say') {
     let speaking = null, grammar;
     if (value && typeof value === 'object' && !Array.isArray(value) && 'tiles' in value) grammar = norm(value.tiles) === norm(s.nl) ? 1 : 0;
     else { const alts = (Array.isArray(value) ? value : [value]).map(h => sayCheck(s.nl, h, names));
      const bestAlt = alts.reduce((m, a) => (a.speaking + a.grammar > m.speaking + m.grammar ? a : m), {speaking: 0, grammar: 0});
      speaking = bestAlt.speaking >= SAY_PASS; grammar = bestAlt.grammar }
     const grammarOk = grammar >= SAY_PASS; ok = grammarOk && speaking !== false;
     if (firstTry) { count('grammar', grammarOk); if (speaking !== null) count('speaking', speaking) }
     if (!ok) missed(s.nl);
     why = ok ? (s.tip || '') : speaking === false ? 'Не всі слова розпізнано. Скажи ще раз, трохи повільніше.' : 'Слова правильні, але порядок інший: ' + s.nl;
     if (ok) return finishStep({ok, why});
     firstTry = false; return {ok: false, done: false, why, speaking, grammar: grammarOk};
    }
    if (ok) return finishStep({ok, why, react, jump});
    firstTry = false; return {ok: false, done: false, why};
   },
   skip() { const s = scene.steps[index]; if (!s) return; if (GRADED.has(s.type)) { missed(s.nl || s.options?.find(o => o.ok)?.nl); total++ } advance(index + 1) },
   get finished() { return index >= scene.steps.length },
   finish() {
    const prev = state.best[scene.id] || 0; if (correct > prev) state.best[scene.id] = correct;
    for (const k in skills) { state.skills[k][0] += skills[k][0]; state.skills[k][1] += skills[k][1] }
    save(); remember([...people].filter(p => story.cast?.[p]));
    return {correct, total, xp: correct * XP_PER_STEP, gained: Math.max(0, correct - prev) * XP_PER_STEP, skills};
   }
  };
  function finishStep(r) {
   total++; if (firstTry) correct++;
   const target = r.jump ? scene.steps.findIndex(x => x.id === r.jump) : -1;
   advance(target >= 0 ? target : index + 1);
   return {...r, done: true};
  }
  return run;
 }
 function missed(nl) { if (nl && !state.missed.includes(nl)) { state.missed.push(nl); if (state.missed.length > 60) state.missed.shift(); save() } }
 function sceneDone(id) { return Object.hasOwn(state.best, id) }
 function nextScene() { return visibleScenes().find(s => !sceneDone(s.id)) || null }
 function xp() { return story.scenes.reduce((n, s) => n + (state.best[s.id] || 0) * XP_PER_STEP, 0) }
 // Most XP the learner's current path can give (conditional steps and scenes counted when they apply).
 function maxXp() { return visibleScenes().reduce((n, s) => n + gradedSteps(s).filter(x => matches(x.if, state.flags)).length * XP_PER_STEP, 0) }
 return {state, setMode, play, sceneDone, nextScene, visibleScenes, xp, maxXp, save, memory: () => readMemory(storage)};
}

// Shared XP record read by app.js (see absorbLifeXP there): best XP per "<story>:<scene>".
export function recordXp(storage, storyId, sceneId, xp) {
 const o = readJSON(storage, XP_KEY), k = storyId + ':' + sceneId;
 if (Number.isInteger(xp) && xp > (o[k] || 0)) { o[k] = xp; writeJSON(storage, XP_KEY, o) }
 return o[k] || 0;
}
