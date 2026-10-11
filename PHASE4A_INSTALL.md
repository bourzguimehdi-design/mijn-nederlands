# Mijn Nederlands — Phase 4A (safe incremental update)

This is the **first installment** of Phase 4, not the complete curriculum expansion.

## Changes
- Daily-plan skill sessions explicitly target A2. Standalone assessments remain unchanged.
- Supplementary and weekend skills do not duplicate existing daily-plan skills (including vocabulary).
- A2 Learning Studio shows lesson-check progress and explains that B1 readiness requires broader evidence.
- No changes to localStorage keys, saved results, spaced-review engine, or existing curriculum IDs.

## Install on GitHub Codespaces (development branch only)
1. In the Codespaces terminal, run `git status --short` and confirm you're on `development` with `git branch --show-current`.
2. Make a safety commit or copy of any uncommitted edits **before** replacing files. Do not use `git reset --hard`.
3. Download the Phase4A patch ZIP and upload it to the repository's root directory in Codespaces.
4. From the repository root, unzip with `unzip -o mijn-nederlands-phase4a-patch.zip`. It replaces only the four files listed below.
5. Run `node --check js/study-plan-engine.js && node --check js/practice-ui.js && node --check js/a2-studio.js`.
6. Run `node curriculum-test.js && node phase2-test.js && node a2-integrated-test.js`.
7. Inspect `git diff --stat` and `git diff` before committing. Test the app on the development branch.

Files replaced: `index.html`, `js/study-plan-engine.js`, `js/practice-ui.js`, `js/a2-studio.js`.

**Important:** Today's saved plan will not be regenerated automatically. Duplicate prevention and A2 scheduling apply to the **next newly generated plan**. Do not clear browser storage, localStorage, or saved progress.

## What is still planned
A2 Studio lesson integration into the daily plan, expanded vocabulary and A2 reading/listening question banks, more meaningful guided-conversation feedback, and a multidimensional B1-readiness model. Pronunciation assessment is intentionally not prioritized.
