// Sends the daily Leren.be reminder pushes. Run every hour by .github/workflows/reminders.yml.
// Needs secrets: FIREBASE_SA (service-account JSON), VAPID_PUBLIC, VAPID_PRIVATE.
// A subscriber gets one push per day, at their chosen local hour, only if today's goal is not done yet.
import webpush from "web-push";
import {GoogleAuth} from "google-auth-library";
import {readFileSync} from "node:fs";

const {FIREBASE_SA} = process.env;
const VAPID_PRIVATE = (process.env.VAPID_PRIVATE || "").trim();
// The public key is taken from the app itself, so it always matches what the phones subscribed with.
const VAPID_PUBLIC = (readFileSync(new URL("../index.html", import.meta.url), "utf8").match(/vapid:"([A-Za-z0-9_-]{80,})"/) || [])[1] || (process.env.VAPID_PUBLIC || "").trim();
const FORCE = process.env.FORCE === "true"; // manual test run: send to every subscriber now
if (!FIREBASE_SA || !VAPID_PUBLIC || !VAPID_PRIVATE) { console.log(`::warning::Reminders are not configured: missing ${[!FIREBASE_SA && "FIREBASE_SA", !VAPID_PUBLIC && "VAPID_PUBLIC", !VAPID_PRIVATE && "VAPID_PRIVATE"].filter(Boolean).join(", ")}`); process.exit(0); }
process.on("unhandledRejection", e => { console.log(`::error::${String(e && (e.response?.data?.error?.message || e.message) || e).slice(0, 300)}`); process.exit(1); });
let sa; try { sa = JSON.parse(FIREBASE_SA); } catch { console.log("::error::FIREBASE_SA is not valid JSON — paste the whole service-account file"); process.exit(1); }
const BASE = `https://firestore.googleapis.com/v1/projects/${sa.project_id}/databases/(default)/documents`;
webpush.setVapidDetails("mailto:gembarsky.d@gmail.com", VAPID_PUBLIC, VAPID_PRIVATE);
const auth = new GoogleAuth({credentials: sa, scopes: ["https://www.googleapis.com/auth/datastore"]});
const client = await auth.getClient();
const api = (url, opts = {}) => client.request({url, ...opts});

const TEXT = {
  uk: {alive: n => ["🔥 Серія " + n + " дн. — не втрать її", "3 хвилини нідерландської сьогодні — і серія збережеться."], start: ["Час для нідерландської 🇧🇪", "Одна коротка тема на 3 хвилини. Tot straks!"]},
  en: {alive: n => ["🔥 " + n + "-day streak — keep it going", "3 minutes of Dutch today keeps your streak alive."], start: ["Time for some Dutch 🇧🇪", "One short topic, 3 minutes. Tot straks!"]},
  fr: {alive: n => ["🔥 Série de " + n + " jours — ne la perds pas", "3 minutes de néerlandais aujourd'hui et ta série continue."], start: ["C'est l'heure du néerlandais 🇧🇪", "Un petit thème, 3 minutes. Tot straks !"]},
  ar: {alive: n => ["🔥 سلسلة " + n + " أيام — حافظ عليها", "3 دقائق من الهولندية اليوم تحافظ على سلسلتك."], start: ["حان وقت الهولندية 🇧🇪", "موضوع قصير في 3 دقائق. Tot straks!"]}
};
const val = f => f ? (f.stringValue ?? (f.integerValue != null ? Number(f.integerValue) : undefined)) : undefined;
function localNow(tz) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23"}).formatToParts(new Date()).map(x => [x.type, x.value]));
  const y = new Date(Date.UTC(+p.year, +p.month - 1, +p.day - 1));
  return {hour: +p.hour, date: `${p.year}-${p.month}-${p.day}`, yesterday: y.toISOString().slice(0, 10)};
}

let sent = 0, removed = 0, checked = 0, failed = 0, pageToken = "";
do {
  const {data} = await api(`${BASE}/subs?pageSize=300${pageToken ? "&pageToken=" + pageToken : ""}`);
  for (const doc of data.documents || []) {
    checked++;
    const f = doc.fields || {}, s = Object.fromEntries(Object.keys(f).map(k => [k, val(f[k])]));
    let now; try { now = localNow(s.tz || "Europe/Brussels"); } catch { now = localNow("Europe/Brussels"); }
    if (!FORCE && (now.hour !== s.hour || s.lastActive === now.date || s.lastSent === now.date)) continue;
    const t = TEXT[s.lang] || TEXT.uk, alive = s.lastActive === now.yesterday && s.streak > 0;
    const [title, body] = alive ? t.alive(s.streak) : t.start;
    try {
      await webpush.sendNotification({endpoint: s.endpoint, keys: {p256dh: s.p256dh, auth: s.auth}}, JSON.stringify({title, body, url: "./"}), {TTL: 6 * 3600});
      await api(`https://firestore.googleapis.com/v1/${doc.name}?updateMask.fieldPaths=lastSent`, {method: "PATCH", data: {fields: {lastSent: {stringValue: now.date}}}});
      sent++;
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) { await api(`https://firestore.googleapis.com/v1/${doc.name}`, {method: "DELETE"}); removed++; }
      else { failed++; console.log(`::warning::push failed ${e.statusCode || ""} ${String(e.body || e.message).slice(0, 200)}`); }
    }
  }
  pageToken = data.nextPageToken || "";
} while (pageToken);
console.log(`::notice::checked ${checked}, sent ${sent}, failed ${failed}, removed expired ${removed}${FORCE ? " (test run)" : ""}`);
