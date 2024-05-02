<template>
  <div id="contents">
    <div class="camera">
      <video id="video" ref="video" @canplay="playVideo"></video>
      <button id="startstream" @click="startStreaming">
        Start Streaming
      </button>
      <button id="startstream" @click="stopStreaming">
        Stop Streaming
      </button>
    </div>

    <canvas id="canvas" ref="canvas"></canvas>

    <div class="output">
      <img id="photo" :src="photoSrc" alt="Live Stream" />
    </div>
    <video ref="servervideo"></video>
  </div>
</template>

<script>
export default {
  name: "start-video-practice",
  data() {
    return {
      video: null,
      canvas: null,
      photoSrc: null,
      streaming: false,
      height: 0,
      width: 320,
      websocket: null,
      mediaRecorder: null
    }
  },
  mounted() {
    this.video = this.$refs.video
    this.canvas = this.$refs.canvas
    this.getMediaStream()
    this.websocket = new WebSocket("ws://localhost:3000") // WebSocket 주소를 적절히 변경하세요.

    this.websocket.addEventListener("message", (event) => {
      // 클라이언트에서 수신한 데이터
      const data = event.data

      // Blob으로 변환
      // const blob = new Blob([data], { type: "video/mp4" })

      // Blob URL 생성
      const blobURL = URL.createObjectURL(data)
      this.$store.commit()
      console.log("blobURL: ", blobURL)
      // 비디오 엘리먼트에 Blob URL 설정
      this.$refs.servervideo.src = blobURL
      this.$refs.servervideo.play()
    })
  },
  methods: {
    getMediaStream() {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.video.srcObject = stream
          this.video.play()
        })
        .catch((error) => {
          console.error("Error accessing user media:", error)
        })
    },
    playVideo() {
      if (!this.streaming) {
        this.streaming = true
        this.height =
          (this.video.videoHeight / this.video.videoWidth) *
          this.width
        this.video.height = this.height
        this.video.width = this.width
        this.canvas.height = this.height
        this.canvas.width = this.width
      }
    },
    startStreaming() {
      if (
        this.video &&
        this.websocket &&
        this.websocket.readyState == 1
      ) {
        const stream = this.video.srcObject

        this.websocket.send("startStreaming")

        const mediaRecorder = new MediaRecorder(stream)
        this.mediaRecorder = mediaRecorder

        const recordedChunks = [] // 데이터를 저장할 배열

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            // 데이터가 있을 때만 전송
            this.websocket.send(event.data)
          }
        }

        mediaRecorder.onstop = () => {
          console.log("Media recording stopped.")
          // 마지막으로 녹화된 데이터를 서버로 전송
          const blob = new Blob(recordedChunks, {
            type: "video/webm"
          })
          this.websocket.send(blob)
          recordedChunks.length = 0 // 배열 초기화
        }

        mediaRecorder.onstart = () => {
          console.log("Media recording started.")
          // 비디오 스트리밍을 시작하면서 <video ref="servervideo"></video>에 바로 표시
          this.$refs.servervideo.srcObject = stream
          this.$refs.servervideo.play()
        }

        mediaRecorder.start()
      }
    },
    stopStreaming() {
      if (this.mediaRecorder != null) {
        this.mediaRecorder.stop()
      }
    }
  }
}
</script>
