/*
==================================================
MIJN NEDERLANDS
DASHBOARD
==================================================
*/


const Dashboard = {

  profile: null,
  plan: null,
  activeActivity: null,
  DAILY_PLAN_KEY: "mijn_nederlands_daily_plan_v1",

  getTodayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  },

  getDailyRecord() {
    try {
      const data = JSON.parse(localStorage.getItem(this.DAILY_PLAN_KEY) || "null");
      return data && data.date === this.getTodayKey() ? data : null;
    } catch (_) {
      return null;
    }
  },

  saveDailyRecord(record) {
    localStorage.setItem(this.DAILY_PLAN_KEY, JSON.stringify(record));
  },

  isActivityComplete(activity) {
    return Boolean(this.getDailyRecord()?.completed?.[activity.id]);
  },

  getNextActivity() {
    return this.plan?.activities.find(a => !this.isActivityComplete(a)) || null;
  },

  completeActivity(savedResult) {
    if (!this.activeActivity || !savedResult) return false;
    const record = this.getDailyRecord();
    if (!record || !record.plan.activities.some(a => a.id === this.activeActivity.id)) return false;
    if (record.completed[this.activeActivity.id]) return true;
    record.completed[this.activeActivity.id] = {
      resultId: savedResult.id,
      completedAt: savedResult.completedAt
    };
    this.saveDailyRecord(record);
    return true;
  },

  continueTodayPlan() {
    this.activeActivity = null;
    const next = this.getNextActivity();
    if (next) this.startActivity(next, this.plan.activities.indexOf(next));
    else this.open();
  },


  /*
  ==================================================
  OPEN DASHBOARD
  ==================================================
  */

  open() {

    this.activeActivity = null;
    this.profile =
      ProfileEngine.refresh();

    let record = this.getDailyRecord();
    if (!record || !record.plan || !Array.isArray(record.plan.activities)) {
      const plan = StudyPlanEngine.createTodayPlan(this.profile);
      record = { date: this.getTodayKey(), plan, completed: {} };
      this.saveDailyRecord(record);
    }
    this.plan = record.plan;

    hideAllSections();

    const dashboard =
      document.getElementById(
        "dashboard"
      );

    if (!dashboard) {

      console.error(
        "Dashboard section not found."
      );

      return;
    }

    dashboard.classList.remove(
      "hidden"
    );

    this.render();

    window.scrollTo(
      0,
      0
    );

  },


  /*
  ==================================================
  RENDER EVERYTHING
  ==================================================
  */

  render() {
    // Show next unpassed A2 topic without changing the saved daily plan.
    const lessonStatus = document.getElementById('curriculumDashboardStatus');
    if (lessonStatus && typeof CurriculumEngine !== 'undefined') {
      const status = CurriculumEngine.getLearningStatus('A2');
      lessonStatus.textContent = `${status.passed}/${status.total} A2 topic checks passed` +
        (status.nextTitle ? ` · Next: ${status.nextTitle}` : ' · All topic checks passed');
    }

  this.renderA2Overview();
  this.renderGoal();
  this.renderPlan();
  this.renderStartButton();
  this.renderSkills();
  this.renderFocusAreas();
  this.renderProgress();

},

renderA2Overview() {
  // Display-only aggregation: never mutate curriculum, reviews, journal or the saved plan.
  const setText = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = String(value); };
  const status = typeof CurriculumEngine !== 'undefined' && typeof CurriculumEngine.getLearningStatus === 'function'
    ? CurriculumEngine.getLearningStatus('A2') : null;
  if (status) {
    const total = Number(status.total) || 0;
    const passed = Math.min(total, Math.max(0, Number(status.passed) || 0));
    setText('a2OverviewCount', `${passed} / ${total} topic checks passed`);
    setText('a2OverviewNext', status.nextTitle || 'All A2 topics checked');
    const progress = document.getElementById('a2OverviewProgress');
    if (progress) { progress.setAttribute('aria-valuemax', String(total)); progress.setAttribute('aria-valuenow', String(passed)); }
    const bar = document.getElementById('a2OverviewBar');
    if (bar) bar.style.width = `${total ? Math.round(100 * passed / total) : 0}%`;
  }
  const due = typeof SpacedReviewEngine !== 'undefined' && typeof SpacedReviewEngine.getDueReviews === 'function'
    ? SpacedReviewEngine.getDueReviews() : [];
  setText('a2OverviewDue', due.length);
  setText('a2OverviewDueDetail', due.length ? 'Topics ready for another review.' : 'No reviews due right now.');
  const mistakes = typeof A2Phase64 !== 'undefined' && typeof A2Phase64.load === 'function' ? A2Phase64.load() : [];
  setText('a2OverviewMistakes', mistakes.length);
},

renderStartButton() {

  const button =
    document.getElementById("dashboardStartButton");

  if (!button || !this.plan?.activities) {
    return;
  }

  const activities = this.plan.activities;

  const completedCount = activities.filter(
    activity => this.isActivityComplete(activity)
  ).length;

  if (activities.length > 0 && completedCount === activities.length) {

    button.textContent = "✓ Today's plan completed";
    button.disabled = true;

  } else if (completedCount > 0) {

    button.textContent = "Continue today's plan";
    button.disabled = false;

  } else {

    button.textContent = "Start today's plan";
    button.disabled = false;

  }

},


  /*
  ==================================================
  GOAL
  ==================================================
  */

  renderGoal() {

    const profile =
      this.profile;

    const target =
      document.getElementById(
        "dashboardTargetLevel"
      );

    const training =
      document.getElementById(
        "dashboardTrainingTarget"
      );

    const date =
      document.getElementById(
        "dashboardTargetDate"
      );


    if (target) {

      target.textContent =
        profile.goal
          .targetLanguageLevel;

    }


    if (training) {

      training.textContent =
        profile.goal
          .trainingTarget;

    }


    if (date) {

      const targetDate =
        new Date(
          profile.goal.targetDate +
          "T00:00:00"
        );


      date.textContent =
        targetDate
          .toLocaleDateString(
            "en-GB",
            {
              month:
                "long",

              year:
                "numeric"
            }
          );

    }

  },


  /*
  ==================================================
  TODAY'S PLAN
  ==================================================
  */

  renderPlan() {

  const plan =
    this.plan;


  const minutes =
    document.getElementById(
      "dashboardPlanMinutes"
    );


  if (minutes) {

    minutes.textContent =
      `${plan.plannedMinutes} min`;

  }


  const container =
    document.getElementById(
      "dashboardPlan"
    );


  if (!container) {
    return;
  }


  container.innerHTML =
    "";


  /*
  ==================================================
  ACTIVITY GROUPS
  ==================================================

  Concept practice is different from ordinary
  skill practice.

  Instead of presenting the concept as though
  it were another language skill, we present
  it as today's personalized focus.

  The underlying activity object and click
  behaviour remain unchanged.
  ==================================================
  */


  const focusActivities =
    plan.activities.filter(
      activity =>
        activity.type === "concept"
    );


  const regularActivities =
    plan.activities.filter(
      activity =>
        activity.type !== "concept"
    );


  /*
  ==================================================
  HELPER: CREATE ACTIVITY ROW
  ==================================================
  */

  const createActivityRow =
    (
      activity,
      originalIndex,
      options = {}
    ) => {

      const row =
        document.createElement(
          "button"
        );


      row.type =
        "button";


      row.className =
        options.focus
          ? "dashboard-activity dashboard-activity-focus"
          : "dashboard-activity";


      row.onclick =
        () =>
          this.startActivity(
            activity,
            originalIndex
          );


      /*
      ------------------------------------------
      TITLE
      ------------------------------------------
      */


      const title =
        escapeHTML(
          activity.title || ""
        );


      /*
      ------------------------------------------
      SUBTITLE
      ------------------------------------------

      Focus activities receive clearer learner-
      facing wording.

      We still use the original activity data;
      this changes presentation only.
      ------------------------------------------
      */


      let subtitle =
        activity.subtitle || "";


      if (
        options.focus
      ) {

        /*
        The current subtitle may contain text
        such as:

        "High priority · detected in Writing,
        Speaking"

        Remove the internal scheduling wording
        and make the reason understandable to
        the learner.
        */


        const detectedMatch =
          String(subtitle)
            .match(
              /detected in\s+(.+)$/i
            );


        if (
          detectedMatch &&
          detectedMatch[1]
        ) {

          subtitle =
            `Recommended from your recent ${detectedMatch[1]} mistakes`;

        } else {

          subtitle =
            "Recommended from your recent learning";

        }

      }


      /*
      ------------------------------------------
      ICON
      ------------------------------------------
      */


      const icon =
        activity.icon ||
        (
          options.focus
            ? "🎯"
            : "•"
        );


      /*
      ------------------------------------------
      NUMBER
      ------------------------------------------

      Keep the actual plan order.

      This means the visible numbering remains:

      1. focus
      2. writing
      3. speaking
      ...
      ------------------------------------------
      */


      const number =
        originalIndex + 1;

        const completed =
  this.isActivityComplete(activity);

if (completed) {
  row.classList.add("dashboard-activity-completed");
}

      row.innerHTML = `

        <div
          class="dashboard-activity-icon"
          aria-hidden="true"
        >
          ${icon}
        </div>


        <div
          class="dashboard-activity-main"
        >

          ${
            options.focus
              ? `
                <div
                  class="dashboard-focus-label"
                >
                  TODAY'S FOCUS
                </div>
              `
              : ""
          }


          <div
            class="dashboard-activity-title"
          >
            <span
              class="dashboard-activity-number"
            >
              ${number}.
            </span>

            ${title}
          </div>


          ${
            subtitle
              ? `
                <div
                  class="dashboard-activity-subtitle"
                >
                  ${escapeHTML(
                    subtitle
                  )}
                </div>
              `
              : ""
          }

        </div>


       <div class="dashboard-activity-time">
  ${completed ? "✓ Completed" : `${activity.minutes} min`}
</div>

      `;


      return row;

    };


  /*
  ==================================================
  TODAY'S FOCUS
  ==================================================
  */


  if (
    focusActivities.length
  ) {

    const section =
      document.createElement(
        "div"
      );


    section.className =
      "dashboard-plan-section dashboard-focus-section";


    focusActivities.forEach(
      activity => {

        const originalIndex =
          plan.activities.indexOf(
            activity
          );


        section.appendChild(
          createActivityRow(
            activity,
            originalIndex,
            {
              focus: true
            }
          )
        );

      }
    );


    container.appendChild(
      section
    );

  }


  /*
  ==================================================
  PRACTICE SECTION
  ==================================================
  */


  if (
    regularActivities.length
  ) {

    const section =
      document.createElement(
        "div"
      );


    section.className =
      "dashboard-plan-section dashboard-practice-section";


    /*
    Only show the PRACTICE heading when there
    is also a separate focus activity.

    This avoids unnecessary headings if a plan
    happens to contain no concept practice.
    */


    if (
      focusActivities.length
    ) {

      const heading =
        document.createElement(
          "div"
        );


      heading.className =
        "dashboard-plan-section-label";


      heading.textContent =
        "PRACTICE";


      section.appendChild(
        heading
      );

    }


    regularActivities.forEach(
      activity => {

        const originalIndex =
          plan.activities.indexOf(
            activity
          );


        section.appendChild(
          createActivityRow(
            activity,
            originalIndex
          )
        );

      }
    );


    container.appendChild(
      section
    );

  }

},


  /*
  ==================================================
  SKILLS
  ==================================================
  */

  renderSkills() {

    const container =
      document.getElementById(
        "dashboardSkills"
      );


    if (!container) {
      return;
    }


    container.innerHTML =
      "";


    const order = [

      "grammar",

      "vocabulary",

      "reading",

      "listening",

      "writing",

      "speaking",

      "knm"

    ];


    order.forEach(
      skillName => {

        const skill =
          this.profile
            .skills[
              skillName
            ];


        const row =
          document.createElement(
            "div"
          );


        row.className =
          "dashboard-skill-row";


        const icon =
          StudyPlanEngine
            .getSkillIcon(
              skillName
            );


        let status =
          "Not assessed";


        if (
          skill.assessed
        ) {

          if (
            skill.level
          ) {

            status =
              skill.level;

          }

          else if (
            typeof skill.score ===
            "number"
          ) {

            status =
              `${skill.score}%`;

          }

          else {

            status =
              "Assessed";

          }

        }


        row.innerHTML = `

          <div
            class="dashboard-skill-name"
          >
            <span>
              ${icon}
            </span>

            <span>
              ${escapeHTML(
                StudyPlanEngine
                  .formatConcept(
                    skillName
                  )
              )}
            </span>
          </div>


          <div
            class="dashboard-skill-level"
          >
            ${escapeHTML(status)}
          </div>

        `;


        container.appendChild(
          row
        );

      }
    );

  },


  /*
  ==================================================
  FOCUS AREAS
  ==================================================
  */

  renderFocusAreas() {

    const container =
      document.getElementById(
        "dashboardFocusAreas"
      );


    if (!container) {
      return;
    }


    const concepts =
      ProfileEngine
        .getPriorityConcepts(
          this.profile,
          3
        );


    container.innerHTML =
      "";


    if (
      concepts.length === 0
    ) {

      container.innerHTML = `

        <p class="small">
          Complete more writing and
          language exercises so Mijn
          Nederlands can identify your
          personal focus areas.
        </p>

      `;

      return;
    }


    concepts.forEach(
      concept => {

        const item =
          document.createElement(
            "div"
          );


        item.className =
          "dashboard-focus-item";


        /*
        Make the focus area behave like
        an interactive practice item.
        */

        item.setAttribute(
          "role",
          "button"
        );

        item.setAttribute(
          "tabindex",
          "0"
        );


        item.innerHTML = `

          <div
            class="dashboard-focus-icon"
          >
            ⚠
          </div>


          <div>

            <strong>
              ${escapeHTML(
                StudyPlanEngine
                  .formatConcept(
                    concept.name
                  )
              )}
            </strong>


            <div class="small">

              ${escapeHTML(
                StudyPlanEngine
                  .getConceptReason(
                    concept
                  )
              )}

            </div>

          </div>

        `;


        /*
        ------------------------------------------
        START PERSONALIZED CONCEPT PRACTICE
        ------------------------------------------
        */

        const startPractice =
          async () => {

            if (
              typeof PracticeUI ===
              "undefined"
            ) {

              console.error(
                "PracticeUI is not available."
              );

              return;
            }


            const activity = {

              id:
                `focus-${concept.name}`,

              type:
                "concept",

              concept:
                concept.name,

              title:
                StudyPlanEngine
                  .formatConcept(
                    concept.name
                  ),

              subtitle:
                StudyPlanEngine
                  .getConceptReason(
                    concept
                  ),

              minutes: 10,

              priority:
                concept.priority ||
                "high"

            };


            try {

              await PracticeUI
                .startFromActivity(
                  activity
                );

            } catch (error) {

              console.error(
                "Could not start practice:",
                error
              );

            }

          };


        /*
        Mouse / touch.
        */

        item.addEventListener(
          "click",
          startPractice
        );


        /*
        Keyboard accessibility.
        */

        item.addEventListener(
          "keydown",
          event => {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              event.preventDefault();

              startPractice();

            }

          }
        );


        container.appendChild(
          item
        );

      }
    );

  },  /*
  ==================================================
  PROGRESS & MASTERY
  ==================================================
  */

  renderProgress() {

    const container =
      document.getElementById(
        "dashboardProgress"
      );


    if (!container) {
      return;
    }


    /*
    ==================================================
    PROGRESS ENGINE
    ==================================================

    ProgressEngine is now the source of truth for
    learner-facing progress.

    ProfileEngine still owns the learner model, but
    the dashboard should not independently recreate
    progress calculations.
    ==================================================
    */

    if (
      typeof ProgressEngine ===
        "undefined" ||
      typeof ProgressEngine.getProgress !==
        "function"
    ) {

      container.innerHTML = `
        <p class="small">
          Progress tracking is not available yet.
        </p>
      `;

      return;
    }


    const progress =
      ProgressEngine.getProgress();


    /*
    ==================================================
    SNAPSHOT HISTORY
    ==================================================
    */

    const snapshotHistory =
      typeof Storage !== "undefined" &&
      typeof Storage.getProgressHistory ===
        "function"

        ? Storage.getProgressHistory()

        : [];


    const skills =
      Array.isArray(
        progress.skills
      )
        ? progress.skills
        : [];


    const concepts =
      Array.isArray(
        progress.concepts
      )
        ? progress.concepts
        : [];


    const practice =
      progress.practice || {};


    const activity =
      progress.activity || {};


    const hasEvidence =
      Number(
        activity.totalActivities || 0
      ) > 0 ||
      concepts.length > 0;


    if (!hasEvidence) {

      container.innerHTML = `
        <p class="small">
          Complete an assessment or some practice
          to start tracking your progress.
        </p>
      `;

      return;
    }


    /*
    ==================================================
    SKILL PROGRESS
    ==================================================
    */

    const skillProgressHTML =
      skills
        .filter(
          skill =>
            skill.assessed === true ||
            Boolean(
              skill.currentLevel
            ) ||
            (
              Array.isArray(
                skill.evidence
              ) &&
              skill.evidence.length > 0
            )
        )
        .map(
          skill => {

            const label =
              StudyPlanEngine
                .formatConcept(
                  skill.skill
                );


            const level =
              skill.currentLevel ||
              "Assessed";


            /*
            Convert internal trend states into
            learner-facing language.
            */

            const trendLabels = {

              improving:
                "↑ Improving",

              declining:
                "↓ Needs attention",

              stable:
                "→ Stable",

              insufficient_data:
                "More data needed"

            };


            const trendText =
              trendLabels[
                skill.trend
              ] ||
              "More data needed";


            return `

              <div class="dashboard-mastery-item">

                <div class="dashboard-mastery-heading">

                  <strong>
                    ${escapeHTML(
                      label
                    )}
                  </strong>


                  <div class="dashboard-mastery-score">

                    <strong>
                      ${escapeHTML(
                        level
                      )}
                    </strong>

                    <span class="dashboard-mastery-label">
                      ${escapeHTML(
                        trendText
                      )}
                    </span>

                  </div>

                </div>

              </div>

            `;

          }
        )
        .join("");


    /*
    ==================================================
    CONCEPT MASTERY
    ==================================================

    Show the learner the concepts that currently
    need the most attention.

    Lower mastery is shown first.

    This is deliberately different from the Focus
    Areas card. Focus Areas decides what the learner
    should practise next; this section explains the
    learner's current mastery state.
    ==================================================
    */

    const conceptProgress =
      concepts
        .filter(
          concept =>
            concept.mastery !== null &&
            concept.mastery !== undefined
        )
        .slice()
        .sort(
          (a, b) =>
            Number(
              a.mastery || 0
            ) -
            Number(
              b.mastery || 0
            )
        )
        .slice(
          0,
          5
        );


    const conceptProgressHTML =
      conceptProgress
        .map(
          concept => {

            const mastery =
              Math.max(
                0,
                Math.min(
                  100,
                  Number(
                    concept.mastery || 0
                  )
                )
              );


            const masteryLabel =
              typeof ProfileEngine
                .getMasteryLabel ===
                "function"

                ? ProfileEngine
                    .getMasteryLabel(
                      mastery
                    )

                : `${mastery}%`;


            /*
            ------------------------------------------
            PRACTICE DESCRIPTION
            ------------------------------------------
            */

            let practiceText =
              "No practice yet";


            if (
              Number(
                concept.practiceSessions ||
                0
              ) > 0
            ) {

              if (
                concept.latestPracticeScore !==
                  null &&
                concept.latestPracticeScore !==
                  undefined
              ) {

                practiceText =
                  `Latest practice: ${concept.latestPracticeScore}%`;

              } else {

                const sessions =
                  Number(
                    concept.practiceSessions ||
                    0
                  );


                practiceText =
                  `${sessions} practice session${
                    sessions === 1
                      ? ""
                      : "s"
                  }`;

              }

            }


            return `

              <div class="dashboard-mastery-item">

                <div class="dashboard-mastery-heading">

                  <strong>
                    ${escapeHTML(
                      concept.label ||
                      StudyPlanEngine
                        .formatConcept(
                          concept.concept
                        )
                    )}
                  </strong>


                  <div class="dashboard-mastery-score">

                    <strong>
                      ${mastery}%
                    </strong>

                    <span class="dashboard-mastery-label">
                      ${escapeHTML(
                        masteryLabel
                      )}
                    </span>

                  </div>

                </div>


                <div class="dashboard-mastery-bar">

                  <div
                    class="dashboard-mastery-fill"
                    style="width: ${mastery}%"
                  ></div>

                </div>


                <div class="small">
                  ${escapeHTML(
                    practiceText
                  )}
                </div>

              </div>

            `;

          }
        )
        .join("");


    /*
    ==================================================
    SNAPSHOT HISTORY SUMMARY
    ==================================================
    */

    let historyText =
      "Progress history starts with your next completed activity.";


    if (
      snapshotHistory.length
    ) {

      const sortedHistory =
        snapshotHistory
          .slice()
          .sort(
            (a, b) =>
              ProgressEngine
                .getTime(a) -
              ProgressEngine
                .getTime(b)
          );


      const firstSnapshot =
        sortedHistory[0];


      const firstDateValue =
        firstSnapshot
          ?.generatedAt ||
        firstSnapshot
          ?.savedAt ||
        firstSnapshot
          ?.completedAt ||
        null;


      if (
        firstDateValue
      ) {

        const firstDate =
          new Date(
            firstDateValue
          );


        if (
          !Number.isNaN(
            firstDate.getTime()
          )
        ) {

          historyText =
            `Tracking progress since ${
              firstDate
                .toLocaleDateString(
                  "en-GB",
                  {
                    day:
                      "numeric",

                    month:
                      "short",

                    year:
                      "numeric"
                  }
                )
            }.`;

        }

      }

    }


    /*
    ==================================================
    PRACTICE SUMMARY
    ==================================================
    */

    const practiceAccuracy =
      practice.accuracy === null ||
      practice.accuracy === undefined

        ? "—"

        : `${practice.accuracy}%`;


    const practiceTrendLabels = {

      improving:
        "↑ Improving",

      declining:
        "↓ Needs attention",

      stable:
        "→ Stable",

      insufficient_data:
        "More data needed"

    };


    const practiceTrend =
      practiceTrendLabels[
        practice.trend
      ] ||
      "More data needed";


    /*
    ==================================================
    RENDER
    ==================================================
    */

    container.innerHTML = `

      <div class="dashboard-progress-grid">

        <div>

          <div class="small">
            Practice sessions
          </div>

          <strong class="dashboard-big-value">
            ${Number(
              practice.sessions || 0
            )}
          </strong>

        </div>


        <div>

          <div class="small">
            Practice accuracy
          </div>

          <strong class="dashboard-big-value">
            ${escapeHTML(
              practiceAccuracy
            )}
          </strong>

        </div>


        <div>

          <div class="small">
            Progress snapshots
          </div>

          <strong class="dashboard-big-value">
            ${snapshotHistory.length}
          </strong>

        </div>

      </div>


      <div class="dashboard-progress-highlight">

        <div class="small">
          Practice trend
        </div>

        <strong>
          ${escapeHTML(
            practiceTrend
          )}
        </strong>

        <div class="small">
          ${escapeHTML(
            historyText
          )}
        </div>

      </div>


      ${
        skillProgressHTML
          ? `

              <div class="dashboard-mastery-list">

                <div class="skill-label">
                  SKILL PROGRESS
                </div>

                ${skillProgressHTML}

              </div>

            `
          : ""
      }


      ${
        conceptProgressHTML
          ? `

              <div class="dashboard-mastery-list">

                <div class="skill-label">
                  TOPICS TO WORK ON
                </div>

                ${conceptProgressHTML}

              </div>

            `
          : ""
      }

    `;

  },  /*
  ==================================================
  START TODAY'S PLAN
  ==================================================
  */

  startTodayPlan() {
    const next = this.getNextActivity();
    if (next) this.startActivity(next, this.plan.activities.indexOf(next));
    else this.open();
  },


  /*
  ==================================================
  START AN ACTIVITY
  ==================================================

  Today's Plan is PRACTICE.

  Assessment launchers must not be used here.

  Concept activities and language-skill activities
  are routed through PracticeUI.

  This prevents Reading, Listening, Writing and
  Speaking from reopening their initial assessments.
  ==================================================
  */

  startActivity(
    activity,
    index
  ) {

    if (!activity) return;
    this.activeActivity = activity;

    /*
    ==================================================
    CONCEPT PRACTICE
    ==================================================
    */

    if (
      activity.type ===
      "concept"
    ) {

      if (
        typeof PracticeUI ===
        "undefined"
      ) {

        console.error(
          "PracticeUI is not available."
        );

        return;

      }


      const concept = this.profile?.concepts?.[activity.concept];
      const needsLesson = concept && (
        (Number(concept.mastery) < 60 &&
          (Number(concept.moderateErrors || 0) + Number(concept.majorErrors || 0) > 0)) ||
        Number(concept.recentPracticeFailures || 0) >= 3
      );
      const isScheduledReview =
  activity.source === "spaced_review";

const launch =
  !isScheduledReview &&
  needsLesson &&
  typeof ErrorLessonEngine !== "undefined"
    ? ErrorLessonEngine.startLesson(activity.concept)
    : PracticeUI.startFromActivity(activity);
      Promise.resolve(launch)
        .catch(
          error => {

            console.error(
              "Could not start concept practice:",
              error
            );

          }
        );


      return;

    }


    /*
    ==================================================
    SKILL PRACTICE
    ==================================================

    Study-plan skill activities must start a
    PracticeEngine skill session.

    They must NOT call:

      developerStartSkill()
      startWritingAssessment()
      startSpeakingAssessment()

    Those functions belong to assessment flows,
    not Today's Plan.
    ==================================================
    */

    const practiceSkills = [

      "grammar",

      "vocabulary",

      "reading",

      "listening",

      "writing",

      "speaking"

    ];


    if (
      activity.skill &&
      practiceSkills.includes(
        activity.skill
      )
    ) {

      if (
        typeof PracticeUI ===
        "undefined"
      ) {

        console.error(
          "PracticeUI is not available."
        );

        return;

      }


      /*
      Normalize the activity as skill practice.

      Some existing StudyPlanEngine activities may
      already have type: "skill".

      Others may simply contain a skill property.

      PracticeUI.startFromActivity() supports
      type: "skill", so normalize it here rather
      than depending on older study-plan shapes.
      */

      const practiceActivity = {

        ...activity,

        type:
          "skill"

      };


      PracticeUI
        .startFromActivity(
          practiceActivity
        )
        .catch(
          error => {

            console.error(
              `Could not start ${activity.skill} practice:`,
              error
            );

          }
        );


      return;

    }


    /*
    ==================================================
    KNM
    ==================================================

    KNM is intentionally kept separate for now.

    It will eventually need its own practice
    generator/content architecture.
    ==================================================
    */

    if (
      activity.type ===
        "knm" ||
      activity.skill ===
        "knm"
    ) {

      this.showComingSoon(
        "KNM",
        "The Knowledge of Dutch Society module is the next major course module."
      );

      return;

    }


    /*
    ==================================================
    REVIEW
    ==================================================
    */

    if (
      activity.type ===
      "review"
    ) {

      this.showComingSoon(
        "Review",
        "Spaced review will use your vocabulary and previous mistakes."
      );

      return;

    }


    /*
    ==================================================
    UNKNOWN ACTIVITY
    ==================================================
    */

    this.showComingSoon(
      activity.title ||
      "Practice",
      "This activity is not available yet."
    );

  },


  /*
  ==================================================
  TEMPORARY MODULE MESSAGE
  ==================================================
  */

  showComingSoon(
    title,
    message
  ) {

    const titleElement =
      document.getElementById(
        "moduleComingSoonTitle"
      );


    const messageElement =
      document.getElementById(
        "moduleComingSoonMessage"
      );


    if (titleElement) {

      titleElement.textContent =
        title;

    }


    if (messageElement) {

      messageElement.textContent =
        message;

    }


    hideAllSections();


    const section =
      document.getElementById(
        "moduleComingSoon"
      );


    if (section) {

      section.classList.remove(
        "hidden"
      );

    }


    window.scrollTo(
      0,
      0
    );

  }

};



/*
==================================================
GLOBAL BUTTON HELPERS
==================================================
*/


function openDashboard() {

  Dashboard.open();

}


function startTodayPlan() {

  Dashboard.startTodayPlan();

}