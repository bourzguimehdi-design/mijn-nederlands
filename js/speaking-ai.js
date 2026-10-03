/*
==================================================
MIJN NEDERLANDS
AI SPEAKING CONTROLLER
==================================================
*/


/*
==================================================
STATE
==================================================
*/

let speakingTaskIndex = 0;

let speakingResponses = [];

let speakingTaskStartedAt = null;

let speakingRecording = null;

let speakingLastTranscript = "";

let speakingLastEvaluation = null;

let speakingTimerInterval = null;

let speakingRecordingStartedAt = null;

let speakingProcessing = false;



/*
==================================================
HELPERS
==================================================
*/

function getCurrentSpeakingTask() {

  return speakingTasks[
    speakingTaskIndex
  ] || null;

}


function hideSpeakingScreens() {

  const ids = [
    "speakingIntro",
    "speakingAssessment",
    "speakingLoading",
    "speakingFeedback",
    "speakingError",
    "speakingComplete"
  ];


  ids.forEach(
    id => {

      const element =
        document.getElementById(id);

      if (element) {
        element.classList.add(
          "hidden"
        );
      }

    }
  );

}


function hideMainScreensForSpeaking() {

  const ids = [
    "dashboard",
    "moduleComingSoon",
    "intro",
    "assessment",
    "skillComplete",
    "writingIntro",
    "writingAssessment",
    "writingSelfCheck",
    "writingLoading",
    "writingFeedback",
    "writingError",
    "writingComplete",
    "results"
  ];


  ids.forEach(
    id => {

      const element =
        document.getElementById(id);

      if (element) {
        element.classList.add(
          "hidden"
        );
      }

    }
  );

}


function showSpeakingScreen(id) {

  hideMainScreensForSpeaking();
  hideSpeakingScreens();


  const element =
    document.getElementById(id);


  if (element) {

    element.classList.remove(
      "hidden"
    );

  }

}



/*
==================================================
START ASSESSMENT
==================================================
*/

function startSpeakingAssessment() {

  stopSpeakingTimer();


  if (
    SpeakingRecorder.isRecording()
  ) {

    SpeakingRecorder.cancel();

  }


  speakingTaskIndex = 0;

  speakingResponses = [];

  speakingTaskStartedAt = null;

  speakingRecording = null;

  speakingLastTranscript = "";

  speakingLastEvaluation = null;

  speakingProcessing = false;


  showSpeakingScreen(
    "speakingIntro"
  );

}



/*
==================================================
BEGIN TASKS
==================================================
*/

function beginSpeakingTasks() {

  speakingTaskIndex = 0;

  speakingResponses = [];

  renderSpeakingTask();

}



/*
==================================================
RENDER TASK
==================================================
*/

function renderSpeakingTask() {

  const task =
    getCurrentSpeakingTask();


  if (!task) {

    finishSpeakingAssessment();

    return;

  }


  stopSpeakingTimer();


  if (
    SpeakingRecorder.isRecording()
  ) {

    SpeakingRecorder.cancel();

  }


  speakingRecording = null;

  speakingLastTranscript = "";

  speakingLastEvaluation = null;

  speakingProcessing = false;


  speakingTaskStartedAt =
    new Date().toISOString();


  showSpeakingScreen(
    "speakingAssessment"
  );


  /*
  ------------------------------------------
  PROGRESS
  ------------------------------------------
  */

  const progress =
    speakingTasks.length > 0
      ? (
          speakingTaskIndex /
          speakingTasks.length
        ) * 100
      : 0;


  const progressBar =
    document.getElementById(
      "speakingProgressBar"
    );


  if (progressBar) {

    progressBar.style.width =
      `${progress}%`;

  }


  /*
  ------------------------------------------
  HEADER
  ------------------------------------------
  */

  const counter =
    document.getElementById(
      "speakingTaskCounter"
    );


  if (counter) {

    counter.textContent =
      `Task ${
        speakingTaskIndex + 1
      } of ${
        speakingTasks.length
      }`;

  }


  const levelBadge =
    document.getElementById(
      "speakingLevelBadge"
    );


  if (levelBadge) {

    levelBadge.textContent =
      task.level;

  }


  /*
  ------------------------------------------
  TASK CONTENT
  ------------------------------------------
  */

  const title =
    document.getElementById(
      "speakingTaskTitle"
    );


  if (title) {

    title.textContent =
      task.title || "Speaking task";

  }


  const situation =
    document.getElementById(
      "speakingSituation"
    );


  if (situation) {

    situation.textContent =
      task.situation || "";

  }


  const instruction =
    document.getElementById(
      "speakingInstruction"
    );


  if (instruction) {

    instruction.textContent =
      task.instruction || "";

  }


  const requirements =
    document.getElementById(
      "speakingRequirements"
    );


  if (requirements) {

    requirements.innerHTML = "";


    (
      task.requirements || []
    ).forEach(
      requirement => {

        const item =
          document.createElement(
            "li"
          );


        item.textContent =
          requirement;


        requirements.appendChild(
          item
        );

      }
    );

  }


  resetSpeakingRecorderUI();

}



/*
==================================================
RECORDER UI
==================================================
*/

function resetSpeakingRecorderUI() {

  const startButton =
    document.getElementById(
      "startSpeakingRecordingButton"
    );


  const stopButton =
    document.getElementById(
      "stopSpeakingRecordingButton"
    );


  const skipButton =
    document.getElementById(
      "skipSpeakingTaskButton"
    );


  if (startButton) {

    startButton.classList.remove(
      "hidden"
    );

    startButton.disabled = false;

  }


  if (stopButton) {

    stopButton.classList.add(
      "hidden"
    );

    stopButton.disabled = false;

  }


  if (skipButton) {

    skipButton.disabled = false;

  }


  setSpeakingRecorderStatus(
    "Ready to record",
    "Press Start recording when you're ready."
  );


  updateSpeakingTimer(0);

}



/*
==================================================
START RECORDING
==================================================
*/

async function startSpeakingRecording() {

  if (speakingProcessing) {
    return;
  }


  const startButton =
    document.getElementById(
      "startSpeakingRecordingButton"
    );


  const stopButton =
    document.getElementById(
      "stopSpeakingRecordingButton"
    );


  const skipButton =
    document.getElementById(
      "skipSpeakingTaskButton"
    );


  try {

    if (startButton) {

      startButton.disabled =
        true;

    }


    await SpeakingRecorder.start();


    speakingRecordingStartedAt =
      Date.now();


    startSpeakingTimer();


    if (startButton) {

      startButton.classList.add(
        "hidden"
      );

    }


    if (stopButton) {

      stopButton.classList.remove(
        "hidden"
      );

    }


    if (skipButton) {

      skipButton.disabled =
        true;

    }


    setSpeakingRecorderStatus(
      "● Recording",
      "Speak naturally in Dutch. Press Stop recording when you're finished."
    );


  } catch (error) {

    console.error(
      "Could not start speaking recording:",
      error
    );


    if (startButton) {

      startButton.disabled =
        false;

    }


    showSpeakingError(
      error.message ||
      "The microphone could not be started."
    );

  }

}



/*
==================================================
STOP RECORDING
==================================================
*/

async function stopSpeakingRecording() {

  if (
    speakingProcessing ||
    !SpeakingRecorder.isRecording()
  ) {
    return;
  }


  speakingProcessing = true;


  const stopButton =
    document.getElementById(
      "stopSpeakingRecordingButton"
    );


  if (stopButton) {

    stopButton.disabled =
      true;

  }


  stopSpeakingTimer();


  try {

    speakingRecording =
      await SpeakingRecorder.stop();


    if (
      !speakingRecording ||
      !speakingRecording.blob ||
      speakingRecording.size <= 0
    ) {

      throw new Error(
        "No usable recording was created."
      );

    }


    await processSpeakingRecording();


  } catch (error) {

    console.error(
      "Could not stop/process speaking recording:",
      error
    );


    speakingProcessing = false;


    showSpeakingError(
      error.message ||
      "Your recording could not be processed."
    );

  }

}



/*
==================================================
PROCESS RECORDING
==================================================
*/

async function processSpeakingRecording() {

  const task =
    getCurrentSpeakingTask();


  if (!task) {

    speakingProcessing = false;

    return;

  }


  showSpeakingScreen(
    "speakingLoading"
  );


  setSpeakingLoading(
    "Transcribing your Dutch…",
    "Converting your recording into text."
  );


  try {

    /*
    ------------------------------------------
    TRANSCRIPTION
    ------------------------------------------
    */

    const transcription =
      await MijnNederlandsAPI
        .transcribeSpeaking(
          speakingRecording
        );


    speakingLastTranscript =
      String(
        transcription.transcript ||
        ""
      ).trim();


    /*
    ------------------------------------------
    EVALUATION
    ------------------------------------------
    */

    setSpeakingLoading(
      "Evaluating your Dutch…",
      "Checking task completion, comprehensibility, grammar, vocabulary and coherence."
    );


    const result =
      await MijnNederlandsAPI
        .evaluateSpeaking(
          task,
          speakingLastTranscript
        );


    speakingLastEvaluation =
      result.evaluation;


    /*
    ------------------------------------------
    CREATE LOCAL RESPONSE
    ------------------------------------------
    */

    const response =
      SpeakingEngine.createResponse(
        task,
        speakingLastTranscript,
        speakingTaskStartedAt
      );


    response.evaluation = {
      status: "complete",
      ...speakingLastEvaluation
    };


    response.audio = {

      mimeType:
        speakingRecording.mimeType ||
        speakingRecording.blob.type ||
        null,

      size:
        speakingRecording.size ||
        speakingRecording.blob.size ||
        0,

      startedAt:
        speakingRecording.startedAt ||
        null,

      completedAt:
        speakingRecording.completedAt ||
        null

    };


    speakingResponses.push(
      response
    );


    speakingProcessing = false;


    renderSpeakingFeedback(
      response
    );


  } catch (error) {

    console.error(
      "Speaking processing failed:",
      error
    );


    speakingProcessing = false;


    showSpeakingError(
      error.message ||
      "Your speaking response could not be evaluated."
    );

  }

}



/*
==================================================
SKIP TASK
==================================================
*/

function skipSpeakingTask() {

  if (speakingProcessing) {
    return;
  }


  stopSpeakingTimer();


  if (
    SpeakingRecorder.isRecording()
  ) {

    SpeakingRecorder.cancel();

  }


  const task =
    getCurrentSpeakingTask();


  if (!task) {
    return;
  }


  const response =
    SpeakingEngine
      .createSkippedResponse(
        task,
        speakingTaskStartedAt,
        "learner_could_not_answer"
      );


  response.evaluation = {
    status: "skipped",
    estimatedPerformance: null,
    scores: null,
    strengths: [],
    errors: [],
    priorityConcepts: [],
    overallFeedback:
      "This task was skipped.",
    nextStep: null
  };


  speakingResponses.push(
    response
  );


  speakingTaskIndex += 1;


  if (
    speakingTaskIndex >=
    speakingTasks.length
  ) {

    finishSpeakingAssessment();

    return;

  }


  renderSpeakingTask();

}



/*
==================================================
RETRY TASK
==================================================
*/

function retrySpeakingTask() {

  speakingProcessing = false;

  speakingRecording = null;

  speakingLastTranscript = "";

  speakingLastEvaluation = null;


  renderSpeakingTask();

}



/*
==================================================
FEEDBACK
==================================================
*/

function renderSpeakingFeedback(
  response
) {

  const evaluation =
    response.evaluation || {};


  showSpeakingScreen(
    "speakingFeedback"
  );


  /*
  ------------------------------------------
  PERFORMANCE
  ------------------------------------------
  */

  const performance =
    document.getElementById(
      "speakingFeedbackPerformance"
    );


  if (performance) {

    performance.textContent =
      formatSpeakingPerformance(
        evaluation.taskPerformance
      );

  }


  const level =
    document.getElementById(
      "speakingFeedbackLevel"
    );


  if (level) {

    level.textContent =
      evaluation.estimatedPerformance
        ? `Demonstrated performance on this task: ${
            formatSpeakingLevel(
              evaluation.estimatedPerformance
            )
          }`
        : "";

  }


  /*
  ------------------------------------------
  SCORES
  ------------------------------------------
  */

  renderSpeakingScores(
    evaluation.scores
  );


  /*
  ------------------------------------------
  STRENGTHS
  ------------------------------------------
  */

  renderSpeakingList(
    "speakingFeedbackStrengths",
    "speakingFeedbackStrengthsCard",
    evaluation.strengths
  );


  /*
  ------------------------------------------
  ERRORS
  ------------------------------------------
  */

  renderSpeakingErrors(
    evaluation.errors
  );


  /*
  ------------------------------------------
  PRIORITIES
  ------------------------------------------
  */

  renderSpeakingList(
    "speakingFeedbackPriority",
    "speakingFeedbackPriorityCard",
    evaluation.priorityConcepts,
    true
  );


  /*
  ------------------------------------------
  OVERALL
  ------------------------------------------
  */

  const overall =
    document.getElementById(
      "speakingFeedbackOverall"
    );


  if (overall) {

    overall.textContent =
      evaluation.overallFeedback ||
      "";

  }


  const nextStep =
    document.getElementById(
      "speakingFeedbackNextStep"
    );


  if (nextStep) {

    nextStep.textContent =
      evaluation.nextStep ||
      "";

  }

}



/*
==================================================
SCORE DISPLAY
==================================================
*/

function renderSpeakingScores(
  scores
) {

  const container =
    document.getElementById(
      "speakingFeedbackScores"
    );


  if (!container) {
    return;
  }


  if (!scores) {

    container.innerHTML = "";

    container.classList.add(
      "hidden"
    );

    return;
  }


  container.classList.remove(
    "hidden"
  );


  const scoreItems = [

    [
      "Task completion",
      scores.taskCompletion
    ],

    [
      "Comprehensibility",
      scores.comprehensibility
    ],

    [
      "Grammar",
      scores.grammar
    ],

    [
      "Vocabulary",
      scores.vocabulary
    ],

    [
      "Coherence",
      scores.coherence
    ]

  ];


  container.innerHTML =
    scoreItems
      .map(
        ([label, value]) => `
          <div class="feedback-score-row">
            <span>${escapeSpeakingHTML(label)}</span>
            <strong>${
              Number.isFinite(value)
                ? `${value}/4`
                : "—"
            }</strong>
          </div>
        `
      )
      .join("");

}



/*
==================================================
LIST DISPLAY
==================================================
*/

function renderSpeakingList(
  containerId,
  cardId,
  items,
  formatConcepts = false
) {

  const container =
    document.getElementById(
      containerId
    );


  const card =
    document.getElementById(
      cardId
    );


  if (!container || !card) {
    return;
  }


  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {

    container.innerHTML = "";

    card.classList.add(
      "hidden"
    );

    return;
  }


  card.classList.remove(
    "hidden"
  );


  container.innerHTML =
    items
      .map(
        item => {

          const value =
            formatConcepts
              ? formatSpeakingConcept(
                  item
                )
              : String(item);


          return `
            <p>
              ${escapeSpeakingHTML(value)}
            </p>
          `;

        }
      )
      .join("");

}



/*
==================================================
ERROR DISPLAY
==================================================
*/

function renderSpeakingErrors(
  errors
) {

  const container =
    document.getElementById(
      "speakingFeedbackErrors"
    );


  const card =
    document.getElementById(
      "speakingFeedbackErrorsCard"
    );


  if (!container || !card) {
    return;
  }


  if (
    !Array.isArray(errors) ||
    errors.length === 0
  ) {

    container.innerHTML = "";

    card.classList.add(
      "hidden"
    );

    return;
  }


  card.classList.remove(
    "hidden"
  );


  container.innerHTML =
    errors
      .map(
        error => {

          const original =
            escapeSpeakingHTML(
              error.original || ""
            );


          const correction =
            escapeSpeakingHTML(
              error.correction || ""
            );


          const explanation =
            escapeSpeakingHTML(
              error.explanation || ""
            );


          const concept =
            formatSpeakingConcept(
              error.concept || ""
            );


          const severity =
            escapeSpeakingHTML(
              error.severity || ""
            );


          return `
            <div class="feedback-error">

              <p>
                <strong>${original}</strong>
                →
                <strong>${correction}</strong>
              </p>

              <p class="small">
                ${explanation}
              </p>

              <p class="small">
                ${escapeSpeakingHTML(concept)}
                ${
                  severity
                    ? ` · ${severity}`
                    : ""
                }
              </p>

            </div>
          `;

        }
      )
      .join("");

}



/*
==================================================
CONTINUE AFTER FEEDBACK
==================================================
*/

function continueAfterSpeakingFeedback() {

  speakingTaskIndex += 1;


  if (
    speakingTaskIndex >=
    speakingTasks.length
  ) {

    finishSpeakingAssessment();

    return;

  }


  renderSpeakingTask();

}



/*
==================================================
FINISH ASSESSMENT
==================================================
*/

function finishSpeakingAssessment() {

  stopSpeakingTimer();


  if (
    SpeakingRecorder.isRecording()
  ) {

    SpeakingRecorder.cancel();

  }


  const completedAt =
    new Date().toISOString();


  const result = {

    assessmentVersion: 1,

    skill: "speaking",

    completedAt,

    responses:
      speakingResponses.slice()

  };


  /*
  ------------------------------------------
  SAVE
  ------------------------------------------
  */

  try {

    Storage.saveSpeakingAssessment(
      result
    );

  } catch (error) {

    console.error(
      "Could not save speaking assessment:",
      error
    );

  }


  /*
  ------------------------------------------
  SHOW SUMMARY
  ------------------------------------------
  */

  renderSpeakingSummary(
    result
  );


  showSpeakingScreen(
    "speakingComplete"
  );


  /*
  Profile/dashboard integration will use
  the saved assessment. We keep this
  controller independent of profile logic.
  */

}



/*
==================================================
SUMMARY
==================================================
*/

function renderSpeakingSummary(
  result
) {

  const container =
    document.getElementById(
      "speakingSummary"
    );


  if (!container) {
    return;
  }


  const responses =
    Array.isArray(
      result.responses
    )
      ? result.responses
      : [];


  const evaluated =
    responses.filter(
      response =>
        !response.skipped &&
        response.evaluation &&
        response.evaluation.status ===
          "complete"
    );


  const skipped =
    responses.filter(
      response =>
        response.skipped
    );


  const levelCounts = {};


  evaluated.forEach(
    response => {

      const level =
        response.evaluation
          ?.estimatedPerformance;


      if (!level) {
        return;
      }


      levelCounts[level] =
        (
          levelCounts[level] ||
          0
        ) + 1;

    }
  );


  let mostCommonLevel = null;

  let highestCount = 0;


  Object.entries(
    levelCounts
  ).forEach(
    ([level, count]) => {

      if (count > highestCount) {

        mostCommonLevel =
          level;

        highestCount =
          count;

      }

    }
  );


  container.innerHTML = `

    <p>
      <strong>
        ${responses.length}
      </strong>
      tasks completed
    </p>

    <p>
      <strong>
        ${evaluated.length}
      </strong>
      evaluated responses
    </p>

    <p>
      <strong>
        ${skipped.length}
      </strong>
      skipped tasks
    </p>

    ${
      mostCommonLevel
        ? `
          <p>
            Most frequent demonstrated
            performance:
            <strong>
              ${
                escapeSpeakingHTML(
                  formatSpeakingLevel(
                    mostCommonLevel
                  )
                )
              }
            </strong>
          </p>
        `
        : ""
    }

    <p class="small">
      Your full speaking level will be
      calculated from the assessment
      evidence in your learner profile.
    </p>
  `;

}



/*
==================================================
ERROR SCREEN
==================================================
*/

function showSpeakingError(
  message
) {

  stopSpeakingTimer();


  if (
    SpeakingRecorder.isRecording()
  ) {

    SpeakingRecorder.cancel();

  }


  showSpeakingScreen(
    "speakingError"
  );


  const element =
    document.getElementById(
      "speakingErrorMessage"
    );


  if (element) {

    element.textContent =
      message ||
      "Something went wrong.";

  }

}



/*
==================================================
LOADING SCREEN
==================================================
*/

function setSpeakingLoading(
  title,
  message
) {

  const titleElement =
    document.getElementById(
      "speakingLoadingTitle"
    );


  const messageElement =
    document.getElementById(
      "speakingLoadingMessage"
    );


  if (titleElement) {

    titleElement.textContent =
      title;

  }


  if (messageElement) {

    messageElement.textContent =
      message;

  }

}



/*
==================================================
RECORDER STATUS
==================================================
*/

function setSpeakingRecorderStatus(
  title,
  text
) {

  const titleElement =
    document.getElementById(
      "speakingRecorderStatusTitle"
    );


  const textElement =
    document.getElementById(
      "speakingRecorderStatusText"
    );


  if (titleElement) {

    titleElement.textContent =
      title;

  }


  if (textElement) {

    textElement.textContent =
      text;

  }

}



/*
==================================================
TIMER
==================================================
*/

function startSpeakingTimer() {

  stopSpeakingTimer();


  updateSpeakingTimer(0);


  speakingTimerInterval =
    setInterval(
      () => {

        if (
          !speakingRecordingStartedAt
        ) {
          return;
        }


        const seconds =
          Math.floor(
            (
              Date.now() -
              speakingRecordingStartedAt
            ) / 1000
          );


        updateSpeakingTimer(
          seconds
        );

      },
      250
    );

}


function stopSpeakingTimer() {

  if (
    speakingTimerInterval
  ) {

    clearInterval(
      speakingTimerInterval
    );

  }


  speakingTimerInterval =
    null;

  speakingRecordingStartedAt =
    null;

}


function updateSpeakingTimer(
  totalSeconds
) {

  const element =
    document.getElementById(
      "speakingTimer"
    );


  if (!element) {
    return;
  }


  const safeSeconds =
    Math.max(
      0,
      Math.floor(
        Number(totalSeconds) ||
        0
      )
    );


  const minutes =
    Math.floor(
      safeSeconds / 60
    );


  const seconds =
    safeSeconds % 60;


  element.textContent =
    `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(
      2,
      "0"
    )}`;

}



/*
==================================================
FORMATTING
==================================================
*/

function formatSpeakingPerformance(
  value
) {

  const labels = {

    below_target:
      "Keep building",

    developing:
      "Developing",

    meets_target:
      "Good work",

    strong:
      "Strong response"

  };


  return (
    labels[value] ||
    "Your result"
  );

}


function formatSpeakingLevel(
  value
) {

  const labels = {

    below_A1:
      "Below A1",

    A1:
      "A1",

    A1_plus:
      "A1+",

    A2:
      "A2",

    A2_plus:
      "A2+",

    B1:
      "B1"

  };


  return (
    labels[value] ||
    value ||
    "—"
  );

}


function formatSpeakingConcept(
  value
) {

  return String(
    value || ""
  )
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      letter =>
        letter.toUpperCase()
    );

}



/*
==================================================
HTML SAFETY
==================================================
*/

function escapeSpeakingHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}