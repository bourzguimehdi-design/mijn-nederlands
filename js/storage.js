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

      PROGRESS_KEY:
    "mijnNederlandsProgress",

  PROGRESS_HISTORY_KEY:
    "mijnNederlandsProgressHistory",

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
  PROGRESS SNAPSHOTS
  ==================================================

  ProgressEngine calculates learner progress.

  Storage only persists snapshots of that calculated
  progress so that development over time can be
  compared later.

  A snapshot should normally be saved after meaningful
  learner activity such as:

  - placement assessment
  - writing assessment
  - speaking assessment
  - practice session
  ==================================================
  */

  saveProgressSnapshot(progress) {

    if (!progress) {

      console.warn(
        "No progress snapshot supplied."
      );

      return null;

    }


    const generatedAt =
      progress.generatedAt ||
      new Date().toISOString();


    const savedAt =
      new Date().toISOString();


    const savedSnapshot = {

      ...progress,

      generatedAt,

      savedAt

    };


    /*
    ------------------------------------------
    LOAD HISTORY
    ------------------------------------------
    */

    const history =
      this.getProgressHistory();


    /*
    ------------------------------------------
    PREVENT EXACT DUPLICATES
    ------------------------------------------

    generatedAt identifies one ProgressEngine
    calculation.

    This prevents accidentally saving the exact
    same calculated snapshot twice.
    ------------------------------------------
    */

    const alreadyExists =
      history.some(
        item =>
          item.generatedAt ===
          savedSnapshot.generatedAt
      );


    if (!alreadyExists) {

      history.push(
        savedSnapshot
      );

    }


    /*
    ------------------------------------------
    KEEP CHRONOLOGICAL ORDER
    ------------------------------------------
    */

    history.sort(
      (a, b) =>
        this.getResultTime(a) -
        this.getResultTime(b)
    );


    /*
    ------------------------------------------
    SAVE HISTORY
    ------------------------------------------
    */

    localStorage.setItem(
      this.PROGRESS_HISTORY_KEY,
      JSON.stringify(history)
    );


    /*
    ------------------------------------------
    SAVE LATEST SNAPSHOT
    ------------------------------------------
    */

    localStorage.setItem(
      this.PROGRESS_KEY,
      JSON.stringify(savedSnapshot)
    );


    return savedSnapshot;

  },


  getProgressSnapshot() {

    /*
    Prefer the latest history item.

    This keeps the latest snapshot and history
    consistent even if old application versions
    stored data differently.
    */

    const history =
      this.getProgressHistory();


    if (history.length > 0) {

      return history[
        history.length - 1
      ];

    }


    try {

      const stored =
        localStorage.getItem(
          this.PROGRESS_KEY
        );


      return stored
        ? JSON.parse(stored)
        : null;


    } catch (error) {

      console.warn(
        "Could not read progress snapshot.",
        error
      );


      return null;

    }

  },


  getProgressHistory() {

    try {

      const stored =
        localStorage.getItem(
          this.PROGRESS_HISTORY_KEY
        );


      if (!stored) {

        return [];

      }


      const history =
        JSON.parse(stored);


      if (!Array.isArray(history)) {

        return [];

      }


      /*
      Always expose progress history in
      chronological order.
      */

      return history
        .slice()
        .sort(
          (a, b) =>
            this.getResultTime(a) -
            this.getResultTime(b)
        );


    } catch (error) {

      console.warn(
        "Could not read progress history.",
        error
      );


      return [];

    }

  },


  getLatestProgressSnapshot() {

    const history =
      this.getProgressHistory();


    if (history.length > 0) {

      return history[
        history.length - 1
      ];

    }


    return this.getProgressSnapshot();

  },


  getPreviousProgressSnapshots() {

    return this
      .getProgressHistory()
      .slice()
      .reverse();

  },


  clearProgressSnapshot() {

    localStorage.removeItem(
      this.PROGRESS_KEY
    );

  },


  clearAllProgressData() {

    localStorage.removeItem(
      this.PROGRESS_KEY
    );


    localStorage.removeItem(
      this.PROGRESS_HISTORY_KEY
    );

  },
  /*
  ==================================================
  SHARED HELPERS
  ==================================================
  */

    getResultTime(result) {

    if (!result) {
      return 0;
    }


    const value =
      result.completedAt ||
      result.generatedAt ||
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