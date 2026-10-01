const MijnNederlandsAPI = {

  baseURL:
    "https://mijn-nederlands-api.bourzguimehdi.workers.dev",


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
  }

};