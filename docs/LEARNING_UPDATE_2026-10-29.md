# Learning quality update — 29 October 2026

The update fits into the existing A2 Studio and preserves lesson IDs, vocabulary IDs, Daily Plan history and review schedules. It adds no Worker routes and requires no Cloudflare deployment.

## What is included

- **Practice grading checks:** malformed multiple-choice options, missing keys and narrowly identifiable relative-pronoun contradictions are withheld before grading. Example: `De fiets ___ ik gebruik` cannot use a `dat` answer key. Report and skip is available before and after feedback; it removes the current question from the in-progress result before mistake tracking or mastery calculations. Reports stay in this browser. An outstanding API response for a skipped item is ignored. This is conservative validation, not general proof that every AI question is correct. Previously saved mistaken results are not rewritten.
- **Two deeper A2 lessons:** reflexive verbs and relative clauses now have full explanations, pronoun/reference tables, worked examples, common mistakes, translation drills, and five or more understanding checks. Earlier passed checks remain passed; historical two-question checks retain their original display denominator. Other lessons are unchanged and still need a depth audit.
- **Vocabulary:** 97 cards, up from 70, adding 27 words not already in the bank. All earlier cards and IDs are retained, including any earlier repeated vocabulary. Switch between Dutch-to-English meaning, English-to-Dutch recall and sentence recall. If the example does not contain the exact stored phrase, sentence mode falls back to Dutch-word recall. Recall is still self-confirmed, not an AI mastery assessment. The earlier live-count/resume fix remains.
- **Backup and restore:** A2 Studio has a backup screen. Export learning entries as JSON; preview an imported backup; restore only missing entries by default. Explicit replacement requires the checkbox and confirmation, and first starts a download of current progress. Restore failures attempt rollback and report if rollback fails. Unknown/authentication/configuration entries are rejected. No cloud sync, scheduled backups or cross-browser recovery without a saved export.
- **Exam practice:** A2 Studio offers original short reading and listening mocks (6 questions each, 12 minutes), writing (4 tasks, 20 minutes), speaking (6 tasks, 12 minutes), and KNM foundations (15 questions, 15 minutes). Objective mocks save scores and explanations; writing/speaking save responses with model examples/checklists, with optional text feedback through the existing `/practice/evaluate` API. Speaking records/transcribes into editable fields. Text feedback is not pronunciation assessment, is not automatically journalled, and does not award curriculum mastery. Listening uses browser Dutch speech synthesis. A missing audio engine is reported, not silently treated as listening evidence.
- **Dutch society:** five introductory source-linked themes — municipality/address registration, work/payslips, DigiD, education, healthcare institutions. Each has three checks. This is not full KNM syllabus coverage. Exam results and society checks have separate storage.

## Install safely in Codespaces

Check `git status --short` and branch first. Preserve tracked and untracked work. Only when safe:

```bash
git fetch origin
git rebase origin/feature/a2-integrated-upgrade
node learning-update-test.cjs
node vocabulary-progress-test.cjs
node curriculum-test.js
node a2-mastery-test.js
node smoke-test.js
```

Resolve conflicts by inspection, never reset or force-pull. Hard-refresh the app (`Ctrl+Shift+R`). From A2 Studio, test backup download, vocabulary mode changes, both expanded lessons, an objective mock, production feedback and society checks. Verify your old lesson progress and completed daily activities remain present. Export a backup before trying replacement restore. No browser storage clearing.

If an interface regression occurs, revert the release's commits through normal Git revert after preserving local changes; do not clear learning data. New progress keys are additive. If already-used new vocabulary is temporarily absent after reverting content, its stored records remain and can be used when the cards return.

## Validation and limitations

All source JS parses. Fifteen automated checks pass: `learning-update-test.cjs`, `vocabulary-progress-test.cjs`, `curriculum-test.js`, `a2-mastery-test.js`, `a2-practice-quality-test.js`, `smoke-test.js`, `phase5-test.js`, `phase61-test.js`, `phase63-test.js`, `phase64-test.js`, `a2-dashboard-consolidation-test.js`, `a2-integrated-test.js`, `a2-targeting-test.js`, `a2-word-guess-test.js`, `word-game-hint-test.cjs`.

New tests exercise backup validation/conflict modes/rollback, invalid grading rejection/report exclusion, IDs and old check progress, new exam keys/target lessons, objective vs unscored production results and duplicate submission. DOM tests use stubs. Live browser/audio/microphone/AI testing was not performed: the local Playwright package had no Chromium binary. Do not claim those checks have passed. Full official exams, wider lesson upgrades, general AI semantic verification and automatic KNM scheduling remain future work.

## Sources checked on 29 October 2026

Official orientation: DUO lists A2 reading 65 minutes, listening 45, writing 40, speaking 35; KNM 45. Writing is pen-and-paper. App short mocks intentionally use shorter practice times and do not replicate official question counts or scoring thresholds. Individual citizenship eligibility is not determined here.

- https://www.inburgeren.nl/examen-doen/inhoud-taalexamens-a2-b1-b2.jsp
- https://www.inburgeren.nl/examen-doen/inhoud-kennisexamens.jsp
- https://www.inburgeren.nl/examen-doen/oefenen.jsp
- https://www.government.nl/themes/government-and-democracy/municipalities/question-and-answer/how-do-i-inform-the-municipality-of-a-change-of-address
- https://business.gov.nl/regulations/payslip/
- https://www.digid.nl/en/security/tips-secure-login
- https://www.workinnl.nl/en/education/primary-education/default.aspx
- https://www.government.nl/documents/question-and-answer/what-do-i-need-to-arrange-if-im-moving-to-the-netherlands
- Reflexive forms and placement: https://www.dutchgrammar.com/en/?n=Pronouns.Rf01 and https://www.dutchgrammar.com/en/?n=WordOrder.05

## New storage keys

`mijn_nederlands_question_reports_v1`, `mijn_nederlands_exam_practice_v1`, `mijn_nederlands_knm_v1`. Existing progress keys and schedules are unchanged. Backup exports include known learning keys, not arbitrary browser storage.
