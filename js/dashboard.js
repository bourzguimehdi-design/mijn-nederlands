/*
==================================================
MIJN NEDERLANDS
DASHBOARD
==================================================
*/


const Dashboard = {

  profile: null,
  plan: null,


  /*
  ==================================================
  OPEN DASHBOARD
  ==================================================
  */

  open() {

    this.profile =
      ProfileEngine.refresh();

    this.plan =
      StudyPlanEngine.createTodayPlan(
        this.profile
      );

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

  this.renderGoal();

  this.renderPlan();

  this.renderSkills();

  this.renderFocusAreas();

  this.renderProgress();

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


    plan.activities.forEach(
      (activity, index) => {

        const row =
          document.createElement(
            "button"
          );


        row.className =
          "dashboard-activity";


        row.onclick =
          () =>
            this.startActivity(
              activity,
              index
            );


        const number =
          index + 1;


        row.innerHTML = `

          <div
            class="dashboard-activity-icon"
          >
            ${activity.icon}
          </div>


          <div
            class="dashboard-activity-main"
          >

            <div
              class="dashboard-activity-title"
            >
              ${number}.
              ${escapeHTML(
                activity.title
              )}
            </div>

            <div
              class="dashboard-activity-subtitle"
            >
              ${escapeHTML(
                activity.subtitle
              )}
            </div>

          </div>


          <div
            class="dashboard-activity-time"
          >
            ${activity.minutes} min
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


  const profile =
    this.profile ||
    ProfileEngine.refresh();


  const concepts =
    ProfileEngine.getPriorityConcepts(
      profile,
      100
    );


  if (!concepts.length) {

    container.innerHTML = `
      <p class="small">
        Complete some practice to start
        tracking your progress.
      </p>
    `;

    return;
  }


  /*
  Concepts the learner has actually
  practised.
  */

  const practised =
    concepts.filter(
      concept =>
        (
          concept.practiceSuccesses || 0
        ) +
        (
          concept.practiceFailures || 0
        ) > 0
    );


  const totalSuccesses =
    practised.reduce(
      (total, concept) =>
        total +
        (
          concept.practiceSuccesses || 0
        ),
      0
    );


  const totalFailures =
    practised.reduce(
      (total, concept) =>
        total +
        (
          concept.practiceFailures || 0
        ),
      0
    );


  const totalAnswers =
    totalSuccesses +
    totalFailures;


  const accuracy =
    totalAnswers
      ? Math.round(
          (
            totalSuccesses /
            totalAnswers
          ) * 100
        )
      : 0;


  /*
  Highest mastery among concepts that
  have actually been practised.
  */

  const strongest =
    [...practised]
      .sort(
        (a, b) =>
          (b.mastery || 0) -
          (a.mastery || 0)
      )[0];

const progressConcepts =
  [...practised]
    .sort(
      (a, b) =>
        (b.mastery || 0) -
        (a.mastery || 0)
    )
    .slice(
      0,
      5
    );


const conceptProgressHTML =
  progressConcepts
    .map(
      concept => {

        const mastery =
          Math.max(
            0,
            Math.min(
              100,
              concept.mastery || 0
            )
          );


        const recentSuccesses =
          concept.recentPracticeSuccesses ||
          0;


        const recentFailures =
          concept.recentPracticeFailures ||
          0;


        const recentTotal =
          recentSuccesses +
          recentFailures;


        const recentText =
          recentTotal
            ? `${recentSuccesses} of ${recentTotal} correct in recent practice`
            : "Practice data available";


        return `

          <div class="dashboard-mastery-item">

            <div class="dashboard-mastery-heading">

  <strong>
    ${escapeHTML(
      StudyPlanEngine.formatConcept(
        concept.name
      )
    )}
  </strong>

  <div class="dashboard-mastery-score">

    <strong>
      ${mastery}%
    </strong>

    <span class="dashboard-mastery-label">
      ${escapeHTML(
        ProfileEngine.getMasteryLabel(
          mastery
        )
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
              ${recentText}
            </div>

          </div>

        `;

      }
    )
    .join("");
  container.innerHTML = `

    <div class="dashboard-progress-grid">

      <div>

        <div class="small">
          Practice answers
        </div>

        <strong class="dashboard-big-value">
          ${totalAnswers}
        </strong>

      </div>


      <div>

        <div class="small">
          Practice accuracy
        </div>

        <strong class="dashboard-big-value">
          ${accuracy}%
        </strong>

      </div>


      <div>

        <div class="small">
          Concepts practised
        </div>

        <strong class="dashboard-big-value">
          ${practised.length}
        </strong>

      </div>

    </div>


    ${
      strongest
        ? `

          <div class="dashboard-progress-highlight">

            <div class="small">
              Strongest practised concept
            </div>

            <strong>
              ${escapeHTML(
                StudyPlanEngine.formatConcept(
                  strongest.name
                )
              )}
            </strong>

            <div class="small">
              ${strongest.mastery || 0}% mastery
            </div>

          </div>

        `
        : ""
    }
<div class="dashboard-mastery-list">

  <div class="skill-label">
    CONCEPT MASTERY
  </div>

  ${conceptProgressHTML}

</div>
  `;

},

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


  container.innerHTML = "";


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

},

  /*
  ==================================================
  START TODAY'S PLAN
  ==================================================
  */

  startTodayPlan() {

    if (
      !this.plan ||
      !this.plan.activities.length
    ) {

      return;

    }


    this.startActivity(
      this.plan.activities[0],
      0
    );

  },


  /*
  ==================================================
  START AN ACTIVITY
  ==================================================

  For modules that already exist,
  launch them.

  Missing modules show a temporary
  message until we build them.
  ==================================================
  */

  startActivity(
    activity,
    index
  ) {

    if (!activity) {
      return;
    }


    /*
PERSONALIZED CONCEPT PRACTICE
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


  PracticeUI
    .startFromActivity(
      activity
    )
    .catch(
      error => {

        console.error(
          "Could not start practice:",
          error
        );

      }
    );


  return;

}


    /*
    KNM
    */

    if (
      activity.type ===
      "knm"
    ) {

      this.showComingSoon(
        "KNM",
        "The Knowledge of Dutch Society module is the next major course module."
      );

      return;

    }


    /*
    REVIEW
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
    EXISTING SKILLS
    */

    switch (
      activity.skill
    ) {

      case "grammar":

        developerStartSkill(
          "grammar"
        );

        return;


      case "vocabulary":

        developerStartSkill(
          "vocabulary"
        );

        return;


      case "reading":

        developerStartSkill(
          "reading"
        );

        return;


      case "listening":

        developerStartSkill(
          "listening"
        );

        return;


      case "writing":

        startWritingAssessment();

        return;


      case "speaking":

        this.showComingSoon(
          "Speaking",
          "Speaking assessment will use your microphone and AI feedback."
        );

        return;


      default:

        this.showComingSoon(
          activity.title,
          "This activity is not available yet."
        );

    }

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