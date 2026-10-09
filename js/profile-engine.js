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
  ==================================================
  PRESERVE CONCEPT METADATA
  ==================================================

  Concept evidence is rebuilt during refresh.

  However, some concept properties describe the
  learner's evolving curriculum rather than raw
  assessment evidence.

  These must survive a refresh:

  - origin
  - label
  - category
  - discoveryCount
  - discoveredAt
  - promoted
  - promotedAt
  - learningTopic
  ==================================================
  */

  const previousConcepts =
    profile.concepts &&
    typeof profile.concepts === "object"

      ? profile.concepts

      : {};


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


  /*
  Evidence importers still receive a clean concept
  collection.

  Persistent discovery metadata is restored after
  all evidence has been imported.
  */

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


  /*
  ==================================================
  IMPORT EVIDENCE
  ==================================================
  */

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
  RESTORE DISCOVERY METADATA
  ==================================================

  Match old and newly rebuilt concepts by normalized
  concept name.

  This preserves curriculum/discovery state without
  preserving stale evidence counters.
  ==================================================
  */

  Object.entries(
    previousConcepts
  )
    .forEach(
      ([rawName, previous]) => {

        if (!previous) {

          return;

        }


        const name =
          this.normalizeConceptName(
            previous.name ||
            previous.concept ||
            rawName
          );


        if (!name) {

          return;

        }

/*
==================================================
APPLY CURRICULUM METADATA
==================================================

Evidence is rebuilt on every refresh, while
curriculum placement describes the concept itself.

Apply known curriculum metadata after discovery
metadata has been restored so both built-in and
promoted discovered concepts receive their
skill / CEFR classification.
==================================================
*/

Object.values(
  profile.concepts
)
  .forEach(
    concept => {

      if (!concept) {
        return;
      }


      const curriculum =
        this.getConceptCurriculumMetadata(
          concept.name ||
          concept.concept
        );


      if (!curriculum) {
        return;
      }


      if (curriculum.skill) {

        concept.skill =
          curriculum.skill;

      }


      if (curriculum.cefrLevel) {

        concept.cefrLevel =
          curriculum.cefrLevel;

      }

    }
  );
        /*
        ------------------------------------------
        CONCEPT NO LONGER CREATED BY IMPORTERS
        ------------------------------------------

        Discovered concepts may exist only in the
        persistent learner profile.

        Preserve them so refresh does not erase
        learner-specific topics.
        ------------------------------------------
        */

        if (
  !profile.concepts[
    name
  ]
) {

  /*
  ==================================================
  RESTORE GENUINELY DISCOVERED CONCEPTS
  ==================================================

  Do not trust previous.origin by itself.

  Older versions of the profile engine could mark
  assessment concepts as "discovered".

  A concept is restored only when it contains real
  discovery evidence.
  */

  const hasDiscoveryEvidence =
    Number(
      previous.discoveryCount ||
      0
    ) > 0 ||
    Boolean(
      previous.discoveredAt
    );


  if (
    hasDiscoveryEvidence
  ) {

    profile.concepts[
      name
    ] = {

      ...previous,

      name,

      origin:
        "discovered"

    };

  }


  return;

}


const current =
  profile.concepts[
    name
  ];
        /*
        ------------------------------------------
        BUILT-IN CONCEPT
        ------------------------------------------
        */

        if (
          this.isBuiltInConcept(
            name
          )
        ) {

          current.origin =
            "built_in";

          current.label =
            null;

          current.category =
            null;

          current.discoveryCount =
            0;

          current.discoveredAt =
            null;

          current.promoted =
            false;

          current.promotedAt =
            null;

          current.learningTopic =
            true;


          return;

        }


        /*
        ------------------------------------------
        DISCOVERED CONCEPT
        ------------------------------------------
        */

        if (
          previous.origin ===
            "discovered"
        ) {

          current.origin =
            "discovered";


          current.label =
            previous.label ||
            current.label ||
            this.formatConceptName?.(
              name
            ) ||
            name;


          current.category =
            previous.category ||
            current.category ||
            "language";


          current.discoveryCount =
  Math.max(
    Number(
      previous.discoveryCount ||
      0
    ),
    Number(
      current.discoveryCount ||
      0
    )
  );


          current.discoveredAt =
            previous.discoveredAt ||
            current.discoveredAt ||
            null;


          current.promoted =
            previous.promoted ===
            true;


          current.promotedAt =
            previous.promotedAt ||
            null;


          current.learningTopic =
            previous.learningTopic ===
            true;

        }

      }
    );


  /*
  ==================================================
  CLASSIFY NEW CONCEPTS
  ==================================================

  Anything rebuilt from evidence that did not have
  previous discovery metadata still needs a valid
  origin.

  Only concepts in the explicit built-in registry
  are marked built_in.

  Everything else is learner-discovered.
  ==================================================
  */

  Object.values(
    profile.concepts
  )
    .forEach(
      concept => {

        const name =
          this.normalizeConceptName(
            concept.name ||
            concept.concept
          );


        concept.name =
          name;


        if (
          this.isBuiltInConcept(
            name
          )
        ) {

          concept.origin =
            "built_in";


          if (
            concept.label ===
            undefined
          ) {

            concept.label =
              null;

          }


          if (
            concept.category ===
            undefined
          ) {

            concept.category =
              null;

          }


          if (
            concept.discoveryCount ===
            undefined
          ) {

            concept.discoveryCount =
              0;

          }


          if (
            concept.discoveredAt ===
            undefined
          ) {

            concept.discoveredAt =
              null;

          }


          concept.learningTopic =
            true;

        }

        else {

  /*
  ==================================================
  NON-BUILT-IN CONCEPT
  ==================================================

  A non-built-in concept is not automatically an
  AI-discovered learning topic.

  Only concepts carrying genuine discovery evidence
  enter the discovery/promotion pipeline.

  Other concepts can still exist as useful assessment
  evidence without becoming curriculum topics.
  ==================================================
  */

  const hasDiscoveryEvidence =
  Number(
    concept.discoveryCount ||
    0
  ) > 0 ||
  Boolean(
    concept.discoveredAt
  );

  if (
    hasDiscoveryEvidence
  ) {

    concept.origin =
      "discovered";

  }

  else {

    concept.origin =
      "assessment";

  }


          if (
            !concept.label
          ) {

            concept.label =
              String(
                name
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


          if (
            !concept.category
          ) {

            concept.category =
              "language";

          }


          if (
            concept.discoveryCount ===
            undefined
          ) {

            concept.discoveryCount =
              0;

          }


          if (
            concept.discoveredAt ===
            undefined
          ) {

            concept.discoveredAt =
              null;

          }


          if (
            concept.promoted ===
            undefined
          ) {

            concept.promoted =
              false;

          }


          if (
            concept.promotedAt ===
            undefined
          ) {

            concept.promotedAt =
              null;

          }


          if (
            concept.learningTopic ===
            undefined
          ) {

            concept.learningTopic =
              false;

          }

        }

      }
    );

/*
==================================================
PROMOTE ELIGIBLE DISCOVERED CONCEPTS
==================================================

Discovery evidence has now been imported and
persistent discovery metadata has been restored.

Promote any discovered concepts that have gathered
enough genuine evidence to enter the learner's
active curriculum.
*/

this.promoteEligibleDiscoveredConcepts(
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
  ==================================================
  */

  Object.values(
    profile.concepts
  )
    .forEach(
      concept => {

        concept.mastery =
          this.calculateConceptMastery(
            concept
          );

      }
    );


  /*
  ==================================================
  CONFIDENCE
  ==================================================
  */

  this.calculateConfidence(
    profile
  );


  /*
  ==================================================
  SAVE
  ==================================================
  */

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


        const isBuiltIn =
          this.isBuiltInConcept(
            name
          );


        /*
        ==================================================
        DISCOVERY METADATA
        ==================================================

        Do not manufacture a discovery count here.

        recordWritingLearningEvidence() is responsible
        for counting genuine AI observations.

        This importer only transfers that stored evidence
        into the rebuilt learner profile.
        ==================================================
        */

        const storedDiscoveryCount =
          isBuiltIn

            ? 0

            : Number(
                evidence
                  .discoveryCount ||
                0
              );


        const concept =
          this.ensureConcept(
            profile,
            name,
            {
              origin:
                isBuiltIn
                  ? "built_in"
                  : "discovered",

              label:
                isBuiltIn
                  ? null
                  : (
                      evidence.label ||
                      rawName
                    ),

              category:
                isBuiltIn
                  ? null
                  : (
                      evidence.category ||
                      "language"
                    ),

              discoveryCount:
                storedDiscoveryCount,

              discoveredAt:
                isBuiltIn
                  ? null
                  : (
                      evidence
                        .discoveredAt ||
                      null
                    ),

              promoted:
                isBuiltIn
                  ? false
                  : (
                      evidence
                        .promoted ===
                      true
                    ),

              promotedAt:
                isBuiltIn
                  ? null
                  : (
                      evidence
                        .promotedAt ||
                      null
                    ),

              learningTopic:
                isBuiltIn
                  ? true
                  : (
                      evidence
                        .learningTopic ===
                      true
                    )
            }
          );


        /*
        ==================================================
        WRITING EVIDENCE
        ==================================================
        */

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


        /*
        ==================================================
        DISCOVERY STATE
        ==================================================
        */

        if (
          !isBuiltIn
        ) {

          concept.origin =
            "discovered";


          concept.discoveryCount =
            storedDiscoveryCount;


          concept.discoveredAt =
            evidence
              .discoveredAt ||
            concept.discoveredAt ||
            null;


          concept.promoted =
            evidence
              .promoted ===
            true;


          concept.promotedAt =
            evidence
              .promotedAt ||
            concept.promotedAt ||
            null;


          concept.learningTopic =
            concept.promoted ===
            true;

        }

        else {

          concept.origin =
            "built_in";


          concept.discoveryCount =
            0;


          concept.learningTopic =
            true;

        }


        /*
        ==================================================
        LAST SEEN
        ==================================================
        */

        concept.lastSeen =
          this.latestDate(
            concept.lastSeen,
            evidence.lastSeen
          );


        /*
        ==================================================
        SOURCE
        ==================================================
        */

        if (
          !concept.sources.includes(
            "writing"
          )
        ) {

          concept.sources.push(
            "writing"
          );

        }


        /*
        ==================================================
        MASTERY
        ==================================================
        */

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


      /*
      Skill practice has no target concept.

      Its secondary concept evidence is still
      useful, so do not discard the whole
      session merely because session.concept
      is null.
      */

      const targetName =
        rawTargetConcept
          ? this.normalizeConceptName(
              rawTargetConcept
            )
          : null;


      const targetConcept =
        targetName
          ? this.ensureConcept(
              profile,
              targetName,
              {
                origin:
                  this.isBuiltInConcept(
                    targetName
                  )
                    ? "built_in"
                    : "discovered"
              }
            )
          : null;


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
      ==================================================
      TARGET CONCEPT SESSION STATE
      ==================================================
      */

      if (
        targetConcept &&
        sessionTime &&
        (
          !targetConcept.lastPracticeAt ||
          new Date(
            sessionTime
          ).getTime() >
            new Date(
              targetConcept.lastPracticeAt
            ).getTime()
        )
      ) {

        targetConcept.lastPracticeAt =
          sessionTime;

        targetConcept
          .recentPracticeSuccesses =
            0;

        targetConcept
          .recentPracticeFailures =
            0;

      }


      if (
        targetConcept &&
        !targetConcept.sources.includes(
          "practice"
        )
      ) {

        targetConcept.sources.push(
          "practice"
        );

      }


      if (
        targetConcept &&
        sessionTime
      ) {

        targetConcept.lastSeen =
          this.latestDate(
            targetConcept.lastSeen,
            sessionTime
          );

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


          /*
          ==================================================
          TARGET CONCEPT RESULT
          ==================================================
          */

          if (
            targetConcept
          ) {

            targetConcept.encounters +=
              1;


            const targetCorrect =
              typeof answer
                .targetConceptCorrect ===
                "boolean"

                ? answer
                    .targetConceptCorrect

                : answer.correct ===
                    true;


            if (
              targetCorrect
            ) {

              targetConcept
                .practiceSuccesses +=
                  1;

            } else {

              targetConcept
                .practiceFailures +=
                  1;

            }


            /*
            ------------------------------------------
            RECENT PRACTICE SIGNAL
            ------------------------------------------
            */

            if (
              sessionTime &&
              targetConcept.lastPracticeAt &&
              sessionTime ===
                targetConcept.lastPracticeAt
            ) {

              if (
                targetCorrect
              ) {

                targetConcept
                  .recentPracticeSuccesses +=
                    1;

              } else {

                targetConcept
                  .recentPracticeFailures +=
                    1;

              }

            }

          }


          /*
          ==================================================
          SECONDARY CONCEPT EVIDENCE
          ==================================================

          New evaluator:
              answer.concepts[]

          Legacy evaluator:
              answer.errorConcept

          Both are supported.

          These are supporting practice signals,
          not formal assessment errors.
          ==================================================
          */
/*
==================================================
SECONDARY ERROR EVIDENCE
==================================================

Only an explicit errorConcept represents a
secondary mistake.

answer.concepts[] describes concepts involved
in the exercise. A concept being present there
does NOT mean the learner made an error in it.

Example:

target = vocabulary_choice
concepts = ["vocabulary_choice", "spelling"]
correct = true
errorConcept = "none"

This must NOT create a spelling error.
==================================================
*/

const rawErrorConcept =
  answer.errorConcept;


if (
  typeof rawErrorConcept !==
    "string" ||
  !rawErrorConcept.trim() ||
  rawErrorConcept ===
    "none"
) {

  return;

}


const errorName =
  this.normalizeConceptName(
    rawErrorConcept
  );


if (
  !errorName ||
  errorName === targetName
) {

  return;

}


const isBuiltIn =
  this.isBuiltInConcept(
    errorName
  );


const errorConcept =
  this.ensureConcept(
    profile,
    errorName,
    {
      origin:
        isBuiltIn
          ? "built_in"
          : "discovered",

      label:
        isBuiltIn
          ? null
          : errorName,

      category:
        isBuiltIn
          ? null
          : "language"
    }
  );


/*
Secondary mistakes discovered during practice
are supporting practice evidence.

They do not modify formal assessment error
counters.
*/

errorConcept.encounters +=
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


if (
  sessionTime
) {

  errorConcept.lastSeen =
    this.latestDate(
      errorConcept.lastSeen,
      sessionTime
    );

}


errorConcept.mastery =
  this.calculateConceptMastery(
    errorConcept
  );

        }
      );


      /*
      Recalculate target mastery after all
      answers in this session have been
      imported.
      */

      if (
        targetConcept
      ) {

        targetConcept.mastery =
          this.calculateConceptMastery(
            targetConcept
          );

      }

    }
  );

},
  /*
  ==================================================
  CONCEPT MODEL
  ==================================================
  */
CONCEPT_CATALOG: {

  spelling: {
    label: "Spelling",
    skill: "writing",
    level: "A1"
  },

  articles: {
    label: "Articles",
    skill: "grammar",
    level: "A1"
  },

  word_order: {
    label: "Word order",
    skill: "grammar",
    level: "A1"
  },

  verb_conjugation: {
    label: "Verb conjugation",
    skill: "grammar",
    level: "A1"
  },

  perfect_tense: {
    label: "Perfect tense",
    skill: "grammar",
    level: "A2"
  },

  modal_verbs: {
    label: "Modal verbs",
    skill: "grammar",
    level: "A2"
  },

  prepositions: {
    label: "Prepositions",
    skill: "grammar",
    level: "A2"
  },

  adjective_endings: {
    label: "Adjective endings",
    skill: "grammar",
    level: "A2"
  },

  vocabulary_choice: {
    label: "Vocabulary choice",
    skill: "vocabulary",
    level: "A2"
  },

  inversion: {
    label: "Inversion",
    skill: "grammar",
    level: "B1"
  }

},

getConceptCurriculumMetadata(
  name
) {

  const normalized =
    this.normalizeConceptName(
      name
    );


  /*
  ==================================================
  CONCEPT CURRICULUM MAP
  ==================================================

  This describes where a concept belongs in the
  learning curriculum.

  It is independent from learner mastery.

  Unknown discovered concepts deliberately return
  null metadata until they are classified.
  ==================================================
  */

  const curriculum = {

    spelling: {
      skill: "writing",
      cefrLevel: "A1"
    },

    articles: {
      skill: "grammar",
      cefrLevel: "A1"
    },

    word_order: {
      skill: "grammar",
      cefrLevel: "A1"
    },

    verb_conjugation: {
      skill: "grammar",
      cefrLevel: "A1"
    },

    perfect_tense: {
      skill: "grammar",
      cefrLevel: "A2"
    },

    modal_verbs: {
      skill: "grammar",
      cefrLevel: "A2"
    },

    prepositions: {
      skill: "grammar",
      cefrLevel: "A2"
    },

    adjective_endings: {
      skill: "grammar",
      cefrLevel: "A2"
    },

    vocabulary_choice: {
      skill: "vocabulary",
      cefrLevel: "A2"
    },

    inversion: {
      skill: "grammar",
      cefrLevel: "B1"
    },


    /*
    Promoted discovered concepts can also be
    classified here.

    Their origin remains "discovered".
    */

    separable_verbs: {
      skill: "grammar",
      cefrLevel: "A2"
    }

  };


  return (
    curriculum[
      normalized
    ] || {
      skill: null,
      cefrLevel: null
    }
  );

},

isBuiltInConcept(
  name
) {

  const normalized =
    this.normalizeConceptName(
      name
    );


  return Boolean(
    this.CONCEPT_CATALOG[
      normalized
    ]
  );

},

/*
==================================================
DISCOVERED CONCEPT STATUS
==================================================

A concept discovered by AI does not immediately
become part of the learner's curriculum.

Lifecycle:

discovered
    ↓
candidate
    ↓
promoted

Built-in concepts are always considered active.
==================================================
*/

getDiscoveredConceptStatus(
  concept
) {

  if (!concept) {

    return "unknown";

  }


  /*
  ------------------------------------------
  BUILT-IN CONCEPT
  ------------------------------------------
  */

  if (
    concept.origin === "built_in" ||
    this.isBuiltInConcept(
      concept.name ||
      concept.concept
    )
  ) {

    return "built_in";

  }


  /*
  ------------------------------------------
  ALREADY PROMOTED
  ------------------------------------------
  */

  if (
    concept.promoted === true
  ) {

    return "promoted";

  }


  const discoveryCount =
    Number(
      concept.discoveryCount ||
      0
    );


  const encounters =
    Number(
      concept.encounters ||
      concept.writingEncounters ||
      0
    );


  const errors =
    Number(
      concept.errors ||
      concept.writingErrors ||
      0
    );


  /*
  ------------------------------------------
  CANDIDATE
  ------------------------------------------

  Two pieces of evidence are enough for the
  concept to become a serious candidate.

  It is still NOT part of the normal curriculum.
  ------------------------------------------
  */

  if (
    discoveryCount >= 2 ||
    errors >= 2 ||
    encounters >= 2
  ) {

    return "candidate";

  }


  return "discovered";

},


/*
==================================================
CHECK WHETHER DISCOVERED CONCEPT CAN BE PROMOTED
==================================================
*/

shouldPromoteDiscoveredConcept(
  concept
) {

  if (!concept) {

    return false;

  }


  /*
  Built-in concepts do not need promotion.
  */

  if (
    concept.origin === "built_in" ||
    this.isBuiltInConcept(
      concept.name ||
      concept.concept
    )
  ) {

    return false;

  }


  /*
  Do not promote twice.
  */

  if (
    concept.promoted === true
  ) {

    return false;

  }


  const discoveryCount =
    Number(
      concept.discoveryCount ||
      0
    );


  const errors =
    Number(
      concept.errors ||
      concept.writingErrors ||
      0
    );


  const priorityCount =
    Number(
      concept.priorityCount ||
      0
    );


  const majorErrors =
    Number(
      concept.majorErrors ||
      0
    );


  const moderateErrors =
    Number(
      concept.moderateErrors ||
      0
    );


  /*
  ==================================================
  PROMOTION RULES
  ==================================================

  Normal path:
      3+ genuine observations.

  Strong-error path:
      2+ observations AND either:
      - repeated priority signal
      - major error
      - repeated moderate errors

  This keeps one isolated AI label from becoming
  a permanent learning topic.
  ==================================================
  */

  if (
    discoveryCount >= 3
  ) {

    return true;

  }


  if (
    discoveryCount >= 2 &&
    (
      priorityCount >= 2 ||
      majorErrors >= 1 ||
      moderateErrors >= 2 ||
      errors >= 3
    )
  ) {

    return true;

  }


  return false;

},


/*
==================================================
PROMOTE DISCOVERED CONCEPT
==================================================
*/

promoteDiscoveredConcept(
  concept
) {

  if (
    !this.shouldPromoteDiscoveredConcept(
      concept
    )
  ) {

    return false;

  }


  const now =
    new Date()
      .toISOString();


  concept.promoted =
    true;


  concept.promotedAt =
    now;


  concept.learningTopic =
    true;


  /*
  Preserve origin.

  "discovered" tells us where the concept came from.
  "promoted" tells us whether it entered the
  learner's active curriculum.
  */

  if (
    !concept.origin
  ) {

    concept.origin =
      "discovered";

  }


  /*
  Give newly promoted concepts a mastery value
  if they do not have one yet.
  */

  if (
    concept.mastery === null ||
    concept.mastery === undefined
  ) {

    concept.mastery =
      this.calculateConceptMastery(
        concept
      );

  }

  /*
==================================================
CURRICULUM METADATA
==================================================

Promotion makes the discovered concept part of
the learner's active curriculum.

If we know where this concept belongs, attach
that metadata now.
*/

const curriculum =
  this.getConceptCurriculumMetadata(
    concept.name ||
    concept.concept
  );


if (curriculum) {

  if (curriculum.skill) {

    concept.skill =
      curriculum.skill;

  }


  if (curriculum.cefrLevel) {

    concept.cefrLevel =
      curriculum.cefrLevel;

  }

}

  return true;

},


/*
==================================================
PROMOTE ELIGIBLE DISCOVERED CONCEPTS
==================================================

Runs across the learner profile.

Returns the concepts that were promoted during
this pass.
==================================================
*/

promoteEligibleDiscoveredConcepts(
  profile
) {

  if (
    !profile ||
    !profile.concepts
  ) {

    return [];

  }


  const promoted = [];


  Object.values(
    profile.concepts
  )
    .forEach(
      concept => {

        if (
          this.promoteDiscoveredConcept(
            concept
          )
        ) {

          promoted.push(
            concept
          );

        }

      }
    );


  return promoted;

},

  ensureConcept(
  profile,
  name,
  options = {}
) {

  /*
  ==================================================
  NORMALIZE
  ==================================================
  */

  const normalizedName =
    this.normalizeConceptName(
      name
    );


  if (!normalizedName) {

    return null;

  }


  /*
  ==================================================
  CREATE CONCEPT
  ==================================================
  */

  if (
    !profile.concepts[
      normalizedName
    ]
  ) {

    profile.concepts[
      normalizedName
    ] = {

      name:
        normalizedName,


      /*
      ------------------------------------------
      DISCOVERY METADATA
      ------------------------------------------
      */

      origin:
        options.origin ||
        "built_in",

      label:
        options.label ||
        null,

      category:
        options.category ||
        null,
skill:
  this.CONCEPT_CATALOG[
    normalizedName
  ]?.skill ||
  options.skill ||
  null,

cefrLevel:
  this.CONCEPT_CATALOG[
    normalizedName
  ]?.level ||
  options.cefrLevel ||
  null,

      discoveryCount:
        options.discoveryCount ||
        0,

      discoveredAt:
        options.origin ===
        "discovered"

          ? new Date()
              .toISOString()

          : null,


      /*
      ------------------------------------------
      ASSESSMENT EVIDENCE
      ------------------------------------------
      */

      encounters: 0,

      errors: 0,

      minorErrors: 0,

      moderateErrors: 0,

      majorErrors: 0,

      priorityCount: 0,


      /*
      ------------------------------------------
      PRACTICE EVIDENCE
      ------------------------------------------
      */

      practiceSuccesses: 0,

      practiceFailures: 0,

      practiceSecondaryErrors: 0,

      lastPracticeAt: null,

      recentPracticeSuccesses: 0,

      recentPracticeFailures: 0,


      /*
      ------------------------------------------
      LEARNING STATE
      ------------------------------------------
      */

      mastery: null,

      lastSeen: null,

      sources: []

    };

  }


  /*
  ==================================================
  BACKWARD-COMPATIBLE METADATA
  ==================================================

  Existing learner profiles were created before
  concept discovery metadata existed.

  Add missing fields without deleting any
  existing evidence.
  */

  const concept =
    profile.concepts[
      normalizedName
    ];


  if (
    concept.origin ===
    undefined
  ) {

    concept.origin =
      options.origin ||
      "built_in";

  }


  if (
    concept.label ===
    undefined
  ) {

    concept.label =
      options.label ||
      null;

  }


  if (
    concept.category ===
    undefined
  ) {

    concept.category =
      options.category ||
      null;

  }
if (
  concept.skill ===
  undefined
) {

  concept.skill =
    this.CONCEPT_CATALOG[
      normalizedName
    ]?.skill ||
    options.skill ||
    null;

}


if (
  concept.cefrLevel ===
  undefined
) {

  concept.cefrLevel =
    this.CONCEPT_CATALOG[
      normalizedName
    ]?.level ||
    options.cefrLevel ||
    null;

}

  if (
    concept.discoveryCount ===
    undefined
  ) {

    concept.discoveryCount = 0;

  }


  if (
    concept.discoveredAt ===
    undefined
  ) {

    concept.discoveredAt = null;

  }


  return concept;

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
  FORMAL ASSESSMENT MASTERY
  ==================================================

  Formal assessment evidence remains the main
  measure of demonstrated proficiency.

  Practice can show recovery, but it should not
  erase an assessment weakness after one lesson.
  ==================================================
  */

  const minorErrors =
    Number(
      concept.minorErrors ||
      0
    );

  const moderateErrors =
    Number(
      concept.moderateErrors ||
      0
    );

  const majorErrors =
    Number(
      concept.majorErrors ||
      0
    );


  const weightedErrors =
    (
      minorErrors * 1
    ) +
    (
      moderateErrors * 2
    ) +
    (
      majorErrors * 3
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
  PRACTICE EVIDENCE
  ==================================================

  Practice is supporting evidence.

  Successful practice can recover part of the
  assessment penalty, but cannot simply add points
  beyond what there is to recover.

  Failures can lower mastery because they provide
  evidence that the weakness is still active.
  ==================================================
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


  const totalPractice =
    practiceSuccesses +
    practiceFailures;


  let practiceRecovery = 0;


  if (
    totalPractice > 0 &&
    penalty > 0
  ) {

    const practiceAccuracy =
      practiceSuccesses /
      totalPractice;


    /*
    At most, accumulated practice can recover
    40% of the formal assessment penalty.

    The evidence strength grows gradually and
    reaches full strength after 16 attempts.
    */

    const evidenceStrength =
      Math.min(
        1,
        totalPractice / 16
      );


    practiceRecovery =
      penalty *
      0.4 *
      practiceAccuracy *
      evidenceStrength;

  }


  /*
  ==================================================
  RECENT PRACTICE RECOVERY
  ==================================================

  The latest session tells us whether the learner
  appears to be recovering now.

  It can recover another part of the assessment
  penalty, but only when enough recent evidence
  exists.

  This is intentionally smaller than the old
  +10 bonus and is tied directly to the existing
  assessment penalty.
  ==================================================
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


  let recentRecovery = 0;


  if (
    recentAttempts >= 5 &&
    penalty > 0
  ) {

    const recentAccuracy =
      recentSuccesses /
      recentAttempts;


    if (
      recentAccuracy >= 0.8
    ) {

      /*
      Scale recovery from 0 at 80% accuracy
      to full recovery strength at 100%.
      */

      const recoveryStrength =
        Math.min(
          1,
          Math.max(
            0,
            (
              recentAccuracy -
              0.8
            ) / 0.2
          )
        );


      recentRecovery =
        penalty *
        0.2 *
        recoveryStrength;

    }

  }


  /*
  ==================================================
  PRACTICE FAILURE PENALTY
  ==================================================

  Practice failures are useful evidence that the
  concept is still unstable.

  Keep this modest because practice is a learning
  environment, not a formal assessment.
  ==================================================
  */

  const practiceFailurePenalty =
    Math.min(
      10,
      practiceFailures * 1.5
    );


  /*
  ==================================================
  FINAL MASTERY
  ==================================================

  Assessment establishes the baseline.

  Practice can recover part of an existing
  assessment penalty.

  Practice cannot manufacture mastery above the
  assessment ceiling simply by accumulating easy
  successful exercises.
  ==================================================
  */

  const mastery =
    baseMastery +
    practiceRecovery +
    recentRecovery -
    practiceFailurePenalty;


  return Math.round(
    Math.max(
      20,
      Math.min(
        100,
        mastery
      )
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

    .map(
      concept => {

        const priorityScore =
          this.getConceptPriorityScore(
            concept
          );


        const readinessMultiplier =
          this.getConceptReadinessMultiplier(
            concept,
            current
          );


        return {

          concept,

          effectivePriority:
            priorityScore *
            readinessMultiplier

        };

      }
    )

    .sort(
      (a, b) =>
        b.effectivePriority -
        a.effectivePriority
    )

    .slice(
      0,
      limit
    )

    .map(
      item =>
        item.concept
    );

},


  /*
  ==================================================
  PRIORITY SCORE
  ==================================================
  */
getConceptReadinessMultiplier(
  concept,
  profile
) {

  /*
  ==================================================
  CEFR READINESS
  ==================================================

  Concept priority represents learning need.

  CEFR readiness adjusts that need according to
  whether the concept is appropriate for the
  learner's current level in the relevant skill.

  It must NOT modify mastery or assessment evidence.
  */


  if (
    !concept ||
    !profile
  ) {

    return 1;

  }


  const skillName =
    concept.skill;


  const conceptLevel =
    concept.cefrLevel;


  /*
  Discovered/unclassified concepts currently have
  no reliable curriculum metadata.

  Leave their priority unchanged.
  */

  if (
    !skillName ||
    !conceptLevel
  ) {

    return 1;

  }


  const skill =
    profile.skills?.[
      skillName
    ];


  /*
  If the relevant skill has not been assessed,
  do not make assumptions about readiness.
  */

  if (
    !skill ||
    !skill.assessed ||
    !skill.level
  ) {

    return 1;

  }


  const learnerValue =
    this.getLevelValue(
      skill.level
    );


  const conceptValue =
    this.getLevelValue(
      conceptLevel
    );


  if (
    learnerValue === null ||
    conceptValue === null
  ) {

    return 1;

  }


  const difference =
    conceptValue -
    learnerValue;


  /*
  Concept is at or below the learner's current
  level: fully appropriate.
  */

  if (
    difference <= 0
  ) {

    return 1;

  }


  /*
  Up to half a CEFR step ahead is useful stretch
  material.
  */

  if (
    difference <= 0.5
  ) {

    return 0.9;

  }


  /*
  One full level ahead may still appear when the
  underlying evidence is strong, but it should not
  dominate current-level weaknesses.
  */

  if (
    difference <= 1
  ) {

    return 0.6;

  }


  /*
  Material substantially beyond the learner's
  current skill level is strongly deferred rather
  than completely hidden.
  */

  return 0.3;

},

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

  /*
  ==================================================
  BASIC NORMALIZATION
  ==================================================
  */

  let name =
    String(
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


  /*
  ==================================================
  KNOWN CONCEPT ALIASES
  ==================================================

  AI feedback may describe the same learning
  concept using slightly different names.

  Map common variants to one canonical concept
  so the learner profile does not fragment.
  */

  const aliases = {

    /*
    SPELLING
    */

    spelling_error:
      "spelling",

    spelling_errors:
      "spelling",


    /*
    ARTICLES
    */

    article:
      "articles",

    article_usage:
      "articles",

    dutch_articles:
      "articles",

    de_het:
      "articles",

    de_het_articles:
      "articles",


    /*
WORD ORDER
*/

sentence_order:
  "word_order",

dutch_word_order:
  "word_order",

    /*
    VERB CONJUGATION
    */

    verb_conjugation_error:
      "verb_conjugation",

    verb_conjugations:
      "verb_conjugation",

    conjugation:
      "verb_conjugation",


    /*
    PERFECT TENSE
    */

    perfect:
      "perfect_tense",

    perfectum:
      "perfect_tense",

    present_perfect:
      "perfect_tense",


    /*
    MODAL VERBS
    */

    modal_verb:
      "modal_verbs",

    modals:
      "modal_verbs",


    /*
    PREPOSITIONS
    */

    preposition:
      "prepositions",

    preposition_usage:
      "prepositions",


    /*
    ADJECTIVES
    */

    adjective:
      "adjective_endings",

    adjectives:
      "adjective_endings",

    adjective_ending:
      "adjective_endings",


    /*
    VOCABULARY
    */

    vocabulary:
      "vocabulary_choice",

    word_choice:
      "vocabulary_choice",

    vocabulary_error:
      "vocabulary_choice",

    lexical_choice:
      "vocabulary_choice",


    /*
    INVERSION
    */

    dutch_inversion:
      "inversion"

  };


  if (
    aliases[name]
  ) {

    name =
      aliases[name];

  }


  return name;

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