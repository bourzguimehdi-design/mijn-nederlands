/*
==================================================
MIJN NEDERLANDS
PRACTICE UI
==================================================
*/

const PracticeUI = {

  currentSession: null,
  generatedPractice: null,
  currentStage: "explanation",
  currentQuestionIndex: 0,
  answers: [],
async startFromActivity(activity) {

  if (!activity) {
    throw new Error(
      "A study-plan activity is required."
    );
  }

  if (
    activity.type !== "concept" ||
    !activity.concept
  ) {
    throw new Error(
      "This activity is not a concept-practice activity."
    );
  }


  const profile =
    ProfileEngine.refresh();


  const session =
    PracticeEngine.createConceptSession(
      activity.concept,
      profile,
      {
        minutes:
          activity.minutes || 10
      }
    );


  console.log(
    "Starting practice from activity:",
    activity
  );

  console.log(
    "Created practice session:",
    session
  );


  return this.start(
    session
  );
},

  /*
  ==================================================
  START PRACTICE
  ==================================================
  */

  async start(session) {

    if (!session) {
      throw new Error(
        "A practice session is required."
      );
    }

    this.currentSession =
      session;

    this.generatedPractice =
      null;

    this.currentStage =
      "loading";

    this.currentQuestionIndex =
      0;

    this.answers = [];

    this.renderLoading();

    try {

      const result =
        await MijnNederlandsAPI
          .generatePractice(
            session
          );

      if (
        result.status !== "success" ||
        !result.practice
      ) {
        throw new Error(
          "Practice generation returned an incomplete result."
        );
      }

      this.generatedPractice =
        result.practice;

      this.currentStage =
        "explanation";

      this.render();

    } catch (error) {

      console.error(
        "Could not start practice:",
        error
      );

      this.renderError(
        error.message ||
        "Could not load this practice session."
      );
    }
  },


  /*
  ==================================================
  ROOT
  ==================================================
  */

  getRoot() {

    return document.getElementById(
      "practice-screen"
    );
  },


  /*
  ==================================================
  LOADING
  ==================================================
  */

  renderLoading() {

    const root =
      this.getRoot();

    if (!root) {
      console.error(
        "#practice-screen was not found."
      );
      return;
    }

    root.innerHTML = `
      <div class="practice-shell">

        <div class="practice-header">
          <div class="practice-eyebrow">
            PERSONALIZED PRACTICE
          </div>

          <h1>
            Preparing your lesson…
          </h1>

          <p>
            We're creating practice based on
            your current Dutch profile.
          </p>
        </div>

      </div>
    `;

    this.showScreen();
  },


  /*
  ==================================================
  ERROR
  ==================================================
  */

  renderError(message) {

    const root =
      this.getRoot();

    if (!root) {
      return;
    }

    root.innerHTML = `
      <div class="practice-shell">

        <div class="practice-header">
          <div class="practice-eyebrow">
            PRACTICE
          </div>

          <h1>
            We couldn't load this lesson
          </h1>

          <p>
            ${this.escapeHTML(message)}
          </p>

          <button
            class="practice-primary-button"
            type="button"
            onclick="PracticeUI.retry()"
          >
            Try again
          </button>
        </div>

      </div>
    `;

    this.showScreen();
  },


  retry() {

    if (!this.currentSession) {
      return;
    }

    this.start(
      this.currentSession
    );
  },


  /*
  ==================================================
  MAIN RENDER
  ==================================================
  */

  render() {

    if (!this.generatedPractice) {
      return;
    }

    if (
      this.currentStage ===
      "explanation"
    ) {

      this.renderExplanation();
      return;
    }

    if (
      this.currentStage ===
      "guided"
    ) {

      this.renderGuidedPractice();
      return;
    }

    if (
      this.currentStage ===
      "independent"
    ) {

      this.renderIndependentPractice();
      return;
    }

    if (
      this.currentStage ===
      "complete"
    ) {

      this.renderComplete();
    }
  },


  /*
  ==================================================
  EXPLANATION
  ==================================================
  */

  renderExplanation() {

    const root =
      this.getRoot();

    if (!root) {
      return;
    }

    const practice =
      this.generatedPractice;

    const explanation =
      practice.explanation;

    const examples =
      Array.isArray(
        explanation.examples
      )
        ? explanation.examples
        : [];

    root.innerHTML = `
      <div class="practice-shell">

        ${this.renderHeader()}

        <div class="practice-progress">
          <div class="practice-progress-bar">
            <div
              class="practice-progress-fill"
              style="width: 15%"
            ></div>
          </div>

          <div class="practice-progress-label">
            Learn
          </div>
        </div>


        <section class="practice-card">

          <div class="practice-card-label">
            LEARN
          </div>

          <h2>
            ${this.escapeHTML(
              explanation.title
            )}
          </h2>

          <p class="practice-explanation">
            ${this.escapeHTML(
              explanation.explanation
            )}
          </p>


          <div class="practice-rule">

            <strong>
              Remember
            </strong>

            <p>
              ${this.escapeHTML(
                explanation.rule
              )}
            </p>

          </div>


          ${
            examples.length
              ? `
                <div class="practice-examples">

                  <h3>
                    Examples
                  </h3>

                  ${examples
                    .map(
                      example => `
                        <div class="practice-example">
                          ${this.escapeHTML(
                            example
                          )}
                        </div>
                      `
                    )
                    .join("")}

                </div>
              `
              : ""
          }


          <button
            class="practice-primary-button"
            type="button"
            onclick="PracticeUI.beginGuidedPractice()"
          >
            Start practice
          </button>

        </section>

      </div>
    `;

    this.showScreen();
  },


  /*
  ==================================================
  GUIDED PRACTICE
  ==================================================
  */

  beginGuidedPractice() {

    this.currentStage =
      "guided";

    this.currentQuestionIndex =
      0;

    this.render();
  },


  renderGuidedPractice() {

    const exercises =
      this.generatedPractice
        ?.guidedPractice ||
      [];

    if (
      this.currentQuestionIndex >=
      exercises.length
    ) {

      this.currentStage =
        "independent";

      this.currentQuestionIndex =
        0;

      this.render();

      return;
    }

    this.renderQuestion(
      exercises[
        this.currentQuestionIndex
      ],
      "guided",
      exercises.length
    );
  },


  /*
  ==================================================
  INDEPENDENT PRACTICE
  ==================================================
  */

  renderIndependentPractice() {

    const exercises =
      this.generatedPractice
        ?.independentPractice ||
      [];

    if (
      this.currentQuestionIndex >=
      exercises.length
    ) {

      this.currentStage =
        "complete";

      this.render();

      return;
    }

    this.renderQuestion(
      exercises[
        this.currentQuestionIndex
      ],
      "independent",
      exercises.length
    );
  },


  /*
  ==================================================
  QUESTION
  ==================================================
  */

  renderQuestion(
    exercise,
    stage,
    total
  ) {

    const root =
      this.getRoot();

    if (!root) {
      return;
    }

    const number =
      this.currentQuestionIndex + 1;

    const progress =
      stage === "guided"
        ? 20 + (
            number /
            Math.max(total, 1)
          ) * 45
        : 65 + (
            number /
            Math.max(total, 1)
          ) * 30;

    root.innerHTML = `
      <div class="practice-shell">

        ${this.renderHeader()}

        <div class="practice-progress">

          <div class="practice-progress-bar">
            <div
              class="practice-progress-fill"
              style="width: ${progress}%"
            ></div>
          </div>

          <div class="practice-progress-label">

            ${
              stage === "guided"
                ? "Guided practice"
                : "Try it yourself"
            }

            · ${number} of ${total}

          </div>

        </div>


        <section class="practice-card">

          <div class="practice-card-label">

            ${
              stage === "guided"
                ? "PRACTICE"
                : "TRY IT YOURSELF"
            }

          </div>


          <p class="practice-instruction">
            ${this.escapeHTML(
              exercise.instruction
            )}
          </p>


          <h2 class="practice-prompt">
            ${this.escapeHTML(
              exercise.prompt
            )}
          </h2>


          ${this.renderAnswerControl(
            exercise
          )}


          ${
            exercise.hint
              ? `
                <button
                  class="practice-hint-button"
                  type="button"
                  onclick="PracticeUI.showHint()"
                >
                  Need a hint?
                </button>

                <div
                  id="practice-hint"
                  class="practice-hint"
                  hidden
                >
                  ${this.escapeHTML(
                    exercise.hint
                  )}
                </div>
              `
              : ""
          }


          <button
            class="practice-primary-button"
            type="button"
            onclick="PracticeUI.submitCurrentAnswer()"
          >
            Check answer
          </button>

        </section>

      </div>
    `;

    this.showScreen();
  },


  /*
  ==================================================
  ANSWER CONTROLS
  ==================================================
  */

  renderAnswerControl(
    exercise
  ) {

    if (
      exercise.type ===
      "multiple_choice"
    ) {

      return `
        <div class="practice-options">

          ${(exercise.options || [])
            .map(
              option => `
                <label class="practice-option">

                  <input
                    type="radio"
                    name="practice-answer"
                    value="${this.escapeAttribute(
                      option
                    )}"
                  >

                  <span>
                    ${this.escapeHTML(
                      option
                    )}
                  </span>

                </label>
              `
            )
            .join("")}

        </div>
      `;
    }


    return `
      <textarea
        id="practice-text-answer"
        class="practice-text-answer"
        rows="4"
        placeholder="Type your answer here…"
      ></textarea>
    `;
  },


  /*
  ==================================================
  ANSWER SUBMISSION
  ==================================================
  */

  async submitCurrentAnswer() {

  const exercise =
    this.getCurrentExercise();


  if (!exercise) {
    return;
  }


  let answer = "";


  /*
  ==================================================
  GET LEARNER ANSWER
  ==================================================
  */

  if (
    exercise.type ===
    "multiple_choice"
  ) {

    const selected =
      document.querySelector(
        'input[name="practice-answer"]:checked'
      );


    answer =
      selected
        ? selected.value
        : "";

  } else {

    const field =
      document.getElementById(
        "practice-text-answer"
      );


    answer =
      field
        ? field.value.trim()
        : "";

  }


  if (!answer) {

    alert(
      "Please enter an answer first."
    );

    return;
  }


  /*
  ==================================================
  MULTIPLE CHOICE
  ==================================================

  Multiple-choice answers are constrained,
  so exact comparison is appropriate and
  does not require an API request.
  */

  if (
    exercise.type ===
    "multiple_choice"
  ) {

    const correct =
      this.normalizeAnswer(answer) ===
      this.normalizeAnswer(
        exercise.expectedAnswer
      );


    this.answers.push({

      exerciseId:
        exercise.id,

      stage:
        this.currentStage,

      type:
        exercise.type,

      answer,

      expectedAnswer:
        exercise.expectedAnswer,

      correct,

      targetConceptCorrect:
        correct,

      overallCorrect:
        correct,

      evaluationSource:
        "local",

      completedAt:
        new Date().toISOString()

    });


    this.renderFeedback(
      exercise,
      answer,
      correct
    );


    return;
  }


  /*
  ==================================================
  OPEN-ENDED ANSWER
  ==================================================

  Typed answers must not be compared
  literally with one model answer.

  Ask the practice evaluator whether the
  learner demonstrated the target concept.
  */

  const card =
    this.getRoot()
      ?.querySelector(
        ".practice-card"
      );


  const controls =
    card
      ? Array.from(
          card.querySelectorAll(
            "button, input, textarea"
          )
        )
      : [];


  /*
  Prevent double submissions while the
  evaluation request is running.
  */

  controls.forEach(
    element => {
      element.disabled = true;
    }
  );


  try {

    const result =
      await MijnNederlandsAPI
        .evaluatePracticeAnswer(
          this.currentSession,
          exercise,
          answer
        );


    const evaluation =
      result.evaluation;


    /*
    The practice score represents mastery
    of the TARGET CONCEPT.

    Example:
    spelling correct + adjective-ending
    error = spelling target still correct.
    */

    const correct =
      evaluation
        .targetConceptCorrect ===
      true;


    this.answers.push({

      exerciseId:
        exercise.id,

      stage:
        this.currentStage,

      type:
        exercise.type,

      answer,

      expectedAnswer:
        exercise.expectedAnswer,

      correct,

      targetConceptCorrect:
        evaluation
          .targetConceptCorrect,

      overallCorrect:
        evaluation
          .overallCorrect,

      feedback:
        evaluation.feedback,

      correction:
        evaluation.correction,

      errorConcept:
        evaluation.errorConcept,

      evaluationSource:
        "ai",

      completedAt:
        new Date().toISOString()

    });


    this.renderEvaluatedFeedback(
      exercise,
      answer,
      evaluation
    );


  } catch (error) {

    console.error(
      "Could not evaluate practice answer:",
      error
    );


    /*
    Re-enable the controls so the learner
    can retry instead of losing the answer.
    */

    controls.forEach(
      element => {
        element.disabled = false;
      }
    );


    alert(
      error.message ||
      "Could not evaluate this answer. Please try again."
    );

  }

},


  /*
  ==================================================
  FEEDBACK
  ==================================================
  */

  renderFeedback(
    exercise,
    answer,
    correct
  ) {

    const root =
      this.getRoot();

    if (!root) {
      return;
    }


    const feedback =
      document.createElement(
        "div"
      );


    feedback.className =
      correct
        ? "practice-feedback practice-feedback-correct"
        : "practice-feedback practice-feedback-review";


    feedback.innerHTML = `

      <h3>
        ${
          correct
            ? "Correct"
            : "Review this one"
        }
      </h3>

      ${
        !correct
          ? `
            <p>
              <strong>
                Your answer:
              </strong>
              ${this.escapeHTML(
                answer
              )}
            </p>

            <p>
              <strong>
                Model answer:
              </strong>
              ${this.escapeHTML(
                exercise.expectedAnswer
              )}
            </p>
          `
          : ""
      }

      <p>
        ${this.escapeHTML(
          exercise.explanation
        )}
      </p>

      <button
        class="practice-primary-button"
        type="button"
        onclick="PracticeUI.nextQuestion()"
      >
        Continue
      </button>

    `;


    const card =
      root.querySelector(
        ".practice-card"
      );


    if (card) {

      card
        .querySelectorAll(
          "button, input, textarea"
        )
        .forEach(
          element => {
            element.disabled = true;
          }
        );


      card.appendChild(
        feedback
      );


      const continueButton =
        feedback.querySelector(
          "button"
        );

      if (continueButton) {
        continueButton.disabled =
          false;
      }
    }
  },

  renderEvaluatedFeedback(
  exercise,
  answer,
  evaluation
) {

  const root =
    this.getRoot();


  if (!root) {
    return;
  }


  const targetCorrect =
    evaluation
      .targetConceptCorrect ===
    true;


  const overallCorrect =
    evaluation
      .overallCorrect ===
    true;


  const feedback =
    document.createElement(
      "div"
    );


  feedback.className =
    targetCorrect
      ? "practice-feedback practice-feedback-correct"
      : "practice-feedback practice-feedback-review";


  /*
  ==================================================
  FEEDBACK HEADING
  ==================================================
  */

  let heading;


  if (
    targetCorrect &&
    overallCorrect
  ) {

    heading =
      "Correct";

  } else if (
    targetCorrect
  ) {

    heading =
      "Target skill correct";

  } else {

    heading =
      "Review this one";

  }


  /*
  ==================================================
  FEEDBACK CONTENT
  ==================================================
  */

  feedback.innerHTML = `

    <h3>
      ${this.escapeHTML(
        heading
      )}
    </h3>


    <p>
      <strong>
        Your answer:
      </strong>

      ${this.escapeHTML(
        answer
      )}
    </p>


    ${
      evaluation.feedback
        ? `
          <p>
            ${this.escapeHTML(
              evaluation.feedback
            )}
          </p>
        `
        : ""
    }


    ${
      evaluation.correction &&
      this.normalizeAnswer(
        evaluation.correction
      ) !==
      this.normalizeAnswer(
        answer
      )
        ? `
          <p>
            <strong>
              Suggested correction:
            </strong>

            ${this.escapeHTML(
              evaluation.correction
            )}
          </p>
        `
        : ""
    }


    ${
      evaluation.errorConcept &&
      evaluation.errorConcept !==
        "none"
        ? `
          <p class="small">
            <strong>
              Also review:
            </strong>

            ${this.escapeHTML(
              String(
                evaluation.errorConcept
              )
                .replaceAll(
                  "_",
                  " "
                )
            )}
          </p>
        `
        : ""
    }


    <button
      class="practice-primary-button"
      type="button"
      onclick="PracticeUI.nextQuestion()"
    >
      Continue
    </button>

  `;


  const card =
    root.querySelector(
      ".practice-card"
    );


  if (card) {

    card
      .querySelectorAll(
        "button, input, textarea"
      )
      .forEach(
        element => {
          element.disabled = true;
        }
      );


    card.appendChild(
      feedback
    );


    const continueButton =
      feedback.querySelector(
        "button"
      );


    if (continueButton) {

      continueButton.disabled =
        false;

    }

  }

},

  nextQuestion() {

    this.currentQuestionIndex += 1;

    this.render();
  },


  getCurrentExercise() {

    if (
      this.currentStage ===
      "guided"
    ) {

      return (
        this.generatedPractice
          ?.guidedPractice?.[
            this.currentQuestionIndex
          ] ||
        null
      );
    }


    if (
      this.currentStage ===
      "independent"
    ) {

      return (
        this.generatedPractice
          ?.independentPractice?.[
            this.currentQuestionIndex
          ] ||
        null
      );
    }


    return null;
  },


  /*
  ==================================================
  HINT
  ==================================================
  */

  showHint() {

    const hint =
      document.getElementById(
        "practice-hint"
      );

    if (hint) {
      hint.hidden = false;
    }
  },


  /*
  ==================================================
  COMPLETION
  ==================================================
  */

  renderComplete() {

  const root =
    this.getRoot();

  if (!root) {
    return;
  }


  const total =
    this.answers.length;


  const correct =
    this.answers.filter(
      answer =>
        answer.correct
    ).length;


  const score =
    total > 0
      ? Math.round(
          (correct / total) * 100
        )
      : 0;


  /*
  ==================================================
  SAVE PRACTICE RESULT
  ==================================================
  */

  let savedResult = null;


  if (
    typeof Storage !== "undefined" &&
    typeof Storage.savePracticeResult ===
      "function"
  ) {

    const session =
      this.currentSession || {};


    const practiceResult = {

      /*
      Reuse the practice session ID.

      Storage prevents duplicate entries
      using this ID.
      */

      id:
        session.id ||
        `practice_${session.concept || "unknown"}_${Date.now()}`,


      type:
        "concept_practice",


      concept:
        session.concept ||
        this.generatedPractice?.concept ||
        null,


      level:
        session.level ||
        this.generatedPractice?.level ||
        null,


      title:
        session.title ||
        null,


      minutes:
        session.minutes ||
        null,


      correct,

      total,

      score,


      /*
      Keep the exercise evidence.

      Clone the array so the saved result
      does not depend on later UI changes.
      */

      answers:
        this.answers.map(
          answer => ({
            ...answer
          })
        ),


      completedAt:
        new Date().toISOString()

    };


    try {

      savedResult =
        Storage.savePracticeResult(
          practiceResult
        );


      console.log(
        "Practice result saved:",
        savedResult
      );

    } catch (error) {

      console.error(
        "Could not save practice result:",
        error
      );

    }

  } else {

    console.warn(
      "Practice Storage is not available."
    );

  }


  /*
  ==================================================
  RENDER COMPLETION SCREEN
  ==================================================
  */

  root.innerHTML = `
    <div class="practice-shell">

      ${this.renderHeader()}

      <div class="practice-progress">

        <div class="practice-progress-bar">
          <div
            class="practice-progress-fill"
            style="width: 100%"
          ></div>
        </div>

      </div>


      <section class="practice-card">

        <div class="practice-card-label">
          COMPLETE
        </div>

        <h2>
          Practice complete
        </h2>

        <p class="practice-complete-score">
          ${correct} of ${total}
          exercises matched the model answer.
        </p>

        <p>
          ${
            savedResult
              ? `Your result was saved to your learning profile.`
              : `Your practice is complete.`
          }
        </p>

        <button
          class="practice-primary-button"
          type="button"
          onclick="PracticeUI.close()"
        >
          Back to dashboard
        </button>

      </section>

    </div>
  `;


  this.showScreen();
},

  /*
  ==================================================
  HEADER
  ==================================================
  */

  renderHeader() {

    const session =
      this.currentSession;

    return `
      <div class="practice-header">

        <div class="practice-eyebrow">
          PERSONALIZED PRACTICE
        </div>

        <h1>
          ${this.escapeHTML(
            session?.title ||
            session?.concept ||
            "Practice"
          )}
        </h1>

        <p>
          ${this.escapeHTML(
            session?.level || ""
          )}
          ·
          ${Number(
            session?.minutes || 10
          )}
          min
        </p>

      </div>
    `;
  },


  /*
  ==================================================
  SCREEN NAVIGATION
  ==================================================
  */

 showScreen() {

  const root =
    this.getRoot();

  if (!root) {
    return;
  }

  /*
  Hide the dashboard.
  */

  const dashboard =
    document.getElementById(
      "dashboard"
    );

  if (dashboard) {
    dashboard.classList.add(
      "hidden"
    );
  }


  /*
  Show practice.
  */

  root.classList.remove(
    "hidden"
  );


  window.scrollTo(
    0,
    0
  );
},

  close() {

    if (
      typeof openDashboard ===
      "function"
    ) {

      openDashboard();
      return;
    }

    console.warn(
      "openDashboard() was not found."
    );
  },


  /*
  ==================================================
  HELPERS
  ==================================================
  */

  normalizeAnswer(value) {

    return String(
      value || ""
    )
      .trim()
      .toLocaleLowerCase("nl-NL")
      .replace(/[.!?]+$/g, "")
      .replace(/\s+/g, " ");
  },


  escapeHTML(value) {

    return String(
      value ?? ""
    )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      )
      .replaceAll(
        "'",
        "&#039;"
      );
  },


  escapeAttribute(value) {

    return this.escapeHTML(
      value
    );
  }

};