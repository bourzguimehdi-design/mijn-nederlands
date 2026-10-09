const ProgressEngine = {

  /*
  ==================================================
  MAIN PROGRESS REPORT
  ==================================================
  */

  getProgress() {

    const profile =
      ProfileEngine.refresh();

    const placementHistory =
      Storage.getPlacementHistory?.() || [];

    const writingHistory =
      Storage.getWritingHistory?.() || [];

    const speakingHistory =
      Storage.getSpeakingHistory?.() || [];

    const practiceHistory =
      Storage.getPracticeHistory?.() || [];


    return {

      generatedAt:
        new Date().toISOString(),

      skills:
        this.getSkillProgress(
          profile,
          placementHistory,
          writingHistory,
          speakingHistory
        ),

      concepts:
        this.getConceptProgress(
          profile,
          practiceHistory
        ),

      practice:
        this.getPracticeProgress(
          practiceHistory
        ),

      activity:
        this.getActivitySummary({
          placementHistory,
          writingHistory,
          speakingHistory,
          practiceHistory
        })

    };

  },


  /*
  ==================================================
  SAVE PROGRESS SNAPSHOT
  ==================================================

  ProgressEngine calculates the learner's current
  progress state.

  Storage is responsible for persisting that state.

  Keeping these responsibilities separate prevents
  Storage from depending on ProfileEngine or
  ProgressEngine.

  This method should eventually be called after
  meaningful learning events have been completely
  saved:

  - placement assessment
  - writing assessment
  - speaking assessment
  - practice session

  It should NOT be called simply because the
  progress screen was opened.
  ==================================================
  */

  saveSnapshot() {

    if (
      typeof Storage === "undefined" ||
      typeof Storage.saveProgressSnapshot !==
        "function"
    ) {

      console.warn(
        "Progress snapshot storage is unavailable."
      );

      return null;

    }


    const progress =
      this.getProgress();


    if (!progress) {

      console.warn(
        "Could not generate progress snapshot."
      );

      return null;

    }


    return Storage
      .saveProgressSnapshot(
        progress
      );

  },


  /*
  ==================================================
  SKILL PROGRESS
  ==================================================
  */

  getSkillProgress(
    profile,
    placementHistory,
    writingHistory,
    speakingHistory
  ) {

    const skillNames = [
      "grammar",
      "vocabulary",
      "reading",
      "listening",
      "writing",
      "speaking",
      "knm"
    ];


    return skillNames.map(
      skillName => {

        const current =
          profile.skills?.[
            skillName
          ] || {};


        const evidence = [];


        /*
        ------------------------------------------
        PLACEMENT EVIDENCE
        ------------------------------------------

        Historical placement assessments may store
        the CEFR level inside:

          skill.estimate.level

        while newer/alternative records may expose:

          skill.level

        Support both formats so historical progress
        remains backward-compatible.
        ------------------------------------------
        */

        placementHistory.forEach(
          assessment => {

            const skill =
              assessment
                ?.skills
                ?.[skillName];


            if (!skill) {

              return;

            }


            const level =
              skill.level ||
              skill.estimate?.level ||
              null;


            evidence.push({

              source:
                "placement",

              completedAt:
                assessment.completedAt ||
                assessment.savedAt ||
                null,

              level,

              score:
                skill.score ?? null,

              confidence:
                skill.confidence ?? null

            });

          }
        );


        /*
        ------------------------------------------
        WRITING EVIDENCE
        ------------------------------------------
        */

        if (
          skillName === "writing"
        ) {

          writingHistory.forEach(
            assessment => {

              const level =
                this.getAssessmentLevel(
                  assessment
                );


              if (!level) {

                return;

              }


              evidence.push({

                source:
                  "writing",

                completedAt:
                  assessment.completedAt ||
                  assessment.savedAt ||
                  null,

                level,

                responseCount:
                  Array.isArray(
                    assessment.responses
                  )
                    ? assessment.responses.length
                    : 0

              });

            }
          );

        }


        /*
        ------------------------------------------
        SPEAKING EVIDENCE
        ------------------------------------------
        */

        if (
          skillName === "speaking"
        ) {

          speakingHistory.forEach(
            assessment => {

              const level =
                this.getAssessmentLevel(
                  assessment
                );


              if (!level) {

                return;

              }


              evidence.push({

                source:
                  "speaking",

                completedAt:
                  assessment.completedAt ||
                  assessment.savedAt ||
                  null,

                level,

                responseCount:
                  Array.isArray(
                    assessment.responses
                  )
                    ? assessment.responses.length
                    : 0

              });

            }
          );

        }


        /*
        Keep evidence in chronological order.
        */

        evidence.sort(
          (a, b) =>
            this.getTime(a) -
            this.getTime(b)
        );


        return {

          skill:
            skillName,

          currentLevel:
            current.level || null,

          currentScore:
            current.score ?? null,

          confidence:
            current.confidence ?? 0,

          assessed:
            current.assessed === true,

          evidence,

          trend:
            this.getLevelTrend(
              evidence
            )

        };

      }
    );

  },


  /*
  ==================================================
  ASSESSMENT LEVEL
  ==================================================

  Writing and speaking assessments store CEFR
  estimates on their individual responses.

  Use the strongest level demonstrated by the
  assessment as a simple historical summary.

  This is for progress display only.

  ProfileEngine remains authoritative for the
  learner's actual current attainment level.
  ==================================================
  */

  getAssessmentLevel(
    assessment
  ) {

    const responses =
      Array.isArray(
        assessment?.responses
      )
        ? assessment.responses
        : [];


    const levels =
      responses
        .map(
          response =>
            response
              ?.evaluation
              ?.estimatedPerformance
        )
        .filter(Boolean);


    if (!levels.length) {

      return null;

    }


    let strongest =
      levels[0];


    levels.forEach(
      level => {

        const value =
          ProfileEngine
            .getLevelValue(
              level
            );


        const strongestValue =
          ProfileEngine
            .getLevelValue(
              strongest
            );


        if (
          value !== null &&
          (
            strongestValue === null ||
            value > strongestValue
          )
        ) {

          strongest =
            level;

        }

      }
    );


    return ProfileEngine
      .normalizeBaseLevel(
        strongest
      );

  },


  /*
  ==================================================
  LEVEL TREND
  ==================================================
  */

  getLevelTrend(
    evidence
  ) {

    const usable =
      evidence.filter(
        item =>
          item.level &&
          ProfileEngine
            .getLevelValue(
              item.level
            ) !== null
      );


    if (
      usable.length < 2
    ) {

      return "insufficient_data";

    }


    const first =
      ProfileEngine
        .getLevelValue(
          usable[0].level
        );


    const latest =
      ProfileEngine
        .getLevelValue(
          usable[
            usable.length - 1
          ].level
        );


    if (
      latest > first
    ) {

      return "improving";

    }


    if (
      latest < first
    ) {

      return "declining";

    }


    return "stable";

  },


  /*
  ==================================================
  CONCEPT PROGRESS
  ==================================================
  */

  getConceptProgress(
    profile,
    practiceHistory
  ) {

    return Object.values(
      profile.concepts || {}
    )
      .filter(
        concept =>
          concept.learningTopic !==
            false
      )
      .map(
        concept => {

          const name =
            concept.name ||
            concept.concept;


          const sessions =
            practiceHistory
              .filter(
                session =>
                  session.concept ===
                  name
              )
              .slice()
              .sort(
                (a, b) =>
                  this.getTime(a) -
                  this.getTime(b)
              );


          return {

            concept:
              name,

            label:
              concept.label ||
              this.formatConcept(
                name
              ),

            origin:
              concept.origin,

            skill:
              concept.skill || null,

            cefrLevel:
              concept.cefrLevel || null,

            mastery:
              concept.mastery ?? null,

            practiceSessions:
              sessions.length,

            practiceAttempts:
              sessions.reduce(
                (total, session) =>
                  total +
                  Number(
                    session.total || 0
                  ),
                0
              ),

            practiceCorrect:
              sessions.reduce(
                (total, session) =>
                  total +
                  Number(
                    session.correct || 0
                  ),
                0
              ),

            latestPracticeScore:
              sessions.length
                ? sessions[
                    sessions.length - 1
                  ].score ?? null
                : null,

            practiceTrend:
              this.getScoreTrend(
                sessions
              ),

            lastPracticeAt:
              concept.lastPracticeAt ||
              null

          };

        }
      );

  },


  /*
  ==================================================
  PRACTICE PROGRESS
  ==================================================
  */

  getPracticeProgress(
    history
  ) {

    const sessions =
      history
        .slice()
        .sort(
          (a, b) =>
            this.getTime(a) -
            this.getTime(b)
        );


    const totalExercises =
      sessions.reduce(
        (total, session) =>
          total +
          Number(
            session.total || 0
          ),
        0
      );


    const totalCorrect =
      sessions.reduce(
        (total, session) =>
          total +
          Number(
            session.correct || 0
          ),
        0
      );


    return {

      sessions:
        sessions.length,

      totalExercises,

      totalCorrect,

      accuracy:
        totalExercises > 0
          ? Math.round(
              (
                totalCorrect /
                totalExercises
              ) * 100
            )
          : null,

      trend:
        this.getScoreTrend(
          sessions
        ),

      history:
        sessions.map(
          session => ({

            id:
              session.id,

            completedAt:
              session.completedAt,

            concept:
              session.concept,

            level:
              session.level,

            score:
              session.score,

            correct:
              session.correct,

            total:
              session.total

          })
        )

    };

  },


  /*
  ==================================================
  ACTIVITY SUMMARY
  ==================================================
  */

  getActivitySummary({
    placementHistory,
    writingHistory,
    speakingHistory,
    practiceHistory
  }) {

    return {

      placementAssessments:
        placementHistory.length,

      writingAssessments:
        writingHistory.length,

      speakingAssessments:
        speakingHistory.length,

      practiceSessions:
        practiceHistory.length,

      totalActivities:
        placementHistory.length +
        writingHistory.length +
        speakingHistory.length +
        practiceHistory.length

    };

  },


  /*
  ==================================================
  SCORE TREND
  ==================================================
  */

  getScoreTrend(
    sessions
  ) {

    const scored =
      sessions.filter(
        session =>
          Number.isFinite(
            Number(
              session.score
            )
          )
      );


    if (
      scored.length < 2
    ) {

      return "insufficient_data";

    }


    const first =
      Number(
        scored[0].score
      );


    const latest =
      Number(
        scored[
          scored.length - 1
        ].score
      );


    const difference =
      latest - first;


    /*
    Small fluctuations should not be
    presented as meaningful progress.
    */

    if (
      difference >= 5
    ) {

      return "improving";

    }


    if (
      difference <= -5
    ) {

      return "declining";

    }


    return "stable";

  },


  /*
  ==================================================
  HELPERS
  ==================================================
  */

  getTime(
    item
  ) {

    const value =
      item?.completedAt ||
      item?.generatedAt ||
      item?.savedAt ||
      item?.createdAt;


    const time =
      value
        ? new Date(value)
            .getTime()
        : 0;


    return Number.isFinite(time)
      ? time
      : 0;

  },


  formatConcept(
    concept
  ) {

    return String(
      concept || ""
    )
      .replace(
        /_/g,
        " "
      )
      .replace(
        /\b\w/g,
        character =>
          character
            .toUpperCase()
      );

  }

};