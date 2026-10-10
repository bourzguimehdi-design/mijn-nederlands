/*
==================================================
MIJN NEDERLANDS

PERSONALISED STUDY PLAN ENGINE
==================================================
*/


const StudyPlanEngine = {


  /*
  ==================================================
  CREATE TODAY'S PLAN
  ==================================================
  */

  createTodayPlan(
    profile = null,
    date = new Date()
  ) {

    const learner =
      profile ||
      ProfileEngine.refresh();


    const isWeekend =
      date.getDay() === 0 ||
      date.getDay() === 6;


    const availableMinutes =
      isWeekend
        ? learner.preferences.weekendMinutes
        : learner.preferences.weekdayMinutes;


    const plan = {

      date:
        date.toISOString(),

      isWeekend,

      availableMinutes,

      plannedMinutes: 0,

      activities: []

    };


    /*
    ------------------------------------------
    1. ADAPTIVE PERSONAL WEAKNESS
    ------------------------------------------

    Start with concepts identified by
    ProfileEngine.

    Then calculate a scheduling score using:

    - mastery
    - recent successes
    - recent failures
    - time since last practice

    This affects scheduling only.

    It does NOT directly modify mastery.
    */


    /*
------------------------------------------
ACTIVE CURRICULUM CONCEPTS
------------------------------------------

Only concepts that are part of the learner's
active curriculum may enter study-plan
scheduling.

This includes:

- built-in learning topics
- discovered concepts after promotion

Unpromoted discovered/assessment concepts
remain evidence only and cannot enter the
study plan.
*/

const priorities =
  Object.values(
    learner.concepts || {}
  )
    .filter(
      concept =>
        concept &&
        concept.learningTopic === true
    )
    .sort(
      (a, b) => {

        const scoreA =
          ProfileEngine
            .getConceptPriorityScore(
              a
            );

        const scoreB =
          ProfileEngine
            .getConceptPriorityScore(
              b
            );

        return scoreB - scoreA;

      }
    );


    const adaptivePriorities =
      priorities
        .map(
          concept => {


            /*
            ------------------------------------------
            MASTERY
            ------------------------------------------
            */

            const mastery =
              Number(
                concept.mastery || 20
              );


            /*
            ------------------------------------------
            RECENT PRACTICE
            ------------------------------------------
            */

            const recentSuccesses =
              Number(
                concept.recentPracticeSuccesses ||
                0
              );


            const recentFailures =
              Number(
                concept.recentPracticeFailures ||
                0
              );


            /*
            ------------------------------------------
            DAYS SINCE PRACTICE
            ------------------------------------------

            Concepts that have never been
            practised receive the strongest
            exploration bonus.
            */

            let daysSincePractice = 30;


            if (
              concept.lastPracticeAt
            ) {

              const lastPractice =
                new Date(
                  concept.lastPracticeAt
                );


              const elapsed =
                date.getTime() -
                lastPractice.getTime();


              daysSincePractice =
                Math.max(
                  0,
                  elapsed /
                    (
                      1000 *
                      60 *
                      60 *
                      24
                    )
                );

            }


            /*
            ------------------------------------------
            RECENCY BONUS
            ------------------------------------------
            */

            let recencyBonus;


            if (
              !concept.lastPracticeAt
            ) {

              recencyBonus = 25;

            }

            else if (
              daysSincePractice < 1
            ) {

              recencyBonus = 0;

            }

            else if (
              daysSincePractice < 2
            ) {

              recencyBonus = 5;

            }

            else if (
              daysSincePractice < 4
            ) {

              recencyBonus = 10;

            }

            else if (
              daysSincePractice < 7
            ) {

              recencyBonus = 15;

            }

            else {

              recencyBonus = 20;

            }


            /*
            ------------------------------------------
            MASTERY NEED
            ------------------------------------------

            Lower mastery means greater
            learning need.

            Example:

            40 mastery -> 60 need
            70 mastery -> 30 need
            */

            const masteryNeed =
              100 - mastery;


            /*
            ------------------------------------------
            RECENT PERFORMANCE SIGNAL
            ------------------------------------------

            Failures increase urgency.

            Recent successes reduce urgency
            slightly because the learner has
            recently demonstrated retrieval.
            */

            const recentSignal =
              (recentFailures * 6) -
              Math.min(
                8,
                recentSuccesses
              );


            /*
            ------------------------------------------
            FINAL ADAPTIVE SCORE
            ------------------------------------------

            Weakness remains the strongest
            signal.

            Recency prevents the same concept
            from winning forever.
            */

            let adaptiveScore =
              masteryNeed +
              recentSignal +
              recencyBonus;


            /*
            ------------------------------------------
            SAME-DAY REPETITION PENALTY
            ------------------------------------------

            If this concept has already been
            practised today, reduce its
            scheduling priority.

            This does NOT modify mastery.
            */

            if (
              concept.lastPracticeAt &&
              daysSincePractice < 1
            ) {

              adaptiveScore -= 15;

            }


            /*
            Temporary diagnostic output.

            Keep this while testing the
            adaptive planner.

            It can be removed later.
            */

           


            return {
              ...concept,
              adaptiveScore
            };

          }
        )
        .sort(
          (a, b) =>
            b.adaptiveScore -
            a.adaptiveScore
        );


    /*
    ------------------------------------------
    ADD PERSONAL WEAKNESS ACTIVITY
    ------------------------------------------
    */

    if (
      adaptivePriorities.length > 0
    ) {

      // Prefer due reviews that belong to the active curriculum.
const dueReviews =
  typeof SpacedReviewEngine !== "undefined"
    ? SpacedReviewEngine.getDueReviews(date)
    : [];

const dueConcept = dueReviews
  .map(review => {
    const matchingConcept = adaptivePriorities.find(
      item =>
        SpacedReviewEngine.normalizeConcept(item.name) ===
        review.concept
    );

    return matchingConcept
      ? { review, concept: matchingConcept }
      : null;
  })
  .filter(Boolean)
  .sort((a, b) => {
    const dateComparison =
      a.review.nextReviewDate.localeCompare(
        b.review.nextReviewDate
      );

    return dateComparison ||
      b.concept.adaptiveScore - a.concept.adaptiveScore;
  })[0];

const concept =
  dueConcept?.concept || adaptivePriorities[0];


      /*
      Adjust session length according
      to mastery.

      Very weak concepts receive more
      practice.

      Stronger concepts receive shorter
      reinforcement sessions.
      */

      let conceptMinutes;


      if (
        concept.mastery < 40
      ) {

        conceptMinutes =
          isWeekend
            ? 20
            : 15;

      }

      else if (
        concept.mastery < 60
      ) {

        conceptMinutes = 15;

      }

      else if (
        concept.mastery < 80
      ) {

        conceptMinutes = 10;

      }

      else {

        conceptMinutes = 5;

      }


      this.addActivity(
        plan,
        {
          id:
  dueConcept
    ? `review-${concept.name}`
    : `focus-${concept.name}`,

type:
  "concept",

source:
  dueConcept
    ? "spaced_review"
    : "adaptive_focus",

icon:
  dueConcept ? "🔁" : "🎯",

title:
  dueConcept
    ? `Review: ${this.formatConcept(concept.name)}`
    : this.formatConcept(concept.name),

subtitle:
  dueConcept
    ? "Spaced repetition — reinforce previous mistakes"
    : this.getConceptReason(concept),

          minutes:
            conceptMinutes,

          priority:
            concept.mastery < 60
              ? "high"
              : "normal",

          concept:
            concept.name
        }
      );

    }


    /*
    ------------------------------------------
    2. MAIN LANGUAGE SKILL
    ------------------------------------------
    */

    const languageSkill =
      this.chooseLanguageSkill(
        learner,
        date
      );


    if (
      languageSkill
    ) {

      this.addActivity(
        plan,
        {
          id:
            `skill-${languageSkill}`,

          type:
            "skill",

          icon:
            this.getSkillIcon(
              languageSkill
            ),

          title:
            this.formatConcept(
              languageSkill
            ),

          subtitle:
            this.getSkillSubtitle(
              learner,
              languageSkill
            ),

          minutes:
            15,

          priority:
            "normal",

          skill:
            languageSkill
        }
      );

    }


    /*
    ------------------------------------------
    3. SECOND LANGUAGE ACTIVITY
    ------------------------------------------
    */

    const secondSkill =
      this.chooseSecondSkill(
        learner,
        languageSkill,
        date
      );


    /*
    Important:

    chooseSecondSkill() is allowed to return
    null.

    Therefore we only add the activity when
    a usable skill actually exists.
    */

    if (
      secondSkill
    ) {

      this.addActivity(
        plan,
        {
          id:
            `skill-${secondSkill}`,

          type:
            "skill",

          icon:
            this.getSkillIcon(
              secondSkill
            ),

          title:
            this.formatConcept(
              secondSkill
            ),

          subtitle:
            this.getSkillSubtitle(
              learner,
              secondSkill
            ),

          minutes:
            15,

          priority:
            "normal",

          skill:
            secondSkill
        }
      );

    }


    /*
    KNM and spaced review are not yet implemented as interactive
    activities. Replace their time with working skill sessions.
    Distinct IDs avoid ambiguity in daily completion tracking.
    */
    const alreadyUsed = new Set(
      plan.activities.filter(a => a.skill).map(a => a.skill)
    );
    const rotation = ["listening", "reading", "vocabulary", "grammar", "speaking", "writing"];
    const dayOffset = Math.floor(date.getTime() / 86400000) % rotation.length;
    const ordered = rotation.slice(dayOffset).concat(rotation.slice(0, dayOffset));
    const supplements = ordered.filter(skill => !alreadyUsed.has(skill));
    [15, 5].forEach((minutes, index) => {
      const skill = supplements[index] || ordered[index];
      this.addActivity(plan, {
        id: `extra-${index}-${skill}`,
        type: "skill",
        icon: this.getSkillIcon(skill),
        title: this.formatConcept(skill),
        subtitle: "Additional Dutch practice (KNM and review are in development)",
        minutes,
        priority: "normal",
        skill
      });
    });


    /*
    ------------------------------------------
    6. WEEKEND EXTRA
    ------------------------------------------
    */

    if (
      isWeekend
    ) {

      /*
      Remove null values before sending the
      list to chooseWeekendSkill().
      */

      const usedSkills =
        [
          languageSkill,
          secondSkill
        ].filter(Boolean);


      const extraSkill =
        this.chooseWeekendSkill(
          learner,
          usedSkills,
          date
        );


      /*
      chooseWeekendSkill() may legitimately
      return null, so don't create an invalid
      activity.
      */

      if (
        extraSkill
      ) {

        this.addActivity(
          plan,
          {
            id:
              `weekend-${extraSkill}`,

            type:
              "skill",

            icon:
              this.getSkillIcon(
                extraSkill
              ),

            title:
              this.formatConcept(
                extraSkill
              ),

            subtitle:
              "Extended weekend practice",

            minutes:
              20,

            priority:
              "normal",

            skill:
              extraSkill
          }
        );

      }

    }


    /*
    ------------------------------------------
    FIT PLAN INTO AVAILABLE TIME
    ------------------------------------------
    */

    this.fitToTime(plan);

    // Use the full available study budget with functioning activities.
    // fitToTime only reduces over-budget plans, so distribute any surplus.
    let spare = Math.max(0, plan.availableMinutes - plan.plannedMinutes);
    let i = 0;
    while (spare > 0 && plan.activities.length) {
      const activity = plan.activities[i % plan.activities.length];
      const increment = Math.min(5, spare);
      activity.minutes += increment;
      plan.plannedMinutes += increment;
      spare -= increment;
      i++;
    }

    return plan;

  },


  /*
  ==================================================
  ADD ACTIVITY
  ==================================================
  */

  addActivity(
    plan,
    activity
  ) {

    /*
    Defensive validation.

    Don't add malformed activities.
    */

    if (
      !plan ||
      !activity ||
      !activity.id
    ) {

      return;

    }


    plan.activities.push(
      activity
    );


    plan.plannedMinutes +=
      Number(
        activity.minutes || 0
      );

  },


  /*
  ==================================================
  CHOOSE MAIN LANGUAGE SKILL
  ==================================================
  */

  chooseLanguageSkill(
    profile,
    date
  ) {

    const skillNames = [
      "writing",
      "speaking",
      "grammar",
      "vocabulary",
      "listening",
      "reading"
    ];


    const candidates =
      skillNames
        .map(
          skillName => {

            const skill =
              profile.skills[
                skillName
              ];


            if (
              !skill ||
              !skill.assessed
            ) {

              return null;

            }


            const score =
              Number.isFinite(
                skill.score
              )
                ? skill.score
                : 50;


            const confidence =
              Number.isFinite(
                skill.confidence
              )
                ? skill.confidence
                : 50;


            /*
            Lower skill score =
            greater learning need.
            */

            let priority =
              100 - score;


            /*
            Low-confidence assessments get
            a small additional priority.
            */

            priority +=
              (100 - confidence) *
              0.1;


            /*
            Productive skills receive a
            modest boost.
            */

            if (
              skillName === "writing" ||
              skillName === "speaking"
            ) {

              priority += 5;

            }


            return {
              skillName,
              priority
            };

          }
        )
        .filter(Boolean);


    /*
    If no assessed language skill exists,
    grammar remains the safe fallback.
    */

    if (
      candidates.length === 0
    ) {

      return "grammar";

    }


    candidates.sort(
      (a, b) =>
        b.priority -
        a.priority
    );


    /*
    Main activity stays remediation-focused.

    The weakest assessed skill should receive
    sustained attention.
    */

    return candidates[0]
      .skillName;

  },


  /*
  ==================================================
  CHOOSE SECOND SKILL
  ==================================================
  */

  chooseSecondSkill(
    profile,
    firstSkill,
    date
  ) {

    const remediationSkills = [
      "writing",
      "speaking",
      "grammar"
    ];


    const maintenanceSkills = [
      "listening",
      "reading",
      "vocabulary"
    ];


    /*
    ------------------------------------------
    MAINTENANCE DAYS
    ------------------------------------------

    Roughly every fourth day, use the
    second activity to maintain a stronger
    receptive/general skill.

    The date-based choice keeps plan
    generation deterministic.
    */

    const useMaintenance =
      date.getDate() % 4 === 0;


    let pool =
      useMaintenance
        ? maintenanceSkills
        : remediationSkills;


    /*
    Don't repeat the main language skill.
    */

    pool =
      pool.filter(
        skillName =>
          skillName !== firstSkill
      );


    /*
    Only assessed skills are candidates.
    */

    let candidates =
      pool
        .map(
          skillName => {

            const skill =
              profile.skills[
                skillName
              ];


            if (
              !skill ||
              !skill.assessed
            ) {

              return null;

            }


            const score =
              Number.isFinite(
                skill.score
              )
                ? skill.score
                : 50;


            const confidence =
              Number.isFinite(
                skill.confidence
              )
                ? skill.confidence
                : 50;


            let priority =
              100 - score;


            priority +=
              (100 - confidence) *
              0.1;


            if (
              skillName === "writing" ||
              skillName === "speaking"
            ) {

              priority += 5;

            }


            return {
              skillName,
              priority
            };

          }
        )
        .filter(Boolean);


    /*
    ------------------------------------------
    FALLBACK
    ------------------------------------------

    If the preferred pool contains no
    usable skills, consider every assessed
    language skill except the first one.
    */

    if (
      candidates.length === 0
    ) {

      const fallbackSkills = [
        "writing",
        "speaking",
        "grammar",
        "listening",
        "reading",
        "vocabulary"
      ];


      candidates =
        fallbackSkills
          .filter(
            skillName =>
              skillName !== firstSkill
          )
          .map(
            skillName => {

              const skill =
                profile.skills[
                  skillName
                ];


              if (
                !skill ||
                !skill.assessed
              ) {

                return null;

              }


              const score =
                Number.isFinite(
                  skill.score
                )
                  ? skill.score
                  : 50;


              return {
                skillName,

                priority:
                  100 - score
              };

            }
          )
          .filter(Boolean);

    }


    /*
    There may genuinely be no second skill.
    */

    if (
      candidates.length === 0
    ) {

      return null;

    }


    candidates.sort(
      (a, b) =>
        b.priority -
        a.priority
    );


    /*
    On maintenance days rotate between
    available maintenance skills.

    This avoids one equally-scored skill
    winning forever.
    */

    if (
      useMaintenance &&
      candidates.length > 1
    ) {

      const index =
        Math.floor(
          date.getDate() / 4
        ) %
        candidates.length;


      return candidates[index]
        .skillName;

    }


    return candidates[0]
      .skillName;

  },


  /*
  ==================================================
  WEEKEND EXTRA
  ==================================================
  */

  chooseWeekendSkill(
    profile,
    alreadyUsed = [],
    date = new Date()
  ) {

    const candidates = [
      "speaking",
      "writing",
      "listening",
      "reading",
      "grammar",
      "vocabulary"
    ];


    const used =
      Array.isArray(
        alreadyUsed
      )
        ? alreadyUsed.filter(Boolean)
        : [];


    const available =
      candidates.filter(
        skill =>
          !used.includes(
            skill
          )
      );


    /*
    No available skill means no weekend
    extra should be created.
    */

    if (
      available.length === 0
    ) {

      return null;

    }


    /*
    Prefer speaking while it remains
    unassessed.
    */

    if (
      available.includes(
        "speaking"
      ) &&
      profile.skills &&
      profile.skills.speaking &&
      !profile.skills.speaking.assessed
    ) {

      return "speaking";

    }


    /*
    Deterministic rotation through the
    remaining available skills.
    */

    const index =
      date.getDate() %
      available.length;


    return available[index];

  },


  /*
  ==================================================
  FIT PLAN TO AVAILABLE TIME
  ==================================================
  */

  fitToTime(
    plan
  ) {

    /*
    If the generated plan exceeds the
    learner's available time, reduce normal
    activities before high-priority ones.

    Activities are never reduced below
    five minutes.
    */

    while (
      plan.plannedMinutes >
      plan.availableMinutes
    ) {

      const reducible =
        [...plan.activities]
          .reverse()
          .find(
            activity =>
              activity.minutes > 5 &&
              activity.priority !==
                "high"
          );


      if (
        !reducible
      ) {

        break;

      }


      reducible.minutes -= 5;

      plan.plannedMinutes -= 5;

    }

  },


  /*
  ==================================================
  SKILL DISPLAY
  ==================================================
  */

  getSkillIcon(
    skill
  ) {

    const icons = {

      grammar:
        "📐",

      vocabulary:
        "🧠",

      reading:
        "📖",

      listening:
        "🎧",

      writing:
        "✍️",

      speaking:
        "🗣️",

      knm:
        "🇳🇱"

    };


    return (
      icons[skill] ||
      "📚"
    );

  },


  /*
  ==================================================
  SKILL SUBTITLE
  ==================================================
  */

  getSkillSubtitle(
    profile,
    skill
  ) {

    const data =
      profile &&
      profile.skills
        ? profile.skills[
            skill
          ]
        : null;


    if (
      !data
    ) {

      return "Dutch practice";

    }


    if (
      !data.assessed
    ) {

      return "Not assessed yet";

    }


    if (
      data.level
    ) {

      const target =
        profile.goal &&
        profile.goal.trainingTarget
          ? profile.goal.trainingTarget
          : "";


      if (
        target
      ) {

        return (
          `${data.level} → ` +
          `${target}`
        );

      }


      return data.level;

    }


    return "Continue building this skill";

  },


  /*
  ==================================================
  CONCEPT REASON
  ==================================================
  */

  getConceptReason(
    concept
  ) {

    const sources =
      concept.sources &&
      concept.sources.length

        ? concept.sources
            .map(
              source =>
                this.formatConcept(
                  source
                )
            )
            .join(", ")

        : "assessment";


    if (
      Number(
        concept.majorErrors || 0
      ) > 0
    ) {

      return (
        `High priority · detected in ${sources}`
      );

    }


    if (
      Number(
        concept.moderateErrors || 0
      ) > 0
    ) {

      return (
        `Needs practice · detected in ${sources}`
      );

    }


    /*
    If formal error severity is low but
    recent practice still shows failures,
    make the reason reflect that.
    */

    if (
      Number(
        concept.recentPracticeFailures || 0
      ) > 0
    ) {

      return (
        `Recent mistakes · practise again`
      );

    }


    return (
      `Review · detected in ${sources}`
    );

  },


  /*
  ==================================================
  FORMAT NAMES
  ==================================================
  */

  formatConcept(
    value
  ) {

    if (
      !value
    ) {

      return "";

    }


    return String(
      value
    )
      .replaceAll(
        "_",
        " "
      )
      .replace(
        /\b\w/g,
        letter =>
          letter.toUpperCase()
      );

  }


};