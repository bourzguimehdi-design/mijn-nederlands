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


let responses = [];

let currentSkillIndex = 0;
let currentLevelIndex = 0;
let currentQuestionIndex = 0;

let currentQuestions = [];

let dutchVoice = null;


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
ASSESSMENT
==================================================
*/

function startAssessment() {

  stopSpeech();

  responses = [];

  currentSkillIndex = 0;
  currentLevelIndex = 0;
  currentQuestionIndex = 0;

  hideAllSections();

  document
    .getElementById("assessment")
    .classList.remove("hidden");

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


  if (currentQuestions.length === 0) {

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
    .getElementById("skillLabel")
    .textContent =
    `${skillIcons[skill]} ${skillNames[skill]}`;


  document
    .getElementById("levelBadge")
    .textContent =
    currentLevel();


  document
    .getElementById("questionCounter")
    .textContent =
    `Question ${
      currentQuestionIndex + 1
    } of ${currentQuestions.length}`;


  const progress =
    (
      (
        currentQuestionIndex + 1
      ) /
      currentQuestions.length
    ) * 100;


  document
    .getElementById("progressBar")
    .style.width =
    `${progress}%`;


  renderQuestionMedia(
    question
  );


  document
    .getElementById("questionText")
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


  document
    .getElementById(
      "skillComplete"
    )
    .classList.remove(
      "hidden"
    );


  document
    .getElementById(
      "completedSkillTitle"
    )
    .textContent =
    `${skillIcons[skill]} ${skillNames[skill]} complete`;


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
      " Part 1 is complete.";
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


  document
    .getElementById(
      "assessment"
    )
    .classList.remove(
      "hidden"
    );


  loadQuestionSet();
}


/*
==================================================
RESULTS
==================================================
*/

function showResults() {

  stopSpeech();

  hideAllSections();


  document
    .getElementById(
      "results"
    )
    .classList.remove(
      "hidden"
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


  skills.forEach(skill => {

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
            ${result.estimate.level}
          </div>

        </div>

        <div class="small">
          ${result.estimate.status}
        </div>

      </div>

      ${createLevelRows(
        result.levels
      )}
    `;


    container.appendChild(
      section
    );
  });
}


function createLevelRows(
  levelResults
) {

  return levels
    .map(level => {

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
    })
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
          ${formatConcept(
            item.concept
          )}
        </strong>

        <div class="small">
          ${skillIcons[item.skill]}
          ${skillNames[item.skill]}
          · ${item.level}
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
UTILITIES
==================================================
*/

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


function restartAssessment() {

  stopSpeech();

  responses = [];

  hideAllSections();


  document
    .getElementById(
      "intro"
    )
    .classList.remove(
      "hidden"
    );


  window.scrollTo(
    0,
    0
  );
}


function hideAllSections() {

  [
    "intro",
    "assessment",
    "skillComplete",
    "results"
  ]
    .forEach(id => {

      document
        .getElementById(id)
        .classList.add(
          "hidden"
        );
    });
}