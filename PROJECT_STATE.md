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
