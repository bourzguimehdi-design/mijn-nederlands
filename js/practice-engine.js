/*
==================================================
MIJN NEDERLANDS
PRACTICE ENGINE
==================================================

Creates personalized practice sessions from
the learner's current profile and study plan.

This engine is for LEARNING/PRACTICE.

It is deliberately separate from:
- placement assessment
- writing assessment
- speaking assessment
==================================================
*/


const PracticeEngine = {

  /*
  ==================================================
  SESSION CREATION
  ==================================================
  */

  createConceptSession(
    concept,
    profile,
    options = {}
  ) {

    const normalizedConcept =
      String(concept || "")
        .trim()
        .toLowerCase();


    if (!normalizedConcept) {
      throw new Error(
        "PracticeEngine requires a concept."
      );
    }


    const minutes =
      Number.isFinite(options.minutes)
        ? options.minutes
        : 10;


    const level =
      this.getPracticeLevel(
        profile,
        normalizedConcept
      );


    const weakness =
      this.findWeakness(
        profile,
        normalizedConcept
      );


    return {

      id:
        this.createSessionId(
          normalizedConcept
        ),

      type:
        "concept_practice",

      concept:
        normalizedConcept,

      title:
        this.formatConcept(
          normalizedConcept
        ),

      level,

      minutes,

      createdAt:
        new Date().toISOString(),

      status:
        "ready",

      source:
        weakness
          ? "learner_profile"
          : "study_plan",

      weakness:
        weakness || null,

      activities:
        this.createConceptActivities(
          normalizedConcept,
          level,
          weakness,
          minutes
        )

    };
  },


  /*
  ==================================================
  ACTIVITY GENERATION
  ==================================================
  */

  createConceptActivities(
    concept,
    level,
    weakness,
    minutes
  ) {

    /*
    For now this creates the STRUCTURE of a
    practice session.

    Later these activity objects will contain
    real generated questions/exercises.
    */

    const activities = [];


    activities.push({

      id:
        `${concept}_learn`,

      type:
        "explanation",

      concept,

      level,

      minutes:
        Math.min(
          2,
          minutes
        ),

      title:
        `Learn ${this.formatConcept(concept)}`

    });


    activities.push({

      id:
        `${concept}_guided`,

      type:
        "guided_practice",

      concept,

      level,

      minutes:
        Math.max(
          2,
          Math.round(
            minutes * 0.4
          )
        ),

      title:
        "Guided practice"

    });


    activities.push({

      id:
        `${concept}_independent`,

      type:
        "independent_practice",

      concept,

      level,

      minutes:
        Math.max(
          2,
          minutes -
          activities.reduce(
            (sum, activity) =>
              sum + activity.minutes,
            0
          )
        ),

      title:
        "Try it yourself"

    });


    return activities;
  },


  /*
  ==================================================
  PRACTICE LEVEL
  ==================================================
  */

  getPracticeLevel(
    profile,
    concept
  ) {

    /*
    Concept weaknesses currently come mainly
    from productive language evidence.

    Writing is therefore the safest starting
    level for concept remediation.

    Later we can make this concept-specific.
    */

    const writing =
      profile?.skills?.writing;


    if (
      writing?.assessed &&
      writing.level
    ) {
      return writing.level;
    }


    const grammar =
      profile?.skills?.grammar;


    if (
      grammar?.assessed &&
      grammar.level
    ) {
      return grammar.level;
    }


    return "A1";
  },


  /*
  ==================================================
  WEAKNESS LOOKUP
  ==================================================
  */

  findWeakness(
    profile,
    concept
  ) {

    const weaknesses =
      profile?.weaknesses;


    if (
      !Array.isArray(weaknesses)
    ) {
      return null;
    }


    return (
      weaknesses.find(
        weakness =>
          this.normalizeConcept(
            weakness?.concept
          ) ===
          this.normalizeConcept(
            concept
          )
      ) ||
      null
    );
  },


  /*
  ==================================================
  HELPERS
  ==================================================
  */

  normalizeConcept(value) {

    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
  },


  formatConcept(concept) {

    return String(concept || "")
      .replace(/_/g, " ")
      .replace(
        /\b\w/g,
        character =>
          character.toUpperCase()
      );
  },


  createSessionId(concept) {

    return [
      "practice",
      concept,
      Date.now()
    ].join("_");
  }

};