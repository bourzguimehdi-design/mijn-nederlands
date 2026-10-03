/*
==================================================
MIJN NEDERLANDS
LEARNER PROFILE ENGINE
VERSION 4
==================================================

The learner profile is derived from evidence.

Sources currently supported:

- Placement assessment history
- Placement weak concepts
- Writing assessment history
- AI writing evaluations
- AI writing concept evidence

Important principles:

1. Assessment history is the source of truth.
2. Legacy data is preserved.
3. Valid v2 writing assessments take priority over
   legacy writing assessments.
4. CEFR level and numerical performance score are
   separate concepts.
5. Writing level is based on demonstrated attainment,
   not a median of unrelated task difficulties.
==================================================
*/


const ProfileEngine = {

  STORAGE_KEY:
    "mijnNederlandsLearnerProfile",


  /*
  ==================================================
  DEFAULT PROFILE
  ==================================================
  */

  createDefaultProfile() {

    return {

      version: 3,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),


      goal: {

        type:
          "naturalisation",

        targetLanguageLevel:
          "A2",

        trainingTarget:
          "B1",

        targetDate:
          "2026-12-31"

      },


      preferences: {

        interfaceLanguage:
          "English",

        weekdayMinutes:
          60,

        weekendMinutes:
          90,

        learningStyle:
          "balanced"

      },


      skills: {

        grammar:
          this.createSkill(),

        vocabulary:
          this.createSkill(),

        reading:
          this.createSkill(),

        listening:
          this.createSkill(),

        writing:
          this.createSkill(),

        speaking:
          this.createSkill(),

        knm:
          this.createSkill()

      },


      concepts: {},


      examReadiness: {

        reading: null,

        listening: null,

        writing: null,

        speaking: null,

        knm: null,

        overall: null

      },


     assessmentSummary: {

  placementAttempts: 0,

  writingAssessments: 0,

  writingResponses: 0,

  speakingAssessments: 0,

  speakingResponses: 0,

  practiceSessions: 0,

  practiceResponses: 0,

  latestPlacementAt: null,

  latestWritingAt: null,

  latestSpeakingAt: null,

  latestPracticeAt: null

}

    };

  },


  /*
  ==================================================
  DEFAULT SKILL
  ==================================================
  */

  createSkill() {

    return {

      level: null,

      score: null,

      confidence: 0,

      assessed: false,

      lastAssessedAt: null,

      evidenceCount: 0,

      source: null

    };

  },


  /*
  ==================================================
  LOAD
  ==================================================
  */

  load() {

    try {

      const saved =
        localStorage.getItem(
          this.STORAGE_KEY
        );


      if (!saved) {

        return this
          .createDefaultProfile();

      }


      return this.mergeWithDefaults(
        JSON.parse(saved)
      );


    } catch (error) {

      console.warn(
        "Could not load learner profile.",
        error
      );


      return this
        .createDefaultProfile();

    }

  },


  /*
  ==================================================
  SAVE
  ==================================================
  */

  save(profile) {

    profile.updatedAt =
      new Date().toISOString();


    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(profile)
    );


    return profile;

  },


  /*
  ==================================================
  MERGE SAVED PROFILE WITH DEFAULTS
  ==================================================
  */

  mergeWithDefaults(saved) {

    const defaults =
      this.createDefaultProfile();


    const skills = {};


    Object.keys(
      defaults.skills
    )
      .forEach(
        skillName => {

          skills[skillName] = {

            ...defaults.skills[
              skillName
            ],

            ...(
              saved.skills?.[
                skillName
              ] || {}
            )

          };

        }
      );


    return {

      ...defaults,

      ...saved,


      version:
        defaults.version,


      goal: {

        ...defaults.goal,

        ...(saved.goal || {})

      },


      preferences: {

        ...defaults.preferences,

        ...(saved.preferences || {})

      },


      skills,


      concepts: {

        ...(saved.concepts || {})

      },


      examReadiness: {

        ...defaults.examReadiness,

        ...(saved.examReadiness || {})

      },


      assessmentSummary: {

        ...defaults.assessmentSummary,

        ...(
          saved.assessmentSummary ||
          {}
        )

      }

    };

  },


  /*
  ==================================================
  REFRESH PROFILE
  ==================================================
  */

  refresh() {

    const profile =
      this.load();


    /*
    Rebuild evidence-derived state.

    Goals and preferences remain untouched.
    */

    profile.skills = {

      grammar:
        this.createSkill(),

      vocabulary:
        this.createSkill(),

      reading:
        this.createSkill(),

      listening:
        this.createSkill(),

      writing:
        this.createSkill(),

      speaking:
        this.createSkill(),

      knm:
        this.createSkill()

    };


    profile.concepts = {};


    profile.assessmentSummary = {

  placementAttempts: 0,

  writingAssessments: 0,

  writingResponses: 0,

  speakingAssessments: 0,

  speakingResponses: 0,

  practiceSessions: 0,

  practiceResponses: 0,

  latestPlacementAt: null,

  latestWritingAt: null,

  latestSpeakingAt: null,

  latestPracticeAt: null

};


    this.importPlacementEvidence(
  profile
);


this.importWritingEvidence(
  profile
);


this.importWritingConceptEvidence(
  profile
);


this.importSpeakingEvidence(
  profile
);


this.importSpeakingConceptEvidence(
  profile
);


this.importPracticeEvidence(
  profile
);


/*
==================================================
RECALCULATE CONCEPT MASTERY
==================================================

Practice evidence is imported after the formal
assessment evidence.

Recalculate mastery now so successful practice
and practice failures are reflected in the
final learner profile.
*/

Object.values(
  profile.concepts
).forEach(
  concept => {

    concept.mastery =
      this.calculateConceptMastery(
        concept
      );

  }
);


this.calculateConfidence(
  profile
);

    this.save(
      profile
    );


    return profile;

  },


  /*
  ==================================================
  PLACEMENT EVIDENCE
  ==================================================
  */

  importPlacementEvidence(profile) {

    let history = [];


    if (
      typeof Storage !==
        "undefined" &&
      typeof Storage
        .getPlacementHistory ===
        "function"
    ) {

      history =
        Storage
          .getPlacementHistory();

    }


    /*
    Legacy fallback.
    */

    if (
      history.length === 0
    ) {

      try {

        const legacy =
          JSON.parse(
            localStorage.getItem(
              "mijnNederlandsPlacement"
            ) || "null"
          );


        if (legacy) {

          history = [
            legacy
          ];

        }

      } catch (error) {

        history = [];

      }

    }


    if (
      history.length === 0
    ) {

      return;

    }


    profile
      .assessmentSummary
      .placementAttempts =
        history.length;


    const sorted =
      history
        .slice()
        .sort(
          (a, b) =>
            this.getAssessmentTime(b) -
            this.getAssessmentTime(a)
        );


    const latest =
      sorted[0];


    profile
      .assessmentSummary
      .latestPlacementAt =
        latest.completedAt ||
        latest.savedAt ||
        null;


    /*
    ------------------------------------------
    LATEST PLACEMENT SKILLS
    ------------------------------------------
    */

    if (
      latest.skills
    ) {

      const placementSkills = [

        "grammar",

        "vocabulary",

        "reading",

        "listening"

      ];


      placementSkills.forEach(
        skillName => {

          const result =
            latest.skills[
              skillName
            ];


          if (!result) {
            return;
          }


          const estimate =
            result.estimate ||
            {};


          const skill =
            profile.skills[
              skillName
            ];


          skill.level =
            this.normalizeLevel(
              estimate.level
            );


          skill.score =
            this.calculatePlacementScore(
              result
            );


          skill.assessed =
            true;


          skill.lastAssessedAt =
            latest.completedAt ||
            latest.savedAt ||
            null;


          skill.evidenceCount =
            this.countSkillResponses(
              latest,
              skillName
            );


          skill.source =
            "placement";

        }
      );

    }


    /*
    ------------------------------------------
    PLACEMENT WEAK CONCEPTS
    ------------------------------------------
    */

    if (
      Array.isArray(
        latest.weakConcepts
      )
    ) {

      latest
        .weakConcepts
        .forEach(
          weakness => {

            this.importPlacementConcept(
              profile,
              weakness,
              latest
            );

          }
        );

    }

  },


  /*
  ==================================================
  PLACEMENT SCORE
  ==================================================
  */

  calculatePlacementScore(
    skillResult
  ) {

    if (
      !skillResult ||
      !skillResult.levels
    ) {

      return null;

    }


    let total = 0;
    let correct = 0;


    Object.values(
      skillResult.levels
    )
      .forEach(
        level => {

          total +=
            Number(
              level.total ||
              0
            );


          correct +=
            Number(
              level.correct ||
              0
            );

        }
      );


    if (
      total === 0
    ) {

      return null;

    }


    return Math.round(
      (
        correct /
        total
      ) *
      100
    );

  },


  /*
  ==================================================
  COUNT PLACEMENT RESPONSES
  ==================================================
  */

  countSkillResponses(
    assessment,
    skillName
  ) {

    if (
      !Array.isArray(
        assessment.responses
      )
    ) {

      return 0;

    }


    return assessment
      .responses
      .filter(
        response =>
          response.skill ===
          skillName
      )
      .length;

  },


  /*
  ==================================================
  PLACEMENT CONCEPT
  ==================================================
  */

  importPlacementConcept(
    profile,
    weakness,
    assessment
  ) {

    if (!weakness) {
      return;
    }


    const rawName =
      weakness.concept ||
      weakness.topic ||
      weakness.category ||
      weakness.name;


    if (!rawName) {
      return;
    }


    const name =
      this.normalizeConceptName(
        rawName
      );


    const concept =
      this.ensureConcept(
        profile,
        name
      );


    concept.encounters += 1;

    concept.errors += 1;


    const severity =
      weakness.severity ||
      "moderate";


    this.incrementSeverity(
      concept,
      severity
    );


    concept.lastSeen =
      assessment.completedAt ||
      assessment.savedAt ||
      new Date().toISOString();


    if (
      !concept.sources.includes(
        "placement"
      )
    ) {

      concept.sources.push(
        "placement"
      );

    }


    concept.mastery =
      this.calculateConceptMastery(
        concept
      );

  },


  /*
  ==================================================
  WRITING HISTORY
  ==================================================
  */

  getWritingHistory() {

    if (
      typeof Storage !==
        "undefined" &&
      typeof Storage
        .getWritingHistory ===
        "function"
    ) {

      const history =
        Storage
          .getWritingHistory();


      if (
        Array.isArray(history)
      ) {

        return history;

      }

    }


    /*
    Legacy fallback.
    */

    try {

      const legacy =
        JSON.parse(
          localStorage.getItem(
            "mijnNederlandsWritingAssessment"
          ) || "null"
        );


      return legacy
        ? [legacy]
        : [];


    } catch (error) {

      return [];

    }

  },


  /*
  ==================================================
  SELECT CURRENT WRITING ASSESSMENT
  ==================================================

  Prefer the newest valid v2 assessment.

  If no v2 assessment exists yet, use the newest
  legacy assessment temporarily.

  This means old evidence is preserved without
  controlling the profile forever.
  ==================================================
  */

  getCurrentWritingAssessment(
    history
  ) {

    if (
      !Array.isArray(history) ||
      history.length === 0
    ) {

      return null;

    }


    const sorted =
      history
        .slice()
        .sort(
          (a, b) =>
            this.getAssessmentTime(b) -
            this.getAssessmentTime(a)
        );


    const validV2 =
      sorted.find(
        assessment =>
          Number(
            assessment.assessmentVersion
          ) >= 2 &&
          Array.isArray(
            assessment.responses
          ) &&
          assessment.responses.length > 0
      );


    if (validV2) {

      return validV2;

    }


    return sorted.find(
      assessment =>
        Array.isArray(
          assessment.responses
        ) &&
        assessment.responses.length > 0
    ) || null;

  },


  /*
  ==================================================
  WRITING EVIDENCE
  ==================================================
  */

  importWritingEvidence(profile) {

    const history =
      this.getWritingHistory();


    if (
      history.length === 0
    ) {

      return;

    }


    profile
      .assessmentSummary
      .writingAssessments =
        history.length;


    const writing =
      this.getCurrentWritingAssessment(
        history
      );


    if (!writing) {

      return;

    }


    const evaluated =
      writing.responses.filter(
        response =>
          this.hasValidWritingEvaluation(
            response
          )
      );


    if (
      evaluated.length === 0
    ) {

      return;

    }


    profile
      .assessmentSummary
      .writingResponses =
        evaluated.length;


    profile
      .assessmentSummary
      .latestWritingAt =
        writing.completedAt ||
        writing.savedAt ||
        writing.updatedAt ||
        null;


    const skill =
      profile.skills.writing;


    skill.assessed =
      true;


    skill.evidenceCount =
      evaluated.length;


    skill.lastAssessedAt =
      writing.completedAt ||
      writing.savedAt ||
      writing.updatedAt ||
      null;


    skill.source =
      Number(
        writing.assessmentVersion
      ) >= 2
        ? "writing-assessment-v2"
        : "legacy-writing";


    /*
    Internal performance score.

    This is NOT the CEFR level.
    */

    const percentages =
      evaluated
        .map(
          response =>
            this.getWritingPercentage(
              response.evaluation
            )
        )
        .filter(
          value =>
            value !== null
        );


    if (
      percentages.length > 0
    ) {

      skill.score =
        Math.round(
          percentages.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          percentages.length
        );

    }


    /*
    v2 uses attainment logic.

    Legacy data retains the old median method
    until a clean v2 assessment exists.
    */

    if (
      Number(
        writing.assessmentVersion
      ) >= 2
    ) {

      skill.level =
        this.calculateWritingAttainmentLevel(
          evaluated
        );

    } else {

      skill.level =
        this.calculateLegacyWritingLevel(
          evaluated
        );

    }

  },


  /*
  ==================================================
  VALID WRITING EVALUATION
  ==================================================
  */

  hasValidWritingEvaluation(
    response
  ) {

    if (
      !response ||
      !response.evaluation
    ) {

      return false;

    }


    const evaluation =
      response.evaluation;


    return Boolean(
      evaluation.estimatedPerformance ||
      evaluation.scores
    );

  },


  /*
  ==================================================
  WRITING PERFORMANCE PERCENTAGE
  ==================================================
  */

  getWritingPercentage(
    evaluation
  ) {

    if (
      !evaluation ||
      !evaluation.scores
    ) {

      return null;

    }


    const scores =
      evaluation.scores;


    const values = [

      scores.taskCompletion,

      scores.comprehensibility,

      scores.grammar,

      scores.vocabulary,

      scores.coherence

    ].filter(
      value =>
        typeof value ===
        "number"
    );


    if (
      values.length === 0
    ) {

      return null;

    }


    const average =
      values.reduce(
        (sum, value) =>
          sum + value,
        0
      ) /
      values.length;


    return Math.round(
      (
        average /
        4
      ) *
      100
    );

  },


  /*
  ==================================================
  WRITING ATTAINMENT LEVEL — V2
  ==================================================

  Principle:

  A difficult task that is not demonstrated does
  not erase a lower level that WAS demonstrated.

  Example:

  A1 tasks -> demonstrated
  A2 tasks -> demonstrated
  B1 tasks -> not demonstrated

  Result: A2

  Each CEFR level is evaluated against tasks
  targeted at that level.
  ==================================================
  */

  calculateWritingAttainmentLevel(
    evaluatedResponses
  ) {

    const levels = [
      "A1",
      "A2",
      "B1"
    ];


    let highestDemonstrated =
      null;


    levels.forEach(
      targetLevel => {

        const tasks =
          evaluatedResponses.filter(
            response =>
              this.normalizeBaseLevel(
                response.level
              ) === targetLevel
          );


        if (
          tasks.length === 0
        ) {

          return;

        }


        const demonstrated =
          tasks.filter(
            response =>
              this.writingTaskDemonstratesLevel(
                response,
                targetLevel
              )
          );


        /*
        For one available task:
        it must demonstrate the level.

        For two or more tasks:
        require at least half, rounded up.

        With our current bank of two tasks per level,
        this requires at least one clear demonstration
        plus supporting score logic below.
        */

        const required =
          Math.ceil(
            tasks.length / 2
          );


        const averageScore =
          this.averageWritingTaskScore(
            tasks
          );


        const levelPassed =
          demonstrated.length >=
            required &&
          (
            averageScore === null ||
            averageScore >= 60
          );


        if (levelPassed) {

          highestDemonstrated =
            targetLevel;

        }

      }
    );


    if (
      highestDemonstrated
    ) {

      return highestDemonstrated;

    }


    /*
    No A1-level attainment demonstrated.
    */

    return "< A1";

  },


  /*
  ==================================================
  DOES A TASK DEMONSTRATE ITS TARGET LEVEL?
  ==================================================
  */

  writingTaskDemonstratesLevel(
    response,
    targetLevel
  ) {

    const evaluation =
      response.evaluation ||
      {};


    const demonstratedLevel =
      this.normalizeBaseLevel(
        evaluation
          .estimatedPerformance
      );


    if (!demonstratedLevel) {

      return false;

    }


    const demonstratedValue =
      this.getLevelValue(
        demonstratedLevel
      );


    const targetValue =
      this.getLevelValue(
        targetLevel
      );


    if (
      demonstratedValue === null ||
      targetValue === null
    ) {

      return false;

    }


    /*
    Estimated CEFR must reach the target.
    */

    if (
      demonstratedValue <
      targetValue
    ) {

      return false;

    }


    /*
    Require reasonable task performance too.

    This prevents a CEFR label by itself from
    producing a pass when the component scores
    are extremely weak.
    */

    const percentage =
      this.getWritingPercentage(
        evaluation
      );


    if (
      percentage !== null &&
      percentage < 60
    ) {

      return false;

    }


    return true;

  },


  /*
  ==================================================
  AVERAGE SCORE FOR WRITING TASKS
  ==================================================
  */

  averageWritingTaskScore(
    responses
  ) {

    const values =
      responses
        .map(
          response =>
            this.getWritingPercentage(
              response.evaluation
            )
        )
        .filter(
          value =>
            value !== null
        );


    if (
      values.length === 0
    ) {

      return null;

    }


    return Math.round(
      values.reduce(
        (sum, value) =>
          sum + value,
        0
      ) /
      values.length
    );

  },


  /*
  ==================================================
  LEGACY WRITING LEVEL
  ==================================================

  Preserves interpretation of the old assessment
  until a clean v2 assessment exists.

  We do NOT rewrite historical evidence.
  ==================================================
  */

  calculateLegacyWritingLevel(
    evaluatedResponses
  ) {

    const values =
      evaluatedResponses

        .map(
          response =>
            this.getLevelValue(
              response
                .evaluation
                .estimatedPerformance
            )
        )

        .filter(
          value =>
            value !== null
        )

        .sort(
          (a, b) =>
            a - b
        );


    if (
      values.length === 0
    ) {

      return null;

    }


    const middle =
      Math.floor(
        values.length /
        2
      );


    const median =
      values.length % 2 === 0

        ? (
            values[
              middle - 1
            ] +
            values[
              middle
            ]
          ) / 2

        : values[
            middle
          ];


    return this.levelFromNumericValue(
      median
    );

  },

/*
==================================================
SPEAKING HISTORY
==================================================
*/

getSpeakingHistory() {

  if (
    typeof Storage !==
      "undefined" &&
    typeof Storage
      .getSpeakingHistory ===
      "function"
  ) {

    const history =
      Storage
        .getSpeakingHistory();


    if (
      Array.isArray(history)
    ) {

      return history;

    }

  }


  /*
  Legacy/direct-key fallback.
  */

  try {

    const legacy =
      JSON.parse(
        localStorage.getItem(
          "mijnNederlandsSpeakingAssessment"
        ) || "null"
      );


    return legacy
      ? [legacy]
      : [];


  } catch (error) {

    return [];

  }

},


/*
==================================================
SELECT CURRENT SPEAKING ASSESSMENT
==================================================
*/

getCurrentSpeakingAssessment(
  history
) {

  if (
    !Array.isArray(history) ||
    history.length === 0
  ) {

    return null;

  }


  return history
    .slice()
    .filter(
      assessment =>
        Array.isArray(
          assessment.responses
        ) &&
        assessment.responses.length > 0
    )
    .sort(
      (a, b) =>
        this.getAssessmentTime(b) -
        this.getAssessmentTime(a)
    )[0] || null;

},


/*
==================================================
SPEAKING EVIDENCE
==================================================
*/

importSpeakingEvidence(
  profile
) {

  const history =
    this.getSpeakingHistory();


  if (
    history.length === 0
  ) {

    return;

  }


  profile
    .assessmentSummary
    .speakingAssessments =
      history.length;


  const speaking =
    this.getCurrentSpeakingAssessment(
      history
    );


  if (!speaking) {

    return;

  }


  profile
    .assessmentSummary
    .latestSpeakingAt =
      speaking.completedAt ||
      speaking.savedAt ||
      null;


  /*
  Only actual evaluated answers count
  as positive performance evidence.

  A skipped task remains useful assessment
  evidence, but it must never be treated as
  an evaluated answer with a CEFR score.
  */

  const evaluated =
    speaking.responses.filter(
      response =>
        this.hasValidSpeakingEvaluation(
          response
        )
    );


  const skipped =
    speaking.responses.filter(
      response =>
        response &&
        response.skipped === true
    );


  profile
    .assessmentSummary
    .speakingResponses =
      evaluated.length;


  /*
  If every task was skipped, we do not have
  enough produced-language evidence to assign
  a CEFR speaking level.
  */

  if (
    evaluated.length === 0
  ) {

    return;

  }


  const skill =
    profile.skills.speaking;


  skill.assessed =
    true;


  skill.evidenceCount =
    evaluated.length;


  skill.lastAssessedAt =
    speaking.completedAt ||
    speaking.savedAt ||
    null;


  skill.source =
    Number(
      speaking.assessmentVersion
    ) >= 1
      ? "speaking-assessment-v1"
      : "legacy-speaking";


  /*
  Internal numerical performance score.

  Like Writing, this is separate from the
  CEFR attainment level.
  */

  const percentages =
    evaluated
      .map(
        response =>
          this.getSpeakingPercentage(
            response.evaluation
          )
      )
      .filter(
        value =>
          value !== null
      );


  if (
    percentages.length > 0
  ) {

    skill.score =
      Math.round(
        percentages.reduce(
          (sum, value) =>
            sum + value,
          0
        ) /
        percentages.length
      );

  }


  /*
  Determine the highest CEFR band actually
  demonstrated on tasks targeted at that band.

  Skipped higher-level tasks do not erase
  demonstrated lower-level ability.
  */

  skill.level =
    this.calculateSpeakingAttainmentLevel(
      evaluated,
      skipped
    );

},


/*
==================================================
VALID SPEAKING EVALUATION
==================================================
*/

hasValidSpeakingEvaluation(
  response
) {

  if (
    !response ||
    response.skipped === true ||
    !response.evaluation
  ) {

    return false;

  }


  const evaluation =
    response.evaluation;


  if (
    evaluation.status ===
      "skipped"
  ) {

    return false;

  }


  return Boolean(
    evaluation.estimatedPerformance ||
    evaluation.scores
  );

},


/*
==================================================
SPEAKING PERFORMANCE PERCENTAGE
==================================================
*/

getSpeakingPercentage(
  evaluation
) {

  if (
    !evaluation ||
    !evaluation.scores
  ) {

    return null;

  }


  const scores =
    evaluation.scores;


  const values = [

    scores.taskCompletion,

    scores.comprehensibility,

    scores.grammar,

    scores.vocabulary,

    scores.coherence

  ].filter(
    value =>
      typeof value ===
        "number" &&
      Number.isFinite(value)
  );


  if (
    values.length === 0
  ) {

    return null;

  }


  const average =
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) /
    values.length;


  return Math.round(
    (
      average /
      4
    ) *
    100
  );

},


/*
==================================================
SPEAKING ATTAINMENT LEVEL
==================================================

Same core principle as Writing:

A learner is credited with the highest CEFR
band that was actually demonstrated.

Failure or inability at a harder level does
not erase demonstrated attainment below it.

Skipped tasks never count as successful
demonstrations.
==================================================
*/

calculateSpeakingAttainmentLevel(
  evaluatedResponses
) {

  const levels = [
    "A1",
    "A2",
    "B1"
  ];


  let highestDemonstrated =
    null;


  levels.forEach(
    targetLevel => {

      const tasks =
        evaluatedResponses.filter(
          response =>
            this.normalizeBaseLevel(
              response.level
            ) === targetLevel
        );


      if (
        tasks.length === 0
      ) {

        return;

      }


      const demonstrated =
        tasks.filter(
          response =>
            this.speakingTaskDemonstratesLevel(
              response,
              targetLevel
            )
        );


      /*
      Require at least half of the evaluated
      tasks at this target level, rounded up.
      */

      const required =
        Math.ceil(
          tasks.length / 2
        );


      const averageScore =
        this.averageSpeakingTaskScore(
          tasks
        );


      const levelPassed =
        demonstrated.length >=
          required &&
        (
          averageScore === null ||
          averageScore >= 60
        );


      if (levelPassed) {

        highestDemonstrated =
          targetLevel;

      }

    }
  );


  if (
    highestDemonstrated
  ) {

    return highestDemonstrated;

  }


  return "< A1";

},


/*
==================================================
DOES A SPEAKING TASK DEMONSTRATE ITS LEVEL?
==================================================
*/

speakingTaskDemonstratesLevel(
  response,
  targetLevel
) {

  if (
    !response ||
    response.skipped === true
  ) {

    return false;

  }


  const evaluation =
    response.evaluation ||
    {};


  const demonstratedLevel =
    this.normalizeBaseLevel(
      evaluation
        .estimatedPerformance
    );


  if (
    !demonstratedLevel
  ) {

    return false;

  }


  const demonstratedValue =
    this.getLevelValue(
      demonstratedLevel
    );


  const targetValue =
    this.getLevelValue(
      targetLevel
    );


  if (
    demonstratedValue === null ||
    targetValue === null
  ) {

    return false;

  }


  if (
    demonstratedValue <
    targetValue
  ) {

    return false;

  }


  const percentage =
    this.getSpeakingPercentage(
      evaluation
    );


  if (
    percentage !== null &&
    percentage < 60
  ) {

    return false;

  }


  return true;

},


/*
==================================================
AVERAGE SPEAKING TASK SCORE
==================================================
*/

averageSpeakingTaskScore(
  responses
) {

  const values =
    responses
      .map(
        response =>
          this.getSpeakingPercentage(
            response.evaluation
          )
      )
      .filter(
        value =>
          value !== null
      );


  if (
    values.length === 0
  ) {

    return null;

  }


  return Math.round(
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) /
    values.length
  );

},


/*
==================================================
SPEAKING CONCEPT EVIDENCE
==================================================
*/

importSpeakingConceptEvidence(
  profile
) {

  const history =
    this.getSpeakingHistory();


  const speaking =
    this.getCurrentSpeakingAssessment(
      history
    );


  if (
    !speaking ||
    !Array.isArray(
      speaking.responses
    )
  ) {

    return;

  }


  speaking.responses.forEach(
    response => {

      if (
        !this.hasValidSpeakingEvaluation(
          response
        )
      ) {

        return;

      }


      const evaluation =
        response.evaluation ||
        {};


      /*
      ------------------------------------------
      EXPLICIT PRIORITY CONCEPTS
      ------------------------------------------
      */

      (
        evaluation.priorityConcepts ||
        []
      ).forEach(
        rawName => {

          if (!rawName) {
            return;
          }


          const name =
            this.normalizeConceptName(
              rawName
            );


          const concept =
            this.ensureConcept(
              profile,
              name
            );


          concept.encounters +=
            1;


          concept.priorityCount +=
            1;


          concept.lastSeen =
            this.latestDate(
              concept.lastSeen,
              response.completedAt ||
              speaking.completedAt ||
              speaking.savedAt
            );


          if (
            !concept.sources.includes(
              "speaking"
            )
          ) {

            concept.sources.push(
              "speaking"
            );

          }


          concept.mastery =
            this.calculateConceptMastery(
              concept
            );

        }
      );


      /*
      ------------------------------------------
      CORRECTED ERRORS
      ------------------------------------------
      */

      (
        evaluation.errors ||
        []
      ).forEach(
        error => {

          const rawName =
            error?.concept;


          if (!rawName) {
            return;
          }


          const name =
            this.normalizeConceptName(
              rawName
            );


          const concept =
            this.ensureConcept(
              profile,
              name
            );


          concept.encounters +=
            1;


          concept.errors +=
            1;


          const severity =
            error.severity ||
            "moderate";


          this.incrementSeverity(
            concept,
            severity
          );


          concept.lastSeen =
            this.latestDate(
              concept.lastSeen,
              response.completedAt ||
              speaking.completedAt ||
              speaking.savedAt
            );


          if (
            !concept.sources.includes(
              "speaking"
            )
          ) {

            concept.sources.push(
              "speaking"
            );

          }


          concept.mastery =
            this.calculateConceptMastery(
              concept
            );

        }
      );

    }
  );

},
  /*
  ==================================================
  AI WRITING CONCEPT EVIDENCE
  ==================================================
  */

  importWritingConceptEvidence(
    profile
  ) {

    let learningProfile;


    try {

      learningProfile =
        JSON.parse(
          localStorage.getItem(
            "mijnNederlandsLearningProfile"
          ) || "null"
        );

    } catch (error) {

      learningProfile = null;

    }


    if (
      !learningProfile ||
      !learningProfile.concepts
    ) {

      return;

    }


    Object.entries(
      learningProfile.concepts
    )
      .forEach(
        ([rawName, evidence]) => {

          const name =
            this.normalizeConceptName(
              rawName
            );


          const concept =
            this.ensureConcept(
              profile,
              name
            );


          concept.encounters +=
            Number(
              evidence
                .writingEncounters ||
              0
            );


          concept.errors +=
            Number(
              evidence
                .writingErrors ||
              0
            );


          concept.minorErrors +=
            Number(
              evidence
                .minorErrors ||
              0
            );


          concept.moderateErrors +=
            Number(
              evidence
                .moderateErrors ||
              0
            );


          concept.majorErrors +=
            Number(
              evidence
                .majorErrors ||
              0
            );


          concept.priorityCount +=
            Number(
              evidence
                .priorityCount ||
              0
            );


          concept.lastSeen =
            this.latestDate(
              concept.lastSeen,
              evidence.lastSeen
            );


          if (
            !concept.sources.includes(
              "writing"
            )
          ) {

            concept.sources.push(
              "writing"
            );

          }


          concept.mastery =
            this.calculateConceptMastery(
              concept
            );

        }
      );

  },

/*
==================================================
PRACTICE EVIDENCE
==================================================
*/

importPracticeEvidence(
  profile
) {

  /*
  Practice is supporting evidence.

  It should refine the learner profile,
  not instantly override formal assessment
  evidence.
  */

  if (
    typeof Storage === "undefined" ||
    typeof Storage.getPracticeHistory !==
      "function"
  ) {

    return;

  }


  const history =
    Storage.getPracticeHistory();


  if (
    !Array.isArray(history) ||
    history.length === 0
  ) {

    return;

  }


  profile
    .assessmentSummary
    .practiceSessions =
      history.length;


  /*
  Count all stored exercise responses.
  */

  profile
    .assessmentSummary
    .practiceResponses =
      history.reduce(
        (total, session) => {

          return (
            total +
            (
              Array.isArray(
                session.answers
              )
                ? session.answers.length
                : 0
            )
          );

        },
        0
      );


  /*
  Find the most recent practice session.
  */

  const sorted =
    history
      .slice()
      .sort(
        (a, b) =>
          this.getAssessmentTime(b) -
          this.getAssessmentTime(a)
      );


  const latest =
    sorted[0];


  profile
    .assessmentSummary
    .latestPracticeAt =
      latest.completedAt ||
      latest.savedAt ||
      null;


  /*
  ==================================================
  IMPORT EACH SESSION
  ==================================================
  */

  const chronologicalHistory =
  history
    .slice()
    .sort(
      (a, b) =>
        this.getAssessmentTime(a) -
        this.getAssessmentTime(b)
    );


chronologicalHistory.forEach(
  session => {

      if (!session) {
        return;
      }


      const rawTargetConcept =
        session.concept;


      if (!rawTargetConcept) {
        return;
      }


      const targetName =
        this.normalizeConceptName(
          rawTargetConcept
        );


      const targetConcept =
        this.ensureConcept(
          profile,
          targetName
        );


      const answers =
        Array.isArray(
          session.answers
        )
          ? session.answers
          : [];


      const sessionTime =
        session.completedAt ||
        session.savedAt ||
        null;

        /*
Track the most recent practice time
for the target concept.
*/

if (
  sessionTime &&
  (
    !targetConcept.lastPracticeAt ||
    new Date(sessionTime).getTime() >
      new Date(
        targetConcept.lastPracticeAt
      ).getTime()
  )
) {

  /*
A newer session replaces the previous
"recent" practice window.
*/

targetConcept.lastPracticeAt =
  sessionTime;

targetConcept.recentPracticeSuccesses =
  0;

targetConcept.recentPracticeFailures =
  0;

}


      /*
      Mark practice as a source for the
      target concept.
      */

      if (
        !targetConcept.sources.includes(
          "practice"
        )
      ) {

        targetConcept.sources.push(
          "practice"
        );

      }


      if (sessionTime) {

        targetConcept.lastSeen =
          sessionTime;

      }


      /*
      ==================================================
      IMPORT EACH ANSWER
      ==================================================
      */

      answers.forEach(
        answer => {

          if (!answer) {
            return;
          }


          targetConcept.encounters +=
            1;


          /*
          ------------------------------------------
          TARGET CONCEPT RESULT
          ------------------------------------------

          Prefer targetConceptCorrect from
          the new evaluator.

          Fall back to correct for older
          locally graded practice records.
          */

          const targetCorrect =
            typeof answer
              .targetConceptCorrect ===
              "boolean"
              ? answer
                  .targetConceptCorrect
              : answer.correct === true;


          if (targetCorrect) {

            targetConcept
              .practiceSuccesses +=
                1;

          } else {

            targetConcept
              .practiceFailures +=
                1;


            /*
            A failed target exercise is useful
            evidence, but practice should be
            lighter than formal assessment.

            Record it as a minor error.
            */

            targetConcept.errors +=
              1;

            targetConcept.minorErrors +=
              1;

          }

/*
==================================================
RECENT PRACTICE SIGNAL
==================================================

For now, "recent" means the latest practice
session for this concept.

Only answers belonging to that latest session
should contribute to the recent counters.
*/

if (
  sessionTime &&
  targetConcept.lastPracticeAt &&
  sessionTime ===
    targetConcept.lastPracticeAt
) {

  if (targetCorrect) {

    targetConcept
      .recentPracticeSuccesses +=
        1;

  } else {

    targetConcept
      .recentPracticeFailures +=
        1;

  }

}
          /*
          ------------------------------------------
          SECONDARY ERROR
          ------------------------------------------

          Example:

          target = spelling
          spelling correct = true
          errorConcept = adjective_ending

          The adjective error belongs to
          adjective_ending, not spelling.
          */

          const rawErrorConcept =
            answer.errorConcept;


          if (
            typeof rawErrorConcept !==
              "string" ||
            !rawErrorConcept.trim() ||
            rawErrorConcept === "none"
          ) {

            return;

          }


          const errorName =
            this.normalizeConceptName(
              rawErrorConcept
            );


          /*
          Avoid double-counting when the
          evaluator reports the target concept
          itself as the secondary error.
          */

          if (
            errorName ===
            targetName
          ) {

            return;

          }


          const errorConcept =
            this.ensureConcept(
              profile,
              errorName
            );


          errorConcept.encounters +=
            1;

          errorConcept.errors +=
            1;

          errorConcept.minorErrors +=
            1;

          errorConcept
            .practiceSecondaryErrors +=
              1;


          if (
            !errorConcept.sources.includes(
              "practice"
            )
          ) {

            errorConcept.sources.push(
              "practice"
            );

          }


          if (sessionTime) {

            errorConcept.lastSeen =
              sessionTime;

          }

        }

      );

    }

  );

},
  /*
  ==================================================
  CONCEPT MODEL
  ==================================================
  */

  ensureConcept(
    profile,
    name
  ) {

    if (
      !profile.concepts[
        name
      ]
    ) {

      profile.concepts[
        name
      ] = {

        name,

        encounters: 0,

        errors: 0,

        minorErrors: 0,

        moderateErrors: 0,

        majorErrors: 0,

priorityCount: 0,

practiceSuccesses: 0,

practiceFailures: 0,

practiceSecondaryErrors: 0,

lastPracticeAt: null,

recentPracticeSuccesses: 0,

recentPracticeFailures: 0,

mastery: null,

lastSeen: null,

sources: []

      };

    }


    return profile.concepts[
      name
    ];

  },


  /*
  ==================================================
  SEVERITY
  ==================================================
  */

  incrementSeverity(
    concept,
    severity
  ) {

    if (
      severity ===
      "major"
    ) {

      concept.majorErrors +=
        1;

      return;

    }


    if (
      severity ===
      "minor"
    ) {

      concept.minorErrors +=
        1;

      return;

    }


    concept.moderateErrors +=
      1;

  },


  /*
  ==================================================
  MASTERY
  ==================================================
  */

  calculateConceptMastery(
  concept
) {

  /*
  ==================================================
  FORMAL ERROR PENALTY
  ==================================================

  Existing assessment evidence remains the
  main source of concept mastery.
  */

  const weightedErrors =

    (
      concept.minorErrors *
      1
    ) +

    (
      concept.moderateErrors *
      2
    ) +

    (
      concept.majorErrors *
      3
    );


  const penalty =
    Math.min(
      80,
      weightedErrors * 6
    );


  const baseMastery =
    Math.max(
      20,
      100 - penalty
    );


  /*
  ==================================================
  PRACTICE ADJUSTMENT
  ==================================================

  Practice should refine mastery gradually.

  Successes provide a small positive signal.

  Failures provide a somewhat stronger
  negative signal.

  The total adjustment is capped so one
  practice session cannot radically change
  the learner profile.
  */

  const practiceSuccesses =
    Number(
      concept.practiceSuccesses ||
      0
    );


  const practiceFailures =
    Number(
      concept.practiceFailures ||
      0
    );


  const positiveAdjustment =
    Math.min(
      15,
      practiceSuccesses * 2
    );


const negativeAdjustment =
  Math.min(
    15,
    practiceFailures * 3
  );

  const practiceAdjustment =
    positiveAdjustment -
    negativeAdjustment;
/*
==================================================
RECENT PRACTICE RECOVERY
==================================================

Strong recent performance is evidence that the
learner may be overcoming an earlier weakness.

Recovery is deliberately capped so one strong
session cannot immediately create mastery.
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


const recentAttempts =
  recentSuccesses +
  recentFailures;


let recoveryAdjustment = 0;


if (recentAttempts >= 5) {

  const recentAccuracy =
    recentSuccesses /
    recentAttempts;


  if (recentAccuracy >= 0.8) {

    recoveryAdjustment =
      Math.min(
        10,
        Math.round(
          recentAccuracy * 10
        )
      );

  }

}

  /*
  ==================================================
  FINAL MASTERY
  ==================================================
  */

  return Math.max(
  20,
  Math.min(
    100,
    baseMastery +
    practiceAdjustment +
    recoveryAdjustment
  )
);

},

getMasteryLabel(
  mastery
) {

  const value =
    Number(mastery || 0);


  if (value >= 90) {
    return "Mastered";
  }


  if (value >= 80) {
    return "Strong";
  }


  if (value >= 60) {
    return "Improving";
  }


  if (value >= 40) {
    return "Developing";
  }


  return "Needs work";

},
  /*
  ==================================================
  CONFIDENCE
  ==================================================
  */

  calculateConfidence(
    profile
  ) {

    Object.values(
      profile.skills
    )
      .forEach(
        skill => {

          if (
            !skill.assessed
          ) {

            skill.confidence =
              0;

            return;

          }


          const evidence =
            Math.max(
              1,
              skill.evidenceCount ||
              1
            );


          skill.confidence =
            Math.min(
              100,
              35 + (
                evidence * 8
              )
            );

        }
      );

  },


  /*
  ==================================================
  PRIORITY CONCEPTS
  ==================================================
  */

  getPriorityConcepts(
    profile = null,
    limit = 5
  ) {

    const current =
      profile ||
      this.refresh();


    return Object.values(
      current.concepts
    )

      .sort(
        (a, b) => {

          const scoreA =
            this.getConceptPriorityScore(
              a
            );


          const scoreB =
            this.getConceptPriorityScore(
              b
            );


          return scoreB -
            scoreA;

        }
      )

      .slice(
        0,
        limit
      );

  },


  /*
  ==================================================
  PRIORITY SCORE
  ==================================================
  */

  getConceptPriorityScore(
  concept
) {

  /*
  Base priority comes from assessment
  errors and explicit priority evidence.
  */

  const basePriority =

    (
      concept.majorErrors *
      5
    ) +

    (
      concept.moderateErrors *
      3
    ) +

    (
      concept.minorErrors *
      1
    ) +

    (
      concept.priorityCount *
      2
    );


  /*
  Successful practice gradually lowers
  priority.

  Keep the reduction capped so practice
  cannot erase substantial assessment
  evidence too quickly.
  */

  const practiceSuccesses =
  Number(
    concept.practiceSuccesses ||
    0
  );


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
Historical successful practice gives
a modest reduction.
*/

const historicalReduction =
  Math.min(
    6,
    practiceSuccesses
  );


/*
A clean recent session is stronger evidence
that the learner may be ready to move on.

Recent failures cancel this extra reduction.
*/

const recentReduction =
  recentFailures === 0
    ? Math.min(
        10,
        recentSuccesses * 2
      )
    : 0;


const practiceReduction =
  historicalReduction +
  recentReduction;


  return Math.max(
    0,
    basePriority -
    practiceReduction
  );

},


  /*
  ==================================================
  LEVEL HELPERS
  ==================================================
  */

  normalizeLevel(level) {

    if (!level) {
      return null;
    }


    const aliases = {

      "below_A1":
        "< A1",

      "A1_plus":
        "A1+",

      "A2_plus":
        "A2+",

      "B1_plus":
        "B1+"

    };


    return aliases[level] ||
      level;

  },


  /*
  Converts variants such as A1+, A2_plus and B1+
  to their base CEFR band for attainment checks.
  */

  normalizeBaseLevel(level) {

    const normalized =
      this.normalizeLevel(
        level
      );


    if (!normalized) {
      return null;
    }


    if (
      normalized === "< A1"
    ) {

      return "< A1";

    }


    if (
      normalized.startsWith(
        "B1"
      )
    ) {

      return "B1";

    }


    if (
      normalized.startsWith(
        "A2"
      )
    ) {

      return "A2";

    }


    if (
      normalized.startsWith(
        "A1"
      )
    ) {

      return "A1";

    }


    return null;

  },


  getLevelValue(level) {

    const normalized =
      this.normalizeLevel(
        level
      );


    const values = {

      "< A1": 0,

      "A1": 1,

      "A1+": 1.5,

      "A2": 2,

      "A2+": 2.5,

      "B1": 3,

      "B1+": 3.25

    };


    return (
      Object.prototype
        .hasOwnProperty.call(
          values,
          normalized
        )
    )
      ? values[normalized]
      : null;

  },


  levelFromNumericValue(
    value
  ) {

    if (
      value >= 3.1
    ) {

      return "B1+";

    }


    if (
      value >= 2.75
    ) {

      return "B1";

    }


    if (
      value >= 2.25
    ) {

      return "A2+";

    }


    if (
      value >= 1.75
    ) {

      return "A2";

    }


    if (
      value >= 1.25
    ) {

      return "A1+";

    }


    if (
      value >= 0.75
    ) {

      return "A1";

    }


    return "< A1";

  },


  /*
  ==================================================
  CONCEPT NORMALIZATION
  ==================================================
  */

  normalizeConceptName(
    value
  ) {

    return String(value)

      .trim()

      .toLowerCase()

      .replace(
        /\s+/g,
        "_"
      );

  },


  /*
  ==================================================
  DATE HELPERS
  ==================================================
  */

  getAssessmentTime(
    assessment
  ) {

    const value =
      assessment.completedAt ||
      assessment.savedAt ||
      assessment.migratedAt;


    const time =
      value
        ? new Date(value)
            .getTime()
        : 0;


    return Number.isFinite(
      time
    )
      ? time
      : 0;

  },


  latestDate(
    first,
    second
  ) {

    if (!first) {
      return second || null;
    }


    if (!second) {
      return first;
    }


    return (
      new Date(first).getTime() >=
      new Date(second).getTime()
    )
      ? first
      : second;

  }

};