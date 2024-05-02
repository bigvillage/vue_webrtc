<template>
  <div>
    <video
      ref="liveStream"
      class="video-js vjs-default-skin"
      controls
    ></video>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted } from "vue"
const { proxy } = getCurrentInstance()
// import "videojs-contrib-hls"

// 라이브 스트림 URL 설정
const liveStreamUrl =
  "https://dai.google.com/linear/hls/pb/event/rtcMlf4RTvOEkaudeany5w/stream/daccfb9e-d3a2-42fd-b343-35d38151cf20:SIN2/variant/0849d728086ff6b756408190899fffb5/bandwidth/3395123.m3u8"

// Video.js 플레이어 설정
const liveStreamPlayer = ref(null)
const liveStream = ref(null)

onMounted(() => {
  const options = {
    fluid: true,
    liveui: true,
    sources: [
      {
        src: liveStreamUrl,
        type: "application/x-mpegURL" // HLS 스트림의 MIME 유형
      }
    ],
    width: 300,
    height: 300
  }

  // Video.js 플레이어 초기화
  liveStreamPlayer.value = proxy.$videojs(liveStream.value, options)

  // 재생 시작
  liveStreamPlayer.value.play()
})
</script>
