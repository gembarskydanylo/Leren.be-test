/* LerenBe home v2 (TEST-016): the top of the existing home screen — full-width HERO with HTML text, interface language,
   course cards, the LerenBe LIFE entrance, progress, XP and rewards, the orange cat. No learning logic of its own:
   everything comes from the learning path (levels, progress, continue), the app bridge (streak, XP, rewards), the
   course player (English / French) and the existing language picker (#uiLangPicker). Pictures come from
   img/home/home-visuals.json: only entries with status "approved" are loaded (with width/height, so nothing jumps);
   until then the HERO keeps its painted CSS fallback. Called by modules/learning-path/ui.js (hero()). */
(() => {
 'use strict';
 const T = {
  uk: {kicker: 'Learn languages. Live in Belgium.', h1a: 'Вивчай мови для ', h1b: 'реального життя', h1c: ' в Бельгії', sub: 'Уроки, озвучені фрази й історії з повсякденного життя: вокзал, магазин, комуна, сусіди.', start: 'Почати навчання', cont: 'Продовжити урок', life: 'LerenBe LIFE', lifeTitle: 'Перший день у Бельгії', lifeText: 'Інтерактивна історія: вокзал, трамвай, квартира, сусід. Персонажі говорять — ти відповідаєш.', lifeGo: 'Відкрити історію', courses: 'Курси', nl: 'Нідерландська', en: 'Англійська', fr: 'Французька', de: 'Німецька', preview: 'перегляд', soon: 'скоро', open: 'Відкрити', active: 'зараз', lessons: 'уроків', lang: 'Мова інтерфейсу', streak: 'днів поспіль', xp: 'XP', today: 'хв сьогодні', rewards: 'Нагороди й досягнення', progress: 'Твій прогрес', cat: 'Котик LerenBe'},
  en: {kicker: 'Learn languages. Live in Belgium.', h1a: 'Learn languages for ', h1b: 'real life', h1c: ' in Belgium', sub: 'Lessons, recorded phrases and everyday stories: the station, the shop, the town hall, the neighbours.', start: 'Start learning', cont: 'Continue the lesson', life: 'LerenBe LIFE', lifeTitle: 'First day in Belgium', lifeText: 'An interactive story: the station, the tram, the flat, the neighbour. The characters talk — you answer.', lifeGo: 'Open the story', courses: 'Courses', nl: 'Dutch', en: 'English', fr: 'French', de: 'German', preview: 'preview', soon: 'soon', open: 'Open', active: 'now', lessons: 'lessons', lang: 'Interface language', streak: 'days in a row', xp: 'XP', today: 'min today', rewards: 'Rewards and achievements', progress: 'Your progress', cat: 'The LerenBe cat'},
  fr: {kicker: 'Learn languages. Live in Belgium.', h1a: 'Apprends les langues pour ', h1b: 'la vraie vie', h1c: ' en Belgique', sub: 'Des leçons, des phrases enregistrées et des histoires du quotidien : la gare, le magasin, la commune, les voisins.', start: 'Commencer', cont: 'Reprendre la leçon', life: 'LerenBe LIFE', lifeTitle: 'Premier jour en Belgique', lifeText: 'Une histoire interactive : la gare, le tram, l’appartement, le voisin. Les personnages parlent, tu réponds.', lifeGo: 'Ouvrir l’histoire', courses: 'Cours', nl: 'Néerlandais', en: 'Anglais', fr: 'Français', de: 'Allemand', preview: 'aperçu', soon: 'bientôt', open: 'Ouvrir', active: 'en cours', lessons: 'leçons', lang: 'Langue de l’interface', streak: 'jours d’affilée', xp: 'XP', today: 'min aujourd’hui', rewards: 'Récompenses et succès', progress: 'Ta progression', cat: 'Le chat LerenBe'},
  ar: {kicker: 'Learn languages. Live in Belgium.', h1a: 'تعلّم اللغات من أجل ', h1b: 'الحياة الحقيقية', h1c: ' في بلجيكا', sub: 'دروس وعبارات مسجّلة وقصص من الحياة اليومية: المحطة، المتجر، البلدية، الجيران.', start: 'ابدأ التعلّم', cont: 'تابع الدرس', life: 'LerenBe LIFE', lifeTitle: 'اليوم الأول في بلجيكا', lifeText: 'قصة تفاعلية: المحطة، الترام، الشقة، الجار. الشخصيات تتكلم وأنت تجيب.', lifeGo: 'افتح القصة', courses: 'الدورات', nl: 'الهولندية', en: 'الإنجليزية', fr: 'الفرنسية', de: 'الألمانية', preview: 'معاينة', soon: 'قريبًا', open: 'افتح', active: 'الآن', lessons: 'دروس', lang: 'لغة الواجهة', streak: 'أيام متتالية', xp: 'XP', today: 'دقيقة اليوم', rewards: 'المكافآت والإنجازات', progress: 'تقدّمك', cat: 'قطة LerenBe'}
 };
 const badge = id => { const b = el('span', 'hv-flag hv-flag-' + id, id.toUpperCase()); b.setAttribute('aria-hidden', 'true'); return b };
 const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n };
 const button = (label, fn, cls = 'hv-btn') => { const b = el('button', cls, label); b.type = 'button'; b.onclick = fn; return b };
 let VIS = null; const ready = fetch('img/home/home-visuals.json', {cache: 'no-cache'}).then(r => r.ok ? r.json() : null).catch(() => null).then(v => { VIS = v; return v });
 const PATH = /^img\/[a-z0-9][a-z0-9/_.-]*\.(webp|avif|png|jpe?g)$/i;
 const ok = e => e && e.status === 'approved' && PATH.test(e.src || '') && !e.src.includes('..');

 // <picture>: mobile and desktop sources, intrinsic size (no layout shift), eager + high priority only for the HERO.
 function picture(entry, cls, {eager = false} = {}) {
  const d = entry.desktop, m = entry.mobile; if (!ok(d) && !ok(m)) return null;
  const pic = el('picture', cls), main = ok(m) ? m : d;
  if (ok(d) && ok(m)) { const s = el('source'); s.media = '(min-width: 768px)'; s.srcset = d.src; s.width = d.width; s.height = d.height; pic.append(s) }
  const img = el('img'); img.src = main.src; img.alt = entry.alt || ''; img.width = main.width; img.height = main.height; img.decoding = 'async';
  img.loading = eager ? 'eager' : 'lazy'; if (eager) img.fetchPriority = 'high';
  img.onerror = () => pic.remove(); pic.append(img); return pic;
 }
 function single(entry, cls, alt) {
  if (!ok(entry)) return null; const img = el('img', cls); img.src = entry.src; img.alt = alt ?? entry.alt ?? ''; img.width = entry.width; img.height = entry.height; img.loading = 'lazy'; img.decoding = 'async'; img.onerror = () => img.remove(); return img;
 }

 // Interface language: a compact copy of the app's own picker; choosing here changes the original (same logic).
 function langSelect(t) {
  const src = document.getElementById('uiLangPicker'); if (!src) return null;
  const wrap = el('label', 'hv-lang'), sel = el('select'); wrap.append(el('span', 'hv-lang-label', t.lang), sel);
  for (const o of src.options) { const c = el('option', '', o.textContent); c.value = o.value; sel.append(c) }
  sel.value = src.value; sel.onchange = () => { src.value = sel.value; src.dispatchEvent(new Event('change', {bubbles: true})) };
  return wrap;
 }

 function top(ctx) {
  const lang = T[ctx.lang] ? ctx.lang : 'uk', t = T[lang], box = el('section', 'hv'); box.dir = lang === 'ar' ? 'rtl' : 'ltr'; box.lang = lang;
  box.setAttribute('aria-label', t.kicker);
  // HERO
  const hero = el('div', 'hv-hero'); hero.dataset.art = 'fallback';
  const fill = () => { if (!VIS?.hero) return; const pic = picture(VIS.hero, 'hv-hero-art', {eager: true}); if (pic) { hero.prepend(pic); hero.dataset.art = 'image' } };
  // the language picker lives in the app header (#uiLangPicker); langSelect() stays available for layouts without it
  if (VIS) fill(); else ready.then(fill);
  const copy = el('div', 'hv-hero-copy'), h1 = el('h1', 'hv-title');
  h1.append(t.h1a, el('em', '', t.h1b), t.h1c);
  copy.append(el('p', 'hv-kicker', t.kicker), h1, el('p', 'hv-sub', t.sub));
  const acts = el('div', 'hv-actions');
  acts.append(button((ctx.started ? t.cont : t.start) + ' →', () => ctx.onContinue?.(), 'hv-btn hv-primary'));
  const life = el('a', 'hv-btn hv-ghost', '🎬 ' + t.life); life.href = './learn-life-story.html?s=first-day'; acts.append(life);
  copy.append(acts);
  const stats = ctx.stats || {}, strip = el('div', 'hv-stats');
  strip.append(el('span', 'hv-chip', '🔥 ' + (stats.streak || 0) + ' ' + t.streak), el('span', 'hv-chip', '⭐ ' + Number(stats.points || 0).toLocaleString(lang === 'ar' ? 'ar' : 'uk-UA') + ' ' + t.xp));
  copy.append(strip);
  const cat = single(VIS?.mascot, 'hv-cat', t.cat) || (() => { const img = el('img', 'hv-cat'); img.src = 'img/home/hero-cat-v196-320.webp'; img.alt = t.cat; img.width = 320; img.height = 320; img.loading = 'lazy'; img.decoding = 'async'; img.onerror = () => img.remove(); return img })();
  hero.append(copy, cat); box.append(hero);

  // Courses
  const courses = el('section', 'hv-courses'); courses.append(el('h2', 'hv-h2', t.courses));
  const grid = el('div', 'hv-course-grid');
  const nl = el('article', 'hv-course is-live'); nl.dataset.course = 'nl';
  { const hd = el('div', 'hv-course-head'); hd.append(badge('nl'), t.nl); nl.append(hd) }
  for (const lv of ctx.levels || []) {
   const row = button('', () => lv.pick?.(), 'hv-level' + (lv.active ? ' is-active' : '')); row.disabled = !!lv.soon; row.dataset.level = lv.level;
   const pct = lv.total ? Math.round(100 * lv.done / lv.total) : 0, bar = el('span', 'hv-bar'), f = el('span'); f.style.width = pct + '%'; bar.append(f);
   row.append(el('b', '', lv.level), el('small', '', lv.soon ? t.soon : lv.done + ' / ' + lv.total + ' ' + t.lessons + (lv.active ? ' · ' + t.active : '')), bar);
   row.setAttribute('aria-label', t.nl + ' ' + lv.level + (lv.soon ? ' — ' + t.soon : ' — ' + pct + '%')); nl.append(row) }
  grid.append(nl);
  const R = globalThis.LerenCourses, P = globalThis.LerenCoursePlayer;
  for (const id of ['en', 'fr', 'de']) {
   const info = R?.COURSES?.[id], hasPack = !!globalThis.LerenCourseData?.[id], c = el('article', 'hv-course'); c.dataset.course = id;
   { const hd = el('div', 'hv-course-head'); hd.append(badge(id), t[id]); c.append(hd) } c.append(el('small', 'hv-course-meta', (info?.levels || []).join(' · ') + ' · ' + (hasPack ? t.preview : t.soon)));
   const b = button(hasPack ? t.open + ' →' : t.soon, () => P?.open?.(id, lang), 'hv-btn hv-small'); b.disabled = !hasPack || !P; c.append(b); grid.append(c) }
  courses.append(grid); box.append(courses);

  // LIFE entrance + progress side by side on wide screens
  const duo = el('div', 'hv-duo');
  const lifeCard = el('a', 'hv-life'); lifeCard.href = './learn-life-story.html?s=first-day';
  const lifeArt = el('div', 'hv-life-art'); lifeArt.append(el('span', 'hv-life-icon', '🚉'));
  const fillLife = () => { const pic = VIS?.lifePromo && picture(VIS.lifePromo, 'hv-life-pic'); if (pic) { lifeArt.replaceChildren(pic); lifeArt.dataset.art = 'image' } };
  if (VIS) fillLife(); else ready.then(fillLife);
  const lt = el('div', 'hv-life-text'); lt.append(el('p', 'hv-kicker', '🎬 ' + t.life), el('h2', 'hv-h2', t.lifeTitle), el('p', '', t.lifeText), el('span', 'hv-btn hv-primary hv-small', t.lifeGo + ' →'));
  lifeCard.append(lifeArt, lt);
  const prog = el('section', 'hv-progress'); prog.append(el('h2', 'hv-h2', t.progress));
  const cur = (ctx.levels || []).find(l => l.active) || (ctx.levels || [])[0];
  if (cur) { const pct = cur.total ? Math.round(100 * cur.done / cur.total) : 0, ring = el('div', 'hv-ring'); ring.style.setProperty('--p', pct); ring.setAttribute('role', 'img'); ring.setAttribute('aria-label', t.nl + ' ' + cur.level + ': ' + pct + '%'); ring.append(el('span', '', pct + '%'));
   const info = el('div'); info.append(el('b', '', t.nl + ' ' + cur.level), el('small', '', cur.done + ' / ' + cur.total + ' ' + t.lessons)); const row = el('div', 'hv-ring-row'); row.append(ring, info); prog.append(row) }
  const chips = el('div', 'hv-stats'); chips.append(el('span', 'hv-chip', '⭐ ' + Number(stats.points || 0) + ' ' + t.xp), el('span', 'hv-chip', '⏱️ ' + (stats.min || 0) + ' / ' + (stats.goal || 0) + ' ' + t.today));
  prog.append(chips, button('🏆 ' + t.rewards + ' →', () => ctx.rewards?.(), 'hv-btn hv-small'));
  duo.append(lifeCard, prog); box.append(duo);
  return box;
 }
 globalThis.LerenHomeV2 = {top, ready: () => ready, T, langSelect};
})();
