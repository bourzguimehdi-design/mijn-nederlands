const SpeakingRecorder = {

  mediaRecorder: null,
  stream: null,
  chunks: [],
  startedAt: null,


  async start() {

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      throw new Error(
        "Microphone recording is not supported in this browser."
      );
    }


    if (
      this.mediaRecorder &&
      this.mediaRecorder.state === "recording"
    ) {
      throw new Error(
        "A recording is already in progress."
      );
    }


    this.stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });


    this.chunks = [];


    const options = {};

    if (
      typeof MediaRecorder !== "undefined" &&
      MediaRecorder.isTypeSupported(
        "audio/webm;codecs=opus"
      )
    ) {
      options.mimeType =
        "audio/webm;codecs=opus";
    }


    this.mediaRecorder =
      new MediaRecorder(
        this.stream,
        options
      );


    this.mediaRecorder.addEventListener(
      "dataavailable",
      event => {

        if (
          event.data &&
          event.data.size > 0
        ) {
          this.chunks.push(
            event.data
          );
        }

      }
    );


    this.startedAt =
      new Date().toISOString();


    this.mediaRecorder.start();


    return {
      startedAt:
        this.startedAt,

      mimeType:
        this.mediaRecorder.mimeType
    };
  },


  stop() {

    return new Promise(
      (resolve, reject) => {

        if (
          !this.mediaRecorder ||
          this.mediaRecorder.state !==
            "recording"
        ) {

          reject(
            new Error(
              "No recording is currently in progress."
            )
          );

          return;
        }


        const recorder =
          this.mediaRecorder;


        recorder.addEventListener(
          "stop",
          () => {

            const mimeType =
              recorder.mimeType ||
              "audio/webm";


            const blob =
              new Blob(
                this.chunks,
                {
                  type: mimeType
                }
              );


            const result = {

              blob,

              mimeType,

              size:
                blob.size,

              startedAt:
                this.startedAt,

              completedAt:
                new Date().toISOString()
            };


            this.stopStream();


            this.mediaRecorder =
              null;

            this.chunks = [];

            this.startedAt =
              null;


            resolve(result);

          },
          {
            once: true
          }
        );


        recorder.stop();
      }
    );
  },


  cancel() {

    if (
      this.mediaRecorder &&
      this.mediaRecorder.state ===
        "recording"
    ) {

      this.mediaRecorder.stop();
    }


    this.stopStream();

    this.mediaRecorder =
      null;

    this.chunks = [];

    this.startedAt =
      null;
  },


  stopStream() {

    if (!this.stream) {
      return;
    }


    this.stream
      .getTracks()
      .forEach(
        track =>
          track.stop()
      );


    this.stream = null;
  },


  isRecording() {

    return Boolean(
      this.mediaRecorder &&
      this.mediaRecorder.state ===
        "recording"
    );
  }

};