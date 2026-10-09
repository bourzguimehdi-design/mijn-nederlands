/*
==================================================
MIJN NEDERLANDS
ERROR LESSON ENGINE
==================================================
*/

const ErrorLessonEngine = {

  /*
  ==================================================
  CONCEPT ALIASES
  ==================================================
  */

  CONCEPT_ALIASES: {

    task_fulfilment:
      "task_fulfillment",

    sentence_order:
      "word_order",

    verb_forms:
      "verb_conjugation"

  },


  /*
  ==================================================
  META CONCEPTS
  ==================================================
  */

  META_CONCEPTS: new Set([

    "task_fulfillment",
    "politeness"

  ]),


  /*
  ==================================================
  NORMALIZE CONCEPT
  ==================================================
  */

  normalizeConcept(
    concept
  ) {

    if (
      typeof concept !==
      "string"
    ) {

      return null;

    }


    const normalized =
      concept
        .trim()
        .toLowerCase()
        .replace(
          /\s+/g,
          "_"
        );


    return (
      this.CONCEPT_ALIASES[
        normalized
      ] ||
      normalized
    );

  },


  /*
  ==================================================
  GET RECENT MISTAKES
  ==================================================
  */

  getRecentMistakes(
    limit = 10
  ) {

    if (
      typeof Storage ===
        "undefined" ||
      typeof Storage
        .getPracticeHistory !==
        "function"
    ) {

      return [];

    }


    const history =
      Storage
        .getPracticeHistory();


    if (
      !Array.isArray(
        history
      )
    ) {

      return [];

    }


    return history
      .slice(
        -limit
      )
      .flatMap(
        result => {

          const answers =
            Array.isArray(
              result.answers
            )
              ? result.answers
              : [];


          return answers
            .filter(
              answer =>
                answer.correct ===
                false
            )
            .map(
              answer => ({

                sessionId:
                  result.id ||
                  null,

                practiceType:
                  result.practiceType ||
                  null,

                skill:
                  result.skill ||
                  null,

                concept:
                  result.concept ||
                  null,

                level:
                  result.level ||
                  null,

                exerciseId:
                  answer.exerciseId ||
                  null,

                answer:
                  answer.answer ??
                  null,

                expectedAnswer:
                  answer.expectedAnswer ??
                  null,

                correction:
                  answer.correction ||
                  null,

                feedback:
                  answer.feedback ||
                  null,

                explanation:
                  answer.explanation ||
                  null,

                concepts:
                  Array.isArray(
                    answer.concepts
                  )
                    ? answer.concepts
                    : []

              })
            );

        }
      );

  },


  /*
  ==================================================
  BUILD ERROR TOPICS
  ==================================================
  */

  getErrorTopics(
    limit = 10
  ) {

    const mistakes =
      this.getRecentMistakes(
        limit
      );


    const topics =
      new Map();


    mistakes.forEach(
      mistake => {

        const concepts =
          new Set(
            mistake.concepts
              .map(
                concept =>
                  this.normalizeConcept(
                    concept
                  )
              )
              .filter(Boolean)
          );


        concepts.forEach(
          concept => {

            if (
              this.META_CONCEPTS
                .has(
                  concept
                )
            ) {

              return;

            }


            if (
              !topics.has(
                concept
              )
            ) {

              topics.set(
                concept,
                {

                  concept,

                  count: 0,

                  mistakes: [],

                  skills:
                    new Set(),

                  levels:
                    new Set()

                }
              );

            }


            const topic =
              topics.get(
                concept
              );


            topic.count += 1;


            topic.mistakes.push(
              mistake
            );


            if (
              mistake.skill
            ) {

              topic.skills.add(
                mistake.skill
              );

            }


            if (
              mistake.level
            ) {

              topic.levels.add(
                mistake.level
              );

            }

          }
        );

      }
    );


    return Array.from(
      topics.values()
    )
      .map(
        topic => ({

          concept:
            topic.concept,

          count:
            topic.count,

          mistakes:
            topic.mistakes,

          skills:
            Array.from(
              topic.skills
            ),

          levels:
            Array.from(
              topic.levels
            )

        })
      )
      .sort(
        (a, b) =>
          b.count -
          a.count
      );

  },


  /*
  ==================================================
  GET RECOMMENDED LESSONS
  ==================================================
  */

  getRecommendedLessons(
    maxLessons = 3,
    minimumEvidence = 2
  ) {

    return this
      .getErrorTopics()
      .filter(
        topic =>
          topic.count >=
          minimumEvidence
      )
      .slice(
        0,
        maxLessons
      );

  },


  /*
  ==================================================
  GET LESSON CONTEXT
  ==================================================
  */

  getLessonContext(
    concept
  ) {

    const normalized =
      this.normalizeConcept(
        concept
      );


    if (!normalized) {

      return null;

    }


    const topic =
      this.getErrorTopics()
        .find(
          item =>
            item.concept ===
            normalized
        );


    if (!topic) {

      return null;

    }


    /*
    ------------------------------------------
    REPRESENTATIVE MISTAKES
    ------------------------------------------
    */

    const mistakes =
      topic.mistakes
        .slice(
          0,
          5
        )
        .map(
          mistake => ({

            skill:
              mistake.skill,

            level:
              mistake.level,

            learnerAnswer:
              mistake.answer,

            expectedAnswer:
              mistake.expectedAnswer,

            correction:
              mistake.correction,

            feedback:
              mistake.feedback,

            explanation:
              mistake.explanation

          })
        );


    /*
    ------------------------------------------
    DETERMINE LESSON LEVEL
    ------------------------------------------
    */

    const levelOrder = {

      A1: 1,
      A2: 2,
      B1: 3,
      B2: 4,
      C1: 5,
      C2: 6

    };


    const level =
      topic.levels
        .slice()
        .sort(
          (a, b) =>
            (
              levelOrder[b] ||
              0
            ) -
            (
              levelOrder[a] ||
              0
            )
        )[0] ||
      "A1";


    return {

      concept:
        topic.concept,

      level,

      evidenceCount:
        topic.count,

      skills:
        topic.skills.slice(),

      mistakes

    };

  },


  /*
  ==================================================
  CREATE ERROR LESSON SESSION
  ==================================================
  */

  createSession(
    context
  ) {

    if (
      !context ||
      !context.concept
    ) {

      throw new Error(
        "Error lesson context is required."
      );

    }


    const concept =
      context.concept;


    const title =
      concept
        .replace(
          /_/g,
          " "
        )
        .replace(
          /\b\w/g,
          character =>
            character.toUpperCase()
        );


    return {

      id:
        `error_lesson_${concept}_${Date.now()}`,

      type:
        "concept_practice",

      practiceType:
        "concept",

      source:
        "error_lesson",

      concept,

      skill:
        null,

      level:
        context.level ||
        "A1",

      minutes:
        10,

      title,

      weakness: {

        source:
          "practice_mistakes",

        evidenceCount:
          context.evidenceCount ||
          0,

        skills:
          Array.isArray(
            context.skills
          )
            ? context.skills.slice()
            : [],

        mistakes:
          Array.isArray(
            context.mistakes
          )
            ? context.mistakes.slice()
            : []

      },

      createdAt:
        new Date()
          .toISOString(),

      status:
        "ready"

    };

  },


  /*
  ==================================================
  GENERATE ERROR LESSON
  ==================================================
  */

  async generateLesson(
    concept
  ) {

    const context =
      this.getLessonContext(
        concept
      );


    if (!context) {

      throw new Error(
        `No mistake evidence was found for ${concept}.`
      );

    }


    const session =
      this.createSession(
        context
      );


    console.log(
      "Generating error lesson:",
      {
        session,
        context
      }
    );


    /*
    The normal practice API is used here.

    The session contains the target concept,
    target level and real learner mistakes
    inside session.weakness.
    */

    const result =
      await MijnNederlandsAPI
        .generatePractice(
          session
        );


    if (
      !result ||
      result.status !==
        "success" ||
      !result.practice
    ) {

      console.error(
        "Invalid error lesson result:",
        result
      );


      throw new Error(
        "Error lesson generation returned an incomplete result."
      );

    }


    /*
    The Worker may return a normal PracticeUI
    practice object OR an error-lesson-shaped
    object.

    Keep the raw result here. startLesson()
    performs the UI adaptation.
    */

    return {

      status:
        "success",

      concept:
        context.concept,

      targetLevel:
        context.level,

      evidenceCount:
        context.evidenceCount,

      context,

      session,

      practice:
        result.practice

    };

  },


  /*
  ==================================================
  ADAPT LESSON FOR PRACTICE UI
  ==================================================
  */

  adaptPractice(
    result
  ) {

    if (
      !result ||
      !result.practice
    ) {

      throw new Error(
        "There is no generated lesson to adapt."
      );

    }


    const raw =
      result.practice;


    /*
    --------------------------------------------------
    CASE 1
    ALREADY NORMAL PRACTICE UI FORMAT
    --------------------------------------------------

    If the Worker already returned:

      practice.explanation = {
        title,
        explanation,
        rule,
        examples
      }

    preserve it.
    */

    if (
      raw.explanation &&
      typeof raw.explanation ===
        "object" &&
      !Array.isArray(
        raw.explanation
      )
    ) {

      return {

        ...raw,

        concept:
          raw.concept ||
          result.session?.concept ||
          result.concept ||
          null,

        level:
          raw.level ||
          result.session?.level ||
          result.targetLevel ||
          null,

        explanation: {

          ...raw.explanation,

          title:
            raw.explanation.title ||
            raw.title ||
            "Review",

          explanation:
            raw.explanation
              .explanation ||
            raw.explanation
              .text ||
            "",

          rule:
            raw.explanation.rule ||
            "",

          examples:
            Array.isArray(
              raw.explanation.examples
            )
              ? raw.explanation.examples
              : []

        },

        guidedPractice:
          Array.isArray(
            raw.guidedPractice
          )
            ? raw.guidedPractice
            : [],

        independentPractice:
          Array.isArray(
            raw.independentPractice
          )
            ? raw.independentPractice
            : []

      };

    }


    /*
    --------------------------------------------------
    CASE 2
    ERROR LESSON FORMAT
    --------------------------------------------------

    The generated lesson may instead look like:

      {
        title,
        explanation: "...",
        rule,
        examples,
        guidedPractice,
        independentPractice
      }

    PracticeUI cannot consume that directly because
    it expects explanation to be an OBJECT.
    */

    const lesson =
      (
        raw.lesson &&
        typeof raw.lesson ===
          "object"
      )
        ? raw.lesson
        : raw;


    const explanationText =
      typeof lesson.explanation ===
        "string"
        ? lesson.explanation
        : (
            lesson.description ||
            lesson.summary ||
            ""
          );


    const examples =
      Array.isArray(
        lesson.examples
      )
        ? lesson.examples
        : [];


    const guidedPractice =
      Array.isArray(
        lesson.guidedPractice
      )
        ? lesson.guidedPractice
        : (
            Array.isArray(
              lesson.guided
            )
              ? lesson.guided
              : []
          );


    const independentPractice =
      Array.isArray(
        lesson.independentPractice
      )
        ? lesson.independentPractice
        : (
            Array.isArray(
              lesson.independent
            )
              ? lesson.independent
              : []
          );


    return {

      ...lesson,

      concept:
        lesson.concept ||
        result.session?.concept ||
        result.concept ||
        null,

      level:
        lesson.level ||
        result.session?.level ||
        result.targetLevel ||
        null,

      title:
        lesson.title ||
        result.session?.title ||
        "Error lesson",

      explanation: {

        title:
          lesson.title ||
          "Review",

        explanation:
          explanationText,

        rule:
          lesson.rule ||
          lesson.keyRule ||
          "",

        examples

      },

      guidedPractice,

      independentPractice

    };

  },


  /*
  ==================================================
  START ERROR LESSON
  ==================================================
  */

  async startLesson(
    concept
  ) {

    try {

      const result =
        await this.generateLesson(
          concept
        );


      console.log(
        "Generated error lesson:",
        result
      );


      if (
        typeof PracticeUI ===
        "undefined"
      ) {

        throw new Error(
          "Practice UI is not available."
        );

      }


      /*
      Convert the Worker response into the exact
      structure expected by PracticeUI.
      */

      const adaptedPractice =
        this.adaptPractice(
          result
        );


      console.log(
        "Adapted error lesson for PracticeUI:",
        adaptedPractice
      );


      /*
      ------------------------------------------
      SAFETY CHECK
      ------------------------------------------
      */

      if (
        !adaptedPractice.explanation ||
        typeof adaptedPractice
          .explanation !==
          "object"
      ) {

        throw new Error(
          "The error lesson does not contain a valid explanation."
        );

      }


      /*
      ------------------------------------------
      HAND OFF TO PRACTICE UI
      ------------------------------------------
      */

      PracticeUI.completedResult = null;
      PracticeUI.currentSession =
        result.session;


      PracticeUI.generatedPractice =
        adaptedPractice;


      PracticeUI.currentStage =
        "explanation";


      PracticeUI.currentQuestionIndex =
        0;


      PracticeUI.answers =
        [];


      PracticeUI.render();


      return {

        ...result,

        practice:
          adaptedPractice

      };


    } catch (error) {

      console.error(
        "Could not start error lesson:",
        error
      );


      throw error;

    }

  }

};