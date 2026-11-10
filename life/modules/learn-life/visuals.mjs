// LerenBe LIFE visual system: reads assets/lerenbe-life/visual-manifest.json and tells the story UI which picture to
// show for a story cover, a scene background (mobile / desktop) and a character (full figure or portrait, by emotion).
// Missing art (null) is normal while the illustrations are being drawn: every function then returns null and the UI
// keeps its drawn-free fallback. Only files inside assets/lerenbe-life/ (not reference/) in web image formats are used.
export const ASSET_BASE = 'assets/lerenbe-life/';
export const EMOTIONS = ['neutral', 'happy', 'thinking', 'surprised'];
export const POSES = ['full', 'portrait'];
const PATH = /^assets\/lerenbe-life\/[a-z0-9][a-z0-9/_.-]*\.(webp|avif|png|jpe?g)$/i;

export function safePath(p) {
 return typeof p === 'string' && PATH.test(p) && !p.includes('..') && !p.includes('//') && !p.startsWith(ASSET_BASE + 'reference/') ? p : null;
}
const pair = v => {
 if (!v || typeof v !== 'object') return null;
 const mobile = safePath(v.mobile), desktop = safePath(v.desktop);
 return mobile || desktop ? {mobile: mobile || desktop, desktop: desktop || mobile} : null;
};

export async function loadVisuals(fetchFn = globalThis.fetch, url = ASSET_BASE + 'visual-manifest.json') {
 try { const r = await fetchFn(url, {cache: 'no-cache'}); if (!r.ok) return empty(); const m = await r.json(); return m && typeof m === 'object' ? m : empty() } catch { return empty() }
}
export const empty = () => ({version: 1, characters: {}, stories: {}});

export function storyCover(m, storyId) {
 const c = m?.stories?.[storyId]?.cover; const p = pair(c);
 return p ? {...p, alt: String(c.alt || '')} : null;
}
// The learner's character: the manifest's protagonist (Anastasia) unless a valid alternative is chosen
// (`hero` — for the future hero choice; nothing in the stories sets it yet).
export function protagonistId(m, hero = null) {
 const alts = Array.isArray(m?.protagonistAlternatives) ? m.protagonistAlternatives : [];
 return hero && alts.includes(hero) && m?.characters?.[hero] ? hero : (m?.protagonist && m.characters?.[m.protagonist] ? m.protagonist : null);
}
// A scene: background (or null) + characters to place on the stage + alt text + the dialogue zone. `who`/`emotion`
// (the line being shown) put the speaking character first and set its emotion; `heroEmotion` sets the learner's
// character (happy after a right answer, thinking after a mistake); `hero` = chosen protagonist.
export function sceneVisual(m, storyId, sceneId, {who = null, emotion = null, heroEmotion = null, hero = null} = {}) {
 const s = m?.stories?.[storyId]?.scenes?.[sceneId]; if (!s) return {background: null, characters: [], alt: '', dialogue: DIALOGUE};
 const me = protagonistId(m, hero);
 let chars = (Array.isArray(s.characters) ? s.characters : []).filter(c => c && typeof c.id === 'string')
  .map(c => c.role === 'protagonist' ? {...c, id: me || c.id, emotion: EMOTIONS.includes(heroEmotion) ? heroEmotion : c.emotion, protagonist: true} : c);
 if (who && chars.some(c => c.id === who)) chars = [...chars.filter(c => c.id === who), ...chars.filter(c => c.id !== who)];
 const characters = chars.map(c => {
  const e = c.id === who && EMOTIONS.includes(emotion) ? emotion : EMOTIONS.includes(c.emotion) ? c.emotion : 'neutral';
  const pose = POSES.includes(c.pose) ? c.pose : 'full', src = characterImage(m, c.id, {pose, emotion: e});
  return src ? {id: c.id, pose, emotion: e, position: c.position === 'left' ? 'left' : 'right', src, alt: characterAlt(m, c.id), protagonist: !!c.protagonist} : null;
 }).filter(Boolean);
 return {background: pair(s.background), characters, alt: String(s.alt || ''), dialogue: dialogueZone(s.dialogue)};
}
// Bottom part of the stage kept free for the dialogue box (share of the height, 0.2–0.5).
const DIALOGUE = {position: 'bottom', reserve: 0.32};
const dialogueZone = d => ({position: 'bottom', reserve: Number.isFinite(d?.reserve) ? Math.min(.5, Math.max(.2, d.reserve)) : DIALOGUE.reserve});
// Exact emotion first, then neutral of the same pose. A full figure never stands in for a portrait or the reverse:
// reference sheets are not cut automatically.
export function characterImage(m, id, {pose = 'portrait', emotion = 'neutral'} = {}) {
 const c = m?.characters?.[id]; if (!c) return null;
 const set = c[POSES.includes(pose) ? pose : 'portrait']; if (!set || typeof set !== 'object') return null;
 return safePath(set[emotion]) || safePath(set.neutral) || null;
}
export const characterAlt = (m, id) => String(m?.characters?.[id]?.alt || m?.characters?.[id]?.name || '');

// Problems in a manifest (for tests and for the artist's hand-off): unsafe paths, unknown emotions/poses,
// scenes that a story does not have. `stories` = {id: [sceneIds]} of the stories in the app.
export function validateManifest(m, stories = {}) {
 const out = [], check = (p, where) => { if (p !== null && p !== undefined && !safePath(p)) out.push(where + ': unsafe or wrong path ' + JSON.stringify(p)) };
 for (const [id, c] of Object.entries(m?.characters || {})) for (const pose of POSES) {
  const set = c?.[pose]; if (!set) { out.push('character ' + id + ': no ' + pose + ' set'); continue }
  for (const [e, p] of Object.entries(set)) { if (!EMOTIONS.includes(e)) out.push('character ' + id + ': unknown emotion ' + e); check(p, 'character ' + id + '.' + pose + '.' + e) } }
 for (const [sid, s] of Object.entries(m?.stories || {})) {
  check(s?.cover?.mobile, sid + '.cover.mobile'); check(s?.cover?.desktop, sid + '.cover.desktop');
  if (stories[sid]) { for (const sc of stories[sid]) if (!s.scenes?.[sc]) out.push(sid + ': scene ' + sc + ' missing in the manifest') }
  for (const [sc, v] of Object.entries(s?.scenes || {})) {
   if (stories[sid] && !stories[sid].includes(sc)) out.push(sid + ': manifest scene ' + sc + ' is not in the story');
   check(v?.background?.mobile, sid + '.' + sc + '.background.mobile'); check(v?.background?.desktop, sid + '.' + sc + '.background.desktop');
   if (!v?.alt) out.push(sid + '.' + sc + ': no alt text');
   for (const c of v?.characters || []) { if (!m.characters?.[c.id]) out.push(sid + '.' + sc + ': unknown character ' + c.id); if (c.emotion && !EMOTIONS.includes(c.emotion)) out.push(sid + '.' + sc + ': unknown emotion ' + c.emotion) }
   if (v?.dialogue && !(v.dialogue.reserve >= .2 && v.dialogue.reserve <= .5)) out.push(sid + '.' + sc + ': dialogue reserve must be 0.2–0.5');
   if ((v?.characters || []).length && v?.backgroundHasCharacters !== false) out.push(sid + '.' + sc + ': characters are separate layers, so backgroundHasCharacters must be false') } }
 if (m?.protagonist && !m.characters?.[m.protagonist]) out.push('protagonist ' + m.protagonist + ' is not a character');
 for (const a of m?.protagonistAlternatives || []) if (!m.characters?.[a]) out.push('protagonist alternative ' + a + ' is not a character');
 return out;
}
// Paths the manifest points to (to check that the files exist and to precache them).
export function manifestPaths(m) {
 const out = new Set(), add = p => { const s = safePath(p); if (s) out.add(s) };
 for (const c of Object.values(m?.characters || {})) for (const pose of POSES) for (const p of Object.values(c?.[pose] || {})) add(p);
 for (const s of Object.values(m?.stories || {})) { add(s?.cover?.mobile); add(s?.cover?.desktop); for (const v of Object.values(s?.scenes || {})) { add(v?.background?.mobile); add(v?.background?.desktop) } }
 for (const p of Object.values(m?.ui || {})) add(p);
 return [...out];
}
