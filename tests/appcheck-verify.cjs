// TEST-041 · App Check token verification prototype (tools/appcheck-verify.mjs) with locally generated keys: no Firebase,
// no network, nothing deployed. Also guards that the worker does not use the prototype yet (no silent activation).
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), {webcrypto: wc} = require('node:crypto');
const root = path.join(__dirname, '..');
const b64u = b => Buffer.from(b).toString('base64url');
(async () => {
 const {verifyAppCheck, jwksCache} = await import(path.join(root, 'tools/appcheck-verify.mjs'));
 const gen = () => wc.subtle.generateKey({name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256'}, true, ['sign', 'verify']);
 const pair = await gen(), other = await gen(), pub = {...(await wc.subtle.exportKey('jwk', pair.publicKey)), kid: 'k1'};
 const JWKS = {keys: [pub]}, getJwks = async () => JWKS, now = Date.UTC(2026, 10, 20, 12), t = now / 1000;
 const P = {projectNumber: '533895640416', projectId: 'leren-be', appIds: ['1:533895640416:web:770d52f1926e13a186da05'], getJwks, now};
 const sign = async (claims, {key = pair.privateKey, head = {alg: 'RS256', typ: 'JWT', kid: 'k1'}} = {}) => {
  const data = b64u(JSON.stringify(head)) + '.' + b64u(JSON.stringify(claims));
  return data + '.' + b64u(await wc.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(data)));
 };
 const good = {iss: 'https://firebaseappcheck.googleapis.com/533895640416', aud: ['projects/533895640416', 'projects/leren-be'], sub: P.appIds[0], iat: t - 60, exp: t + 3600};
 const r = async (tok, o = {}) => (await verifyAppCheck(tok, {...P, ...o})).reason || 'ok';
 assert.equal(await r(await sign(good)), 'ok', 'valid token');
 assert.equal(await r(''), 'missing'); assert.equal(await r(undefined), 'missing');
 assert.equal(await r('a.b'), 'malformed'); assert.equal(await r('x'.repeat(5000)), 'malformed'); assert.equal(await r('###.###.###'), 'malformed');
 assert.equal(await r(await sign(good, {head: {alg: 'none', typ: 'JWT', kid: 'k1'}})), 'alg', 'alg none refused');
 assert.equal(await r(await sign(good, {head: {alg: 'HS256', typ: 'JWT', kid: 'k1'}})), 'alg', 'HS256 refused');
 assert.equal(await r(await sign(good, {head: {alg: 'RS256', typ: 'JWT', kid: 'nope'}})), 'kid', 'unknown key id');
 assert.equal(await r(await sign(good, {key: other.privateKey})), 'signature', 'forged signature');
 const tok = await sign(good), [h, , s] = tok.split('.');
 assert.equal(await r(h + '.' + b64u(JSON.stringify({...good, exp: t + 99999})) + '.' + s), 'signature', 'edited claims');
 assert.equal(await r(await sign({...good, iss: 'https://firebaseappcheck.googleapis.com/999'})), 'issuer', 'other project');
 assert.equal(await r(await sign({...good, aud: ['projects/999']})), 'audience');
 assert.equal(await r(await sign({...good, sub: '1:999:web:x'})), 'app', 'other app id');
 assert.equal(await r(await sign({...good, exp: t - 1})), 'expired');
 assert.equal(await r(await sign({...good, iat: t + 3600})), 'future');
 assert.equal(await r(await sign(good), {getJwks: async () => ({keys: []})}), 'kid', 'no public keys → refused, never accepted');
 // key cache: one fetch for many checks, a failed refresh keeps the last good keys
 let calls = 0, fail = false; const fetchFn = async () => { calls++; if (fail) throw new Error('down'); return {ok: true, json: async () => JWKS} };
 const cache = jwksCache(fetchFn, 1000); await cache(); await cache(); assert.equal(calls, 1, 'cached');
 const stale = jwksCache(fetchFn, -1); await stale(); fail = true; assert.deepEqual(await stale(), JWKS, 'failed refresh keeps the keys');
 // not active: the worker does not import the prototype and allows no App Check header (production CORS unchanged)
 const worker = fs.readFileSync(path.join(root, 'tools/ai-worker.js'), 'utf8');
 assert.doesNotMatch(worker, /appcheck-verify|X-Firebase-AppCheck/i, 'App Check is not wired into the worker');
 assert.match(worker, /"Access-Control-Allow-Headers": "Content-Type, X-Leren-Device"/, 'worker CORS headers unchanged');
 console.log('PASS: App Check prototype — valid token; missing / malformed / alg none / HS256 / unknown kid / forged / edited / other project / audience / app / expired / future refused; key cache; NOT wired into the worker');
})().catch(e => { console.error('FAIL:', e.message); process.exit(1) });
