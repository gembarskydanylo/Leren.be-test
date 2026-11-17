// TEST-027 · app/index.html: every script is announced with <link rel="preload" as="script"> right after the CSP.
// A <meta> Content-Security-Policy turns off Chrome's preload scanner for <script> tags, so without these hints the 53
// scripts loaded one after another: on slow 4G (Chromium emulation, HTTP/2 + gzip like GitHub Pages) the first screen came
// after 12.9 s, with the hints after 6.8 s. The CSP stays (it keeps the test snapshot away from production services) and
// stays first: the hints come after it, so it checks them too. A hint with another ?v= would download a file twice and a
// missing hint brings the waterfall back — so the two lists must be equal, in the same order.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname, '..', 'app', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g)].map(m => m[1]);
const hints = [...html.matchAll(/<link rel="preload" as="script" href="([^"]+)">/g)].map(m => m[1]);
assert(scripts.length > 40, 'scripts found: ' + scripts.length);
assert.deepEqual(hints, scripts, 'preload hints = <script src> list (same files, same ?v=, same order)');
const csp = html.indexOf('http-equiv="Content-Security-Policy"'), first = html.indexOf('<link rel="preload" as="script"');
assert(csp > 0 && csp < first, 'the CSP comes first and also applies to the hints');
assert(html.indexOf('<link rel="preload" as="script"', html.indexOf('</head>')) < 0, 'hints are in <head>');
assert(!/<link rel="preload" as="script" href="https?:/.test(html), 'no external preload');
console.log('PASS: ' + hints.length + ' script preload hints after the CSP = the <script src> list (no waterfall, no double download)');
