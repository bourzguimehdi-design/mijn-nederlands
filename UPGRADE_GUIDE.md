# Mijn Nederlands — structured curriculum upgrade

## Delivered

- A separate **Learning path** entry on the existing dashboard, with **37 curated lessons**: 10 A1 foundations, 22 A2 topics, and 5 B1 introductory topics.
- Each topic contains a learning objective, explanation, two Dutch/English examples, two short typed-answer checks, and a link into the existing AI practice engine.
- Curriculum check attempts are stored in **`mijn_nederlands_curriculum_v1`**. Existing practice history, profile, daily-plan completion, and spaced-review storage are not overwritten or migrated.
- Topic checks show correct answers and count a topic as checked/passed when both answers are correct. A passed check remains passed; retakes are allowed. **This is introductory lesson progress, not CEFR proficiency validation.**
- Curriculum AI practice is available for all listed concepts without automatically promoting them into the daily-plan curriculum. It targets the selected A1/A2/B1 level, and practice results use `source: curriculum_practice`.
- Existing daily-plan and spaced-repetition code retained. The October 11 real review-completion test remains pending.

## Installation

1. Keep a backup of your original project and preserve your existing browser origin. Your learning history is in browser localStorage, **not inside the ZIP**.
2. On your `development` branch, review and replace the project files from this ZIP. Do not clear localStorage. The source ZIP is not a git patch; use your normal Git diff/review before committing.
3. Serve the app from the same origin as before. Refresh to load the updated `practice-ui.js?v=7` and the new curriculum scripts.
4. On the dashboard select **Explore lessons**. Open an A2 lesson, complete its two checks, return to the catalog, then try AI practice.
5. Confirm existing Today's Plan and previous progress are unchanged. Test Worker-dependent generation, microphone, writing and listening in your actual browser.

## Local validation

- `node smoke-test.js` — passed (daily-plan budget and persistence smoke test)
- `node curriculum-test.js` — passed (topic coverage, unique IDs, checks and local persistence)
- `node --check` on all JavaScript files — passed

## Still needed for a fully validated A2/B1 tutor

- Pedagogical review of curriculum content and exercise correctness; expand each topic beyond an introductory lesson into guided explanations, more varied practice and multiple mastery assessments.
- Realistic listening/speaking tasks mapped to curriculum outcomes, multi-turn conversation practice, and exam-style writing/reading rubrics.
- Calibrated A2/B1 mock tests and CEFR evaluation; existing internal skill estimates are not independently validated.
- Live Worker/browser end-to-end verification (especially speaking/audio and saved review completion).
- Backup/sync, offline recovery, and wider automated integration tests.

No claim of official exam readiness is made by this build.
