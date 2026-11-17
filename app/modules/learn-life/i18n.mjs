// LIFE pages in the app's interface languages. The Ukrainian text in the story data and in the UI is the source and
// the key: a dictionary module (loaded only for en / fr / ar) maps it to [en, fr, ar]. Story data, the engines and saved
// progress stay exactly as they are; a text without a translation stays Ukrainian (tests/life-i18n.cjs keeps that list empty).
// Language: ?lang= (a link that names it) → the app's own choice (localStorage poly_ui, same origin) → uk.
// The same file is in app/modules/learn-life/ (the fence page) and life/modules/learn-life/ (stories); the test keeps them equal.
export const LANGS = ['uk', 'en', 'fr', 'ar'];
const fromUrl = (() => { try { const l = new URLSearchParams(location.search).get('lang'); return LANGS.includes(l) ? l : null } catch { return null } })();
const fromApp = (() => { try { const l = localStorage.getItem('poly_ui'); return LANGS.includes(l) ? l : null } catch { return null } })();
export const LANG = fromUrl || fromApp || 'uk';
const COL = LANGS.indexOf(LANG) - 1;
let DICT = null;
const CYR = /[а-яіїєґ]/i;

// Loads the dictionary for a non-Ukrainian page; Ukrainian pages load nothing. A failed load keeps the page Ukrainian.
export async function loadDict(load) {
 if (LANG === 'uk') return;
 try { DICT = (await load()).DICT || null } catch { DICT = null }
 // French typography: a no-break space before ? ! : ; » and after «, so the mark never starts a new line.
 if (DICT && LANG === 'fr') for (const r of Object.values(DICT)) if (r[1]) r[1] = r[1].replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ');
}
// T('Сцени') → 'Scenes'; T('Наступна сцена: {0}', title) fills {0}, {1}… after translating.
export function T(s, ...args) {
 let r = String(s ?? '');
 if (DICT && COL >= 0) { const row = DICT[r]; if (row && row[COL]) r = row[COL] }
 args.forEach((a, i) => { r = r.split('{' + i + '}').join(String(a)) });
 return r;
}
// A translated deep copy of data: every string with Ukrainian letters goes through T (Dutch text never has them).
export function localize(o) {
 if (typeof o === 'string') return CYR.test(o) ? T(o) : o;
 if (Array.isArray(o)) return o.map(localize);
 if (o && typeof o === 'object') { const r = {}; for (const [k, v] of Object.entries(o)) r[k] = localize(v); return r }
 return o;
}
// A LIFE link keeps the language when the page itself was opened with ?lang= (otherwise the app's choice applies anyway).
export function withLang(href) {
 if (!fromUrl || !/learn-life/.test(href) || /^[a-z]+:|^\/\/|[?&]lang=/i.test(href)) return href;
 const [path, hash] = href.split('#'); return path + (path.includes('?') ? '&' : '?') + 'lang=' + fromUrl + (hash != null ? '#' + hash : '');
}
// The static page: <html lang/dir>, text nodes, labels and placeholders, <title> and the description; Dutch stays as it is.
export function translateDom(root = document) {
 const html = document.documentElement; html.lang = LANG;
 if (LANG === 'ar') html.dir = 'rtl'; else html.removeAttribute('dir');
 if (LANG === 'uk') return;
 const w = document.createTreeWalker(root.body || root, NodeFilter.SHOW_TEXT); const nodes = []; let n;
 while ((n = w.nextNode())) {
  if (n.parentElement?.closest('script,style')) continue;
  // «← LerenBe»: in a right-to-left page «back» points right.
  if (LANG === 'ar' && /^\s*←/.test(n.textContent) && !CYR.test(n.textContent)) n.textContent = n.textContent.replace('←', '→');
  if (CYR.test(n.textContent)) nodes.push(n);
 }
 for (const t of nodes) { const raw = t.textContent, key = raw.trim(); if (!key) continue; const tr = T(key); if (tr !== key) t.textContent = raw.replace(key, tr) }
 for (const e of (root.body || root).querySelectorAll('[aria-label],[placeholder],[title]')) for (const a of ['aria-label', 'placeholder', 'title']) { const v = e.getAttribute(a); if (v && CYR.test(v)) e.setAttribute(a, T(v)) }
 for (const a of (root.body || root).querySelectorAll('a[href]')) a.setAttribute('href', withLang(a.getAttribute('href')));
 document.title = T(document.title);
 const d = document.querySelector('meta[name=description]'); if (d) d.content = T(d.content);
}
