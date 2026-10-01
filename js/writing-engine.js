const WritingEngine = {

  countWords(text) {

    const cleaned =
      text
        .trim()
        .replace(/\s+/g, " ");

    if (!cleaned) {
      return 0;
    }

    return cleaned
      .split(" ")
      .filter(Boolean)
      .length;
  },


  meetsMinimumLength(
    text,
    minimum
  ) {

    return (
      this.countWords(text) >=
      minimum
    );
  },


  createResponse(
    task,
    text,
    requirementChecks,
    startedAt
  ) {

    const finishedAt =
      new Date();


    const started =
      new Date(startedAt);


    const secondsSpent =
      Math.max(
        0,
        Math.round(
          (
            finishedAt.getTime() -
            started.getTime()
          ) / 1000
        )
      );


    return {

      id: task.id,

      skill: "writing",

      level: task.level,

      category: task.category,

      topic: task.topic,

      concept: task.concept,

      text: text.trim(),

      wordCount:
        this.countWords(text),

      minimumWords:
        task.minWords,

      meetsMinimumLength:
        this.meetsMinimumLength(
          text,
          task.minWords
        ),

      requirementChecks,

      selfReportedRequirementsMet:
        requirementChecks.filter(
          item => item.checked
        ).length,

      totalRequirements:
        requirementChecks.length,

      secondsSpent,

      startedAt:
        started.toISOString(),

      completedAt:
        finishedAt.toISOString(),

      evaluation: {
        status: "pending",
        cefrLevel: null,
        feedback: null
      }

    };
  }

};