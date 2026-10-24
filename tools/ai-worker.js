// Leren.be — "Praat met Peter / Dafna" AI tutor proxy (Cloudflare Worker). Keeps API keys off the website.
// Deploy: automatic — every push to main that changes this file runs .github/workflows/deploy-worker.yml (wrangler.toml).
// Choose ONE provider with the variable PROVIDER:
//   "anthropic"  — Claude (best Dutch + Ukrainian explanations). Secret ANTHROPIC_KEY. Optional MODEL (default claude-haiku-5-5).
//   "gemini"     — Google Gemini PAID tier (the free tier may not be used for apps serving EU users). Secret GEMINI_KEY. Optional MODEL.
//   "workers-ai" — Cloudflare Workers AI (free daily allowance). Add a Workers AI binding named AI. Optional MODEL.
// Optional: KV binding RATE (daily limit per visitor, DAILY_LIMIT default 60 messages).
//
// Request:  {mode: "chat"|"ask"|"memo", target: "nl"|"en"|"fr", lang: UI language, level, scene, char, profile, memory, messages: [{role, content}]}
// Response: chat → {reply, reply_nl, translation, correction|null}
//           ask  → {answer, examples: [{lang, text, translation}]}
//           memo → {memory}   (updated notes about the learner; the app keeps them on the device)
//           report → {ok}     (a learner flagged an AI answer; logged to Workers Logs for review)
const WORKER_VERSION = "2026-10-23-a1-parts"; // bump on every change: shows in the X-Leren-AI response header after a deploy
const ALLOWED_ORIGINS = ["https://gembarskydanylo.github.io", "https://lerenbe.com", "https://www.lerenbe.com", "http://localhost:8765"];
const LANG = {uk: "Ukrainian", en: "English", fr: "French", ar: "Arabic"};
const SCENES = {
  cafe: "You are a barista in a Flemish café. The learner orders a drink, chooses milk/size and pays.",
  super: "You work in a Belgian supermarket. The learner asks where products are, asks prices, loyalty card.",
  huisarts: "You are the GP's assistant (huisarts). The learner explains symptoms (keelpijn, koorts, hoest); you ask since when and give simple advice.",
  apotheek: "You are a pharmacist. The learner asks for something against pain/cold; you ask about symptoms and explain dosage simply.",
  gemeente: "You work at the gemeente (town hall). The learner changes address; you ask for ID card and new address; mention the wijkagent visit.",
  station: "You sell train tickets at a Belgian station. The learner buys a ticket (enkel / heen en terug), you give price, time and platform (spoor).",
  buren: "You are the learner's new Flemish neighbour. Small talk: names, where from, how long here, invite for coffee."
};
// Condensed curricula (from the Leren.be knowledge base) used to ground corrections.
const GRAMMAR_NL = `- Main clause: verb in 2nd position (Ik woon in België). After a time/place word first: inversion (Om zeven uur sta ik op).
- Present tense: ik + stem (ik werk, ik woon, ik sta), jij/hij/zij + stem+t (jij werkt, hij woont); no -t when jij comes after the verb (Werk jij?). wij/jullie/zij + infinitive (wij werken).
- Long vowel written double in closed syllable: slapen → ik slaap; double consonant becomes single: zwemmen → ik zwem; z→s, v→f at the end of the stem: lezen → ik lees, geven → ik geef; stem on d + t = dt (hij vindt).
- zijn: ik ben, jij bent, u bent, hij/zij is, wij zijn. hebben: ik heb, jij hebt, u heeft, hij heeft, wij hebben.
- Separable verbs: the particle goes to the end (opstaan → Ik sta om zeven uur op; meenemen → Ik neem een paraplu mee).
- Negation: geen before an indefinite noun (Ik heb geen auto), niet otherwise (Ik werk niet).
- Questions: question word + verb + subject (Waar woon jij?); yes/no: verb first (Woon jij in Gent?).
- Articles: de/het must be learned with the noun (het station, het huis, de winkel, de apotheek); diminutives -je are het.
- Polite: u (formal), alstublieft / alsjeblieft, graag (Ik wil graag een koffie).
- Course A1.1 (first part of A1): introductions, personal details, prices/weather, time, birthdays, opening hours, forms, daily routine, invitations/plans, health, eating habits, groceries. Include possessives, inversion, niet/geen, separable verbs, modal verbs + infinitive, gaan + infinitive, aan het + infinitive, want/omdat, imperatives, frequency and plurals.
- Course A1.2 (second part of A1, NOT A2): family/holiday accounts, shopping and exchanges, second-hand ads, travel disruptions, online appointments, messages and short articles/instructions. Practise perfectum (hebben/zijn + participle), common past forms, comparisons and connected explanations. Use the current course scope; do not introduce perfectum to 1.1 unless the learner asks.`;
const GRAMMAR_EN = `- Word order: subject + verb + object (I live in Belgium). Questions with do/does (Do you work? Where does she live?); with be/can: invert (Are you tired? Can you help?).
- Present simple: he/she/it + -s (she works, he goes, it has); negative don't/doesn't + base verb.
- be: I am, you are, he/she/it is, we/they are. have got / has got.
- Present continuous for now: I am working. Past simple: worked, went, was/were.
- Articles: a/an (a car, an apple), the; no article for general plurals (I like dogs).
- Plurals: -s/-es, irregular (children, people, men, women).
- Polite: please, thank you, Could I have…? I'd like…`;
const GRAMMAR_FR = `- Word order: sujet + verbe + complément (J'habite en Belgique). Questions: est-ce que…? or intonation (Tu travailles ?); formal inversion (Où habitez-vous ?).
- Present tense: -er verbs (je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent); être (je suis, tu es, il est, nous sommes, vous êtes, ils sont), avoir (j'ai, tu as, il a, nous avons, vous avez, ils ont), aller, faire.
- Gender: le/la/l', un/une; adjectives agree (un petit café, une petite maison). Plural les/des.
- Negation: ne … pas (Je ne travaille pas); de after negation (Je n'ai pas de voiture).
- Polite: vous (formal), s'il vous plaît, je voudrais…
- Belgian usage: septante (70), nonante (90); déjeuner = lunch in BE is 'dîner', breakfast 'déjeuner'.
- A1+: passé composé (j'ai travaillé, je suis allé), futur proche (je vais manger).`;
const TARGET = {
  nl: {name: "Dutch as spoken in Belgium (nl-BE, Flemish)", grammar: GRAMMAR_NL, place: "everyday life in Belgium (family, work, CVO school, shopping, weather, hobbies, transport)"},
  en: {name: "English (British spelling)", grammar: GRAMMAR_EN, place: "everyday life (family, work, school, shopping, weather, hobbies, travel)"},
  fr: {name: "French as spoken in Belgium (fr-BE)", grammar: GRAMMAR_FR, place: "everyday life in Belgium (famille, travail, école, courses, météo, loisirs, transports)"}
};
const PERSONA = {
  peter: "Peter, a calm, friendly Flemish language teacher of about 50 with a gentle sense of humour; you explain rules simply, like on a whiteboard",
  dafna: "Dafna, a warm, cheerful young Flemish woman and language coach"
};
const SAFETY = `- Be encouraging. Do not give medical, legal or financial decisions; in such cases teach the words and suggest a professional.
- Never ask for or repeat passwords, national register numbers, bank or card numbers. Refuse unsafe or adult topics kindly and return to the lesson.`;

function chatSystem(t, lang, level, scene, char, extra = "") {
  const T = TARGET[t] || TARGET.nl, L = LANG[lang] || "Ukrainian";
  const sceneText = t === "nl" && scene && SCENES[scene] ? "Role-play situation: " + SCENES[scene] : "Free conversation about " + T.place + ".";
  return `You are ${PERSONA[char] || PERSONA.peter}. You help an adult ${level === "a12" ? "course A1.2 / A1" : "course A1.1 / A1"} learner practise ${T.name} by chatting. You are an AI tutor, not a human. The learner's own language is ${L}.
${sceneText}
Course grammar (follow it when correcting):
${T.grammar}
Rules:
- reply: very simple ${T.name}, max 2 short sentences, common words; continue the conversation and ask exactly ONE simple question. Always write reply in the target language, even if the learner writes in another language.
- translation: complete translation of reply into ${L}; every word translated, no Dutch, English or French words left (names excepted).
- learner_in_target: the learner's last message rendered in correct, natural target language with exactly the same meaning; if the learner wrote in their own language, this is the translation they should learn.
- Understand the learner's message exactly (also when written in ${L}): react to its real meaning, keep its time (tomorrow ≠ today), negation and reasons; never change what they said.
- correction: set has_error true only if the learner's LAST message has a real mistake (grammar, word order, wrong word) or is not in the target language; then original = their text, corrected = a natural sentence in the target language, explanation = one short sentence explaining the rule, written in ${L} (never in the target language). Correct at most the 1–2 most important errors. Never invent errors. If there is no mistake: has_error false and empty strings.
${extra}- Stay on language practice. If the learner asks about something unrelated to learning languages, say in reply (in the target language, very simply) that you only help with language practice and steer back.
${SAFETY}
LANGUAGE RULE: "reply" and "corrected" are in the target language and use only Latin letters (write names in Latin script, e.g. Danylo, never mixed with Cyrillic); "translation" and "explanation" are ALWAYS in ${L}, never in Dutch, English or French unless ${L} is that language.`;
}

function askSystem(t, lang, level, char, extra = "") {
  const T = TARGET[t] || TARGET.nl, L = LANG[lang] || "Ukrainian";
  return `You are ${PERSONA[char] || PERSONA.peter}, the language tutor inside the Leren.be app. You are an AI tutor, not a human. You always talk to the learner in ${L}. The learner is an adult beginner (${level === "a12" ? "course A1.2 / A1" : "course A1.1 / A1"}) who is studying ${T.name}; the app also teaches Dutch (nl-BE), English and French.
Your ONLY job is helping the learner learn Dutch, English or French: grammar, vocabulary and word meanings, translation of words and short phrases, pronunciation tips, spelling, de/het and le/la, verb forms, example sentences, short practice exercises or quizzes on request, study tips, and the culture behind everyday language (greetings, politeness, Belgian expressions).
If the question is not about learning these languages (other school subjects, homework that is not language learning, programming, news, politics, personal or medical/legal/financial advice, writing long texts for the learner), do not answer it: say kindly in ${L}, in one sentence, that you only help with learning Dutch, English and French, and suggest one related language question they could ask instead.
Grammar notes for ${T.name} (keep explanations consistent with them):
${T.grammar}
Answer format:
- answer: ALWAYS written in ${L}, also when you decline a question; short and simple (max about 120 words), beginner-friendly, no tables, no markdown headings; you may use line breaks and "•" bullets. Put words in the studied language in «guillemets».
- examples: 0–3 short example sentences that illustrate the answer; lang is the language of the example (nl, en or fr), text is the sentence, translation is its ${L} translation. Use [] when examples do not help (for example when declining an off-topic question).
- If the learner asks for an exercise, give one or two short tasks in answer and put the solutions at the end after "→".
- STUDY METHOD ON PAPER ("Korean method"): when the learner asks how to learn or memorise verbs, verb forms or new words (or asks for a study method or tip), explain this paper method, enthusiastic and simple, as 4 numbered steps (for this answer up to about 200 words are allowed):
  1. Preparation: take an ordinary A4 sheet and a pen.
  2. First column: write the verbs in the infinitive with the translation in ${L} (infinitive — translation), one verb per line.
  3. Next columns: fold the sheet lengthwise like an accordion into 3–4 strips; in each strip write another form of the same verb on the same line${t === "nl" ? " (present «ik …», imperfectum, perfectum «ik heb/ben …»)" : t === "en" ? " (present, past simple, past participle)" : " (présent «je …», imparfait, passé composé)"}.
  4. Training: fold the form columns back so only the first column is visible, recall each form from memory (out loud), then unfold and check; mark mistakes and repeat them; the place on the page helps visual memory. Then hide the first column and go the other way.
  Always include a visual mini-scheme in answer: a header line and 3–4 lines of real, correct ${T.name} verbs with the columns separated by " | " (e.g. for Dutch: «gaan — ${L === "Ukrainian" ? "йти" : "to go"} | ik ga | ik ging | ik ben gegaan»), followed by one short line showing which columns to fold back. Prefer verbs from the learner profile or the current lesson when available. End with one short motivating sentence and suggest repeating the sheet for 5 minutes a day. examples: 1–3 sentences with these verbs.
${extra}
${SAFETY}
LANGUAGE RULE: the whole "answer" is written in ${L}, including when you decline; only the words you quote in «guillemets» and the example sentences are in Dutch, English or French.`;
}

// Learner profile sent by the app (learning data from the device) + how to read voice input.
function learnerNotes(p, mode, memory) {
  const clean = (s, n) => String(s || "").replace(/[\r\n{}<>]/g, " ").slice(0, n).trim();
  const list = (a, n) => (Array.isArray(a) ? a : []).slice(0, n).map(x => clean(x, 80)).filter(Boolean);
  const lines = [];
  if (p && typeof p === "object") {
    if (p.topic) lines.push(`current lesson topic in the app: ${clean(p.topic, 60)}`);
    if (Number.isFinite(p.learned)) lines.push(`words practised so far: ${Math.max(0, Math.min(100000, Math.round(p.learned)))}`);
    const weak = list(p.weak, 8), mist = list(p.mistakes, 5);
    if (weak.length) lines.push(`words the learner often gets wrong: ${weak.join("; ")}`);
    if (mist.length) lines.push(`sentences the learner recently got corrected: ${mist.join("; ")}`);
  }
  let s = "";
  if (memory) s += `- What you remember about the learner from earlier conversations (your own notes): ${memory}\n  ${mode === "ask" ? "Use it to make explanations and examples personal." : "If you know their name, use it when you greet them; now and then refer naturally to what you know (e.g. ask how things are at their work). Never recite these notes."}\n`;
  if (lines.length) s += `- Learner profile (from the app, may be incomplete): ${lines.join(". ")}. ${mode === "ask" ? "Use it to pick examples that fit the learner." : "Use it to choose topics and words: naturally reuse the weak words and the recently corrected patterns now and then, at the learner's level."} Never list the profile back to the learner.\n`;
  s += `- A user message ending with "[spoken; other possible transcriptions: …]" came from speech recognition and may contain recognition errors: work out what the learner most likely said from all versions. ${mode === "ask" ? "" : "Only correct a grammar or word mistake if every transcription has it; never correct pure recognition errors."}\n`;
  return s;
}

function memoSystem(lang) {
  const L = LANG[lang] || "Ukrainian";
  return `You keep short notes about a language learner so their AI tutor can remember them in the next conversation.
Update the old notes with what the learner said about themselves in the new conversation.
Keep only stable, useful facts the learner told about themselves: name, where they live and where they come from, work or studies, family situation (no names of other people), hobbies and interests, why and for what they learn the language, and recurring language difficulties.
Never keep: health or medical details, religion, political opinions, sexual orientation, exact addresses, phone numbers, e-mail addresses, ID, bank or card numbers, passwords, or anything about other people beyond their relation to the learner. Never invent facts; the tutor's own lines are not facts about the learner. Write the learner's name exactly as they wrote it (keep the Latin spelling, e.g. "Danylo").
Write in ${L}: at most 8 short lines, each starting with "• ", at most 500 characters in total. If there is nothing new, return the old notes unchanged (or an empty string if there are none).`;
}

const STR = {type: "string"};
const TNAME = {uk: {nl: "нідерландською", en: "англійською", fr: "французькою"}, en: {nl: "in Dutch", en: "in English", fr: "in French"},
  fr: {nl: "en néerlandais", en: "en anglais", fr: "en français"}, ar: {nl: "بالهولندية", en: "بالإنجليزية", fr: "بالفرنسية"}};
const SAY_IT = {uk: t => `Ти написав не ${TNAME.uk[t] || TNAME.uk.nl}. Так це звучить ${TNAME.uk[t] || TNAME.uk.nl} — повтори вголос.`,
  en: t => `That wasn't ${TNAME.en[t] || TNAME.en.nl}. This is how to say it ${TNAME.en[t] || TNAME.en.nl} — repeat it out loud.`,
  fr: t => `Ce n'était pas ${TNAME.fr[t] || TNAME.fr.nl}. Voilà comment le dire ${TNAME.fr[t] || TNAME.fr.nl} — répète-le à voix haute.`,
  ar: t => `لم تكتب ${TNAME.ar[t] || TNAME.ar.nl}. هكذا تقولها ${TNAME.ar[t] || TNAME.ar.nl} — كرّرها بصوت عالٍ.`};
const schemaFor = (mode, L) => mode === "memo"
  ? {type: "object", additionalProperties: false, required: ["memory"], properties: {memory: {type: "string", description: `Notes about the learner in ${L}.`}}}
  : mode === "ask"
  ? {type: "object", additionalProperties: false, required: ["answer", "examples"], properties: {
      answer: {type: "string", description: `Written in ${L}.`},
      examples: {type: "array", items: {type: "object", additionalProperties: false, required: ["lang", "text", "translation"],
        properties: {lang: {type: "string", enum: ["nl", "en", "fr"]}, text: STR, translation: {type: "string", description: `Translation into ${L}.`}}}}}}
  : {type: "object", additionalProperties: false, required: ["learner_in_target", "reply", "translation", "correction"], properties: {
      learner_in_target: {type: "string", description: "The learner's LAST message said naturally and correctly in the target language, with exactly the same meaning (keep tense, negation and time words such as tomorrow/yesterday)."},
      reply: {type: "string", description: "In the target language."}, translation: {type: "string", description: `Complete translation of reply into ${L}: translate every word, leave no words in the target language.`},
      correction: {type: "object", additionalProperties: false, required: ["has_error", "original", "corrected", "explanation"],
        properties: {has_error: {type: "boolean"}, original: STR, corrected: STR, explanation: {type: "string", description: `Short rule explanation written in ${L}.`}}}}};

function parseJSON(t) {
  if (!t) return null;
  const m = String(t).match(/\{[\s\S]*\}/);
  try { return JSON.parse(m ? m[0] : t); } catch { return null; }
}
const cut = (s, n) => String(s || "").slice(0, n);
// Replies in Dutch/English/French must be in Latin script: transliterate any Cyrillic the model mixes in (Данило → Danylo).
const TRANSLIT = {а:"a",б:"b",в:"v",г:"h",ґ:"g",д:"d",е:"e",є:"ie",ж:"zh",з:"z",и:"y",і:"i",ї:"i",й:"i",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ь:"",ю:"iu",я:"ia",ы:"y",э:"e",ё:"io",ъ:"","'":"'"};
const latin = s => String(s || "").replace(/[\u0400-\u04FF]/g, ch => { const l = ch.toLowerCase(), r = TRANSLIT[l] ?? ""; return ch !== l && r ? r[0].toUpperCase() + r.slice(1) : r; });

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const cors = {"Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0], "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin"};
    if (req.method === "OPTIONS") return new Response(null, {headers: cors});
    const json = (o, status = 200) => new Response(JSON.stringify(o), {status, headers: {...cors, "Content-Type": "application/json", "X-Leren-AI": WORKER_VERSION}});
    if (req.method !== "POST" || !ALLOWED_ORIGINS.includes(origin)) return json({error: "forbidden"}, 403);

    // daily limit per visitor (optional KV binding RATE)
    // KV on the free plan allows ~1000 writes a day: if KV fails, keep the chat working
    // (the monthly spend limit in the Anthropic Console is the hard cap).
    if (env.RATE) {
      const ip = req.headers.get("CF-Connecting-IP") || "x";
      const key = new Date().toISOString().slice(0, 10) + ":" + ip;
      let n = 0;
      try { n = Number(await env.RATE.get(key)) || 0; } catch (e) { console.log("rate get", String(e)); }
      if (n >= Number(env.DAILY_LIMIT || 60)) return json({error: "limit"}, 429);
      try { await env.RATE.put(key, String(n + 1), {expirationTtl: 90000}); } catch (e) { console.log("rate put", String(e)); }
    }

    let body; try { body = await req.json(); } catch { return json({error: "bad json"}, 400); }
    // JSON parsing also accepts null, arrays and primitives; validate before reading fields.
    if (!body || typeof body !== "object" || Array.isArray(body)) return json({error: "bad request"}, 400);
    if (body.mode === "report") { // Google Play: users can flag AI content inside the app; read them in Cloudflare → leren-ai → Logs
      console.log("AI_REPORT " + JSON.stringify({at: new Date().toISOString(), kind: String(body.kind || "").slice(0, 10), target: String(body.target || "").slice(0, 5), lang: String(body.lang || "").slice(0, 5), text: String(body.text || "").slice(0, 1500)}));
      return json({ok: true});
    }
    const mode = ["ask", "memo"].includes(body.mode) ? body.mode : "chat";
    const memory = String(body.memory || "").replace(/[{}<>]/g, " ").slice(0, 600).trim();
    const target = TARGET[body.target] ? body.target : "nl"; // older app versions send no target → Dutch
    const maxLen = mode === "chat" ? 400 : 600;
    const msgs = (Array.isArray(body.messages) ? body.messages : []).slice(-12)
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map(m => ({role: m.role, content: m.content.slice(0, maxLen)}));
    if (mode !== "chat") { while (msgs.length && msgs[0].role !== "user") msgs.shift(); if (!msgs.length) return json({error: "empty"}, 400); }
    else if (!msgs.length || msgs[0].role !== "user") msgs.unshift({role: "user", content: "(Start: greet me in the target language and ask one easy question that fits the situation.)"});
    if (mode === "memo") { // one user message with the old notes and the conversation transcript
      const transcript = msgs.map(m => (m.role === "user" ? "Learner: " : "Tutor: ") + m.content).join("\n");
      msgs.splice(0, msgs.length, {role: "user", content: `Old notes:\n${memory || "(none)"}\n\nNew conversation:\n${transcript}`});
    }
    const notes = learnerNotes(body.profile, mode, memory);
    const sys = mode === "memo" ? memoSystem(body.lang) : mode === "ask" ? askSystem(target, body.lang, body.level, body.char, notes) : chatSystem(target, body.lang, body.level, body.scene, body.char, notes);
    const schema = schemaFor(mode, LANG[body.lang] || "Ukrainian");
    const provider = env.PROVIDER || (env.ANTHROPIC_KEY ? "anthropic" : env.GEMINI_KEY ? "gemini" : "workers-ai");
    try {
      let text = "";
      if (provider === "anthropic") {
        // Structured outputs guarantee valid JSON; low effort keeps replies fast and cheap.
        const r = await fetch("https://api.anthropic.com/v1/messages", {method: "POST", headers: {"content-type": "application/json", "x-api-key": env.ANTHROPIC_KEY, "anthropic-version": "2023-06-01"},
          body: JSON.stringify({model: env.MODEL || "claude-haiku-5-5", max_tokens: 4000, system: sys, messages: msgs,
            output_config: {effort: env.EFFORT || (mode === "ask" ? "medium" : "low"), format: {type: "json_schema", schema}}})});
        const j = await r.json();
        if (!r.ok) { console.log("anthropic", r.status, JSON.stringify(j).slice(0, 300)); return json({error: "ai"}, 502); }
        if (j.stop_reason === "refusal") return json({error: "refusal"}, 502);
        text = (j.content || []).filter(c => c.type === "text").map(c => c.text).join("");
      } else if (provider === "gemini") {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${env.MODEL || "gemini-3.5-flash-lite"}:generateContent`, {method: "POST", headers: {"Content-Type": "application/json", "x-goog-api-key": env.GEMINI_KEY},
          body: JSON.stringify({systemInstruction: {parts: [{text: sys + "\nReturn ONLY valid JSON matching this schema: " + JSON.stringify(schema)}]}, contents: msgs.map(m => ({role: m.role === "assistant" ? "model" : "user", parts: [{text: m.content}]})), generationConfig: {maxOutputTokens: 1200, temperature: 0.6, responseMimeType: "application/json"}})});
        const j = await r.json(); text = j?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "";
      } else {
        const r = await env.AI.run(env.MODEL || "@cf/meta/llama-3.3-70b-instruct-fp8-fast", {messages: [{role: "system", content: sys + "\nReturn ONLY valid JSON matching this schema: " + JSON.stringify(schema)}, ...msgs], max_tokens: 1200, temperature: 0.6});
        text = typeof r?.response === "string" ? r.response : JSON.stringify(r?.response || "");
      }
      const o = parseJSON(text);
      if (mode === "memo") return json({memory: cut(o && typeof o.memory === "string" ? o.memory : memory, 600)});
      if (mode === "ask") {
        if (!o || !o.answer) return json({error: "format"}, 502);
        const ex = (Array.isArray(o.examples) ? o.examples : []).filter(e => e && e.text && ["nl", "en", "fr"].includes(e.lang)).slice(0, 3)
          .map(e => ({lang: e.lang, text: cut(e.text, 200), translation: cut(e.translation, 200)}));
        return json({answer: cut(o.answer, 1500), examples: ex});
      }
      const reply = o && (o.reply || o.reply_nl);
      if (!reply) return json({error: "format"}, 502);
      const k = o.correction;
      let c = k && k.corrected && k.has_error !== false ? {original: cut(k.original, 300), corrected: cut(latin(k.corrected), 300), explanation: cut(k.explanation, 300)} : null;
      const lastUser = String((msgs.filter(m => m.role === "user").pop() || {}).content || "").replace(/\[spoken;[^\]]*\]\s*$/, "").trim();
      const said = o.learner_in_target ? cut(latin(o.learner_in_target), 300) : "";
      if (said && /[\u0400-\u04FF\u0600-\u06FF]/.test(lastUser) && (!c || /[\u0400-\u04FF\u0600-\u06FF]/.test(c.corrected)))
        c = {original: cut(lastUser, 300), corrected: said, explanation: (SAY_IT[body.lang] || SAY_IT.en)(body.target)};
      return json({reply: cut(latin(reply), 400), reply_nl: cut(latin(reply), 400), translation: cut(o.translation, 400), correction: c});
    } catch (e) { return json({error: "ai"}, 502); }
  }
};
