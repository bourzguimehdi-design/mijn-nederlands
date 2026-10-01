/*
==================================================
MIJN NEDERLANDS
AI WRITING CONTROLLER
==================================================

This file intentionally overrides the original
writing submission function in app.js.

app.js remains our stable core.
==================================================
*/


/*
==================================================
SUBMIT WRITING FOR AI EVALUATION
==================================================
*/

async function submitWritingTask() {

  const task =
    writingTasks[
      currentWritingTaskIndex
    ];

  if (!task) {
    return;
  }


  const checks =
    task.requirements.map(
      (requirement, index) => {

        const checkbox =
          document.getElementById(
            `requirement-${index}`
          );

        return {
          requirement,

          checked:
            checkbox
              ? checkbox.checked
              : false
        };
      }
    );


  const submitButton =
    document.getElementById(
      "submitWritingButton"
    );


  if (submitButton) {

    submitButton.disabled =
      true;

  }


  /*
  ------------------------------------------
  SHOW LOADING SCREEN
  ------------------------------------------
  */

  hideAllSections();

  showSection(
    "writingLoading"
  );

  window.scrollTo(
    0,
    0
  );


  try {

    /*
    ------------------------------------------
    CALL CLOUDFLARE API
    ------------------------------------------
    */

    const apiResult =
      await MijnNederlandsAPI
        .evaluateWriting(
          task,
          pendingWritingText
        );


    /*
    ------------------------------------------
    BUILD OUR NORMAL LOCAL RESPONSE
    ------------------------------------------
    */

    const response =
      WritingEngine
        .createResponse(

          task,

          pendingWritingText,

          checks,

          writingTaskStartedAt

        );


    /*
    Attach the AI evaluation.

    This means one writing response now
    contains both:

    - the learner's original answer
    - the AI assessment
    */

    response.evaluation =
      apiResult.evaluation;


    response.aiUsage =
      apiResult.usage || null;


    response.evaluatedAt =
      new Date()
        .toISOString();


    writingResponses.push(
      response
    );


    /*
    ------------------------------------------
    SAVE PROGRESS
    ------------------------------------------
    */

    saveWritingAIProgress();


    /*
    ------------------------------------------
    UPDATE LEARNING PROFILE
    ------------------------------------------
    */

    recordWritingLearningEvidence(
      task,
      apiResult.evaluation
    );


    /*
    ------------------------------------------
    RENDER FEEDBACK
    ------------------------------------------
    */

    renderWritingFeedback(
      apiResult.evaluation
    );


    hideAllSections();

    showSection(
      "writingFeedback"
    );


    window.scrollTo(
      0,
      0
    );


  } catch (error) {

    console.error(
      "Writing evaluation error:",
      error
    );


    const message =
      document.getElementById(
        "writingErrorMessage"
      );


    if (message) {

      message.textContent =
        error.message ||
        "The writing evaluation could not be completed.";

    }


    hideAllSections();

    showSection(
      "writingError"
    );


    window.scrollTo(
      0,
      0
    );


  } finally {

    if (submitButton) {

      submitButton.disabled =
        false;

    }

  }

}



/*
==================================================
RETRY
==================================================
*/

function retryWritingEvaluation() {

  submitWritingTask();

}



/*
==================================================
CONTINUE AFTER FEEDBACK
==================================================
*/

function continueAfterWritingFeedback() {

  currentWritingTaskIndex++;


  pendingWritingText =
    "";


  if (
    currentWritingTaskIndex >=
    writingTasks.length
  ) {

    finishWritingAssessment();

    return;

  }


  showWritingTask();

}



/*
==================================================
RENDER MAIN FEEDBACK
==================================================
*/

function renderWritingFeedback(
  evaluation
) {

  const performanceLabels = {

    below_target:
      "Below target",

    developing:
      "Developing",

    meets_target:
      "Meets target ✓",

    strong:
      "Strong ✓"

  };


  const levelLabels = {

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


  /*
  ------------------------------------------
  PERFORMANCE
  ------------------------------------------
  */

  const performance =
    document.getElementById(
      "feedbackPerformance"
    );


  if (performance) {

    performance.textContent =
      performanceLabels[
        evaluation.taskPerformance
      ] ||
      formatConcept(
        evaluation.taskPerformance ||
        "Result"
      );

  }


  /*
  ------------------------------------------
  DEMONSTRATED LEVEL
  ------------------------------------------
  */

  const level =
    document.getElementById(
      "feedbackLevel"
    );


  if (level) {

    const shownLevel =
      levelLabels[
        evaluation
          .estimatedPerformance
      ] ||
      evaluation
        .estimatedPerformance ||
      "Not estimated";


    level.textContent =
      `Performance on this task: ${shownLevel}. ` +
      "This is not an overall CEFR certification.";

  }


  renderWritingScores(
    evaluation.scores || {}
  );


  renderWritingStrengths(
    evaluation.strengths || []
  );


  renderWritingErrors(
    evaluation.errors || []
  );


  renderWritingSuggestions(
    evaluation.suggestions || []
  );


  renderWritingPriorities(
    evaluation.priorityConcepts || []
  );


  /*
  ------------------------------------------
  OVERALL FEEDBACK
  ------------------------------------------
  */

  const overall =
    document.getElementById(
      "feedbackOverall"
    );


  if (overall) {

    overall.textContent =
      evaluation.overallFeedback ||
      "No overall feedback was returned.";

  }


  /*
  ------------------------------------------
  NEXT STEP
  ------------------------------------------
  */

  const nextStep =
    document.getElementById(
      "feedbackNextStep"
    );


  if (nextStep) {

    nextStep.textContent =
      evaluation.nextStep ||
      "Continue practising your Dutch writing.";

  }

}



/*
==================================================
SCORES
==================================================
*/

function renderWritingScores(
  scores
) {

  const container =
    document.getElementById(
      "feedbackScores"
    );


  if (!container) {
    return;
  }


  const labels = {

    taskCompletion:
      "Task completion",

    comprehensibility:
      "Comprehensibility",

    grammar:
      "Grammar",

    vocabulary:
      "Vocabulary",

    coherence:
      "Coherence"

  };


  container.innerHTML =
    "<h2>Scores</h2>";


  Object.entries(
    labels
  )
    .forEach(
      ([key, label]) => {

        const score =
          Number.isFinite(
            scores[key]
          )
            ? scores[key]
            : "—";


        const row =
          document.createElement(
            "div"
          );


        row.className =
          "feedback-score-row";


        row.innerHTML = `

          <span>
            ${escapeHTML(label)}
          </span>

          <span
            class="feedback-score-value"
          >
            ${escapeHTML(score)} / 4
          </span>

        `;


        container.appendChild(
          row
        );

      }
    );

}



/*
==================================================
STRENGTHS
==================================================
*/

function renderWritingStrengths(
  strengths
) {

  const card =
    document.getElementById(
      "feedbackStrengthsCard"
    );


  const container =
    document.getElementById(
      "feedbackStrengths"
    );


  if (
    !card ||
    !container
  ) {
    return;
  }


  if (
    strengths.length === 0
  ) {

    card.classList.add(
      "hidden"
    );

    return;

  }


  card.classList.remove(
    "hidden"
  );


  container.innerHTML =
    "";


  strengths.forEach(
    strength => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "feedback-item";


      item.textContent =
        `✓ ${strength}`;


      container.appendChild(
        item
      );

    }
  );

}



/*
==================================================
GENUINE ERRORS
==================================================
*/

function renderWritingErrors(
  errors
) {

  const card =
    document.getElementById(
      "feedbackErrorsCard"
    );


  const container =
    document.getElementById(
      "feedbackErrors"
    );


  if (
    !card ||
    !container
  ) {
    return;
  }


  if (
    errors.length === 0
  ) {

    card.classList.add(
      "hidden"
    );

    return;

  }


  card.classList.remove(
    "hidden"
  );


  container.innerHTML =
    "";


  errors.forEach(
    error => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "feedback-item";


      /*
      Original
      */

      const original =
        document.createElement(
          "div"
        );


      original.className =
        "error-original";


      original.textContent =
        error.original;


      /*
      Correction
      */

      const correction =
        document.createElement(
          "div"
        );


      correction.className =
        "error-correction";


      correction.textContent =
        `→ ${error.correction}`;


      /*
      Explanation
      */

      const explanation =
        document.createElement(
          "p"
        );


      explanation.textContent =
        error.explanation;


      /*
      Concept
      */

      const concept =
        document.createElement(
          "span"
        );


      concept.className =
        "feedback-tag";


      concept.textContent =
        formatConcept(
          error.concept ||
          "language"
        );


      /*
      Severity
      */

      const severity =
        document.createElement(
          "span"
        );


      const severityValue =
        error.severity ||
        "minor";


      severity.className =
        `feedback-tag severity-${severityValue}`;


      severity.textContent =
        severityValue;


      item.appendChild(
        original
      );


      item.appendChild(
        correction
      );


      item.appendChild(
        explanation
      );


      item.appendChild(
        concept
      );


      item.appendChild(
        severity
      );


      container.appendChild(
        item
      );

    }
  );

}



/*
==================================================
SUGGESTIONS
==================================================
*/

function renderWritingSuggestions(
  suggestions
) {

  const card =
    document.getElementById(
      "feedbackSuggestionsCard"
    );


  const container =
    document.getElementById(
      "feedbackSuggestions"
    );


  if (
    !card ||
    !container
  ) {
    return;
  }


  if (
    suggestions.length === 0
  ) {

    card.classList.add(
      "hidden"
    );

    return;

  }


  card.classList.remove(
    "hidden"
  );


  container.innerHTML =
    "";


  suggestions.forEach(
    suggestion => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "feedback-item";


      const original =
        document.createElement(
          "strong"
        );


      original.textContent =
        suggestion.original;


      const improved =
        document.createElement(
          "div"
        );


      improved.className =
        "error-correction";


      improved.textContent =
        `→ ${suggestion.suggestion}`;


      const explanation =
        document.createElement(
          "p"
        );


      explanation.textContent =
        suggestion.explanation;


      item.appendChild(
        original
      );


      item.appendChild(
        improved
      );


      item.appendChild(
        explanation
      );


      container.appendChild(
        item
      );

    }
  );

}



/*
==================================================
PRIORITY CONCEPTS
==================================================
*/

function renderWritingPriorities(
  concepts
) {

  const card =
    document.getElementById(
      "feedbackPriorityCard"
    );


  const container =
    document.getElementById(
      "feedbackPriority"
    );


  if (
    !card ||
    !container
  ) {
    return;
  }


  if (
    concepts.length === 0
  ) {

    card.classList.add(
      "hidden"
    );

    return;

  }


  card.classList.remove(
    "hidden"
  );


  container.innerHTML =
    "";


  concepts.forEach(
    concept => {

      const tag =
        document.createElement(
          "span"
        );


      tag.className =
        "priority-concept";


      tag.textContent =
        formatConcept(
          concept
        );


      container.appendChild(
        tag
      );

    }
  );

}



/*
==================================================
SAVE WRITING PROGRESS
==================================================
*/

function saveWritingAIProgress() {

  try {

    localStorage.setItem(
      "mijnNederlandsWritingAssessment",

      JSON.stringify({

        completed:
          false,

        updatedAt:
          new Date()
            .toISOString(),

        currentTaskIndex:
          currentWritingTaskIndex,

        responses:
          writingResponses

      })
    );


  } catch (error) {

    console.warn(
      "Could not save writing progress.",
      error
    );

  }

}



/*
==================================================
LEARNING PROFILE
==================================================
*/

function recordWritingLearningEvidence(
  task,
  evaluation
) {

  try {

    const storageKey =
      "mijnNederlandsLearningProfile";


    const existing =
      JSON.parse(
        localStorage.getItem(
          storageKey
        ) || "{}"
      );


    if (!existing.concepts) {

      existing.concepts = {};

    }


    const errors =
      Array.isArray(
        evaluation.errors
      )
        ? evaluation.errors
        : [];


    const priorityConcepts =
      new Set(

        Array.isArray(
          evaluation.priorityConcepts
        )
          ? evaluation.priorityConcepts
          : []

      );


    errors.forEach(
      error => {

        const concept =
          error.concept;


        if (!concept) {
          return;
        }


        /*
        Create concept if it
        doesn't exist yet.
        */

        if (
          !existing
            .concepts[
              concept
            ]
        ) {

          existing
            .concepts[
              concept
            ] = {

              concept,

              writingEncounters:
                0,

              writingErrors:
                0,

              minorErrors:
                0,

              moderateErrors:
                0,

              majorErrors:
                0,

              priorityCount:
                0,

              lastSeen:
                null,

              evidence:
                []

            };

        }


        const item =
          existing
            .concepts[
              concept
            ];


        item.writingEncounters =
          (
            item.writingEncounters ||
            0
          ) + 1;


        item.writingErrors =
          (
            item.writingErrors ||
            0
          ) + 1;


        const severity =
          error.severity ||
          "minor";


        if (
          severity ===
          "major"
        ) {

          item.majorErrors =
            (
              item.majorErrors ||
              0
            ) + 1;

        }

        else if (
          severity ===
          "moderate"
        ) {

          item.moderateErrors =
            (
              item.moderateErrors ||
              0
            ) + 1;

        }

        else {

          item.minorErrors =
            (
              item.minorErrors ||
              0
            ) + 1;

        }


        if (
          priorityConcepts.has(
            concept
          )
        ) {

          item.priorityCount =
            (
              item.priorityCount ||
              0
            ) + 1;

        }


        item.lastSeen =
          new Date()
            .toISOString();


        if (
          !Array.isArray(
            item.evidence
          )
        ) {

          item.evidence = [];

        }


        item.evidence.push({

          source:
            "writing",

          taskId:
            task.id,

          level:
            task.level,

          severity,

          original:
            error.original,

          correction:
            error.correction,

          recordedAt:
            item.lastSeen

        });


        /*
        Keep localStorage from
        growing forever.
        */

        if (
          item.evidence.length >
          20
        ) {

          item.evidence =
            item.evidence
              .slice(-20);

        }

      }
    );


    existing.updatedAt =
      new Date()
        .toISOString();


    localStorage.setItem(
      storageKey,

      JSON.stringify(
        existing
      )
    );


  } catch (error) {

    console.warn(
      "Could not update learning profile.",
      error
    );

  }

}