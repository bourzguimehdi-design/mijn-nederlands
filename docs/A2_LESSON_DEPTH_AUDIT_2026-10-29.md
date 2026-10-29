# A2 lesson-depth audit — 29 October 2026

All 52 A2 lessons now have expanded guided teaching. The two reference lessons remain; 50 additional topics were authored in this release. Counts document coverage, not independently validated teaching effectiveness. Stable topic IDs and previous passes are retained.

| Topic | Examples | Quick checks before → after | Guided translation models |
|---|---:|---:|---:|
| Perfect tense | 5 | 2 → 5 | 3 |
| Past participles | 5 | 2 → 5 | 3 |
| Simple past | 5 | 2 → 5 | 3 |
| Because and that | 5 | 2 → 5 | 3 |
| Inversion | 5 | 2 → 5 | 3 |
| Adjective endings | 5 | 2 → 5 | 3 |
| Comparisons | 5 | 2 → 5 | 3 |
| Place and direction | 5 | 2 → 5 | 3 |
| Time expressions | 5 | 2 → 5 | 3 |
| Future plans | 5 | 2 → 5 | 3 |
| Reflexive verbs | 10 | 6 → 6 | 5 |
| Relative clauses | 5 | 5 → 5 | 3 |
| Instructions and requests | 5 | 2 → 5 | 3 |
| Making appointments | 5 | 2 → 5 | 3 |
| Shopping and returns | 5 | 2 → 5 | 3 |
| At the doctor | 5 | 2 → 5 | 3 |
| Housing and repairs | 5 | 2 → 5 | 3 |
| Work communication | 5 | 2 → 5 | 3 |
| Emails and messages | 5 | 2 → 5 | 3 |
| Opinions and reasons | 5 | 2 → 5 | 3 |
| Reading notices | 5 | 2 → 5 | 3 |
| Listening for details | 5 | 2 → 5 | 3 |
| Negation: niet and geen | 5 | 2 → 5 | 3 |
| Object pronouns | 5 | 2 → 5 | 3 |
| Possessive words | 5 | 2 → 5 | 3 |
| Questions and clarification | 5 | 2 → 5 | 3 |
| Numbers, prices and quantities | 5 | 2 → 5 | 3 |
| Transport and travel | 5 | 2 → 5 | 3 |
| Food, restaurants and ordering | 5 | 2 → 5 | 3 |
| Family and relationships | 5 | 2 → 5 | 3 |
| Daily routines and frequency | 5 | 2 → 5 | 3 |
| Weather and seasons | 5 | 2 → 5 | 3 |
| Health and pharmacy | 5 | 2 → 5 | 3 |
| Municipality and public services | 5 | 2 → 5 | 3 |
| Banking and payments | 5 | 2 → 5 | 3 |
| Jobs and applications | 5 | 2 → 5 | 3 |
| Courses and learning | 5 | 2 → 5 | 3 |
| Invitations and social plans | 5 | 2 → 5 | 3 |
| Emergencies and safety | 5 | 2 → 5 | 3 |
| Complaints and customer service | 5 | 2 → 5 | 3 |
| Telling events in order | 5 | 2 → 5 | 3 |
| Obligation and permission | 5 | 2 → 5 | 3 |
| Conditions with als | 5 | 2 → 5 | 3 |
| Time prepositions | 5 | 2 → 5 | 3 |
| Phone calls and messages | 5 | 2 → 5 | 3 |
| Colours and describing things | 5 | 2 → 5 | 3 |
| Clothes and getting dressed | 5 | 2 → 5 | 3 |
| Locations and position | 5 | 2 → 5 | 3 |
| Food, meals and cooking | 5 | 2 → 5 | 3 |
| Furniture, rooms and the home | 5 | 2 → 5 | 3 |
| Separable verbs (scheidbare werkwoorden) | 7 | 3 → 6 | 3 |
| Verbs with fixed prepositions | 7 | 3 → 6 | 3 |

## What changed

- Topic-specific explanations and rules, worked Dutch examples with English rationale, at least two common-mistake contrasts, guided translation models and a realistic independent task for every topic.
- At least five examples and five quick checks per A2 lesson; 263 quick-check items total. The counts are a minimum, not a claim that fill-in items establish mastery.
- Replaced generic repeated-example depth sections. Practical lessons teach communication sequences; grammar lessons teach forms, word order and important contrasts.
- Clarified underspecified blanks. Accepted alternatives include appointment verzetten/verplaatsen and object me/mij; wrong meanings remain wrong.
- Added original check totals for expanded topics. Existing passes stay passed and old scores keep their original denominator. Newly attempted checks save their new total.
- No vocabulary, exam, backup, Worker, daily planner or storage migration changes. A1 and B1 content is byte-equivalent as parsed lesson data.

## Validation

Run `node a2-lesson-depth-test.cjs`, `node curriculum-test.js`, `node a2-mastery-test.js`, `node a2-practice-quality-test.js`, `node learning-update-test.cjs` and `node smoke-test.js`. New tests render all 52 lessons using DOM stubs, verify historical score/pass preservation and verify grammar/key alternatives. Live visual browser validation remains a user check. Automated structure checks do not certify natural-language correctness; report any problematic exercise.

## Reference checks

Core grammar cross-checked against author-written DutchGrammar explanations and university material; practical situations are original language exercises, not legal, financial or medical advice. References consulted:
- https://www.dutchgrammar.com/en/?n=Verbs.re13
- https://www.dutchgrammar.com/en/?n=Pronouns.Po01
- https://www.dutchgrammar.com/en/?n=Pronouns.Rf01
- https://www.dutchgrammar.com/en/?n=WordOrder.05
- https://resources.clie.ucl.ac.uk/learning-resources/online-dutch/lagelands-grammar/auxiliaries.php

## Next live check

After safe Codespaces sync and Ctrl+Shift+R, inspect one grammar lesson (e.g. Past participles) and one practical lesson (e.g. Housing and repairs), plus an already-passed topic. Confirm extra examples/checks, guided model reveals, retained passed status and old score totals. No need to redo all prior lessons or clear learning data.
