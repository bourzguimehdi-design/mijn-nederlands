/*
==================================================
MIJN NEDERLANDS
API
==================================================
*/

const MijnNederlandsAPI = {

  baseURL:
    "https://mijn-nederlands-api.bourzguimehdi.workers.dev",


  /*
  ==================================================
  WRITING EVALUATION
  ==================================================
  */

  async evaluateWriting(task, text) {

    const response =
      await fetch(
        `${this.baseURL}/evaluate-writing`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            taskId:
              task.id,

            level:
              task.level,

            situation:
              task.situation,

            instruction:
              task.instruction,

            requirements:
              task.requirements,

            text

          })
        }
      );


    let data;


    try {

      data =
        await response.json();

    } catch (error) {

      throw new Error(
        "The server returned an invalid response."
      );

    }


    if (!response.ok) {

      console.error(
        "Writing evaluation failed:",
        data
      );


      throw new Error(
        data.message ||
        data.error ||
        "Writing evaluation failed."
      );

    }


    if (
      data.status !== "success" ||
      !data.evaluation
    ) {

      throw new Error(
        "The evaluation response was incomplete."
      );

    }


    return data;
  },


  /*
  ==================================================
  SPEAKING TRANSCRIPTION
  ==================================================
  */

  async transcribeSpeaking(recording) {

    /*
    Accept either:
      - the complete result returned by
        SpeakingRecorder.stop()

      OR:
      - a Blob directly
    */

    const audio =
      recording instanceof Blob
        ? recording
        : recording?.blob;


    if (!(audio instanceof Blob)) {

      throw new Error(
        "A valid speaking recording is required."
      );

    }


    if (audio.size === 0) {

      throw new Error(
        "The speaking recording is empty."
      );

    }


    const formData =
      new FormData();


    /*
    Determine a suitable filename.
    */

    let extension = "webm";


    if (
      audio.type.includes("ogg")
    ) {

      extension = "ogg";

    } else if (
      audio.type.includes("mp4")
    ) {

      extension = "mp4";

    } else if (
      audio.type.includes("mpeg")
    ) {

      extension = "mp3";

    } else if (
      audio.type.includes("wav")
    ) {

      extension = "wav";

    }


    formData.append(
      "audio",
      audio,
      `speaking.${extension}`
    );


    let response;


    try {

      response =
        await fetch(
          `${this.baseURL}/transcribe-speaking`,
          {
            method: "POST",
            body: formData
          }
        );

    } catch (error) {

      console.error(
        "Speaking transcription network error:",
        error
      );


      throw new Error(
        "Could not connect to the speaking transcription service."
      );

    }


    let data;


    try {

      data =
        await response.json();

    } catch (error) {

      throw new Error(
        "The transcription server returned an invalid response."
      );

    }


    if (!response.ok) {

      console.error(
        "Speaking transcription failed:",
        data
      );


      throw new Error(
        data.message ||
        data.error ||
        "Speaking transcription failed."
      );

    }


    if (
      data.status !== "success" ||
      typeof data.transcript !==
        "string"
    ) {

      console.error(
        "Incomplete transcription response:",
        data
      );


      throw new Error(
        "The transcription response was incomplete."
      );

    }


    return data;
  },


  /*
  ==================================================
  SPEAKING EVALUATION
  ==================================================
  */

  async evaluateSpeaking(
    task,
    transcript
  ) {

    /*
    ------------------------------------------
    CLIENT VALIDATION
    ------------------------------------------
    */

    if (
      !task ||
      !task.id ||
      !task.level
    ) {

      throw new Error(
        "A valid speaking task is required."
      );

    }


    if (
      typeof transcript !==
      "string"
    ) {

      throw new Error(
        "A speaking transcript is required."
      );

    }


    const cleanedTranscript =
      transcript.trim();


    /*
    An empty transcript is still useful
    assessment evidence.

    For example, the learner may have
    attempted the recording but produced
    no usable speech.

    Therefore we send it to the evaluator
    rather than rejecting it here.
    */


    let response;


    try {

      response =
        await fetch(
          `${this.baseURL}/evaluate-speaking`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              taskId:
                task.id,

              level:
                task.level,

              situation:
                task.situation,

              instruction:
                task.instruction,

              requirements:
                task.requirements,

              transcript:
                cleanedTranscript

            })
          }
        );

    } catch (error) {

      console.error(
        "Speaking evaluation network error:",
        error
      );


      throw new Error(
        "Could not connect to the speaking evaluation service."
      );

    }


    let data;


    try {

      data =
        await response.json();

    } catch (error) {

      throw new Error(
        "The speaking evaluation server returned an invalid response."
      );

    }


    if (!response.ok) {

      console.error(
        "Speaking evaluation failed:",
        data
      );


      throw new Error(
        data.message ||
        data.error ||
        "Speaking evaluation failed."
      );

    }


    if (
      data.status !== "success" ||
      !data.evaluation
    ) {

      console.error(
        "Incomplete speaking evaluation response:",
        data
      );


      throw new Error(
        "The speaking evaluation response was incomplete."
      );

    }


    return data;
  },

/*
==================================================
PRACTICE ANSWER EVALUATION
==================================================
*/

async evaluatePracticeAnswer(
  session,
  exercise,
  learnerAnswer
) {

  if (
    !session ||
    !session.concept ||
    !session.level
  ) {
    throw new Error(
      "A valid practice session is required."
    );
  }


  if (!exercise) {
    throw new Error(
      "A valid practice exercise is required."
    );
  }


  if (
    typeof learnerAnswer !== "string"
  ) {
    throw new Error(
      "A learner answer is required."
    );
  }


  const cleanedAnswer =
    learnerAnswer.trim();


  let response;


  try {

    response =
      await fetch(
        `${this.baseURL}/practice/evaluate`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            concept:
              session.concept,

            level:
              session.level,

            exerciseType:
              exercise.type ||
              "short_answer",

            instruction:
              exercise.instruction ||
              "",

            prompt:
              exercise.prompt ||
              "",

            expectedAnswer:
              exercise.expectedAnswer ||
              "",

            learnerAnswer:
              cleanedAnswer

          })

        }
      );

  } catch (error) {

    console.error(
      "Practice evaluation network error:",
      error
    );

    throw new Error(
      "Could not connect to the practice evaluation service."
    );

  }


  let data;


  try {

    data =
      await response.json();

  } catch (error) {

    throw new Error(
      "The practice evaluation server returned an invalid response."
    );

  }


  if (!response.ok) {

    console.error(
      "Practice evaluation failed:",
      data
    );

    throw new Error(
      data.message ||
      data.error ||
      "Practice evaluation failed."
    );

  }


  if (
    data.status !== "success" ||
    !data.evaluation ||
    typeof data.evaluation
      .targetConceptCorrect !==
      "boolean" ||
    typeof data.evaluation
      .overallCorrect !==
      "boolean"
  ) {

    console.error(
      "Incomplete practice evaluation response:",
      data
    );

    throw new Error(
      "The practice evaluation response was incomplete."
    );

  }


  return data;

},
  /*
  ==================================================
  PERSONALIZED PRACTICE GENERATION
  ==================================================
  */

  async generatePractice(session) {

    /*
    ------------------------------------------
    CLIENT VALIDATION
    ------------------------------------------
    */

    if (
      !session ||
      !session.concept ||
      !session.level
    ) {

      throw new Error(
        "A valid practice session is required."
      );

    }


    const concept =
      String(
        session.concept
      ).trim();


    const level =
      String(
        session.level
      ).trim();


    const minutes =
      Number.isFinite(
        session.minutes
      )
        ? session.minutes
        : 10;


    if (!concept) {

      throw new Error(
        "A practice concept is required."
      );

    }


    if (!level) {

      throw new Error(
        "A practice level is required."
      );

    }


    /*
    ------------------------------------------
    REQUEST
    ------------------------------------------
    */

    let response;


    try {

      response =
        await fetch(
          `${this.baseURL}/practice/generate`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              concept,

              level,

              minutes,

              weakness:
                session.weakness ||
                null

            })
          }
        );

    } catch (error) {

      console.error(
        "Practice generation network error:",
        error
      );


      throw new Error(
        "Could not connect to the practice generation service."
      );

    }


    /*
    ------------------------------------------
    RESPONSE
    ------------------------------------------
    */

    let data;


    try {

      data =
        await response.json();

    } catch (error) {

      throw new Error(
        "The practice server returned an invalid response."
      );

    }


    if (!response.ok) {

      console.error(
        "Practice generation failed:",
        data
      );


      throw new Error(
        data.message ||
        data.error ||
        "Practice generation failed."
      );

    }


    /*
    We deliberately require a success status.

    The exact generated-practice payload will
    be validated more strictly once the Worker
    endpoint has been implemented.
    */

    if (
      data.status !== "success"
    ) {

      console.error(
        "Incomplete practice generation response:",
        data
      );


      throw new Error(
        "The practice generation response was incomplete."
      );

    }


    return data;
  }

};