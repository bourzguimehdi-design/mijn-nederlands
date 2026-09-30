const AssessmentEngine = {

  levelOrder: [
    "A1",
    "A2",
    "B1"
  ],


  getAccuracy(responses) {

    if (!responses.length) {
      return null;
    }

    const correct =
      responses.filter(
        response =>
          response.correct
      ).length;

    return correct /
      responses.length;
  },


  getSkillLevelResponses(
    responses,
    skill,
    level
  ) {

    return responses.filter(
      response =>
        response.skill === skill &&
        response.level === level
    );
  },


  getLevelPerformance(
    responses,
    skill,
    level
  ) {

    const answers =
      this.getSkillLevelResponses(
        responses,
        skill,
        level
      );

    const accuracy =
      this.getAccuracy(
        answers
      );

    return {

      total:
        answers.length,

      correct:
        answers.filter(
          answer =>
            answer.correct
        ).length,

      accuracy:
        accuracy === null
          ? null
          : Math.round(
              accuracy * 100
            )

    };

  },


  passedLevel(
    responses,
    skill,
    level
  ) {

    const performance =
      this.getLevelPerformance(
        responses,
        skill,
        level
      );

    /*
      We currently require all four
      questions to be answered.

      75% = 3 out of 4 correct.

      Later we can replace this with
      a more sophisticated adaptive
      confidence model.
    */

    if (
      performance.total < 4
    ) {
      return false;
    }

    return (
      performance.accuracy >= 75
    );

  },


  estimateSkillLevel(
    responses,
    skill
  ) {

    const a1 =
      this.getLevelPerformance(
        responses,
        skill,
        "A1"
      );

    const a2 =
      this.getLevelPerformance(
        responses,
        skill,
        "A2"
      );

    const b1 =
      this.getLevelPerformance(
        responses,
        skill,
        "B1"
      );


    const passedA1 =
      this.passedLevel(
        responses,
        skill,
        "A1"
      );


    const passedA2 =
      this.passedLevel(
        responses,
        skill,
        "A2"
      );


    const passedB1 =
      this.passedLevel(
        responses,
        skill,
        "B1"
      );


    if (
      passedA1 &&
      passedA2 &&
      passedB1
    ) {

      return {
        level: "B1+",
        status:
          "B1 demonstrated"
      };

    }


    if (
      passedA1 &&
      passedA2
    ) {

      if (
        b1.total > 0 &&
        b1.accuracy >= 50
      ) {

        return {
          level: "A2+",
          status:
            "Developing B1"
        };

      }

      return {
        level: "A2",
        status:
          "A2 demonstrated"
      };

    }


    if (passedA1) {

      if (
        a2.total > 0 &&
        a2.accuracy >= 50
      ) {

        return {
          level: "A1+",
          status:
            "Developing A2"
        };

      }

      return {
        level: "A1",
        status:
          "A1 demonstrated"
      };

    }


    return {
      level: "< A1",
      status:
        "A1 not yet demonstrated"
    };

  },


  getOverallSkillAccuracy(
    responses,
    skill
  ) {

    const answers =
      responses.filter(
        response =>
          response.skill === skill
      );

    const accuracy =
      this.getAccuracy(
        answers
      );

    if (
      accuracy === null
    ) {
      return null;
    }

    return Math.round(
      accuracy * 100
    );

  },


  findWeakConcepts(
    responses
  ) {

    const concepts = {};


    responses.forEach(
      response => {

        if (
          !concepts[
            response.concept
          ]
        ) {

          concepts[
            response.concept
          ] = {

            concept:
              response.concept,

            topic:
              response.topic,

            skill:
              response.skill,

            level:
              response.level,

            total: 0,

            correct: 0

          };

        }


        concepts[
          response.concept
        ].total++;


        if (
          response.correct
        ) {

          concepts[
            response.concept
          ].correct++;

        }

      }
    );


    return Object
      .values(concepts)

      .map(
        concept => ({

          ...concept,

          accuracy:
            Math.round(
              (
                concept.correct /
                concept.total
              ) * 100
            )

        })
      )

      .filter(
        concept =>
          concept.accuracy < 70
      );

  },


  buildSkillResult(
    responses,
    skill
  ) {

    return {

      estimate:
        this.estimateSkillLevel(
          responses,
          skill
        ),

      overallAccuracy:
        this.getOverallSkillAccuracy(
          responses,
          skill
        ),

      levels: {

        A1:
          this.getLevelPerformance(
            responses,
            skill,
            "A1"
          ),

        A2:
          this.getLevelPerformance(
            responses,
            skill,
            "A2"
          ),

        B1:
          this.getLevelPerformance(
            responses,
            skill,
            "B1"
          )

      }

    };

  },


  generateResult(
    responses
  ) {

    return {

      completedAt:
        new Date()
          .toISOString(),

      skills: {

        grammar:
          this.buildSkillResult(
            responses,
            "grammar"
          ),

        vocabulary:
          this.buildSkillResult(
            responses,
            "vocabulary"
          ),

        reading:
          this.buildSkillResult(
            responses,
            "reading"
          )

      },

      weakConcepts:
        this.findWeakConcepts(
          responses
        ),

      responses

    };

  }

};