// Leren.be speech-to-text worker ("leren-stt").
// The AI chat records the learner's voice and sends it here. Whisper (Cloudflare Workers AI)
// detects the language itself, so the learner can speak Ukrainian (or another own language)
// and Dutch / English / French without a language switch. The audio is transcribed and
// thrown away: nothing is stored or logged.
//
// Deploy (separate from the shared "leren-ai" worker, so production is not touched):
//   npx wrangler deploy -c tools/wrangler-stt.toml
// Local test: npx wrangler dev -c tools/wrangler-stt.toml  (then localStorage.leren_stt_endpoint="http://localhost:8787")

const STT_VERSION = "2026-11-11-whisper-auto-v1"; // bump on every change: shows in the X-Leren-STT response header
const MODEL = "@cf/openai/whisper-large-v3-turbo";
const ALLOWED_ORIGINS = ["https://lerenbe.com", "https://www.lerenbe.com", "https://gembarskydanylo.github.io", "http://localhost:8765"];
const MAX_BYTES = 2_000_000; // about 60 s of opus voice
const UI_LANGS = ["uk", "en", "fr", "ar"];
const TARGETS = ["nl", "en", "fr", "de"];
// Whisper sometimes labels short Ukrainian speech as Russian or Belarusian, and short Dutch
// as Afrikaans or German. If the detected language is neither the interface language nor the
// studied language, the audio is transcribed again in the closest of the two.
const NEAR = { ru: "uk", be: "uk", pl: "uk", af: "nl", de: "nl", fy: "nl", li: "nl" };

function base64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

async function visitorKey(secret, value) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode("stt:" + value)));
  return Array.from(mac.slice(0, 12), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function pickRetry(detected, ui, target) {
  if (!detected || detected === ui || detected === target) return "";
  const near = NEAR[detected];
  if (near && (near === ui || near === target)) return near;
  return "";
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const cors = { "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0], "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, X-Leren-Device", "Vary": "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json", "X-Leren-STT": STT_VERSION } });
    if (req.method !== "POST" || !ALLOWED_ORIGINS.includes(origin)) return json({ error: "forbidden" }, 403);
    if (env.STT_OFF === "1" || !env.AI) return json({ error: "off" }, 503);

    if (env.STT_LIMIT) {
      const ip = await visitorKey(env.RATE_SALT || "leren-stt", req.headers.get("CF-Connecting-IP") || "x");
      let ok = false;
      try { ok = (await env.STT_LIMIT.limit({ key: ip })).success; } catch (e) { console.log("limiter", String(e)); }
      if (!ok) return json({ error: "slow", retry_after: 60 }, 429);
    }

    if (Number(req.headers.get("Content-Length") || 0) > MAX_BYTES) return json({ error: "too big" }, 413);
    const type = (req.headers.get("Content-Type") || "").toLowerCase();
    if (!/^audio\//.test(type)) return json({ error: "bad type" }, 415);
    let bytes;
    try { bytes = new Uint8Array(await req.arrayBuffer()); } catch { return json({ error: "bad body" }, 400); }
    if (bytes.length > MAX_BYTES) return json({ error: "too big" }, 413);
    if (bytes.length < 800) return json({ error: "empty" }, 400);

    const url = new URL(req.url);
    const ui = UI_LANGS.includes(url.searchParams.get("ui")) ? url.searchParams.get("ui") : "uk";
    const target = TARGETS.includes(url.searchParams.get("target")) ? url.searchParams.get("target") : "nl";
    const audio = base64(bytes);
    try {
      let r = await env.AI.run(MODEL, { audio, task: "transcribe", vad_filter: true });
      let lang = r?.transcription_info?.language || "";
      const retry = pickRetry(lang, ui, target);
      if (retry) {
        r = await env.AI.run(MODEL, { audio, task: "transcribe", vad_filter: true, language: retry });
        lang = retry;
      }
      const text = String(r?.text || "").replace(/\s+/g, " ").trim().slice(0, 300);
      if (!text) return json({ error: "no-speech" }, 422);
      // Log only sizes and languages: never the audio or the words.
      console.log("STT " + JSON.stringify({ bytes: bytes.length, lang, retried: !!retry, chars: text.length }));
      return json({ text, lang });
    } catch (e) {
      console.log("stt", String(e).slice(0, 200));
      return json({ error: "stt" }, 502);
    }
  }
};
