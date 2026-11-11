// TEST-017: speech-to-text worker (tools/stt-worker.js) with a mocked Workers AI binding.
const assert = require("assert");
const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  const mod = await import(pathToFileURL(path.join(__dirname, "..", "tools", "stt-worker.js")).href);
  const worker = mod.default;
  const ORIGIN = "https://lerenbe.com";
  const audio = new Uint8Array(4000).fill(7);
  const req = (opts = {}) => new Request("https://leren-stt.example/" + (opts.qs || "?ui=uk&target=nl"), {
    method: opts.method || "POST",
    headers: { "Origin": opts.origin ?? ORIGIN, "Content-Type": opts.type || "audio/webm", "CF-Connecting-IP": "1.2.3.4" },
    body: (opts.method || "POST") === "POST" ? (opts.body || audio) : undefined
  });
  const ai = (answers) => { const calls = []; return { calls, run: async (model, input) => { calls.push({ model, input }); const a = answers[Math.min(calls.length - 1, answers.length - 1)]; if (a instanceof Error) throw a; return a; } }; };

  // preflight
  let r = await worker.fetch(req({ method: "OPTIONS" }), {});
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("Access-Control-Allow-Origin"), ORIGIN);

  // foreign origin and GET are refused
  r = await worker.fetch(req({ origin: "https://evil.example" }), { AI: ai([{ text: "x" }]) });
  assert.equal(r.status, 403);

  // no AI binding -> off
  r = await worker.fetch(req(), {});
  assert.equal(r.status, 503);

  // wrong content type, too small
  r = await worker.fetch(req({ type: "text/plain" }), { AI: ai([{ text: "x" }]) });
  assert.equal(r.status, 415);
  r = await worker.fetch(req({ body: new Uint8Array(10) }), { AI: ai([{ text: "x" }]) });
  assert.equal(r.status, 400);

  // Ukrainian detected directly: one call, auto language, Cyrillic text returned unchanged
  let env = { AI: ai([{ text: "  Привіт,  як твої справи? ", transcription_info: { language: "uk" } }]) };
  r = await worker.fetch(req(), env);
  let j = await r.json();
  assert.equal(r.status, 200);
  assert.deepEqual(j, { text: "Привіт, як твої справи?", lang: "uk" });
  assert.equal(env.AI.calls.length, 1);
  assert.equal(env.AI.calls[0].input.language, undefined, "first pass must auto-detect");
  assert.equal(env.AI.calls[0].input.audio, Buffer.from(audio).toString("base64"));

  // Dutch detected: kept as is
  env = { AI: ai([{ text: "Hoe gaat het?", transcription_info: { language: "nl" } }]) };
  j = await (await worker.fetch(req(), env)).json();
  assert.deepEqual(j, { text: "Hoe gaat het?", lang: "nl" });

  // Russian label for Ukrainian speech -> second pass forced to Ukrainian
  env = { AI: ai([{ text: "Привет", transcription_info: { language: "ru" } }, { text: "Привіт", transcription_info: { language: "uk" } }]) };
  j = await (await worker.fetch(req(), env)).json();
  assert.deepEqual(j, { text: "Привіт", lang: "uk" });
  assert.equal(env.AI.calls[1].input.language, "uk");

  // Afrikaans label for short Dutch -> second pass in Dutch
  env = { AI: ai([{ text: "Hoe gaan dit", transcription_info: { language: "af" } }, { text: "Hoe gaat het", transcription_info: { language: "nl" } }]) };
  j = await (await worker.fetch(req(), env)).json();
  assert.equal(j.lang, "nl");

  // unrelated language is not forced
  env = { AI: ai([{ text: "Hola", transcription_info: { language: "es" } }]) };
  j = await (await worker.fetch(req(), env)).json();
  assert.deepEqual(j, { text: "Hola", lang: "es" });
  assert.equal(env.AI.calls.length, 1);

  // silence and model errors
  r = await worker.fetch(req(), { AI: ai([{ text: "   ", transcription_info: { language: "uk" } }]) });
  assert.equal(r.status, 422);
  r = await worker.fetch(req(), { AI: ai([new Error("boom")]) });
  assert.equal(r.status, 502);

  // rate limit
  r = await worker.fetch(req(), { AI: ai([{ text: "x" }]), STT_LIMIT: { limit: async () => ({ success: false }) } });
  assert.equal(r.status, 429);

  // unknown query params fall back to safe defaults
  env = { AI: ai([{ text: "Привет", transcription_info: { language: "ru" } }, { text: "Привіт" }]) };
  j = await (await worker.fetch(req({ qs: "?ui=xx&target=zz" }), env)).json();
  assert.equal(j.lang, "uk");

  console.log("stt-worker: all checks passed");
})().catch((e) => { console.error(e); process.exit(1); });
