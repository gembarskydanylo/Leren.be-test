# LerenBe 3.0 — Learn languages. Live in Belgium.

TEST-025. Presentation redesign of the existing test application, based on main `8607321`.
PR #13 and `origin/claude/test-024-technical-audit` are unmerged; their fixes are NOT assumed present. No changes to their branches.

## Real screen inventory

| Surface | Existing implementation | Design adapter |
|---|---|---|
| Home, next lesson, language/course picker | learning-path/ui.js hero(), home-v2/ui.js picker()/top() | home.css |
| Onboarding, goals and level choice | app.js welcomeNl()/firstRun() | foundation.css |
| Topic map, chapter/lesson list | learning-path/ui.js courseMap() | learning.css |
| Guided Study, Listen, Check, Review, placement, result | learning-path/ui.js exercises()/placement() | learning.css |
| Free Study, Quiz, Audio, Review, sentence building | app.js renderLessonModes()/nextQuestion() | learning.css |
| English/French course preview | modules/course-player/ui.js | learning.css |
| LIFE story home, scene, answers, results | app/learn-life-story.html → ../life/modules/learn-life/story-ui.mjs | life.css |
| Progress, XP, streaks, due words, goals | app.js renderProgressView()/renderInsights(), rewards | engagement.css |
| Settings, UI/target language, voice, topics | settingsSheet/topicsSheet, voiceDialog | engagement.css |
| Dictionary, tests, games, conversations | existing app views/modules | foundation/learning/engagement adapters |
| Four guides + guide index | app/guides/*.html | guides.css |
| Loading, wrong answer, no due words, storage unavailable | existing .empty/.lp-feedback/.lp-caption/.ls-loading | shared semantic tokens |
| Profile | No dedicated profile page exists. Real settings/account controls and progress provide the available surfaces | No fake profile, avatar upload or account state added |

## Design rules

Orange `--lb-brand` is a restrained action accent; teal anchors LIFE and navigation; Belgian yellow highlights the selected destination. Approved HERO A/C and the existing cat remain source assets. No new illustrations or requests to third-party font services.

`tokens.css` is the single semantic source: brand, hover, surfaces, text, border, success/error/warning, focus; light/dark palettes; typography, spacing, radius, tap size, motion. Adapters alias legacy variables to these tokens so learning content/actions stay owned by existing components. Do not add course logic or storage to styles.

Nunito is the common local UI typeface. Use 900 weight and tight tracking for titles, 1rem/1.55 body, .8125rem captions, responsive 1.8–2.8rem learning words. Readable sentence examples keep normal line spacing. Arabic retains system fallback.

Buttons use one modest radius, flat depth and ≥44 px targets. Main actions use orange, alternate actions a border, sound a warning-soft surface. Success and failure include existing text/icons as well as color. Focus uses a 3 px blue ring. No autoplay animation; reduced motion disables transitions/animations.

Home keeps TEST-019's next-lesson action and TEST-022's top course picker/calm rule. Progress precedes supporting stories; the original HERO remains a supporting brand introduction. Desktop uses the same content in a responsive grid. Navigation preserves its five actual destinations and aria state.

Forms, modal sheets, notices and empty states use shared surfaces and spacing. No simulated statistics, certification, streaks or account details. Dynamic progress remains read from the current course model, with stored IDs unchanged.

## Stages and acceptance

A: shared tokens, shell, navigation, home and screen inventory.
B: learning, topic map, answers, sound and review.
C: LIFE, real progress/settings, guides.
D: integration, light/dark, reduced motion, enlarged text, 8 widths, test suite and screenshot comparison.

Each stage has a separate commit and browser validation. `screenshots/test-025/` contains actual connected screens, not standalone mockups. Physical Samsung, audible nl-BE voice quality, actual PWA installation, TalkBack and external account/AI services remain device/service checks.

## Owner review

Approve palette, flatter control depth, calmer typography, compact/desktop hierarchy and LIFE presentation. A new mascot, alternate HERO, a dedicated Profile page or different navigation destinations need a separate product decision; none is implemented here.

## Integration record

The adapters are connected to live pages, not proposed standalone screens. The only change to app.js is the cache release number (230 → 250); no engine/state/data module was changed. All seven CSS files are registered in APP_FILES. Release 250 reserves a separate design preview number rather than reusing PR #13's 231 or TEST-024's technical release.

22 existing suites passed with Chromium, 0 skips. The new `tests/design-system.cjs` covers 164 screen checks across eight widths: a UI-completed lesson with a deliberate mistake, Review entry, persisted XP, course picker, map/chapter/back, settings keyboard interaction, all four guides, LIFE story and fence practice. At 390/1440 it also checks dark theme, 200% base text and reduced motion. Selected semantic pairs and actual dark HERO/fence text surfaces meet ≥4.5:1. This is targeted AA validation, not a full assistive-technology certification.

Initial failures were real integration issues: old dock translate, old dark-theme variable specificity, sub-44px settings/desktop/fence controls, and legacy white/yellow fence text on the new surface. Each was corrected. A test-helper error parsing short #fff values was also corrected; the design test now checks computed surfaces as well as tokens.

`docs/design/BEFORE-AFTER.md` links the screenshot pairs. Full local runs, intermediate screenshots and logs: `/private/tmp/test025-evidence/`. Guide noindex,nofollow remains intact. HERO A/C and cat asset files are unchanged.

## Status: implemented / planned / needs approval

- Implemented: A–D presentation foundation, shell/home, guided/free learning, course previews/map, LIFE story/fence, real progress/settings, guide styles, shared notice/empty/error states.
- Tested: browser emulation and the available automated suite as described above. Integration does not exercise live account deletion, Firebase, external AI requests or microphone permissions; these are service/device checks, and TEST-024 owns the technical fixes.
- Planned: physical Samsung pass, PWA installation/update from the home screen, TalkBack, audible nl-BE playback, system font scaling and landscape validation on-device. Rare game-specific screens and account-provider forms have not each received a separate before/after image; they inherit shared tokens and retain existing regression coverage.
- Owner approval: palette, typography, flatter controls, desktop hierarchy, compact LIFE dialogues and navigation treatment. A dedicated Profile screen and any mascot/HERO replacement are proposals only, not shipped features.

Keep Draft. No production transfer approved. New LerenBe 3.0 has a connected design iteration ready for review, not a declaration of a finished production release. PR #13 and TEST-024 remain separate unmerged work; coordinate their overlapping app/index.html, app/app.js, app/sw.js and first-lesson version references explicitly before combining.
