// TEST-043 · tiny static server + Chromium page for the audits and tests of TEST-043 (local only, no network beyond 127.0.0.1).
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const repo = path.join(__dirname, '..', '..');
const T = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
 '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.m4a': 'audio/mp4', '.woff2': 'font/woff2', '.tsv': 'text/plain'};
function serve() {
 return new Promise(res => {
  const srv = http.createServer((q, r) => {
   let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
   const f = path.join(repo, p); if (!f.startsWith(repo)) { r.writeHead(403); return r.end() }
   fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end() } r.writeHead(200, {'Content-Type': T[path.extname(f)] || 'application/octet-stream'}); r.end(b) });
  });
  srv.listen(0, '127.0.0.1', () => res({srv, base: 'http://localhost:' + srv.address().port}));
 });
}
// Block everything that is not this local server (no Firebase, no AI Worker, no fonts from the internet).
async function browser(opts = {}) {
 const {chromium} = require('playwright');
 const b = await chromium.launch(), {srv, base} = await serve();
 const ctx = await b.newContext({serviceWorkers: 'block', ...opts});
 await ctx.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
 return {b, ctx, base, close: async () => { await b.close(); srv.close() }};
}
module.exports = {repo, serve, browser};
