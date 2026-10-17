# Mijn Nederlands — Project State / Source of Truth
Last updated: 2026-10-12
Status: Architecture audit started; no consolidation deployed in this session.

## Mission
Build a maintainable Dutch-learning application centered on a **complete 46-topic A2 curriculum** and eventual B1 readiness. Teach each topic thoroughly (rules, exceptions, realistic examples, guided practice, meaningful independent checks). Use AI for genuinely fresh reading, listening, writing, speaking, and targeted remediation. Track exact mistakes and map them to relevant lessons and spaced reviews. Build a Daily Plan from curriculum progress, review due dates, weaknesses, skill balance and available time. Keep lesson completion, check passing, retention/mastery and CEFR skill assessments distinct.

## Non-negotiables
- **Never delete/reset localStorage or historical learning progress**. Keep completed Daily Plan activity IDs, assessment history, vocabulary, mistake journal and spaced-review history.
- No unverified claim that code has been deployed, Worker changed in Cloudflare, or AI API live-tested.
- Supply safe, testable ZIPs with full Codespaces backup/install/test/commit/rollback steps directly in chat.
- Avoid stacking patches indefinitely; consolidate into shared modules and preserve compatibility.
- At the end of **every development session**, produce an updated downloadable TXT context handoff AND update PROJECT_STATE.md for GitHub. Start each future session by reading this document and the current code; distinguish verified facts from user-reported deployment state.

## Sources inspected in this session
1. `/mnt/data/mijn-nederlands-phase7-source.zip` (user's 2026-10-11 source snapshot): 54 ZIP entries, ~682 KB uncompressed; contains index.html, js/, data/, css/, 10+ test scripts; **does not include Worker**.
2. `/mnt/data/Texte collé(5).txt`: user-provided Cloudflare Worker source, ~5,621 lines; endpoint code inspected.
3. `/mnt/data/mijn-nederlands-phase7-bridge-upgrade.zip`: previously prepared patch with js/a2-phase64.js, js/a2-ai-conversation.js, worker.js, phase7-bridge-test.js. User reported installing the bridge, and screenshots show worker.js and phase7-bridge-test.js in Codespaces; **Cloudflare deployment status not independently verified**.
4. Screenshots show cluttered Codespaces root (phase6-backup, phase61-backup, phase62-backup, phase63-backup, phase64-backup, upgrade-preview, ZIP file, numerous phase tests, worker.js) and legacy dashboard panels (skill profile A1/B1 estimates, focus areas, progress snapshots).

## Verified code architecture
- `index.html` loads ~35 classic scripts in sequence (not a module bundler), including all phase-specific overrides. Preserve script ordering when consolidating.
- `data/curriculum.js`, `data/a2-depth.js`, `data/lesson-guides.js`: curriculum and lesson content. `curriculum-test.js` reports 61 unique structured lessons, 46 A2 topics.
- `js/curriculum-engine.js`: lesson presentation and progress.
- `js/study-plan-engine.js`, `js/dashboard.js`, `js/a2-daily-integration.js`, `js/a2-adaptive-phase5.js`, `js/a2-phase63.js`: overlapping plan creation/routing/wrapping. Target for consolidation.
- `js/a2-phase64.js`: mistake journal; original source ZIP relies on explanation keyword heuristics. Bridge ZIP prefers structured Worker correction category.
- `js/spaced-review-engine.js`: review schedules.
- `js/api.js`: frontend Worker calls; `js/practice-ui.js` generic practice; `js/a2-ai-conversation.js` conversation frontend.
- `js/storage.js`, `js/progress-engine.js`, `js/profile-engine.js`: persistent history and progress.
- `js/writing-ai.js`, `js/speaking-ai.js`, `js/speaking-recorder.js`: assessments and recording.
- Worker routes: GET `/health`; POST `/evaluate-writing`, `/transcribe-speaking`, `/evaluate-speaking`, `/practice/evaluate`, `/practice/generate`, `/error-lesson/generate`, `/a2/conversation/turn`, `/a2/conversation/feedback`.
- Worker already supports fresh generated skill practice, but listening generator instructions explicitly state no synthesized audio in current frontend; actual audio-enabled listening needs work. Worker conversation feedback returns correction objects `{original,suggested,explanation,category}`.

## Verified tests against original Phase 7 source ZIP on 2026-10-12
- PASS: `node curriculum-test.js` — 61 structured lessons; A2 46; persistence.
- PASS: `node phase5-test.js` — migration, completion history, duplicate avoidance, routing.
- PASS: `node phase61-test.js` — routing.
- PASS: `node phase63-test.js` — idempotence, tagging, completed preservation, lessons and due reviews.
- PASS: `node phase64-test.js` — correction journal, classification, duplicates, review scheduling.
- PASS: `node smoke-test.js` — plan 60 minutes, unique IDs, completion persisted; logs 'Dashboard section not found' twice, worth investigating.
- NOT RUN SUCCESSFULLY: `node phase6-test.js` — requires `worker-phase6.js`, missing from ZIP; does NOT prove deployed Worker failure.
- Live Cloudflare API behavior and post-bridge app tests were NOT tested in this session.

## Known issues / risks
1. Legacy dashboard sections may mislead: skill profile displays historical A1/B1 estimates alongside A2 learning path; user wants product cleanup, not history deletion.
2. Phase scripts monkey-patch/wrap functions and create overlapping responsibilities; simplify cautiously with regression tests.
3. Original Phase 6.4 corrections may remain unclassified; bridge uses Worker categories, but older saved records need **safe reclassification** without inventing certainty or duplicating reviews. Maintain unclassified records visibly.
4. Original Worker ends dialogue at turn 6 while frontend offers extended mode; bridge intended to align, but live deployed Worker must be checked.
5. A2 lesson breadth/depth insufficient; two-question checks aren't reliable mastery evidence.
6. Daily Plan remains partly based on older scheduler; should prioritize next A2 lesson, due reviews, specific errors and balanced four skills while preserving completed IDs.
7. Root clutter: old backup folders, ZIPs and phase scripts; don't delete until dependencies and Git tracking are audited. Move archival material only after verifying references and safe backups.
8. Worker code is monolithic (~5.6K lines), with repeated OpenAI request/JSON extraction patterns. Modularize only with an explicit Cloudflare deployment approach and endpoint compatibility tests.

## Data persistence contracts to preserve
- `mijn_nederlands_curriculum_v1`
- `mijn_nederlands_daily_plan_v1`
- `mijn_nederlands_spaced_reviews_v1` (records include `nextReviewDate`, stage, concept)
- `mijn_nederlands_a2_mistake_journal_v1`
- `mijn_nederlands_a2_ai_conversations_v1`
- `mijn_nederlands_a2_vocab_v1`, `mijn_nederlands_a2_mock_v1`, `mijn_nederlands_a2_conversations_v1`
- Additional assessment/practice keys defined in `js/storage.js`; inspect before any migration.
- Daily Plan records: `Dashboard.getDailyRecord()` returns `{date, plan, completed}`; `plan.activities` contain stable `id`, `title`, `type`, `source`, `skill`, `minutes`, `level`, `studioKind`.

## Deployment / Git context (reported, not independently verified)
- GitHub repo `bourzguimehdi-design/mijn-nederlands`; Codespaces `/workspaces/mijn-nederlands`; branch previously `feature/a2-integrated-upgrade` — verify with `git branch --show-current` before editing.
- Cloudflare Worker `mijn-nederlands-api`, secret `OPENAI_API_KEY` configured; never include secret in ZIP or logs.
- User reports latest bridge ZIP installed in Codespaces; confirm Git status, actual file hashes and Cloudflare deployment before further changes.

## Next steps, in order
1. Audit actual installed Codespaces source vs provided ZIP + bridge, Git status, runtime loading and data dependencies. Obtain fresh snapshot only if needed.
2. Produce a dependency map: every script, UI section, storage key, Worker route and test. Mark active, duplicate, legacy-but-needed, and safe-to-archive; confirm with user which UI sections to remove.
3. Establish one canonical planner, one mistake classification/mapping engine, and clean activity routing; maintain legacy API adapters and migrations without data loss.
4. Clean repository layout: src-like js/data/css, tests/, docs/, worker/, archive outside deployable app as appropriate; ensure static hosting paths remain correct; test before moving.
5. Implement genuinely deep curriculum for all 46 A2 topics and varied assessments, plus lesson-specific AI fresh practice across four skills and actual Dutch listening audio (if browser support permits).
6. Fix legacy unclassified corrections and connect feedback to lesson/review; differentiate stylistic suggestions from true errors.
7. Implement Daily Plan driven by curriculum/reviews/weaknesses/skill balance; preserve historical completed IDs and display honest progress/mastery.
8. Run all regression tests plus live browser/Worker smoke tests (user executes Cloudflare deployment); package frontend and Worker separately, with rollback.
9. Update this PROJECT_STATE.md and session handoff TXT before ending.

## Session result
2026-10-12: Baseline audit, test run, and continuity documentation completed. **No app source files were changed, no cleanup deployed, and no new Phase 7 release built.**


## 2026-10-12 follow-up: safe cleanup audit prepared
- User approved archiving unnecessary files and requested immediate progress.
- Built an actual dependency inventory from source ZIP + bridge overlay: `index.html` script load order and loaded/unloaded JS, storage/planner touchpoints. See `DEPENDENCY_AUDIT.md` in cleanup audit ZIP.
- Created opt-in `safe_cleanup.py`: default dry-run; `--apply` moves only untracked historical root backup folders and root ZIP files to `.local-archive/cleanup-TIMESTAMP/`; tracked files skipped; never deletes files. Does not touch JS, tests, Worker, or localStorage.
- Source is a snapshot; actual live Codespaces branch and deployment not accessible to this session. User must run and report Git status before deeper consolidation.
- Next: obtain current Codespaces snapshot after bridge and archive, build tests for runtime planner/journal/UI, then implement consolidated code and curriculum in verified releases.

## Update — 2026-10-12, live checkout audit preparation
User reports cleanup utility moved six historical folders and two ZIPs to `.local-archive`. Git status had untracked active JS and Worker files, plus two tracked deletions. Prior instructions to restore/stage/commit were given but execution has not been confirmed. A read-only `audit_live_repo.py` has been prepared to inspect actual Codespaces checkout; it is not yet executed there. No app refactor or deployment is verified in this step. See `SESSION_HANDOFF_2026-10-12.txt` for continuation.


## 2026-10-12 A2 content release (pending installation)
- User feedback: A2 ONLY; keep A2 dashboard and working Daily Plan; remove Dutch naturalisation goal card.
- Add explicit A2 topics: colours/descriptions, clothing/getting dressed, locations/spatial words; add 15 vocabulary cards with stable new IDs.
- Existing quick-check pass history remains intact; UI clarifies that quick checks are NOT mastery. Actual AI-verified mastery is NOT implemented yet.
- User wants Daily Plan derived from curriculum and personal mistakes, and balanced speaking/listening/reading/writing across week. Planner enhancement pending; do not claim complete.
- Source for this release: latest uploaded tracked ZIP from before Consolidation 2; verify installed version before applying.
- No Worker modifications or localStorage resets.


## Speaking quality update — 2026-10-14
- GitHub js/a2-ai-conversation.js now filters unchanged, unsupported and duplicate AI feedback corrections before journal registration; nextPractice is explicitly labelled unscheduled suggestions. Commit 077d2b6.
- User-uploaded newer Cloudflare Worker was patched separately and packaged for manual deployment; not committed as active Worker, not deployed or live-tested.
- Correction-derived spaced reviews already use A2Phase64; AI nextPractice free-text suggestions are NOT automatically scheduled into Daily Plan. This remains a priority.
- No localStorage reset or historical progress rewrite. Local Codespaces uncommitted changes may differ from GitHub branch: reconcile before pulling.

## Optional speaking follow-up (2026-10-14)
- Implemented in committed frontend: Speaking feedback now offers 'Practise my mistakes now' when feedback contains corrections or suggested practice. It launches an on-demand generated A2 concept lesson via existing PracticeUI using up to 3 validated corrections and up to 3 suggestions, with fresh-context instruction.
- PracticeUI pins `a2_speaking_followup` to A2 and does not assign a Daily Plan activity ID; does not award A2 curriculum mastery. Existing practice engine handles question grading and normal error tracking.
- `index.html` cache versions bumped. No Worker modification/deployment needed for this button; existing `/practice/generate` must be functional.
- NOT yet live-tested in browser; no automated test suite run by assistant on GitHub commit. Do not claim user browser storage was verified. No automatic conversion of free-text suggestions into future scheduled tasks; existing correction-derived spaced reviews remain.
- Local Codespaces `js/a2-ai-conversation.js` had uncommitted scenarioId change; preserve it when reconciling remote branch. Do not reset localStorage.

## 2026-10-17: A2 practice quality patch (committed)
- CurriculumEngine.normalize removes whitespace before punctuation and ignores final punctuation/case as UI promises. Example `Waar woon je ?` matches `Waar woon je?`; wrong answers remain wrong. Historical checks untouched.
- Speaking follow-up PracticeUI now assigns a short display title from the activity instead of showing the entire prompt. AI still receives detailed concept text.
- A2AIConversation.practiseFeedback extracts up to three distinct correction categories and requests at least two graded exercises per category when multiple exist; remaining exercises mixed. This is prompt-level guidance, NOT programmatically enforced distribution. Feedback can include up to three correction examples and three suggestions.
- index.html script query versions refreshed. New test `node a2-practice-quality-test.js` added but NOT executed in Codespaces by assistant. JavaScript syntax checked from GitHub source; all three edited JS scripts parsed successfully.
- Changes made directly to GitHub branch `feature/a2-integrated-upgrade`, not automatically installed in local Codespaces. Safely fetch/rebase after checking local status; no reset/force pull. Never clear browser localStorage.
- Planned but NOT implemented: `Raad het woord` A2 speaking guessing game with give-up, hints and AI feedback; separable verbs and fixed-preposition verbs A2 lessons; structured automatic scheduling of free-text nextPractice suggestions. The guessing game requires a stable hidden secret on the Worker side and explicit deployment/testing.

## 2026-10-17: Raad het woord + A2 verb lessons
- Added `js/a2-word-guess.js` and A2 Studio button `Raad het woord · A2 guessing game`. The app chooses a secret from a curated eight-word bank, holds it constant during a round, asks the existing Worker conversation-turn endpoint to answer Dutch yes/no questions, supports hints, typed questions, microphone transcription, give-up, and end-of-round AI feedback via `A2AIConversation.finish()` (including the existing journal/review integration). This is a FIRST playable iteration, not a Worker-managed secret or an AI-generated secret. Client-held secret is not cheat-proof; Worker compliance and microphone endpoint must be live-tested. The current implementation may fail to detect paraphrased guesses; literal matching is used. No automatic Daily Plan scheduling of the game yet.
- Added/expanded structured A2 lesson `separable_verbs_a2`, preserving its existing ID, and added `fixed_preposition_verbs_a2`. Removed duplicate original entry during validation. Current source has 67 unique structured lessons, 52 A2 lessons. Historical curriculum progress is untouched.
- Updated `js/a2-studio.js` and `index.html` with new game button/script and cache-busted curriculum/studio script URLs.
- Added `a2-word-guess-test.js`; run in Codespaces with `node a2-word-guess-test.js`, `node curriculum-test.js`, `node smoke-test.js`, `node a2-mastery-test.js`. GitHub source syntax/unique ID check performed; Codespaces and live Worker testing not performed yet. Worker code was NOT modified or deployed.
- User requested optional A2 speaking game and both verb lessons. Future improvement: migrate secret and round logic to Worker with a signed session, robust question/guess detection, scenario-aware feedback, additional word bank, and Daily Plan optional rotation.


## 2026-10-17: Word-game referee fix (deployment pending)
- Based on user-supplied current deployed Worker `Texte collé(8).txt`, added candidate `cloudflare-worker/worker-word-game.mjs`. Only insertion is a scenarioId === raad_het_woord branch before generic scenario truncation; all original routes preserved byte-for-byte after newline normalization. This candidate does NOT replace the older worker-phase6.js or any untracked Codespaces Worker.
- Existing frontend protocol supported: reads allowlisted secret from full scenario, uses fixed per-word facts and separate game referee instructions. Model returns an answer enum; server maps it to fixed Dutch text. No generated follow-up question, unsolicited clue, secret disclosure, or automatic closing turn can pass through this path. Hints/give-up stay frontend controlled.
- PASS locally: Worker syntax; node word-game-worker-test.mjs (mocked AI) covers eight words, enum mapping, invalid outputs, history/late turns, input/API failures, normal conversation route. Live factual accuracy, microphone, feedback/journal/reviews NOT verified. No Cloudflare deployment performed. No frontend change or localStorage change.
- Limitations retained: client-held secret; frontend literal guess matching and async round controls; AI semantic truthfulness not deterministic. Broader vocabulary and server-owned rounds deferred.
- Deploy the supplied candidate manually to mijn-nederlands-api after retaining the current deployed source/version. Existing frontend needs no fetch/rebase/cache reset for this Worker-only fix. Test carrot questions, no hints unless requested, ordinary roleplay, hints/give-up and feedback persistence. Roll back using prior Cloudflare version if needed.
