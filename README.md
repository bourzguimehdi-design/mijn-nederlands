# Mijn Nederlands — personal learning build

## What changed (9 October 2026)

- Today's Plan no longer schedules KNM or spaced-review placeholder screens. Until those modules are built, the study time is allocated to usable language practice.
- A plan is stored per local calendar day in `localStorage` (`mijn_nederlands_daily_plan_v1`) so opening the dashboard does not regenerate and reorder activities mid-day.
- Completed activities are recorded against their activity IDs, and completion is restored on dashboard reopen.
- The next unfinished activity is selected when starting Today's Plan.
- Weak concept activities with substantive error evidence can launch an existing mini-lesson before practice.
- Practice results now include `dailyPlanDate` and `dailyActivityId` for plan-launched sessions; completion is only recorded after a practice result is successfully saved.
- Practice completion provides a Continue Today's Plan button when another activity is unfinished.
- Re-rendering a completion screen does not re-save the same result.

## How to run

Serve the folder from your existing local web server, using the existing API/Worker configuration. Keep the same browser origin if you want to retain the existing `localStorage` learner profile. **Back up browser storage before replacing the original files.**

For a quick static server: `python -m http.server 8000` from this directory, then open `http://localhost:8000`. AI-generated practice still requires the configured external API/Worker.

## Validation

- `node --check js/*.js` (run individually in a loop) — passed.
- `node smoke-test.js` — passed: usable 60-minute plan, unique activity IDs, daily completion survives dashboard reopen.

## Not yet completed / important limitations

- KNM course content and true spaced-repetition review are **not implemented**; the plan temporarily replaces them with language practice.
- No end-to-end browser/Worker test was possible in this environment. Check lesson generation, audio, speaking and writing on your deployment.
- CEFR/B1 proficiency has not been independently validated. The app's mastery score is not an external B1 certificate.
- The daily plan is intentionally frozen for each local day; a change in preferences will take effect in the next day's plan.
- This build does not migrate or synchronize learner data between browsers/devices.

## Quick manual acceptance test

1. Back up your existing app's browser data and replace the code with this folder, preserving the original browser origin.
2. Open Today's Plan: verify there are no KNM/Review placeholders and total time equals your weekday/weekend budget.
3. Start Perfect Tense: when the profile indicates substantial weakness, the lesson should appear before practice.
4. Complete the practice; verify the completion screen shows Continue Today's Plan.
5. Continue to the next activity, then return to the dashboard. The completed activity should show a check mark and should be skipped by Start Today's Plan.
6. Refresh the page and repeat step 5. Verify the previous practice result is not duplicated.
7. Test reading, listening, writing, and speaking on the deployed Worker service.
