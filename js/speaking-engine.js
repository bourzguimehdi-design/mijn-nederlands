const SpeakingEngine = {

  createResponse(
    task,
    transcript,
    startedAt,
    options = {}
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


    const cleanedTranscript =
      String(
        transcript || ""
      ).trim();


    return {

      id: task.id,

      skill: "speaking",

      level: task.level,

      category: task.category,

      topic: task.topic,

      concept: task.concept,

      transcript:
        cleanedTranscript,

      wordCount:
        this.countWords(
          cleanedTranscript
        ),

      skipped:
        options.skipped === true,

      skipReason:
        options.skipReason || null,

      secondsSpent,

      startedAt:
        started.toISOString(),

      completedAt:
        finishedAt.toISOString(),

      evaluation: {
        status: "pending",
        estimatedPerformance: null,
        scores: null,
        strengths: [],
        improvements: [],
        weakConcepts: []
      }

    };
  },


  createSkippedResponse(
    task,
    startedAt,
    reason = "learner_could_not_answer"
  ) {

    return this.createResponse(
      task,
      "",
      startedAt,
      {
        skipped: true,
        skipReason: reason
      }
    );
  },


  countWords(text) {

    const cleaned =
      String(
        text || ""
      )
        .trim()
        .replace(
          /\s+/g,
          " "
        );


    if (!cleaned) {
      return 0;
    }


    return cleaned
      .split(" ")
      .filter(Boolean)
      .length;
  }

};