/* TEST-042 · Lesson Help: an «Ask Lexi» button under the current exercise of the classic lesson, the Learning Path (nl) and the
 * Course Player (en / fr). It opens Lexi's lesson help through the app's own entry point, lexiOpen('lesson', ctx); the request
 * itself (languages, level, limits, privacy) is built by LerenLexi (engine.js), so this file only reads WHAT the learner sees.
 *
 * Deferred and self-contained on purpose: the first screen is at its 760 KB budget, so the three screens are not edited; the
 * button is added by watching the page. Contract: docs/LEXI-LESSON-HELP-CONTRACT.md, plan: docs/LEXI-LESSON-HELP-PLAN.md.
 *
 * Privacy: only text that is already on the exercise screen is read (task, the answer the learner picked, the course's sample
 * answer AFTER they answered). No account, XP, streak, history or audio; nothing is stored; nothing is sent until the tap.
 */
(() => {
 'use strict';
 const LABEL = {uk: 'Запитай Lexi', en: 'Ask Lexi', fr: 'Demande à Lexi', ar: 'اسأل Lexi'};
 const q = (r, s) => r && r.querySelector(s), text = (r, s) => { const e = s ? q(r, s) : r; return e ? e.textContent.replace(/\s+/g, ' ').trim() : '' };
 let last = {};
 const MODES = {study: 'study', quiz: 'quiz', review: 'quiz', audio: 'listen'}, mode = d => (q(d, '#lessonModes [aria-selected="true"]') || {dataset: {}}).dataset.mode;

 // One adapter per screen: find(doc) → the element the button goes into (or null), read(host) → the exercise on screen.
 const SCREENS = [
  {id: 'classic',
   // Not in the chapter tests (no mode tab is selected there): the help must not hand out answers during a test.
   find: d => { const c = q(d, '#card'); return c && MODES[mode(d)] && q(c, '.q') && (q(c, '.opt') || q(c, '.study-row')) ? c : null },
   read: h => {
    const answered = !!q(h, '.opt.correct, .opt.incorrect'), word = text(h, '.q h2'), meaning = text(h, '.q > p'), kind = MODES[mode(document)] || 'quiz';
    return {kind, lesson: text(h, '.q small'),
     question: kind === 'study' ? [word, text(h, '#feedback strong')].filter(Boolean).join(' — ') : word || meaning,
     answer: text(h, '.opt.incorrect') || (answered ? text(h, '.opt.correct') : ''), expected: answered ? text(h, '#feedback strong + p') : ''};
   }},
  {id: 'path',
   find: d => { const b = q(d, '.lp-exercise'); return b && (q(b, '.lp-options') || q(b, '.fh-study-actions') || q(b, '.lp-feedback')) ? b : null },
   read: h => {
    const study = !!q(h, '.fh-study-actions'), listen = !!q(h, '.lp-listen-head') && !q(h, '.lp-check-row'), word = text(h, '.lp-word');
    if (word) last.path = word;
    return {kind: study ? 'study' : listen ? 'listen' : 'quiz', question: listen ? '' : word || last.path || '', answer: '', expected: ''};
   }},
  {id: 'player',
   find: d => { const e = q(d, '.cp-q, .cp-word'); return e ? e.parentElement : null },
   read: h => {
    const study = !!q(h, '.cp-word'), listen = !!q(h, '.cp-big'), answered = !!q(h, '.cp-feedback'), right = text(h, '.cp-opt.is-right');
    return {kind: study ? 'study' : listen ? 'listen' : 'quiz', question: study ? [text(h, '.cp-word'), text(h, '.cp-tr')].filter(Boolean).join(' — ') : listen ? '' : text(h, '.cp-q'),
     answer: answered ? text(h, '.cp-opt.is-wrong') || right : '', expected: answered ? right : ''};
   }},
 ];

 function style() {
  if (document.getElementById('lesson-help-style')) return;
  const s = document.createElement('style'); s.id = 'lesson-help-style';
  s.textContent = '.lesson-help-row{display:flex;justify-content:center;margin:12px 0 4px}.lesson-help{min-height:44px;min-width:44px;padding:8px 16px;border-radius:999px;border:2px solid currentColor;background:transparent;color:inherit;font:inherit;font-weight:800;cursor:pointer}.lesson-help:focus-visible{outline:3px solid #1a73e8;outline-offset:2px}';
  document.head.appendChild(s);
 }

 function open(screen, host) {
  const ex = screen.read(host), ctx = {};
  for (const k of ['kind', 'lesson', 'question', 'answer', 'expected']) if (ex[k]) ctx[k] = ex[k];
  globalThis.lexiOpen('lesson', ctx);
 }

 function scan() {
  if (typeof globalThis.lexiOpen !== 'function') return;
  const lang = document.documentElement.lang;
  for (const screen of SCREENS) {
   const host = screen.find(document);
   if (!host || host.querySelector('.lesson-help-row')) continue;
   style();
   const row = document.createElement('div'), b = document.createElement('button');
   row.className = 'lesson-help-row'; b.type = 'button'; b.className = 'lesson-help'; b.textContent = LABEL[lang] || LABEL.uk;
   b.addEventListener('click', () => open(screen, host));
   row.appendChild(b); host.appendChild(row);
  }
 }

 let queued = false;
 const schedule = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; try { scan() } catch (e) {} }) };
 new MutationObserver(schedule).observe(document.documentElement, {childList: true, subtree: true});
 schedule();
 globalThis.LerenLessonHelp = {scan, SCREENS, LABEL};
})();
