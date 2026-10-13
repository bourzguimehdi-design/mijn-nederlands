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
  completedResult: null,
async startFromActivity(activity) {

  if (!activity) {
    throw new Error(
      "A study-plan activity is required."
    );
  }


  const profile =
    ProfileEngine.refresh();


  let session;


  if (
    activity.type === "concept" &&
    activity.concept
  ) {

    session =
      PracticeEngine.createConceptSession(
        activity.concept,
        profile,
        {
          minutes:
            activity.minutes || 10
        }
      );

  } else if (
    activity.type === "skill" &&
    activity.skill
  ) {

    session =
      PracticeEngine.createSkillSession(
        activity.skill,
        profile,
        {
          minutes:
            activity.minutes || 10
        }
      );

  } else {

    throw new Error(
      "This activity cannot be opened as practice."
    );

  }


  console.log(
    "Starting practice from activity:",
    activity
  );
// Curriculum sessions target the selected lesson level; ordinary
// adaptive sessions retain their existing profile-derived level.
if ((activity.source === "curriculum_practice" ||
     activity.source === "a2_mastery_assessment" ||
     activity.type === "skill") &&
    ["A1", "A2", "B1"].includes(activity.level)) {
  session.level = activity.level;
}
// Preserve daily-plan activity metadata.
session.source = activity.source || "daily_plan";
// The mastery bridge uses a descriptive lesson target, never a bare internal ID.
session.masteryTopicId = activity.masteryTopicId || null;
session.dailyActivityId = activity.id || null;

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
  START ERROR LESSON
  ==================================================
  */

  async startErrorLesson(
  concept
) {

  if (!concept) {

    throw new Error(
      "An error lesson concept is required."
    );

  }


  /*
  ==================================================
  RESET PRACTICE STATE
  ==================================================
  */

  this.currentSession =
    null;

  this.generatedPractice =
    null;

  this.currentStage =
    "loading";

  this.currentQuestionIndex =
    0;

  this.answers = [];


  this.renderLoading();


  try {

    /*
    ==================================================
    GENERATE + ADAPT ERROR LESSON
    ==================================================

    ErrorLessonEngine.startLesson() now handles:

    1. building the lesson context
    2. creating the practice session
    3. calling the API
    4. adapting the response for PracticeUI
    5. assigning the generated practice
    6. rendering the explanation

    Therefore PracticeUI must NOT perform the old
    error-lesson response validation here.
    ==================================================
    */

    const result =
      await ErrorLessonEngine
        .startLesson(
          concept
        );


    console.log(
      "ERROR LESSON RESULT:",
      result
    );


    /*
    ==================================================
    FINAL SAFETY CHECK
    ==================================================
    */

    if (
      !result ||
      result.status !==
        "success" ||
      !result.practice
    ) {

      throw new Error(
        "Error lesson generation returned an incomplete result."
      );

    }


    /*
    ErrorLessonEngine.startLesson() already assigned:

      this.currentSession
      this.generatedPractice
      this.currentStage
      this.currentQuestionIndex
      this.answers

    through PracticeUI itself.

    Nothing else needs to be transformed here.
    */


    return result;


  } catch (error) {

    console.error(
      "Could not start error lesson:",
      error
    );


    this.renderError(
      error.message ||
      "Could not load this error lesson."
    );


    throw error;

  }

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

    this.completedResult = null;
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
  /*
  ==================================================
  LISTENING AUDIO
  ==================================================
  */

  speakListeningText(text) {

    if (
      !text ||
      !("speechSynthesis" in window)
    ) {
      return;
    }


    window.speechSynthesis.cancel();


    const utterance =
      new SpeechSynthesisUtterance(
        text
      );


    utterance.lang =
      "nl-NL";

    utterance.rate =
      0.9;

    utterance.pitch =
      1;


    const voices =
      window.speechSynthesis
        .getVoices();


    const dutchVoice =
      voices.find(
        voice =>
          voice.lang
            ?.toLowerCase()
            .startsWith("nl")
      );


    if (dutchVoice) {

      utterance.voice =
        dutchVoice;

    }


    window.speechSynthesis.speak(
      utterance
    );

  },


  stopListeningAudio() {

    if (
      "speechSynthesis" in window
    ) {

      window.speechSynthesis.cancel();

    }

  },


  renderListeningContext(
    context
  ) {

    if (!context) {
      return "";
    }


    const encodedContext =
      encodeURIComponent(
        context
      );


    return `

      <div
        class="practice-listening"
      >

        <div
          class="practice-listening-icon"
          aria-hidden="true"
        >
          🔊
        </div>


        <div
          class="practice-listening-main"
        >

          <strong>
            Listen to the audio
          </strong>

          <span>
            Listen carefully, then answer
            the question below.
          </span>

        </div>


        <button
          class="practice-listen-button"
          type="button"
          onclick="PracticeUI.speakListeningText(
            decodeURIComponent(
              '${encodedContext}'
            )
          )"
        >
          ▶ Play audio
        </button>

      </div>

    `;

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


  this.stopListeningAudio();


  const number =
    this.currentQuestionIndex + 1;

  const progress =
    stage === "guided"
      ? 20 +
        Math.round(
          (
            number /
            Math.max(total, 1)
          ) * 35
        )
      : 60 +
        Math.round(
          (
            number /
            Math.max(total, 1)
          ) * 35
        );


  const options =
    Array.isArray(
      exercise.options
    )
      ? exercise.options
      : [];


  /*
  ==================================================
  CONTEXT
  ==================================================

  Reading:
    passage / notice / message

  Listening:
    transcript or listening context

  Writing / speaking:
    situation or supporting context

  Concept practice:
    normally no context
  ==================================================
  */

  const context =
    typeof exercise.context ===
      "string"
      ? exercise.context.trim()
      : "";


  /*
  ==================================================
  SKILL INFORMATION
  ==================================================
  */

  const skill =
    this.currentSession
      ?.skill ||
    this.generatedPractice
      ?.skill ||
    null;


  const level =
    this.currentSession
      ?.level ||
    this.generatedPractice
      ?.level ||
    null;


  const skillLabel =
    skill
      ? String(skill)
          .replace(
            /_/g,
            " "
          )
          .replace(
            /\b\w/g,
            character =>
              character.toUpperCase()
          )
      : null;


  /*
  ==================================================
  MULTIPLE-CHOICE OPTIONS
  ==================================================

  submitCurrentAnswer() expects:

      input[name="practice-answer"]:checked

  Therefore options must be radio inputs rather
  than buttons calling the old answerOption()
  function.
  ==================================================
  */

  const optionsHTML =
    options
      .map(
        (option, index) => {

          const optionId =
            `practice-option-${index}`;


          return `

            <label
              class="practice-option"
              for="${optionId}"
            >

              <input
                id="${optionId}"
                class="practice-option-input"
                type="radio"
                name="practice-answer"
                value="${this.escapeHTML(
                  option
                )}"
              >

              <span
                class="practice-option-text"
              >
                ${this.escapeHTML(
                  option
                )}
              </span>

            </label>

          `;

        }
      )
      .join("");


  /*
  ==================================================
  RENDER
  ==================================================
  */

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

          ${number} of ${total}

        </div>

      </div>


      <section class="practice-card">


        ${
          skillLabel
            ? `

              <div class="practice-skill-meta">

                <span
                  class="practice-skill-name"
                >
                  ${this.escapeHTML(
                    skillLabel
                  )}
                </span>

                ${
                  level
                    ? `

                      <span
                        class="practice-skill-level"
                      >
                        ${this.escapeHTML(
                          String(level)
                        )}
                      </span>

                    `
                    : ""
                }

              </div>

            `
            : ""
        }


        <div class="practice-card-label">

          ${
            stage === "guided"
              ? "PRACTICE"
              : "YOUR TURN"
          }

        </div>


        ${
          exercise.instruction
            ? `

              <p
                class="practice-instruction"
              >
                ${this.escapeHTML(
                  exercise.instruction
                )}
              </p>

            `
            : ""
        }


                ${
          context
            ? (
                skill === "listening"
                  ? this.renderListeningContext(
                      context
                    )
                  : `

                      <div
                        class="practice-context"
                      >
                        ${this.escapeHTML(
                          context
                        )}
                      </div>

                    `
              )
            : ""
        }


        <h2
          class="practice-question"
        >
          ${this.escapeHTML(
            exercise.prompt || ""
          )}
        </h2>


        ${
          options.length
            ? `

              <div
                class="practice-options"
              >

                ${optionsHTML}

              </div>


              <button
                class="practice-primary-button practice-check-button"
                type="button"
                onclick="PracticeUI.submitCurrentAnswer()"
              >
                Check answer
              </button>

            `
            : `

              <div
                class="practice-answer-area"
              >

                <textarea
                  id="practice-text-answer"
                  class="practice-answer-input"
                  rows="4"
                  placeholder="Write your answer here..."
                ></textarea>
${skill === "speaking" ? `
  <div class="practice-speaking-controls">
    <button
      id="practice-record-start"
      type="button"
      onclick="PracticeUI.startSpeakingAnswer()"
    >
      🎤 Start recording
    </button>

    <button
      id="practice-record-stop"
      type="button"
      onclick="PracticeUI.stopSpeakingAnswer()"
      hidden
    >
      ⏹ Stop recording
    </button>

    <p
      id="practice-record-status"
      role="status"
      aria-live="polite"
    >
      Record your answer in Dutch, or type it below.
    </p>
  </div>
` : ""}

                <button
                  class="practice-primary-button"
                  type="button"
                  onclick="PracticeUI.submitCurrentAnswer()"
                >
                  Check answer
                </button>

              </div>

            `
        }


        ${
          exercise.hint
            ? `

              <div
                class="practice-hint"
              >

                <strong>
                  Hint:
                </strong>

                ${this.escapeHTML(
                  exercise.hint
                )}

              </div>

            `
            : ""
        }


      </section>

    </div>

  `;


  this.showScreen();

},  /*
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

async startSpeakingAnswer() {
  const startButton =
    document.getElementById("practice-record-start");

  const stopButton =
    document.getElementById("practice-record-stop");

  const status =
    document.getElementById("practice-record-status");

  if (!startButton || !stopButton) return;

  startButton.disabled = true;

  try {
    await SpeakingRecorder.start();

    startButton.hidden = true;
    stopButton.hidden = false;

    if (status) {
      status.textContent = "🔴 Recording... Speak Dutch.";
    }
  } catch (error) {
    startButton.disabled = false;

    if (status) {
      status.textContent =
        error.message || "Microphone unavailable.";
    }
  }
},

async stopSpeakingAnswer() {
  const startButton =
    document.getElementById("practice-record-start");

  const stopButton =
    document.getElementById("practice-record-stop");

  const status =
    document.getElementById("practice-record-status");

  const answerField =
    document.getElementById("practice-text-answer");

  if (!stopButton || !answerField) return;

  stopButton.disabled = true;

  try {
    const recording = await SpeakingRecorder.stop();

    if (status) {
      status.textContent = "Transcribing your Dutch...";
    }

    const result =
      await MijnNederlandsAPI.transcribeSpeaking(recording);

    const transcript =
      String(result.transcript || "").trim();

    if (!transcript) {
      throw new Error("No speech was recognized. Please retry.");
    }

    answerField.value = transcript;

    if (status) {
      status.textContent =
        "Transcription ready. Review your answer, then press Check answer.";
    }
  } catch (error) {
    if (status) {
      status.textContent =
        error.message || "Recording failed. You can type your answer.";
    }
  } finally {
    if (startButton) {
      startButton.hidden = false;
      startButton.disabled = false;
    }

    stopButton.hidden = true;
    stopButton.disabled = false;
  }
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

  const hasOptions =
  Array.isArray(
    exercise.options
  ) &&
  exercise.options.length > 0;


if (hasOptions) {

  const root =
    this.getRoot();


  const selected =
    root?.querySelector(
      'input[name="practice-answer"]:checked'
    );


  answer =
    selected
      ? selected.value
      : "";

} else {

  const field =
    this.getRoot()
      ?.querySelector(
        "#practice-text-answer"
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
  DETERMINE PRACTICE TYPE
  ==================================================

  Concept practice:
    targetConceptCorrect

  Skill practice:
    targetSkillCorrect
  ==================================================
  */

  const practiceType =
    this.currentSession
      ?.practiceType ||
    this.generatedPractice
      ?.practiceType ||
    (
      this.currentSession?.skill
        ? "skill"
        : "concept"
    );


  const isSkillPractice =
    practiceType === "skill";


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
      this.normalizeAnswer(
        answer
      ) ===
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

      practiceType,

      concept:
        this.currentSession
          ?.concept ||
        this.generatedPractice
          ?.concept ||
        null,

      skill:
        this.currentSession
          ?.skill ||
        this.generatedPractice
          ?.skill ||
        null,

      answer,

      expectedAnswer:
        exercise.expectedAnswer,

      correct,

      /*
      Only the applicable target field
      receives a boolean.
      */

      targetConceptCorrect:
        isSkillPractice
          ? null
          : correct,

      targetSkillCorrect:
        isSkillPractice
          ? correct
          : null,

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

  Open-ended answers are evaluated by the API.

  Concept practice uses:
    targetConceptCorrect

  Skill practice uses:
    targetSkillCorrect
  ==================================================
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

      element.disabled =
        true;

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
      result?.evaluation ||
      {};


    /*
    ==================================================
    DETERMINE TARGET CORRECTNESS
    ==================================================
    */

    let correct;


    if (
      isSkillPractice
    ) {

      /*
      New skill-practice response.
      */

      if (
        typeof evaluation
          .targetSkillCorrect ===
        "boolean"
      ) {

        correct =
          evaluation
            .targetSkillCorrect;

      } else {

        /*
        Backward/failure-safe fallback.
        */

        correct =
          evaluation
            .overallCorrect ===
          true;

      }

    } else {

      /*
      Existing concept-practice response.
      */

      if (
        typeof evaluation
          .targetConceptCorrect ===
        "boolean"
      ) {

        correct =
          evaluation
            .targetConceptCorrect;

      } else {

        correct =
          evaluation
            .overallCorrect ===
          true;

      }

    }


    /*
    ==================================================
    SAVE ANSWER
    ==================================================
    */

    this.answers.push({

      exerciseId:
        exercise.id,

      stage:
        this.currentStage,

      type:
        exercise.type,

      practiceType,

      concept:
        this.currentSession
          ?.concept ||
        this.generatedPractice
          ?.concept ||
        null,

      skill:
        this.currentSession
          ?.skill ||
        this.generatedPractice
          ?.skill ||
        null,

      answer,

      expectedAnswer:
        exercise.expectedAnswer,

      correct,

      targetConceptCorrect:
        isSkillPractice
          ? null
          : (
              typeof evaluation
                .targetConceptCorrect ===
              "boolean"
                ? evaluation
                    .targetConceptCorrect
                : correct
            ),

      targetSkillCorrect:
        isSkillPractice
          ? (
              typeof evaluation
                .targetSkillCorrect ===
              "boolean"
                ? evaluation
                    .targetSkillCorrect
                : correct
            )
          : null,

      overallCorrect:
        evaluation
          .overallCorrect ===
        true,

      feedback:
        evaluation.feedback ||
        null,

      correction:
        evaluation.correction ||
        null,

      explanation:
        evaluation.explanation ||
        null,

      /*
      New Worker returns concepts[].

      Keep errorConcept too for compatibility
      with older stored practice results.
      */

      concepts:
        Array.isArray(
          evaluation.concepts
        )
          ? evaluation.concepts.slice()
          : [],

      errorConcept:
        evaluation.errorConcept ||
        null,

      evaluationSource:
        "ai",

      completedAt:
        new Date().toISOString()

    });


    /*
    ==================================================
    SHOW FEEDBACK
    ==================================================
    */

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
    Re-enable controls so the learner
    can retry without losing the answer.
    */

    controls.forEach(
      element => {

        element.disabled =
          false;

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


  /*
  ==================================================
  DETERMINE PRACTICE TYPE
  ==================================================
  */

  const practiceType =
    this.currentSession
      ?.practiceType ||
    this.generatedPractice
      ?.practiceType ||
    (
      this.currentSession?.skill
        ? "skill"
        : "concept"
    );


  const isSkillPractice =
    practiceType === "skill";


  /*
  ==================================================
  TARGET CORRECTNESS
  ==================================================
  */

  let targetCorrect;


  if (
    isSkillPractice
  ) {

    targetCorrect =
      typeof evaluation
        .targetSkillCorrect ===
      "boolean"

        ? evaluation
            .targetSkillCorrect

        : evaluation
            .overallCorrect ===
          true;

  } else {

    targetCorrect =
      typeof evaluation
        .targetConceptCorrect ===
      "boolean"

        ? evaluation
            .targetConceptCorrect

        : evaluation
            .overallCorrect ===
          true;

  }


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
    targetCorrect &&
    isSkillPractice
  ) {

    heading =
      "Skill correct";

  } else if (
    targetCorrect
  ) {

    heading =
      "Target concept correct";

  } else {

    heading =
      "Review this one";

  }


  /*
  ==================================================
  ADDITIONAL CONCEPTS
  ==================================================
  */

  const concepts =
    Array.isArray(
      evaluation.concepts
    )
      ? evaluation.concepts
          .filter(Boolean)
      : [];


  /*
  Backward compatibility with the
  previous evaluator response.
  */

  if (
    evaluation.errorConcept &&
    evaluation.errorConcept !==
      "none" &&
    !concepts.includes(
      evaluation.errorConcept
    )
  ) {

    concepts.push(
      evaluation.errorConcept
    );

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
      evaluation.explanation
        ? `
          <p class="small">
            ${this.escapeHTML(
              evaluation.explanation
            )}
          </p>
        `
        : ""
    }


    ${
      concepts.length
        ? `
          <p class="small">

            <strong>
              Also review:
            </strong>

            ${concepts
              .map(
                concept =>
                  this.escapeHTML(
                    String(
                      concept
                    )
                      .replaceAll(
                        "_",
                        " "
                      )
                  )
              )
              .join(", ")}

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

          element.disabled =
            true;

        }
      );


    card.appendChild(
      feedback
    );


    const continueButton =
      feedback.querySelector(
        "button"
      );


    if (
      continueButton
    ) {

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
  },  /*
  ==================================================
  COMPLETE
  ==================================================
  */

 
renderComplete() {
  const root = this.getRoot();

  if (!root) {
    return;
  }

  /*
  ==================================================
  RESULT
  ==================================================
  */

  const total = this.answers.length;

  const correct = this.answers.filter(
    answer => answer.correct === true
  ).length;

  const incorrect = Math.max(0, total - correct);

  const score = total > 0
    ? Math.round((correct / total) * 100)
    : 0;

  /*
  ==================================================
  PRACTICE TYPE
  ==================================================
  */

  const session = this.currentSession || {};

  const practiceType =
    session.practiceType ||
    (session.skill ? "skill" : "concept");

  const concept = practiceType === "concept"
    ? (
        session.concept ||
        this.generatedPractice?.concept ||
        null
      )
    : null;

  const skill = practiceType === "skill"
    ? (
        session.skill ||
        this.generatedPractice?.skill ||
        null
      )
    : null;

  const level =
    session.level ||
    this.generatedPractice?.level ||
    null;

  /*
  ==================================================
  DISPLAY LABEL
  ==================================================
  */

  const target = concept || skill || null;

  const targetLabel = target
    ? String(target)
        .replaceAll("_", " ")
        .replace(
          /\b\w/g,
          character => character.toUpperCase()
        )
    : "this topic";

  /*
  ==================================================
  SAVE PRACTICE RESULT
  ==================================================
  */

  let savedResult = this.completedResult;

  if (
    !savedResult &&
    total > 0 &&
    typeof Storage !== "undefined" &&
    typeof Storage.savePracticeResult === "function"
  ) {
    const practiceResult = {
      id:
        session.id ||
        `practice_${concept || skill || "unknown"}_${Date.now()}`,

      type: practiceType === "skill"
        ? "skill_practice"
        : "concept_practice",

      practiceType,
      concept,
      skill,
      level,

      title:
        session.title ||
        this.generatedPractice?.title ||
        null,

      minutes: session.minutes || null,

      correct,
      total,
      score,

      answers: this.answers.map(answer => ({
        ...answer
      })),

      source: session.source || null,
      masteryTopicId: session.masteryTopicId || null,

      dailyPlanDate:
        typeof Dashboard !== "undefined" &&
        Dashboard.activeActivity
          ? Dashboard.getTodayKey()
          : null,

      dailyActivityId:
        session.dailyActivityId ||
        (
          typeof Dashboard !== "undefined" &&
          Dashboard.activeActivity
            ? Dashboard.activeActivity.id
            : null
        ),

      completedAt: new Date().toISOString()
    };

    try {
      savedResult = Storage.savePracticeResult(
        practiceResult
      );

      console.log(
        "Practice result saved:",
        savedResult
      );

      if (savedResult) {
        this.completedResult = savedResult;

        /*
        ================================================
        SPACED REPETITION
        ================================================
        */

        if (
          typeof SpacedReviewEngine !== "undefined"
        ) {
          if (session.source === "spaced_review") {
            /*
            --------------------------------------------
            COMPLETE SCHEDULED REVIEW
            --------------------------------------------
            */

            try {
              const reviewedConcept =
                SpacedReviewEngine.normalizeConcept(
                  session.concept
                );

              const answers = Array.isArray(
                savedResult.answers
              )
                ? savedResult.answers
                : [];

              const taggedAnswers = answers.filter(
                answer =>
                  Array.isArray(answer.concepts) &&
                  answer.concepts.some(
                    tag =>
                      SpacedReviewEngine.normalizeConcept(
                        tag
                      ) === reviewedConcept
                  )
              );

              /*
              Use all graded answers only when
              there are no matching concept tags
              and the session is concept-focused.
              */

              const relevantAnswers =
                taggedAnswers.length > 0
                  ? taggedAnswers
                  : practiceType === "concept" &&
                    reviewedConcept
                    ? answers
                    : [];

              const gradedAnswers =
                relevantAnswers.filter(
                  answer =>
                    typeof answer.correct === "boolean"
                );

              if (
                reviewedConcept &&
                gradedAnswers.length > 0
              ) {
                const correctCount =
                  gradedAnswers.filter(
                    answer => answer.correct === true
                  ).length;

                const accuracy =
                  correctCount / gradedAnswers.length;

                const updated =
                  SpacedReviewEngine.completeReview({
                    concept: reviewedConcept,
                    correct: accuracy >= 0.8,
                    resultId: savedResult.id,
                    date: new Date(
                      savedResult.completedAt
                    )
                  });

                console.log(
                  "Spaced review completed:",
                  {
                    concept: reviewedConcept,
                    accuracy,
                    updated
                  }
                );
              } else {
                console.warn(
                  "Review schedule not advanced: " +
                  "no reliable graded answers."
                );
              }
            } catch (error) {
              console.error(
                "Could not update spaced review schedule:",
                error
              );
            }
          } else {
            /*
            --------------------------------------------
            REGISTER ORDINARY PRACTICE MISTAKES
            --------------------------------------------
            */

            try {
              const registered =
                SpacedReviewEngine.registerMistakes(
                  savedResult,
                  new Date(
                    savedResult.completedAt
                  )
                );

              console.log(
                "Spaced review mistakes registered:",
                registered
              );
            } catch (error) {
              console.error(
                "Spaced review registration failed:",
                error
              );
            }
          }
        }

        /*
        ================================================
        COMPLETE DAILY PLAN ACTIVITY
        ================================================
        */

        if (typeof Dashboard !== "undefined") {
          Dashboard.completeActivity(savedResult);
        }
      }

      /*
      ==================================================
      SAVE PROGRESS SNAPSHOT
      ==================================================
      */

      if (
        savedResult &&
        typeof ProgressEngine !== "undefined" &&
        typeof ProgressEngine.saveSnapshot === "function"
      ) {
        const progressSnapshot =
          ProgressEngine.saveSnapshot();

        console.log(
          "Progress snapshot saved after practice:",
          progressSnapshot
        );
      } else if (savedResult) {
        console.warn(
          "Progress snapshot engine is unavailable."
        );
      }
    } catch (error) {
      console.error(
        "Could not save practice result or progress snapshot:",
        error
      );
    }
  } else if (!savedResult) {
    console.warn(
      "Practice Storage is not available or no answers were recorded."
    );
  }

  /*
  ==================================================
  RESULT MESSAGE
  ==================================================
  */

  let resultHeading;
  let resultMessage;

  if (score >= 90) {
    resultHeading = "Excellent work";
    resultMessage =
      `You showed strong control of ${targetLabel}.`;
  } else if (score >= 75) {
    resultHeading = "Good progress";
    resultMessage =
      `You're building solid control of ${targetLabel}.`;
  } else if (score >= 60) {
    resultHeading = "Keep building";
    resultMessage =
      `${targetLabel} still needs some practice.`;
  } else {
    resultHeading = "Worth reviewing";
    resultMessage =
      `We'll keep ${targetLabel} in your practice rotation.`;
  }

  /*
  ==================================================
  COMPLETION SCREEN
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

      <section class="practice-card practice-complete-card">

        <div class="practice-card-label">
          COMPLETE
        </div>

        <h2>
          Practice complete
        </h2>

        <div class="practice-result-summary">

          <div class="practice-result-score">
            ${score}%
          </div>

          <div class="practice-result-details">
            <strong>
              ${correct} of ${total} correct
            </strong>

            <span>
              ${this.escapeHTML(targetLabel)}
              ${
                level
                  ? ` · ${this.escapeHTML(String(level))}`
                  : ""
              }
            </span>
          </div>

        </div>

        <div class="practice-result-message">
          <strong>
            ${this.escapeHTML(resultHeading)}
          </strong>

          <p>
            ${this.escapeHTML(resultMessage)}
          </p>
        </div>

        ${
          incorrect > 0
            ? `
              <div class="practice-review-summary">
                <div class="practice-review-count">
                  ${incorrect}
                </div>

                <div>
                  <strong>
                    ${
                      incorrect === 1
                        ? "answer needs review"
                        : "answers need review"
                    }
                  </strong>

                  <p>
                    ${
                      savedResult
                        ? "Your mistakes were saved and can be used to adapt future practice."
                        : "These answers are worth reviewing again."
                    }
                  </p>
                </div>
              </div>
            `
            : `
              <div class="practice-review-summary practice-review-summary-clear">
                <div class="practice-review-count">
                  ✓
                </div>

                <div>
                  <strong>
                    No mistakes to review
                  </strong>

                  <p>
                    You answered every exercise correctly.
                  </p>
                </div>
              </div>
            `
        }

        ${
          savedResult &&
          typeof Dashboard !== "undefined" &&
          Dashboard.getNextActivity()
            ? `
              <button
                class="practice-primary-button practice-complete-button"
                type="button"
                onclick="Dashboard.continueTodayPlan()"
              >
                Continue Today's Plan →
              </button>
            `
            : ""
        }

        <button
          class="practice-primary-button practice-complete-button"
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
  PROGRESS
  ==================================================
  */

  renderProgress() {

    const root =
      this.getRoot();


    if (!root) {
      return;
    }


    const profile =
      ProfileEngine.refresh();


    const concepts =
      ProfileEngine
        .getPriorityConcepts(
          profile,
          100
        );


    if (!concepts.length) {

      root.innerHTML = `
        <div class="practice-shell">

          ${this.renderHeader()}

          <section class="practice-card">

            <div class="practice-card-label">
              PROGRESS
            </div>

            <h2>
              Your practice progress
            </h2>

            <p class="small">
              Complete some concept practice
              to start tracking mastery.
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


      return;
    }


    /*
    Concepts that have actual practice evidence.
    */

    const practised =
      concepts.filter(
        concept =>
          (
            concept.practiceSuccesses ||
            0
          ) +
          (
            concept.practiceFailures ||
            0
          ) > 0
      );


    const totalSuccesses =
      practised.reduce(
        (
          total,
          concept
        ) =>
          total +
          (
            concept.practiceSuccesses ||
            0
          ),
        0
      );


    const totalFailures =
      practised.reduce(
        (
          total,
          concept
        ) =>
          total +
          (
            concept.practiceFailures ||
            0
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


    const strongest =
      [...practised]
        .sort(
          (
            a,
            b
          ) =>
            (
              b.mastery ||
              0
            ) -
            (
              a.mastery ||
              0
            )
        )[0];


    const progressConcepts =
      [...practised]
        .sort(
          (
            a,
            b
          ) =>
            (
              b.mastery ||
              0
            ) -
            (
              a.mastery ||
              0
            )
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
                  concept.mastery ||
                  0
                )
              );


            const recentSuccesses =
              concept
                .recentPracticeSuccesses ||
              0;


            const recentFailures =
              concept
                .recentPracticeFailures ||
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
                    ${this.escapeHTML(
                      StudyPlanEngine
                        .formatConcept(
                          concept.name
                        )
                    )}
                  </strong>


                  <div class="dashboard-mastery-score">

                    <strong>
                      ${mastery}%
                    </strong>


                    <span class="dashboard-mastery-label">
                      ${this.escapeHTML(
                        ProfileEngine
                          .getMasteryLabel(
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


    root.innerHTML = `

      <div class="practice-shell">

        ${this.renderHeader()}


        <section class="practice-card">

          <div class="practice-card-label">
            PROGRESS
          </div>


          <h2>
            Your practice progress
          </h2>


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
                    ${this.escapeHTML(
                      StudyPlanEngine
                        .formatConcept(
                          strongest.name
                        )
                    )}
                  </strong>

                  <div class="small">
                    ${strongest.mastery || 0}%
                    mastery
                  </div>

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

  },  /*
  ==================================================
  PROFILE / PRACTICE SUMMARY
  ==================================================
  */

  renderPracticeSummary() {

    const root =
      this.getRoot();


    if (!root) {
      return;
    }


    const profile =
      ProfileEngine.refresh();


    const session =
      this.currentSession ||
      {};


    const practiceType =
      session.practiceType ||
      (
        session.skill
          ? "skill"
          : "concept"
      );


    /*
    ==================================================
    CONCEPT PRACTICE SUMMARY
    ==================================================
    */

    if (
      practiceType ===
      "concept"
    ) {

      const conceptName =
        PracticeEngine
          .normalizeConcept(
            session.concept
          );


      const concept =
        profile
          ?.concepts
          ?.[
            conceptName
          ] ||
        null;


      const mastery =
        concept
          ? Math.max(
              0,
              Math.min(
                100,
                concept.mastery ||
                0
              )
            )
          : 0;


      const masteryLabel =
        typeof ProfileEngine
          .getMasteryLabel ===
          "function"

          ? ProfileEngine
              .getMasteryLabel(
                mastery
              )

          : "";


      const successes =
        concept
          ?.practiceSuccesses ||
        0;


      const failures =
        concept
          ?.practiceFailures ||
        0;


      const total =
        successes +
        failures;


      const accuracy =
        total
          ? Math.round(
              (
                successes /
                total
              ) * 100
            )
          : 0;


      root.innerHTML = `
        <div class="practice-shell">

          ${this.renderHeader()}


          <section class="practice-card">

            <div class="practice-card-label">
              PRACTICE PROGRESS
            </div>


            <h2>
              ${this.escapeHTML(
                StudyPlanEngine
                  .formatConcept(
                    conceptName
                  )
              )}
            </h2>


            <div class="dashboard-progress-grid">

              <div>

                <div class="small">
                  Mastery
                </div>

                <strong class="dashboard-big-value">
                  ${mastery}%
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
                  Practice answers
                </div>

                <strong class="dashboard-big-value">
                  ${total}
                </strong>

              </div>

            </div>


            ${
              masteryLabel
                ? `
                  <div class="dashboard-progress-highlight">

                    <div class="small">
                      Current mastery
                    </div>

                    <strong>
                      ${this.escapeHTML(
                        masteryLabel
                      )}
                    </strong>

                  </div>
                `
                : ""
            }


            <div class="dashboard-mastery-bar">

              <div
                class="dashboard-mastery-fill"
                style="width: ${mastery}%"
              ></div>

            </div>


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


      return;

    }


    /*
    ==================================================
    SKILL PRACTICE SUMMARY
    ==================================================

    Skill practice is deliberately displayed using
    skill evidence rather than concept mastery.

    We do NOT look for a concept named "reading",
    "writing", etc.
    ==================================================
    */

    const skillName =
      session.skill ||
      this.generatedPractice
        ?.skill ||
      null;


    const skill =
      skillName
        ? profile
            ?.skills
            ?.[skillName]
        : null;


    const skillLevel =
      skill
        ?.level ||
      session.level ||
      null;


    const confidence =
      Number(
        skill?.confidence ||
        0
      );


    const confidencePercent =
      confidence <= 1
        ? Math.round(
            confidence * 100
          )
        : Math.round(
            confidence
          );


    const totalAnswers =
      this.answers.length;


    const correctAnswers =
      this.answers.filter(
        answer =>
          answer.correct
      ).length;


    const sessionAccuracy =
      totalAnswers
        ? Math.round(
            (
              correctAnswers /
              totalAnswers
            ) * 100
          )
        : 0;


    root.innerHTML = `
      <div class="practice-shell">

        ${this.renderHeader()}


        <section class="practice-card">

          <div class="practice-card-label">
            SKILL PRACTICE
          </div>


          <h2>
            ${this.escapeHTML(
              PracticeEngine
                .formatConcept(
                  skillName ||
                  "practice"
                )
            )}
          </h2>


          <div class="dashboard-progress-grid">

            <div>

              <div class="small">
                Current level
              </div>

              <strong class="dashboard-big-value">
                ${this.escapeHTML(
                  skillLevel ||
                  "—"
                )}
              </strong>

            </div>


            <div>

              <div class="small">
                This session
              </div>

              <strong class="dashboard-big-value">
                ${sessionAccuracy}%
              </strong>

            </div>


            <div>

              <div class="small">
                Answers
              </div>

              <strong class="dashboard-big-value">
                ${totalAnswers}
              </strong>

            </div>

          </div>


          ${
            skill?.assessed
              ? `
                <div class="dashboard-progress-highlight">

                  <div class="small">
                    Profile confidence
                  </div>

                  <strong>
                    ${confidencePercent}%
                  </strong>

                </div>
              `
              : ""
          }


          <p class="small">
            This practice session is saved as
            ${this.escapeHTML(
              PracticeEngine
                .formatConcept(
                  skillName ||
                  "skill"
                )
            )}
            skill practice.
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
            session?.skill ||
            "Practice"
          )}
        </h1>

        <p>
          ${this.escapeHTML(
            session?.level ||
            ""
          )}
          ·
          ${Number(
            session?.minutes ||
            10
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

      dashboard
        .classList
        .add(
          "hidden"
        );

    }


    /*
    Show practice.
    */

    root
      .classList
      .remove(
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
      value ||
      ""
    )
      .trim()
      .toLocaleLowerCase(
        "nl-NL"
      )
      .replace(
        /[.!?]+$/g,
        ""
      )
      .replace(
        /\s+/g,
        " "
      );

  },


  escapeHTML(value) {

    return String(
      value ??
      ""
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
