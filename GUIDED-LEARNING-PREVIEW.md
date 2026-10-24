# Guided learning — beta preview

Preview: https://gembarskydanylo.github.io/Leren.be-test/
Production repository and lerenbe.com are unchanged by this feature.

## Try it

1. Open the test app. The Lesson tab now opens the guided route.
2. Choose Start from zero or the 12-question A1.1 starting-point check.
3. Complete Learn → Listen → Check. A lesson contains at most five existing cards.
4. Review mistakes or continue to the next lesson. Use Back to my path for the map.
5. Refresh halfway through an exercise: your phase and place are preserved.
6. Free practice opens the existing app; the return button and Lesson tab return to the route.

## Scope

The route covers all 757 cards across the existing 12 A1.1 and eight A1.2 chapters, arranged into 178 short lessons. Both course parts are labelled as A1. Topics have Ukrainian, English, French and Arabic names; original Dutch titles are retained on the map. Existing translations, examples and selected voice are reused. Supplementary grammar/phonetics, including diphthongs, remain available through free practice and are not edited.

Completed and mastered are distinct: completion lets learners continue, while a result below 80% is marked for additional practice. Mistakes have a separate persistent review queue. End-of-chapter results and the completed chapter map offer the existing topic assessment. All lessons can be explored in this beta, including A1.2; route access does not modify the existing XP-based free-practice unlock rules. The placement check gives a provisional recommendation and does not mark skipped material as mastered or award points.

Progress uses leren_path_v1; personal-best reward ledger uses leren_path_rewards_v1. A full lesson awards five host points per newly correct answer over its previous best. Targeted review awards no XP. Legacy word IDs, progress and old daily-learning prototype are retained. The main Progress page includes route completion and a Continue link.

## Validation

Eight test suites pass. New tests cover all 20 chapters, all card/chunk coverage, all 178 lessons to the course ending, saved phases, repeated/stale answers, mistake review, placement, malformed/unavailable storage, repeat-safe host rewards and exact offline dependencies. Existing curriculum, clock, widgets, notification, beta-daily and runtime checks remain green.

Manual browser checks: beginner flow, first lesson across three phases, deliberately wrong answers and targeted retry, 20 host points without duplicate review XP, next-lesson transition, reload during a lesson and the placement check, switching to French after answering, Arabic at 320px and Ukrainian at 390px. Audio controls use the existing player; physical phone sound output was not directly verified.
