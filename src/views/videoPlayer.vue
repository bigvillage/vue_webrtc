<template>
  <Swiper
    ref="swiper"
    :effect="'coverflow'"
    :grabCursor="true"
    :centeredSlides="true"
    :slidesPerView="'auto'"
    :coverflowEffect="{
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }"
    :pagination="{
      clickable: true,
    }"
    :navigation="true"
    :modules="modules"
    :mousewheel="true"
    @slideChange="onSlideChange"
  >
    <SwiperSlide
      ref="swiperSlide"
      class="slide-item"
      v-for="(d, i) in data"
      :key="i"
      :id="'slide-' + i"
      ><img :src="d.url" @click="clickVideo(i)"
    /></SwiperSlide>
  </Swiper>
  <div class="video-container">
    <video
      ref="vj"
      class="video-js vjs-default-skin"
      autoplay
      loop
      muted
      playsinline
    ></video>
  </div>
  <!-- <LiveStreamPlayer /> -->
</template>

<script setup>
// import LiveStreamPlayer from "./LiveStreamPlayer.vue"
import { Swiper, SwiperSlide } from "swiper/vue";

import {
  EffectCoverflow,
  Pagination,
  Mousewheel,
  Keyboard,
  Navigation,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "../assets/style.css";
import { computed, getCurrentInstance, onMounted, ref } from "vue";

// vue내부 컴포넌트 인스턴스에 접근할 수 있음. videojs는 현재 내부컴포넌트에 선언되었기 때문에, getCurrentInstance()로 접근가능.
const { proxy } = getCurrentInstance();

const data = ref([]);
const swiper = ref(null);
const swiperSlide = ref([]);
const findValue = ref(null);
const vj = ref(null);
const player = ref(null);
const sampleData = ref(0);

// 비디오 경로 업데이트(미리보기 화면 업데이트를 위한)
const videoSrc = computed(() => {
  return `http://127.0.0.1:5173/videoTest?params=${sampleData.value}`;
});

const playerOptions = ref({
  autoplay: false,
  controls: true,
  sources: [
    {
      src: videoSrc.value,
      type: "video/mp4",
    },
  ],
  // 재생속도
  playbackRates: [0.5, 1, 1.5, 2],
  width: 640,
  height: 450,
});

// 다른 동영상 선택시 미리보기 화면 업데이트
const updateVideoSource = () => {
  player.value.src({
    src: videoSrc.value,
    type: "video/mp4",
  });
};

// 사진 클릭시 이동
const clickVideo = (i) => {
  document
    .querySelector(
      ".swiper-pagination.swiper-pagination-clickable.swiper-pagination-bullets.swiper-pagination-horizontal"
    )
    .children[i].click();
};

// 키보드로 동영상 제어
document.addEventListener("keydown", (e) => {
  if (e.key == "ArrowLeft") {
    // 왼쪽 키
    // 10초 앞당기기
    const currentTime = player.value.currentTime();
    player.value.currentTime(currentTime - 10);
  } else if (e.key == "ArrowRight") {
    // 오른쪽 키
    // 10초 뒤로가기
    const currentTime = player.value.currentTime();
    player.value.currentTime(currentTime + 10);
  } else if (e.key === " ") {
    // 스페이스바 키
    // 정지면 재생 / 재생이면 정지
    if (player.value.paused()) {
      player.value.play();
    } else {
      player.value.pause();
    }
  } else if (e.key === "ArrowUp") {
    // 위 화살표 키
    // 볼륨up
    const currentVolume = player.value.volume();
    player.value.volume(Math.min(1, currentVolume + 0.1)); // 최대 볼륨은 1로 제한
  } else if (e.key === "ArrowDown") {
    // 아래 화살표 키
    // 볼륨down
    const currentVolume = player.value.volume();
    player.value.volume(Math.max(0, currentVolume - 0.1)); // 최소 볼륨은 0으로 제한
  }
});

// 풀스크린 모드인 경우 포커스를 비디오 플레이어로 이동(1)
function isVideoInFullscreen() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}

// 풀스크린 모드인 경우 포커스를 비디오 플레이어로 이동(2)
function handleFullscreenChange() {
  if (isVideoInFullscreen()) {
    player.value.focus();
  }
}

onMounted(() => {
  // 비디오 객체 player.value에 할당
  player.value = proxy.$videojs(vj.value, playerOptions.value);
  // player.value.hls()
  // 풀스크린 모드인 경우 포커스를 비디오 플레이어로 이동(3)
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  document.addEventListener("MSFullscreenChange", handleFullscreenChange);
  // console.log(window.navigator.userAgent)
  // console.log(window.navigator.platform)
  // router.push(`/videoplayer/${window.navigator.userAgent}`)
  document.querySelector("body").classList.add("videobody");
}),
  (data.value = [
    {
      url: "/src/assets/sample_00.png",
      no: "0",
    },
    {
      url: "/src/assets/sample_01.png",
      no: "1",
    },
    {
      url: "/src/assets/sample_02.png",
      no: "2",
    },
    {
      url: "/src/assets/sample_03.png",
      no: "3",
    },
    {
      url: "/src/assets/sample_04.png",
      no: "4",
    },
    {
      url: "/src/assets/sample_05.png",
      no: "5",
    },
    {
      url: "/src/assets/sample_06.png",
      no: "6",
    },
  ]);
const modules = ref([
  EffectCoverflow,
  Pagination,
  Mousewheel,
  Keyboard,
  Navigation,
]);
const onSlideChange = (swiperInstance) => {
  // console.log("swiperSlide : ", { ...swiperSlide.value })
  // console.log("swiper : ", { ...swiper.value })
  // console.log("swiperInstance : ", swiperInstance.activeIndex)
  sampleData.value = swiperInstance.activeIndex;
  findValue.value = data.value.find((item) => {
    return item.no === swiperInstance.activeIndex.toString();
  });
  updateVideoSource();

  // 100ms 후에 배경 이미지 URL 업데이트
  setTimeout(() => {
    // 뒷배경 바뀌는 곳
    document.body.style.backgroundImage = `url('${findValue.value.url}')`;
    document.body.classList.add("fade-out-background");

    // 배경 이미지가 업데이트된 후에 fade-out 클래스 제거
    setTimeout(() => {
      document.body.classList.remove("fade-out-background");
    }, 0);
  }, 100);
};
</script>
<style>
.videobody {
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  transition:
    background-image 0.5s ease,
    opacity 0.5s ease;
  opacity: 1;
  background-image: url("/src/assets/sample_00.png");
}
</style>
<style scoped>
/* 슬라이드에 대한 스타일 */
.slide-item {
  transition: opacity 0.5s ease; /* opacity 속성에 대한 0.5초 동안의 트랜지션 설정 */
}
.video-container {
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  height: 450px; /* 화면 높이 전체를 차지하도록 설정 */
}
</style>
