# TEST-027 — isolated visual directions

**Owner selection stage. Not an application implementation.**

Start from the repository root:

```sh
python3 -m http.server 8277 --bind 127.0.0.1
```

Open http://127.0.0.1:8277/design-lab/test-027/ . Individual screens use `prototype.html?concept=a|b|c&screen=home|study|quiz|life`. B additionally has audio/review component studies.

The lab loads none of the application's CSS, JS, engine, Firebase or service worker. It reuses approved HERO/cat files unchanged and one new explicitly unapproved concept illustration. The UI has fixed sample data (20 XP, first lesson completed) for composition review. Buttons navigate the prototype and show demo feedback. No real scoring, SRS, audio or progress persistence.

Artifacts:
- `docs/design/test-027/AUDIT.md` — actual TEST-025 screenshots, screen ratings, causes and recommendation.
- `ART-BRIEF.md`, `missing-assets.csv` — 94 missing expected files, precise names/sizes and production briefs; 40 needed for the current first-day story.
- `screenshots/test-027/` — Before/Proposed at 320/390/768/1440 plus answer states and B Audio/Review.
- `prototype-checks.json`, `contrast-checks.json` — recorded checks, not proof of aesthetic quality.

Reproduce with Playwright and Chromium available:

```sh
node design-lab/test-027/check.cjs
```

If Playwright lives outside the repository, set NODE_PATH to its node_modules directory. This only tests isolated prototypes. It is not a replacement for app UI contracts or learning-engine tests. All screenshots are browser emulation, not physical Samsung testing.

**Do not merge or create an implementation PR until the owner chooses a direction.** Then use a new implementation branch and `TEST-027: LerenBe 3.0 Visual Redesign` Draft PR. This concept branch deliberately leaves app/, life/, IDs, XP and storage untouched relative to TEST-025.
