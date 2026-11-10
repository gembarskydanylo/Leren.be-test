# Illustrated game cards — release 111, 26 October 2026

Twelve scenes generated with the built-in image_gen tool using the **imagegen** skill. `img/tests/practice-v109.webp` was inspected and supplied as the character/style reference for every image. The orange Ukrainian student cat remains the protagonist; Peter/Dafna remain the teachers selected in the app, independent of the static card art.

Optimised project files are 600×400 WebP, quality80, approximately31–49KB each (all twelve approximately430KiB). Original generated PNGs remain under the user's Codex generated_images directory. No existing test or mascot asset was overwritten.

| File | Activity / scene |
| --- | --- |
| story-v111.webp | A day in Belgium: map and backpack in a Flemish square |
| ai-v111.webp | AI conversation: headset microphone and tablet |
| ask-v111.webp | Ask the teacher: raised paw and open book |
| dlg-v111.webp | Dialogue puzzle: speech-bubble jigsaw |
| rp-v111.webp | Role-play: theater and wooden masks |
| sp-v111.webp | Speaking: studio microphone and pop filter |
| bl-v111.webp | Blitz: flashcards and stopwatch |
| mm-v111.webp | Memory: matching illustrated cards |
| dc-v111.webp | Dictation: headphones, pencil and notebook |
| md-v111.webp | My day: daily planner and clock |
| om-v111.webp | Omdat: toy catapult and blocks |
| ks-v111.webp | Verb practice: four-column folded sheet |

Exact final prompts, source PNG identifiers and the shared reference are in **generation-v111.json** beside this file. Each scene used a separate built-in generation call. These are game-card illustrations, not screenshots or photographs.

Decorative images use empty alt text: localised game names and descriptions are real HTML in each button. Both A1.1 and A1.2 use the same game-ID→image mapping. All twelve images and the gallery stylesheet are in the offline cache. Reference-image proportions are preserved in ordinary cards; the wide story card uses a responsive crop. No game rules, teacher voice, AI endpoint, microphone handling, records, XP or progress storage changed.

## Spell it cover — release114, 27 October2026

`wb-v114.webp`: the same orange student cat arranging **K A T** wooden letter tiles. Built-in image_gen with inspected `img/games/mm-v111.webp` as the character/style reference. Exact final prompt and source PNG identifier: `wb-v114.json`. Optimised600×400 WebP, quality80. The previous wb-v112.svg remains in Git for history, but the live game card/offline cache now uses the new WebP. The other12 covers remain unchanged.

Inside the game, the42 existing SVG object cues were reviewed together. Their clean object-first style remains appropriate for guessing nouns. Twelve matching native SVG drawings were added and the pen cue was corrected to distinguish a ballpoint pen from potlood (pencil). Native SVG extension was used for this existing vector collection, preserving sharpness and small offline size. The game now has54 illustrated words; no Dutch answer text is embedded in these question pictures.
