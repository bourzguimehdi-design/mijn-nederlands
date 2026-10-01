const skills = [
  "grammar",
  "vocabulary",
  "reading",
  "listening"
];

const levels = [
  "A1",
  "A2",
  "B1"
];

const skillNames = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  reading: "Reading",
  listening: "Listening"
};

const skillIcons = {
  grammar: "📚",
  vocabulary: "🧠",
  reading: "📖",
  listening: "🎧"
};


/*
==================================================
STATE
==================================================
*/

let responses = [];

let currentSkillIndex = 0;
let currentLevelIndex = 0;
let currentQuestionIndex = 0;

let currentQuestions = [];

let developerSingleSkillMode = false;

let dutchVoice = null;


/*
Writing state
*/

let writingResponses = [];

let currentWritingTaskIndex = 0;

let writingTaskStartedAt = null;

let pendingWritingText = "";


/*
==================================================
SPEECH
==================================================
*/

function findDutchVoice() {

  if (!("speechSynthesis" in window)) {
    return;
  }

  const voices =
    speechSynthesis.getVoices();


  dutchVoice =
    voices.find(
      voice =>
        voice.lang
          .toLowerCase()
          .startsWith("nl")
    ) || null;
}


if ("speechSynthesis" in window) {

  findDutchVoice();

  speechSynthesis.addEventListener(
    "voiceschanged",
    findDutchVoice
  );
}


function stopSpeech() {

  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }
}


function playCurrentAudio() {

  if (!("speechSynthesis" in window)) {

    alert(
      "Speech playback is not supported by this browser."
    );

    return;
  }


  const question =
    currentQuestions[
      currentQuestionIndex
    ];


  if (!question || !question.audio) {
    return;
  }


  stopSpeech();


  const utterance =
    new SpeechSynthesisUtterance(
      question.audio
    );


  utterance.lang = "nl-NL";

  utterance.rate = 0.9;


  if (dutchVoice) {
    utterance.voice = dutchVoice;
  }


  speechSynthesis.speak(
    utterance
  );
}


/*
==================================================
OBJECTIVE ASSESSMENT
==================================================
*/

function startAssessment() {

  stopSpeech();

  responses = [];

  developerSingleSkillMode = false;

  currentSkillIndex = 0;
  currentLevelIndex = 0;
  currentQuestionIndex = 0;

  hideAllSections();

  showSection(
    "assessment"
  );

  loadQuestionSet();
}


function developerStartSkill(
  skill
) {

  stopSpeech();

  responses = [];

  developerSingleSkillMode = true;

  currentSkillIndex =
    skills.indexOf(
      skill
    );


  if (currentSkillIndex === -1) {

    alert(
      "Unknown skill."
    );

    return;
  }


  currentLevelIndex = 0;

  currentQuestionIndex = 0;


  hideAllSections();

  showSection(
    "assessment"
  );


  loadQuestionSet();
}


function currentSkill() {

  return skills[
    currentSkillIndex
  ];
}


function currentLevel() {

  return levels[
    currentLevelIndex
  ];
}


function loadQuestionSet() {

  const skill =
    currentSkill();

  const level =
    currentLevel();


  const source =
    skill === "listening"
      ? listeningQuestions
      : placementQuestions;


  currentQuestions =
    source.filter(
      question =>
        question.skill === skill &&
        question.level === level
    );


  currentQuestionIndex = 0;


  if (
    currentQuestions.length === 0
  ) {

    console.error(
      "No questions found:",
      skill,
      level
    );

    alert(
      `No ${level} ${skill} questions were found.`
    );

    return;
  }


  showQuestion();
}


function showQuestion() {

  stopSpeech();


  const question =
    currentQuestions[
      currentQuestionIndex
    ];


  const skill =
    currentSkill();


  if (!question) {

    console.error(
      "Question could not be loaded."
    );

    return;
  }


  document
    .getElementById(
      "skillLabel"
    )
    .textContent =
    `${skillIcons[skill]} ${skillNames[skill]}`;


  document
    .getElementById(
      "levelBadge"
    )
    .textContent =
    currentLevel();


  document
    .getElementById(
      "questionCounter"
    )
    .textContent =
    `Question ${
      currentQuestionIndex + 1
    } of ${
      currentQuestions.length
    }`;


  const progress =
    (
      (
        currentQuestionIndex + 1
      ) /
      currentQuestions.length
    ) * 100;


  document
    .getElementById(
      "progressBar"
    )
    .style.width =
    `${progress}%`;


  renderQuestionMedia(
    question
  );


  document
    .getElementById(
      "questionText"
    )
    .textContent =
    question.question;


  const container =
    document.getElementById(
      "answerContainer"
    );


  container.innerHTML = "";


  question.answers.forEach(
    (answer, index) => {

      const button =
        document.createElement(
          "button"
        );


      button.textContent =
        answer;


      button.onclick =
        () =>
          answerQuestion(
            index
          );


      container.appendChild(
        button
      );
    }
  );


  window.scrollTo(
    0,
    0
  );
}


function renderQuestionMedia(
  question
) {

  const container =
    document.getElementById(
      "mediaContainer"
    );


  container.innerHTML = "";


  if (
    question.skill ===
    "listening"
  ) {

    container.innerHTML = `
      <div class="audio-card">

        <div class="audio-icon">
          🎧
        </div>

        <strong>
          Listen carefully
        </strong>

        <p class="small">
          The transcript is hidden.
        </p>

        <button
          class="audio-button"
          onclick="playCurrentAudio()"
        >
          🔊 Play audio
        </button>

      </div>
    `;

    return;
  }


  if (question.text) {

    const div =
      document.createElement(
        "div"
      );


    div.className =
      "reading-text";


    div.textContent =
      question.text;


    container.appendChild(
      div
    );
  }
}


function answerQuestion(
  selectedAnswer
) {

  stopSpeech();


  const question =
    currentQuestions[
      currentQuestionIndex
    ];


  responses.push({

    id:
      question.id,

    skill:
      question.skill,

    level:
      question.level,

    category:
      question.category,

    topic:
      question.topic,

    concept:
      question.concept,

    correct:
      selectedAnswer ===
      question.correct

  });


  currentQuestionIndex++;


  if (
    currentQuestionIndex <
    currentQuestions.length
  ) {

    showQuestion();

    return;
  }


  finishLevel();
}


function finishLevel() {

  const skill =
    currentSkill();

  const level =
    currentLevel();


  const passed =
    AssessmentEngine
      .passedLevel(
        responses,
        skill,
        level
      );


  const nextLevelExists =
    currentLevelIndex <
    levels.length - 1;


  if (
    passed &&
    nextLevelExists
  ) {

    currentLevelIndex++;

    loadQuestionSet();

    return;
  }


  finishSkill();
}


function finishSkill() {

  stopSpeech();


  const skill =
    currentSkill();


  const result =
    AssessmentEngine
      .buildSkillResult(
        responses,
        skill
      );


  hideAllSections();


  showSection(
    "skillComplete"
  );


  document
    .getElementById(
      "completedSkillTitle"
    )
    .textContent =
    `${skillIcons[skill]} ${skillNames[skill]} complete`;


  if (
    developerSingleSkillMode
  ) {

    document
      .getElementById(
        "completedSkillMessage"
      )
      .textContent =
      `Developer test complete. Estimated level: ${result.estimate.level}.`;

    return;
  }


  const next =
    skills[
      currentSkillIndex + 1
    ];


  let message =
    `Current estimate: ${result.estimate.level}.`;


  if (next) {

    message +=
      ` Next: ${skillNames[next]}.`;

  } else {

    message +=
      " The objective assessment is complete.";
  }


  document
    .getElementById(
      "completedSkillMessage"
    )
    .textContent =
    message;


  window.scrollTo(
    0,
    0
  );
}


function continueToNextSkill() {

  if (
    developerSingleSkillMode
  ) {

    developerSingleSkillMode = false;

    returnHome();

    return;
  }


  currentSkillIndex++;


  if (
    currentSkillIndex >=
    skills.length
  ) {

    showResults();

    return;
  }


  currentLevelIndex = 0;

  currentQuestionIndex = 0;


  hideAllSections();

  showSection(
    "assessment"
  );


  loadQuestionSet();
}


/*
==================================================
WRITING ASSESSMENT
==================================================
*/

function startWritingAssessment() {

  stopSpeech();

  writingResponses = [];

  currentWritingTaskIndex = 0;

  pendingWritingText = "";

  hideAllSections();

  showSection(
    "writingIntro"
  );

  window.scrollTo(
    0,
    0
  );
}


function beginWritingTasks() {

  writingResponses = [];

  currentWritingTaskIndex = 0;

  showWritingTask();
}


function showWritingTask() {

  const task =
    writingTasks[
      currentWritingTaskIndex
    ];


  if (!task) {

    finishWritingAssessment();

    return;
  }


  writingTaskStartedAt =
    new Date();


  pendingWritingText = "";


  hideAllSections();

  showSection(
    "writingAssessment"
  );


  document
    .getElementById(
      "writingTaskCounter"
    )
    .textContent =
    `Task ${
      currentWritingTaskIndex + 1
    } of ${
      writingTasks.length
    }`;


  document
    .getElementById(
      "writingLevelBadge"
    )
    .textContent =
    task.level;


  document
    .getElementById(
      "writingTaskTitle"
    )
    .textContent =
    task.title;


  document
    .getElementById(
      "writingSituation"
    )
    .textContent =
    task.situation;


  document
    .getElementById(
      "writingInstruction"
    )
    .textContent =
    task.instruction;


  const requirements =
    document.getElementById(
      "writingRequirements"
    );


  requirements.innerHTML = "";


  task.requirements.forEach(
    requirement => {

      const li =
        document.createElement(
          "li"
        );


      li.textContent =
        requirement;


      requirements.appendChild(
        li
      );
    }
  );


  const answer =
    document.getElementById(
      "writingAnswer"
    );


  answer.value = "";


  answer.placeholder =
    task.example;


  answer.oninput =
    updateWritingWordCount;


  updateWritingWordCount();


  const progress =
    (
      (
        currentWritingTaskIndex + 1
      ) /
      writingTasks.length
    ) * 100;


  document
    .getElementById(
      "writingProgressBar"
    )
    .style.width =
    `${progress}%`;


  window.scrollTo(
    0,
    0
  );
}


function updateWritingWordCount() {

  const task =
    writingTasks[
      currentWritingTaskIndex
    ];


  if (!task) {
    return;
  }


  const text =
    document
      .getElementById(
        "writingAnswer"
      )
      .value;


  const count =
    WritingEngine
      .countWords(
        text
      );


  document
    .getElementById(
      "wordCount"
    )
    .textContent =
    `${count} ${
      count === 1
        ? "word"
        : "words"
    }`;


  const minimum =
    document.getElementById(
      "minimumWords"
    );


  minimum.textContent =
    `Minimum ${task.minWords}`;


  minimum.className =
    count >= task.minWords
      ? "small minimum-met"
      : "small minimum-not-met";
}


function openWritingSelfCheck() {

  const task =
    writingTasks[
      currentWritingTaskIndex
    ];


  const textarea =
    document.getElementById(
      "writingAnswer"
    );


  const text =
    textarea.value.trim();


  const wordCount =
    WritingEngine
      .countWords(
        text
      );


  if (!text) {

    alert(
      "Write your answer before continuing."
    );

    textarea.focus();

    return;
  }


  if (
    wordCount <
    task.minWords
  ) {

    const continueAnyway =
      confirm(
        `Your answer has ${wordCount} words. ` +
        `The suggested minimum is ${task.minWords}. ` +
        `Do you want to continue anyway?`
      );


    if (!continueAnyway) {
      return;
    }
  }


  pendingWritingText =
    text;


  hideAllSections();

  showSection(
    "writingSelfCheck"
  );


  const container =
    document.getElementById(
      "writingSelfCheckItems"
    );


  container.innerHTML = "";


  task.requirements.forEach(
    (requirement, index) => {

      const row =
        document.createElement(
          "label"
        );


      row.className =
        "check-row";


      row.innerHTML = `
        <input
          type="checkbox"
          id="requirement-${index}"
        >

        <span>
          ${escapeHTML(requirement)}
        </span>
      `;


      container.appendChild(
        row
      );
    }
  );


  window.scrollTo(
    0,
    0
  );
}


function editWritingAnswer() {

  hideAllSections();

  showSection(
    "writingAssessment"
  );


  document
    .getElementById(
      "writingAnswer"
    )
    .value =
    pendingWritingText;


  updateWritingWordCount();


  window.scrollTo(
    0,
    0
  );
}


function submitWritingTask() {

  const task =
    writingTasks[
      currentWritingTaskIndex
    ];


  const checks =
    task.requirements.map(
      (requirement, index) => ({

        requirement,

        checked:
          document
            .getElementById(
              `requirement-${index}`
            )
            .checked

      })
    );


  const response =
    WritingEngine
      .createResponse(

        task,

        pendingWritingText,

        checks,

        writingTaskStartedAt

      );


  writingResponses.push(
    response
  );


  currentWritingTaskIndex++;


  if (
    currentWritingTaskIndex >=
    writingTasks.length
  ) {

    finishWritingAssessment();

    return;
  }


  showWritingTask();
}


function finishWritingAssessment() {

  hideAllSections();

  showSection(
    "writingComplete"
  );


  renderWritingSummary();


  try {

    localStorage.setItem(
      "mijnNederlandsWritingAssessment",
      JSON.stringify({
        completedAt:
          new Date().toISOString(),

        responses:
          writingResponses
      })
    );

  } catch (error) {

    console.warn(
      "Could not save writing assessment.",
      error
    );
  }


  window.scrollTo(
    0,
    0
  );
}


function renderWritingSummary() {

  const container =
    document.getElementById(
      "writingSummary"
    );


  container.innerHTML = "";


  writingResponses.forEach(
    (response, index) => {

      const task =
        writingTasks.find(
          item =>
            item.id ===
            response.id
        );


      const div =
        document.createElement(
          "div"
        );


      div.className =
        "skill-result";


      div.innerHTML = `
        <div class="skill-label">
          ${escapeHTML(response.level)}
          · Task ${index + 1}
        </div>

        <h3>
          ${escapeHTML(
            task
              ? task.title
              : response.id
          )}
        </h3>

        <p class="small">
          ${response.wordCount} words
          ·
          ${response.selfReportedRequirementsMet}/${response.totalRequirements}
          task points self-checked
        </p>

        <div class="writing-review">${escapeHTML(
          response.text
        )}</div>
      `;


      container.appendChild(
        div
      );
    }
  );
}


/*
==================================================
RESULTS
==================================================
*/

function showResults() {

  stopSpeech();

  hideAllSections();

  showSection(
    "results"
  );


  const result =
    AssessmentEngine
      .generateResult(
        responses
      );


  renderSkillResults(
    result.skills
  );


  renderWeakConcepts(
    result.weakConcepts
  );


  Storage.savePlacementResult(
    result
  );


  window.scrollTo(
    0,
    0
  );
}


function renderSkillResults(
  results
) {

  const container =
    document.getElementById(
      "skillResults"
    );


  container.innerHTML = "";


  skills.forEach(
    skill => {

      const result =
        results[skill];


      const section =
        document.createElement(
          "div"
        );


      section.className =
        "skill-result";


      section.innerHTML = `
        <div class="skill-result-header">

          <div>

            <div class="skill-label">
              ${skillIcons[skill]}
              ${skillNames[skill]}
            </div>

            <div class="estimated-level">
              ${escapeHTML(
                result.estimate.level
              )}
            </div>

          </div>

          <div class="small">
            ${escapeHTML(
              result.estimate.status
            )}
          </div>

        </div>

        ${createLevelRows(
          result.levels
        )}
      `;


      container.appendChild(
        section
      );
    }
  );
}


function createLevelRows(
  levelResults
) {

  return levels
    .map(
      level => {

        const data =
          levelResults[level];


        if (
          !data ||
          data.total === 0
        ) {

          return `
            <div class="level-row">

              <div class="level-name">
                ${level}
              </div>

              <div class="bar"></div>

              <div class="score">
                —
              </div>

            </div>
          `;
        }


        const passed =
          data.accuracy >= 75;


        return `
          <div class="level-row">

            <div class="level-name">
              ${level}
            </div>

            <div class="bar">

              <div
                class="bar-fill"
                style="width: ${data.accuracy}%"
              ></div>

            </div>

            <div class="score">

              ${data.correct}/${data.total}

              ${
                passed
                  ? `<span class="passed">✓</span>`
                  : ""
              }

            </div>

          </div>
        `;
      }
    )
    .join("");
}


function renderWeakConcepts(
  weakConcepts
) {

  const card =
    document.getElementById(
      "weakConceptsCard"
    );


  const container =
    document.getElementById(
      "weakConcepts"
    );


  container.innerHTML = "";


  if (
    !weakConcepts ||
    weakConcepts.length === 0
  ) {

    card.classList.add(
      "hidden"
    );

    return;
  }


  card.classList.remove(
    "hidden"
  );


  weakConcepts.forEach(
    item => {

      const div =
        document.createElement(
          "div"
        );


      div.className =
        "weak-item";


      div.innerHTML = `
        <strong>
          ${escapeHTML(
            formatConcept(
              item.concept
            )
          )}
        </strong>

        <div class="small">
          ${skillIcons[item.skill]}
          ${skillNames[item.skill]}
          · ${escapeHTML(item.level)}
        </div>
      `;


      container.appendChild(
        div
      );
    }
  );
}


/*
==================================================
NAVIGATION + UTILITIES
==================================================
*/

function returnHome() {

  stopSpeech();

  developerSingleSkillMode =
    false;


  hideAllSections();

  showSection(
    "intro"
  );


  window.scrollTo(
    0,
    0
  );
}


function restartAssessment() {

  stopSpeech();

  responses = [];

  developerSingleSkillMode =
    false;


  hideAllSections();

  showSection(
    "intro"
  );


  window.scrollTo(
    0,
    0
  );
}


function showSection(
  id
) {

  document
    .getElementById(id)
    .classList.remove(
      "hidden"
    );
}


function hideAllSections() {

  [
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
  ]
    .forEach(
      id => {

        document
          .getElementById(id)
          .classList.add(
            "hidden"
          );
      }
    );
}


function formatConcept(
  concept
) {

  return concept
    .replaceAll("_", " ")
    .split(" ")
    .map(
      word =>
        word.charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}


function escapeHTML(
  value
) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    String(value);


  return div.innerHTML;
}