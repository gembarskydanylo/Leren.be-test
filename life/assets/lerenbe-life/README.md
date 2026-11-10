# LerenBe Visual Pack v1 — reference bundle

This archive contains **7 existing AI-generated concept images** for visual direction and character references. It does **not** yet contain individually drawn, approved production scenes, transparent character sprites, or a complete story illustration library.

## Art direction
Warm semi-realistic 2D illustrations; recognizable recurring characters; Belgian streets, railway stations, homes, shops, commune, clinics and construction scenes. UI: dark navy, bright yellow/orange, rounded cards, responsive layouts.

## Claude Code workflow
1. Create/use a **separate test repository**, e.g. `LerenBe-Design-Lab`, not a branch deployed from the production site. If repository creation isn't authorized/possible, work locally in a separate directory and ask for approval before creating a remote repository.
2. Copy only reference images into `assets/lerenbe-life/reference/`. They are not final scene artwork.
3. Build a mobile-first prototype of dashboard, course selection, story catalog and story player with HTML/CSS and reusable components. Text, buttons, dialogue, badges and progress bars MUST be real UI, not baked into the reference pictures.
4. Do not claim missing scenes are supplied; use clearly labeled temporary placeholders and list the missing artwork. Do not crop composite mockups and pass them off as final production assets.
5. Do not copy secrets or production Firebase configuration into test repo. Use mock data. Do not alter production repository, Firebase, App Check, XP or user data.
6. Make a migration plan: reusable components, asset manifest, tests, and a PR back to the production repository **only after explicit approval**.

## Initial story set
First day in Belgium; supermarket; commune registration; building a fence; doctor visit.
