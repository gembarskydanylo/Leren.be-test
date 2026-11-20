// TEST-041 · PROTOTYPE, NOT USED ANYWHERE: verification of a Firebase App Check token as the Lexi worker could do it later.
// tools/ai-worker.js does not import this file; nothing in Firebase, Cloudflare, CORS or CSP is changed. The rollout plan
// is in docs/APPCHECK-PLAN.md. Pure Web Crypto (works in Cloudflare Workers and Node 20+), no dependencies, no network
// unless `getJwks` fetches the public keys.
//
// verifyAppCheck(token, {projectNumber, projectId, appIds?, getJwks, now?}) → {ok:true, appId} | {ok:false, reason}
// reasons: missing, malformed, alg, kid, signature, issuer, audience, app, expired, future
export const JWKS_URL = 'https://firebaseappcheck.googleapis.com/v1/jwks';
const b64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
const json = s => JSON.parse(new TextDecoder().decode(b64u(s)));

export async function verifyAppCheck(token, {projectNumber, projectId, appIds = null, getJwks, now = Date.now()}) {
 if (typeof token !== 'string' || !token) return {ok: false, reason: 'missing'};
 if (token.length > 4096) return {ok: false, reason: 'malformed'};
 const parts = token.split('.'); if (parts.length !== 3) return {ok: false, reason: 'malformed'};
 let head, claims; try { head = json(parts[0]); claims = json(parts[1]) } catch { return {ok: false, reason: 'malformed'} }
 if (head.alg !== 'RS256' || head.typ !== 'JWT') return {ok: false, reason: 'alg'}; // never "none" or HS256
 const keys = (await getJwks())?.keys || [], jwk = keys.find(k => k.kid === head.kid && k.kty === 'RSA');
 if (!jwk) return {ok: false, reason: 'kid'};
 let valid = false;
 try {
  const key = await crypto.subtle.importKey('jwk', {kty: 'RSA', n: jwk.n, e: jwk.e, alg: 'RS256', ext: true}, {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'}, false, ['verify']);
  valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64u(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
 } catch { valid = false }
 if (!valid) return {ok: false, reason: 'signature'};
 if (claims.iss !== 'https://firebaseappcheck.googleapis.com/' + projectNumber) return {ok: false, reason: 'issuer'};
 const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
 if (!aud.includes('projects/' + projectNumber) && !aud.includes('projects/' + projectId)) return {ok: false, reason: 'audience'};
 if (appIds && !appIds.includes(claims.sub)) return {ok: false, reason: 'app'};
 const t = Math.floor(now / 1000);
 if (!Number.isFinite(claims.exp) || claims.exp <= t) return {ok: false, reason: 'expired'};
 if (Number.isFinite(claims.iat) && claims.iat > t + 300) return {ok: false, reason: 'future'};
 return {ok: true, appId: claims.sub};
}

// Public keys cached in the isolate for 6 h (Firebase rotates them rarely; a failed fetch keeps the old set).
export function jwksCache(fetchFn = fetch, ttl = 6 * 3600e3) {
 let keys = null, at = 0;
 return async () => {
  if (keys && Date.now() - at < ttl) return keys;
  try { const r = await fetchFn(JWKS_URL); if (r.ok) { keys = await r.json(); at = Date.now() } } catch {}
  return keys || {keys: []};
 };
}
