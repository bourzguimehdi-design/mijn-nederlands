/*
==================================================
MIJN NEDERLANDS
STORAGE
==================================================
*/

const Storage = {

  PLACEMENT_KEY:
    "mijnNederlandsPlacement",

  PLACEMENT_HISTORY_KEY:
    "mijnNederlandsPlacementHistory",

  WRITING_KEY:
    "mijnNederlandsWritingAssessment",

  WRITING_HISTORY_KEY:
    "mijnNederlandsWritingHistory",

  SPEAKING_KEY:
    "mijnNederlandsSpeakingAssessment",

  SPEAKING_HISTORY_KEY:
    "mijnNederlandsSpeakingHistory",

  PRACTICE_KEY:
    "mijnNederlandsPracticeResult",

  PRACTICE_HISTORY_KEY:
    "mijnNederlandsPracticeHistory",


  /*
  ==================================================
  PLACEMENT
  ==================================================
  */

  savePlacementResult(result) {

    if (!result) {
      console.warn(
        "No placement result supplied."
      );
      return;
    }


    const savedResult = {
      ...result,
      savedAt:
        new Date().toISOString()
    };


    localStorage.setItem(
      this.PLACEMENT_KEY,
      JSON.stringify(savedResult)
    );


    const history =
      this.getPlacementHistory();


    const alreadyExists =
      history.some(
        item =>
          item.completedAt &&
          savedResult.completedAt &&
          item.completedAt ===
            savedResult.completedAt
      );


    if (!alreadyExists) {
      history.push(savedResult);
    }


    history.sort(
      (a, b) =>
        this.getResultTime(a) -
        this.getResultTime(b)
    );


    localStorage.setItem(
      this.PLACEMENT_HISTORY_KEY,
      JSON.stringify(history)
    );


    return savedResult;
  },


  getPlacementResult() {

    const history =
      this.getPlacementHistory();


    if (history.length > 0) {

      return history[
        history.length - 1
      ];
    }


    try {

      const result =
        localStorage.getItem(
          this.PLACEMENT_KEY
        );


      return result
        ? JSON.parse(result)
        : null;

    } catch (error) {

      console.warn(
        "Could not read placement result.",
        error
      );


      return null;
    }
  },


  getPlacementHistory() {

    try {

      const saved =
        localStorage.getItem(
          this.PLACEMENT_HISTORY_KEY
        );


      if (!saved) {
        return [];
      }


      const history =
        JSON.parse(saved);


      return Array.isArray(history)
        ? history
        : [];

    } catch (error) {

      console.warn(
        "Could not read placement history.",
        error
      );


      return [];
    }
  },


  getPreviousPlacementResults() {

    return this
      .getPlacementHistory()
      .slice()
      .reverse();
  },


  clearPlacementResult() {

    localStorage.removeItem(
      this.PLACEMENT_KEY
    );
  },


  clearAllPlacementData() {

    localStorage.removeItem(
      this.PLACEMENT_KEY
    );

    localStorage.removeItem(
      this.PLACEMENT_HISTORY_KEY
    );
  },


  migrateLegacyPlacementResult() {

    const history =
      this.getPlacementHistory();


    if (history.length > 0) {
      return false;
    }


    let legacy = null;


    try {

      const saved =
        localStorage.getItem(
          this.PLACEMENT_KEY
        );


      legacy =
        saved
          ? JSON.parse(saved)
          : null;

    } catch (error) {

      legacy = null;
    }


    if (!legacy) {
      return false;
    }


    if (
      !legacy.skills ||
      !legacy.responses
    ) {
      return false;
    }


    const migrated = {

      ...legacy,

      migratedAt:
        new Date().toISOString(),

      savedAt:
        legacy.savedAt ||
        legacy.completedAt ||
        new Date().toISOString()

    };


    localStorage.setItem(
      this.PLACEMENT_HISTORY_KEY,
      JSON.stringify([migrated])
    );


    return true;
  },


  /*
  ==================================================
  WRITING
  ==================================================
  */

  saveWritingAssessment(result) {

    if (!result) {

      console.warn(
        "No writing assessment supplied."
      );

      return;
    }


    const completedAt =
      result.completedAt ||
      new Date().toISOString();


    const savedResult = {

      ...result,

      completedAt,

      savedAt:
        new Date().toISOString()

    };


    const history =
      this.getWritingHistory();


    const alreadyExists =
      history.some(
        item =>
          item.completedAt ===
          savedResult.completedAt
      );


    if (!alreadyExists) {
      history.push(savedResult);
    }


    history.sort(
      (a, b) =>
        this.getResultTime(a) -
        this.getResultTime(b)
    );


    localStorage.setItem(
      this.WRITING_HISTORY_KEY,
      JSON.stringify(history)
    );


    localStorage.setItem(
      this.WRITING_KEY,
      JSON.stringify(savedResult)
    );


    return savedResult;
  },


  getWritingAssessment() {

    try {

      const result =
        localStorage.getItem(
          this.WRITING_KEY
        );


      return result
        ? JSON.parse(result)
        : null;

    } catch (error) {

      console.warn(
        "Could not read writing assessment.",
        error
      );


      return null;
    }
  },


  getWritingHistory() {

    try {

      const stored =
        localStorage.getItem(
          this.WRITING_HISTORY_KEY
        );


      if (!stored) {
        return [];
      }


      const history =
        JSON.parse(stored);


      return Array.isArray(history)
        ? history
        : [];

    } catch (error) {

      console.warn(
        "Could not read writing history.",
        error
      );


      return [];
    }
  },


  getLatestWritingAssessment() {

    const history =
      this.getWritingHistory();


    if (history.length > 0) {

      return history[
        history.length - 1
      ];
    }


    return this.getWritingAssessment();
  },


  /*
  ==================================================
  SPEAKING
  ==================================================
  */

  saveSpeakingAssessment(result) {

    if (!result) {

      console.warn(
        "No speaking assessment supplied."
      );

      return;
    }


    const completedAt =
      result.completedAt ||
      new Date().toISOString();


    const savedResult = {

      ...result,

      completedAt,

      savedAt:
        new Date().toISOString()

    };


    const history =
      this.getSpeakingHistory();


    /*
    Prevent the same completed assessment
    from being inserted twice.
    */

    const alreadyExists =
      history.some(
        item =>
          item.completedAt ===
          savedResult.completedAt
      );


    if (!alreadyExists) {
      history.push(savedResult);
    }


    history.sort(
      (a, b) =>
        this.getResultTime(a) -
        this.getResultTime(b)
    );


    /*
    Save permanent speaking history.
    */

    localStorage.setItem(
      this.SPEAKING_HISTORY_KEY,
      JSON.stringify(history)
    );


    /*
    Keep latest speaking result separately.
    */

    localStorage.setItem(
      this.SPEAKING_KEY,
      JSON.stringify(savedResult)
    );


    return savedResult;
  },


  getSpeakingAssessment() {

    try {

      const result =
        localStorage.getItem(
          this.SPEAKING_KEY
        );


      return result
        ? JSON.parse(result)
        : null;

    } catch (error) {

      console.warn(
        "Could not read speaking assessment.",
        error
      );


      return null;
    }
  },


  getSpeakingHistory() {

    try {

      const stored =
        localStorage.getItem(
          this.SPEAKING_HISTORY_KEY
        );


      if (!stored) {
        return [];
      }


      const history =
        JSON.parse(stored);


      return Array.isArray(history)
        ? history
        : [];

    } catch (error) {

      console.warn(
        "Could not read speaking history.",
        error
      );


      return [];
    }
  },


  getLatestSpeakingAssessment() {

    const history =
      this.getSpeakingHistory();


    if (history.length > 0) {

      return history[
        history.length - 1
      ];
    }


    return this.getSpeakingAssessment();
  },


  /*
  ==================================================
  PRACTICE
  ==================================================
  */

  savePracticeResult(result) {

    if (!result) {

      console.warn(
        "No practice result supplied."
      );

      return;
    }


    const completedAt =
      result.completedAt ||
      new Date().toISOString();


    const total =
      Number(
        result.total || 0
      );


    const correct =
      Number(
        result.correct || 0
      );


    const score =
      total > 0
        ? Math.round(
            (correct / total) * 100
          )
        : 0;


    const savedResult = {

      ...result,

      correct,

      total,

      score,

      completedAt,

      savedAt:
        new Date().toISOString()

    };


    const history =
      this.getPracticeHistory();


    /*
    Prevent the same practice session
    from being inserted twice.

    Prefer the session ID if available.
    Otherwise use completedAt.
    */

    const alreadyExists =
      history.some(
        item => {

          if (
            savedResult.id &&
            item.id
          ) {

            return (
              item.id ===
              savedResult.id
            );
          }


          return (
            item.completedAt ===
            savedResult.completedAt
          );

        }
      );


    if (!alreadyExists) {

      history.push(
        savedResult
      );

    }


    history.sort(
      (a, b) =>
        this.getResultTime(a) -
        this.getResultTime(b)
    );


    /*
    Save permanent practice history.
    */

    localStorage.setItem(
      this.PRACTICE_HISTORY_KEY,
      JSON.stringify(history)
    );


    /*
    Keep latest practice result separately.
    */

    localStorage.setItem(
      this.PRACTICE_KEY,
      JSON.stringify(savedResult)
    );


    return savedResult;
  },


  getPracticeResult() {

    try {

      const result =
        localStorage.getItem(
          this.PRACTICE_KEY
        );


      return result
        ? JSON.parse(result)
        : null;

    } catch (error) {

      console.warn(
        "Could not read practice result.",
        error
      );


      return null;
    }
  },


  getPracticeHistory() {

    try {

      const stored =
        localStorage.getItem(
          this.PRACTICE_HISTORY_KEY
        );


      if (!stored) {
        return [];
      }


      const history =
        JSON.parse(stored);


      return Array.isArray(history)
        ? history
        : [];

    } catch (error) {

      console.warn(
        "Could not read practice history.",
        error
      );


      return [];
    }
  },


  getLatestPracticeResult() {

    const history =
      this.getPracticeHistory();


    if (history.length > 0) {

      return history[
        history.length - 1
      ];
    }


    return this.getPracticeResult();
  },


  getPracticeResultsForConcept(
    concept
  ) {

    if (!concept) {
      return [];
    }


    return this
      .getPracticeHistory()
      .filter(
        result =>
          result.concept === concept
      );
  },


  /*
  ==================================================
  SHARED HELPERS
  ==================================================
  */

  getResultTime(result) {

    const value =
      result.completedAt ||
      result.savedAt ||
      result.migratedAt;


    const time =
      value
        ? new Date(value).getTime()
        : 0;


    return Number.isFinite(time)
      ? time
      : 0;
  }

};


/*
==================================================
AUTOMATIC LEGACY PLACEMENT MIGRATION
==================================================
*/

Storage.migrateLegacyPlacementResult();