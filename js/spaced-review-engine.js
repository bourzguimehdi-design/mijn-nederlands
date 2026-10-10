
/*
==================================================
MIJN NEDERLANDS
SPACED REVIEW ENGINE
==================================================
*/

const SpacedReviewEngine = {

  STORAGE_KEY: "mijn_nederlands_spaced_reviews_v1",

  INTERVALS: [1, 3, 7, 14],

  /*
  ==================================================
  NORMALIZE CONCEPT
  ==================================================
  */

  normalizeConcept(concept) {
    if (typeof concept !== "string") {
      return null;
    }

    if (
      typeof ErrorLessonEngine !== "undefined" &&
      typeof ErrorLessonEngine.normalizeConcept === "function"
    ) {
      return ErrorLessonEngine.normalizeConcept(concept);
    }

    return (
      concept
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_") || null
    );
  },

  isMetaConcept(concept) {
    return (
      typeof ErrorLessonEngine !== "undefined" &&
      ErrorLessonEngine.META_CONCEPTS?.has(concept)
    ) || false;
  },

  /*
  ==================================================
  DATE HELPERS
  ==================================================
  */

  getDateKey(date = new Date()) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  },

  addDays(date, days) {
    const result = new Date(date);

    result.setHours(12, 0, 0, 0);
    result.setDate(result.getDate() + days);

    return this.getDateKey(result);
  },

  /*
  ==================================================
  STORAGE
  ==================================================
  */

  load() {
    try {
      const data = JSON.parse(
        localStorage.getItem(this.STORAGE_KEY) || "{}"
      );

      return (
        data &&
        typeof data === "object" &&
        !Array.isArray(data)
      ) ? data : {};

    } catch (error) {
      console.error(
        "Could not load spaced reviews:",
        error
      );

      return {};
    }
  },

  save(reviews) {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(reviews)
    );
  },

  /*
  ==================================================
  GET DUE REVIEWS
  ==================================================
  */

  getDueReviews(date = new Date()) {
    const today = this.getDateKey(date);

    return Object.values(this.load())
      .filter(item =>
        item &&
        item.concept &&
        item.nextReviewDate &&
        item.nextReviewDate <= today
      )
      .sort((a, b) =>
        a.nextReviewDate.localeCompare(
          b.nextReviewDate
        )
      );
  },

  /*
  ==================================================
  REGISTER NEW MISTAKES
  ==================================================

  Called after ordinary practice is saved.

  Incorrect answers create or reset concept
  review schedules.

  Correct answers do not advance reviews.
  ==================================================
  */

  registerMistakes(result, date = new Date()) {
    if (
      !result?.id ||
      !Array.isArray(result.answers)
    ) {
      return 0;
    }

    const reviews = this.load();
    const concepts = new Set();

    result.answers
      .filter(answer => answer.correct === false)
      .forEach(answer => {
        const tags = Array.isArray(answer.concepts)
          ? answer.concepts
          : [];

        tags.forEach(tag => {
          const concept = this.normalizeConcept(tag);

          if (
            concept &&
            !this.isMetaConcept(concept)
          ) {
            concepts.add(concept);
          }
        });
      });

    // Fallback for exercises without concept tags.
    if (
      concepts.size === 0 &&
      result.answers.some(
        answer => answer.correct === false
      )
    ) {
      const fallback = this.normalizeConcept(
        result.concept
      );

      if (
        fallback &&
        !this.isMetaConcept(fallback)
      ) {
        concepts.add(fallback);
      }
    }

    let updated = 0;

    concepts.forEach(concept => {
      const existing = reviews[concept];

      if (
        existing?.processedResultIds?.includes(
          result.id
        )
      ) {
        return;
      }

      reviews[concept] = {
        ...existing,
        concept,
        stage: 0,
        nextReviewDate: this.addDays(date, 1),
        lastMistakeAt: date.toISOString(),
        processedResultIds: [
          ...(existing?.processedResultIds || []),
          result.id
        ]
      };

      updated++;
    });

    if (updated > 0) {
      this.save(reviews);
    }

    return updated;
  },

  /*
  ==================================================
  COMPLETE SCHEDULED REVIEW
  ==================================================

  Only call this after a scheduled review
  has been completed and saved.

  Success advances the interval.
  Failure resets it to one day.
  ==================================================
  */

  completeReview({
    concept,
    correct,
    resultId,
    date = new Date()
  }) {
    const key = this.normalizeConcept(concept);

    if (
      !key ||
      !resultId ||
      typeof correct !== "boolean"
    ) {
      return false;
    }

    const reviews = this.load();
    const existing = reviews[key];

    // Do not create a review from a success.
    if (!existing) {
      return false;
    }

    if (
      existing.processedResultIds?.includes(
        resultId
      )
    ) {
      return false;
    }

    const previousStage =
      Number(existing.stage) || 0;

    const stage = correct
      ? Math.min(
          previousStage + 1,
          this.INTERVALS.length - 1
        )
      : 0;

    reviews[key] = {
      ...existing,
      stage,
      nextReviewDate: this.addDays(
        date,
        this.INTERVALS[stage]
      ),
      lastReviewedAt: date.toISOString(),
      processedResultIds: [
        ...(existing.processedResultIds || []),
        resultId
      ]
    };

    this.save(reviews);

    return true;
  },

  /*
  ==================================================
  INITIALIZE FROM HISTORICAL PRACTICE
  ==================================================

  Import concepts with at least 3 historical
  mistakes.

  Latest answer incorrect: review in 1 day.
  Latest answer correct: review in 3 days.

  Existing review schedules are preserved.
  ==================================================
  */

  initializeFromHistory(
    history,
    date = new Date()
  ) {
    if (!Array.isArray(history)) {
      return 0;
    }

    const reviews = this.load();
    const concepts = new Map();

    const sortedHistory = [...history].sort(
      (a, b) =>
        new Date(a.completedAt) -
        new Date(b.completedAt)
    );

    sortedHistory.forEach(result => {
      const answers = Array.isArray(result.answers)
        ? result.answers
        : [];

      answers.forEach(answer => {
        const tags = Array.isArray(answer.concepts)
          ? answer.concepts
          : [];

        const labels = tags.length
          ? tags
          : result.concept
            ? [result.concept]
            : [];

        const normalized = new Set(
          labels
            .map(label =>
              this.normalizeConcept(label)
            )
            .filter(Boolean)
        );

        normalized.forEach(concept => {
          if (this.isMetaConcept(concept)) {
            return;
          }

          const item = concepts.get(concept) || {
            concept,
            mistakes: 0,
            latestCorrect: null,
            lastPracticedAt: null
          };

          if (answer.correct === false) {
            item.mistakes++;
          }

          if (
            typeof answer.correct === "boolean"
          ) {
            item.latestCorrect = answer.correct;
          }

          item.lastPracticedAt =
            result.completedAt || null;

          concepts.set(concept, item);
        });
      });
    });

    let imported = 0;

    // Prevent old history from overwriting
    // existing review progress.
    concepts.forEach(item => {
      if (item.mistakes < 3) {
        return;
      }

      if (reviews[item.concept]) {
        return;
      }

      const interval =
        item.latestCorrect === false ? 1 : 3;

      reviews[item.concept] = {
        concept: item.concept,
        stage: 0,
        nextReviewDate: this.addDays(
          date,
          interval
        ),
        importedFromHistory: true,
        historicalMistakes: item.mistakes,
        lastPracticedAt: item.lastPracticedAt,
        processedResultIds: sortedHistory
          .filter(result => result.id)
          .map(result => result.id)
      };

      imported++;
    });

    if (imported > 0) {
      this.save(reviews);
    }

    return imported;
  }

};
