<template>
  <div>
    <video
      ref="videoElement"
      width="500"
      height="500"
      controls
      playsinline="true"
    ></video>
  </div>
</template>

<script>
import axios from "axios"; // Axios를 import
import Hls from "hls.js";

export default {
  mounted() {
    const videoElement = this.$refs.videoElement;

    axios
      .get("https://local.jaehwan.co.kr/vue3node/getVideoData")
      .then((response) => {
        const videoData = response.data;

        // Hls.js가 지원되는지 확인
        if (Hls.isSupported()) {
          // Hls 인스턴스를 생성하고 비디오 소스를 로드
          const hls = new Hls();
          hls.loadSource(videoData.url);

          // 비디오 엘리먼트에 Hls 인스턴스를 연결
          hls.attachMedia(videoElement);

          // Hls의 MANIFEST_PARSED 이벤트를 처리하여 비디오를 재생
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.play();
          });
        } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
          // 브라우저에서 HLS를 지원하지 않는 경우, 비디오 엘리먼트의 src를 설정하고 재생
          videoElement.src = videoData.url;
          videoElement.addEventListener("loadedmetadata", () => {
            videoElement.play();
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching video data:", error);
      });
  },
};
</script>
