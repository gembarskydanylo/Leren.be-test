#!/usr/bin/env node
// TEST-034 · Local test server for Lexi on a computer or a phone over USB (adb reverse tcp:8765 tcp:8765).
//   node tools/lexi-test-server.cjs                      → app on http://localhost:8765/app/ ; Lexi demo: /app/?lexi=demo
//   LEXI_TEST_WORKER=https://leren-ai-test.<account>.workers.dev/ node tools/lexi-test-server.cjs
//                                                        → also real AI through the SEPARATE test Worker (docs/LEXI-TEST-WORKER.md)
// Why a proxy: the app's CSP allows network requests to its own origin only (connect-src 'self'), and the app accepts a
// custom AI endpoint on localhost only. The server forwards POST /lexi-test-ai/ to the test Worker, so the app, its CSP
// and the production endpoint stay unchanged. It refuses any Worker that is not a "leren-ai-test" one.
// http://localhost:8765/lexi-test.html switches this browser to the test Worker (and ?off switches back).
'use strict';
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const ROOT = path.resolve(__dirname, '..'), PORT = Number(process.env.PORT || 8765), ORIGIN = 'http://localhost:' + PORT;
const WORKER = process.env.LEXI_TEST_WORKER || '';
const TEST_WORKER = /^https:\/\/leren-ai-test\.[a-z0-9-]+\.workers\.dev\/?$/;
if (WORKER && !TEST_WORKER.test(WORKER)) { console.error('LEXI_TEST_WORKER must be the test Worker https://leren-ai-test.<account>.workers.dev/ — never the production leren-ai'); process.exit(1) }
const TYPES = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.m4a': 'audio/mp4', '.mp3': 'audio/mpeg', '.txt': 'text/plain'};
const SWITCH = `<!doctype html><html lang="uk"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Lexi test</title>
<body style="font:18px system-ui;margin:24px;line-height:1.5"><h1>Lexi · тест</h1><p id="s"></p><p><a href="/app/" style="font-size:20px">Відкрити застосунок →</a></p>
<script>const off=location.search.includes('off');try{if(off)localStorage.removeItem('leren_ai_endpoint');else localStorage.setItem('leren_ai_endpoint',JSON.stringify(location.origin+'/lexi-test-ai/'))}catch(e){}
document.getElementById('s').textContent=off?'Тестовий AI вимкнено для цього браузера.':'Цей браузер надсилатиме запити Lexi на тестовий Worker${WORKER ? '' : ' (зараз не налаштований: сервер відповідатиме «off»)'}. Вимкнути: /lexi-test.html?off';</script></body></html>`;

async function proxy(req, res) {
 const send = (status, obj) => { res.writeHead(status, {'content-type': 'application/json'}); res.end(JSON.stringify(obj)) };
 if (req.method !== 'POST') return send(405, {error: 'forbidden'});
 if (req.headers.origin && req.headers.origin !== ORIGIN) return send(403, {error: 'forbidden'}); // only the app on this server
 let size = 0; const parts = [];
 for await (const c of req) { size += c.length; if (size > 64000) return send(413, {error: 'too big'}); parts.push(c) }
 if (!WORKER) return send(503, {error: 'off'});
 try {
  const r = await fetch(WORKER, {method: 'POST', body: Buffer.concat(parts), signal: AbortSignal.timeout(35000),
   headers: {'content-type': 'application/json', origin: ORIGIN, ...(req.headers['x-leren-device'] ? {'x-leren-device': String(req.headers['x-leren-device'])} : {})}});
  const text = await r.text(), h = {'content-type': 'application/json'}; if (r.headers.get('retry-after')) h['retry-after'] = r.headers.get('retry-after');
  console.log(new Date().toISOString().slice(11, 19), 'AI', r.status, r.headers.get('x-leren-ai') || '');
  res.writeHead(r.status, h); res.end(text);
 } catch (e) { console.log('AI proxy', e.name); send(e.name === 'TimeoutError' ? 504 : 502, {error: e.name === 'TimeoutError' ? 'timeout' : 'network'}) }
}

const server = http.createServer((req, res) => {
 const u = new URL(req.url, ORIGIN);
 if (u.pathname === '/lexi-test-ai/') return void proxy(req, res);
 if (u.pathname === '/lexi-test.html') { res.writeHead(200, {'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store'}); return res.end(SWITCH) }
 if (u.pathname === '/' || u.pathname === '/app') { res.writeHead(302, {location: '/app/' + u.search}); return res.end() }
 let f; try { f = path.join(ROOT, decodeURIComponent(u.pathname)) } catch { res.writeHead(400); return res.end() }
 if (!f.startsWith(path.join(ROOT, 'app') + path.sep)) { res.writeHead(404); return res.end() } // only the app is served, not the repo
 if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
 if (!fs.existsSync(f)) { res.writeHead(404); return res.end() }
 res.writeHead(200, {'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-cache'});
 fs.createReadStream(f).pipe(res);
});
server.listen(PORT, '127.0.0.1', () => {
 console.log(`LerenBe test server: ${ORIGIN}/app/   Lexi demo: ${ORIGIN}/app/?lexi=demo`);
 console.log(WORKER ? `Real AI through the TEST Worker ${WORKER} — open ${ORIGIN}/lexi-test.html once in the browser` : 'No test Worker (LEXI_TEST_WORKER not set): only the demo answers');
 console.log('Phone over USB: adb reverse tcp:' + PORT + ' tcp:' + PORT);
});
module.exports = server;
