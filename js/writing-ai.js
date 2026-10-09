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


      const concept =
        error.concept
          ? formatConcept(
              error.concept
            )
          : "Language";


      const severity =
        error.severity ||
        "minor";


      item.innerHTML = `

        <strong>
          ${escapeHTML(concept)}
        </strong>

        <span
          class="
            feedback-tag
            severity-${escapeHTML(
              severity
            )}
          "
        >
          ${escapeHTML(severity)}
        </span>


        <div
          class="error-original"
        >
          ${escapeHTML(
            error.original ||
            ""
          )}
        </div>


        <div
          class="error-correction"
        >
          ${escapeHTML(
            error.correction ||
            ""
          )}
        </div>


        <p class="small">

          ${escapeHTML(
            error.explanation ||
            ""
          )}

        </p>

      `;


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


      item.innerHTML = `

        <strong>
          ${escapeHTML(
            suggestion.title ||
            "Suggestion"
          )}
        </strong>

        <p class="small">

          ${escapeHTML(
            suggestion.explanation ||
            ""
          )}

        </p>

      `;


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
      "feedbackPrioritiesCard"
    );


  const container =
    document.getElementById(
      "feedbackPriorities"
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
FORMAT CONCEPT
==================================================
*/

function formatConcept(
  value
) {

  return String(
    value || ""
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

}/*
==================================================
WRITING AI PROGRESS STORAGE
==================================================
*/

function saveWritingAIProgress() {

  try {

    const data = {

      responses:
        writingResponses,

      savedAt:
        new Date()
          .toISOString()

    };


    localStorage.setItem(
      "mijnNederlandsWritingAI",

      JSON.stringify(
        data
      )
    );


  } catch (error) {

    console.warn(
      "Could not save writing AI progress.",
      error
    );

  }

}


/*
==================================================
LOAD WRITING AI PROGRESS
==================================================
*/

function loadWritingAIProgress() {

  try {

    const raw =
      localStorage.getItem(
        "mijnNederlandsWritingProgress"
      );


    if (!raw) {
      return;
    }


    const progress =
      JSON.parse(raw);


    if (
      Array.isArray(
        progress.responses
      )
    ) {

      writingResponses =
        progress.responses;

    }


    if (
      Number.isInteger(
        progress.currentTaskIndex
      )
    ) {

      currentWritingTaskIndex =
        progress.currentTaskIndex;

    }


  } catch (error) {

    console.warn(
      "Could not load writing progress.",
      error
    );

  }

}



/*
==================================================
FORMAT CONCEPT
==================================================
*/

function formatConcept(
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
ESCAPE HTML
==================================================
*/

function escapeHTML(
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

    const progress = {

      assessmentVersion:
        2,

      completed:
        false,

      updatedAt:
        new Date()
          .toISOString(),

      currentTaskIndex:
        currentWritingTaskIndex,

      responses:
        writingResponses

    };


    localStorage.setItem(
      "mijnNederlandsWritingProgress",

      JSON.stringify(
        progress
      )
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

    const profileStorageKey =
      "mijnNederlandsLearningProfile";


    const existing =
      JSON.parse(
        localStorage.getItem(
          profileStorageKey
        ) || "{}"
      );


    if (
      !existing.concepts ||
      typeof existing.concepts !==
        "object"
    ) {

      existing.concepts = {};

    }


    const errors =
      Array.isArray(
        evaluation?.errors
      )
        ? evaluation.errors
        : [];


    const priorityConcepts =
      Array.isArray(
        evaluation?.priorityConcepts
      )
        ? evaluation.priorityConcepts
        : [];


    /*
    ==================================================
    NORMALIZE CONCEPT NAME
    ==================================================

    The learner profile needs one canonical key for
    each concept.

    Examples:

      "Separable Verbs"
      "separable verbs"
      "separable_verbs"

    all become:

      "separable_verbs"
    ==================================================
    */

    const normalizeConceptName =
      value => {

        return String(
          value || ""
        )
          .trim()
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "_"
          )
          .replace(
            /^_+|_+$/g,
            ""
          );

      };


    /*
    ==================================================
    BUILT-IN CONCEPTS
    ==================================================

    These already belong to the normal curriculum.

    They may collect writing evidence, but they should
    not enter the discovered -> candidate -> promoted
    pipeline.
    ==================================================
    */

    const builtInConcepts =
      new Set([
        "spelling",
        "articles",
        "word_order",
        "verb_conjugation",
        "perfect_tense",
        "modal_verbs",
        "prepositions",
        "adjective_endings",
        "vocabulary_choice",
        "inversion"
      ]);


    /*
    ==================================================
    NORMALIZED PRIORITY CONCEPTS
    ==================================================
    */

    const normalizedPriorityConcepts =
      new Set(

        priorityConcepts
          .map(
            concept =>
              normalizeConceptName(
                concept
              )
          )
          .filter(Boolean)

      );


    /*
    ==================================================
    MIGRATE / MERGE LEGACY CONCEPT KEYS
    ==================================================

    Older versions could store:

      existing.concepts["Separable Verbs"]

    while the new version stores:

      existing.concepts["separable_verbs"]

    Before recording new evidence, merge duplicate
    representations into the canonical normalized key.
    ==================================================
    */

    const mergeNumber =
      (a, b) =>
        Number(a || 0) +
        Number(b || 0);


    const mergeLatestDate =
      (a, b) => {

        if (!a) {
          return b || null;
        }

        if (!b) {
          return a || null;
        }


        const aTime =
          new Date(a)
            .getTime();


        const bTime =
          new Date(b)
            .getTime();


        if (
          Number.isNaN(aTime)
        ) {

          return b;

        }


        if (
          Number.isNaN(bTime)
        ) {

          return a;

        }


        return bTime > aTime
          ? b
          : a;

      };


    const mergeEarliestDate =
      (a, b) => {

        if (!a) {
          return b || null;
        }

        if (!b) {
          return a || null;
        }


        const aTime =
          new Date(a)
            .getTime();


        const bTime =
          new Date(b)
            .getTime();


        if (
          Number.isNaN(aTime)
        ) {

          return b;

        }


        if (
          Number.isNaN(bTime)
        ) {

          return a;

        }


        return bTime < aTime
          ? b
          : a;

      };


    const mergeConceptRecords =
      (
        target,
        source,
        canonicalName
      ) => {

        const merged =
          target || {};


        const sourceRecord =
          source || {};


        const isBuiltIn =
          builtInConcepts.has(
            canonicalName
          );


        /*
        Identity
        */

        merged.name =
          canonicalName;


        merged.concept =
          merged.concept ||
          sourceRecord.concept ||
          canonicalName;


        merged.label =
          merged.label ||
          sourceRecord.label ||
          sourceRecord.concept ||
          canonicalName;


        merged.category =
          merged.category ||
          sourceRecord.category ||
          "language";


        /*
        Writing counters
        */

        merged.writingEncounters =
          mergeNumber(
            merged.writingEncounters,
            sourceRecord.writingEncounters
          );


        merged.writingErrors =
          mergeNumber(
            merged.writingErrors,
            sourceRecord.writingErrors
          );


        merged.minorErrors =
          mergeNumber(
            merged.minorErrors,
            sourceRecord.minorErrors
          );


        merged.moderateErrors =
          mergeNumber(
            merged.moderateErrors,
            sourceRecord.moderateErrors
          );


        merged.majorErrors =
          mergeNumber(
            merged.majorErrors,
            sourceRecord.majorErrors
          );


        merged.priorityCount =
          mergeNumber(
            merged.priorityCount,
            sourceRecord.priorityCount
          );


        /*
        Discovery metadata
        */

        if (isBuiltIn) {

          merged.origin =
            "built_in";


          merged.discoveryCount =
            0;


          merged.discoveredAt =
            null;


          merged.learningTopic =
            true;

        }

        else {

          merged.origin =
            "discovered";


          merged.discoveryCount =
            mergeNumber(
              merged.discoveryCount,
              sourceRecord.discoveryCount
            );


          merged.discoveredAt =
            mergeEarliestDate(
              merged.discoveredAt,
              sourceRecord.discoveredAt
            );


          merged.promoted =
            merged.promoted === true ||
            sourceRecord.promoted === true;


          merged.promotedAt =
            mergeEarliestDate(
              merged.promotedAt,
              sourceRecord.promotedAt
            );


          merged.learningTopic =
            merged.promoted === true ||
            sourceRecord.learningTopic ===
              true;

        }


        /*
        Last seen
        */

        merged.lastSeen =
          mergeLatestDate(
            merged.lastSeen,
            sourceRecord.lastSeen
          );


        /*
        Evidence history
        */

        const targetEvidence =
          Array.isArray(
            merged.evidence
          )
            ? merged.evidence
            : [];


        const sourceEvidence =
          Array.isArray(
            sourceRecord.evidence
          )
            ? sourceRecord.evidence
            : [];


        merged.evidence =
          [
            ...targetEvidence,
            ...sourceEvidence
          ]
            .sort(
              (a, b) => {

                const aTime =
                  new Date(
                    a?.recordedAt ||
                    0
                  )
                    .getTime();


                const bTime =
                  new Date(
                    b?.recordedAt ||
                    0
                  )
                    .getTime();


                return aTime -
                  bTime;

              }
            )
            .slice(-20);


        return merged;

      };


    /*
    Build a clean canonical concept map.

    This migration runs every time evidence is recorded,
    making the operation safe for users who already have
    old localStorage data.
    */

    const canonicalConcepts = {};


    Object.entries(
      existing.concepts
    )
      .forEach(
        ([oldKey, oldConcept]) => {

          const canonicalName =
            normalizeConceptName(
              oldConcept?.name ||
              oldConcept?.concept ||
              oldKey
            );


          if (!canonicalName) {

            return;

          }


          canonicalConcepts[
            canonicalName
          ] =
            mergeConceptRecords(
              canonicalConcepts[
                canonicalName
              ],
              oldConcept,
              canonicalName
            );

        }
      );


    existing.concepts =
      canonicalConcepts;


    /*
    ==================================================
    OBSERVATIONS IN THIS EVALUATION
    ==================================================

    discoveryCount means:

      "How many separate evaluations identified this
       concept?"

    It does NOT mean:

      "How many individual errors had this concept?"

    Therefore, if the AI returns two errors for the same
    concept in one evaluation, discoveryCount increases
    only once.
    ==================================================
    */

    const conceptsObserved =
      new Set();


    errors.forEach(
      error => {

        const rawConcept =
          error?.concept;


        if (!rawConcept) {

          return;

        }


        const concept =
          normalizeConceptName(
            rawConcept
          );


        if (!concept) {

          return;

        }


        const isBuiltIn =
          builtInConcepts.has(
            concept
          );


        const now =
          new Date()
            .toISOString();


        /*
        ==================================================
        CREATE CONCEPT
        ==================================================
        */

        if (
          !existing.concepts[
            concept
          ]
        ) {

          existing.concepts[
            concept
          ] = {

            concept:
              rawConcept,

            name:
              concept,

            label:
              String(
                rawConcept
              ).trim(),

            category:
              "language",

            origin:
              isBuiltIn
                ? "built_in"
                : "discovered",

            discoveryCount:
              0,

            discoveredAt:
              null,

            promoted:
              false,

            promotedAt:
              null,

            learningTopic:
              isBuiltIn,

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
          existing.concepts[
            concept
          ];


        /*
        ==================================================
        ENSURE CURRENT SCHEMA
        ==================================================
        */

        item.name =
          concept;


        item.concept =
          item.concept ||
          rawConcept;


        item.label =
          item.label ||
          String(
            rawConcept
          ).trim();


        item.category =
          item.category ||
          "language";


        item.writingEncounters =
          Number(
            item.writingEncounters ||
            0
          );


        item.writingErrors =
          Number(
            item.writingErrors ||
            0
          );


        item.minorErrors =
          Number(
            item.minorErrors ||
            0
          );


        item.moderateErrors =
          Number(
            item.moderateErrors ||
            0
          );


        item.majorErrors =
          Number(
            item.majorErrors ||
            0
          );


        item.priorityCount =
          Number(
            item.priorityCount ||
            0
          );


        if (
          !Array.isArray(
            item.evidence
          )
        ) {

          item.evidence = [];

        }


        /*
        ==================================================
        DISCOVERY
        ==================================================
        */

        if (isBuiltIn) {

          item.origin =
            "built_in";


          item.discoveryCount =
            0;


          item.discoveredAt =
            null;


          item.learningTopic =
            true;

        }

        else {

          item.origin =
            "discovered";


          item.discoveryCount =
            Number(
              item.discoveryCount ||
              0
            );


          if (
            !conceptsObserved.has(
              concept
            )
          ) {

            item.discoveryCount +=
              1;


            if (
              !item.discoveredAt
            ) {

              item.discoveredAt =
                now;

            }


            conceptsObserved.add(
              concept
            );

          }


          item.promoted =
            item.promoted ===
            true;


          item.promotedAt =
            item.promotedAt ||
            null;


          item.learningTopic =
            item.promoted ===
            true;

        }


        /*
        ==================================================
        WRITING EVIDENCE
        ==================================================
        */

        item.writingEncounters +=
          1;


        item.writingErrors +=
          1;


        /*
        ==================================================
        SEVERITY
        ==================================================
        */

        const severity =
          error.severity ||
          "minor";


        if (
          severity ===
          "major"
        ) {

          item.majorErrors +=
            1;

        }

        else if (
          severity ===
          "moderate"
        ) {

          item.moderateErrors +=
            1;

        }

        else {

          item.minorErrors +=
            1;

        }


        /*
        ==================================================
        PRIORITY SIGNAL
        ==================================================
        */

        if (
          normalizedPriorityConcepts
            .has(
              concept
            )
        ) {

          item.priorityCount +=
            1;

        }


        /*
        ==================================================
        LAST SEEN
        ==================================================
        */

        item.lastSeen =
          now;


        /*
        ==================================================
        EVIDENCE HISTORY
        ==================================================
        */

        item.evidence.push({

          source:
            "writing",

          taskId:
            task?.id ||
            null,

          level:
            task?.level ||
            null,

          concept,

          severity,

          original:
            error.original,

          correction:
            error.correction,

          recordedAt:
            now

        });


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


    /*
    ==================================================
    SAVE PROFILE
    ==================================================
    */

    existing.updatedAt =
      new Date()
        .toISOString();


    localStorage.setItem(
      profileStorageKey,

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