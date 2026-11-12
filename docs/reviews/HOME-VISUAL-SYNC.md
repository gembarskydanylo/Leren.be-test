# HOME visual integration audit · 2026-11-12

Scope: `gembarskydanylo/Leren.be-test` only. No production changes, deployment or PR merges.

## Repository and ownership

- Latest main: `9fdf271` (PR #4, Home V2 integration, merged earlier).
- PR #3: `feature/complete-visual-assets`, `db8d3eb`, draft/open; **6 behind / 1 ahead** main, not 3 behind. Candidate A/B/C are Codex artwork, each 1600×900. No changes to that branch or artwork in this audit.
- Claude's existing main contribution: `app/` production-v225 snapshot + Home V2, course/progress/XP bridges, manifest and backlog. Root beta and `desktop/` are older previews; the homepage under review is **`app/index.html`**, not root `index.html`.
- PR #5: `feature/home-v2-final-art`, `c80082c`, open/unmerged. Claude edited C into desktop 1920×1080 (341260 bytes) and A into mobile 1280×800 (219606 bytes); two cat variants reuse the original pose. These are derivatives, not newly drawn scenes/poses. Review before accepting `approved` as human approval.
- Current Codex technical contribution: stable fallback for failed approved assets; route the app's LIFE entry through the existing `life/` visual renderer; regression tests. No learning/storage identifiers changed.

## Review and conflicts

C has the best desktop text space and retains both women on the right. A has larger faces, less text room; B has a busier street. C on a 390px screen keeps the scene but faces become small. A-derived mobile in PR #5 changes the selected bridge panorama: accept only after explicit visual review, or request a dedicated C composition. Annick's light hair in the original candidates differs from ART_REQUEST; identity across separately drawn images is approximate, not guaranteed.

The PR #3 documentation diverges from main (journal/transfer notes); do not blindly merge or overwrite those files. PR #5 already owns final-art files and manifest statuses. This patch leaves them alone. Its changes to the browser test only expose the existing `life/` sibling in the local test server.

Two confirmed technical gaps fixed:
1. On a failed approved image, removing `<picture>` moved mobile content, and LIFE lost its fallback. Keep image geometry and an accessible description; show the LIFE fallback icon.
2. `app/learn-life-story.html` loaded the old snapshot renderer, bypassing the approved cast/visual manifest. It now uses a same-origin base of `../life/` and that existing renderer/CSS/audio, with a return link to `../app/`. The existing route, query parameters and same-origin progress remain intact. No second engine created. Legacy snapshot files remain for other existing entry points; removal requires a separate dependency audit.

Character recommendations (no automatic story edits):
- Peter the older LIFE neighbour and AI Peter remain distinct roles with distinct art/namespaces. Display “Peter — сусід” versus “AI Peter” where ambiguity matters. Do not rename progress keys.
- Keep Tom/Lien in the current supermarket script until the owner approves Sofie's exact role. Then update dialogue, voices and manifest together; keep story/scene IDs stable.
- ART_REQUEST.md and LIFE visual-manifest v2 are the cast authority; Anastasia replaces Olena in display/dialogue, not by a blind identifier rename.

## Validation and limitations

16 local test suites passed before the LIFE route correction; home-v2 passed again after the correction. Playwright Chromium emulation: 360/390/430/1280/1440, missing art and injected C candidate. Language uk↔en, Dutch levels, English player/recorded audio, lesson launch, rewards/progress/XP and LIFE recorded clips are covered. The new regression delays image requests then returns 404 and compares geometry before/after at all five widths.

Screenshots use C injected only in the browser, with test-seeded 120 XP; they are not a deployed final-art approval. Reference collages are never production UI assets (the older generic test still uses one as a fixture). No physical Samsung, microphone recognition, live AI backend or production network performance was tested. PR #5 art weights are repository measurements, not a PageSpeed score. Full offline cross-directory LIFE support requires a cache review before transfer.

## Safe transfer order (approval required)

1. Review desktop/mobile images and resolve the C-vs-A mobile choice. Deliver missing art from CODEX_ART_BACKLOG.md.
2. Review this technical patch and PR #5 together; preserve both journals and manifests. Do not merge PR #3 wholesale for just three candidate files.
3. Re-run browser and unit tests on the combined test branch, including installed service-worker/cache update and slow network; test a physical Android phone.
4. Only after explicit approval, port Home V2 and the existing LIFE visual system into the actual production paths. The test-only `../life/` base must be removed/adapted when production serves the unified engine at its normal root. Do not copy the entire isolated snapshot over production.
5. Bump release/cache consistently; verify audio, sign-in, existing progress and assets. Keep the previous release and manifest for rollback. No storage migration is required by this patch.
