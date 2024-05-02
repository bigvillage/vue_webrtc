<template>
  <HeaderView />
  <div class="body_section">
    <!-- <VideoPlayer /> -->
  </div>
</template>
<script setup>
// import VideoPlayer from "@/views/videoPlayer.vue"
import HeaderView from "@/views/HeaderView.vue"
// import { useCounterStore } from "@/stores/counter.js"
// import { onMounted } from "vue"
// import { useRouter } from "vue-router"
// import router from "@/router"
// const store = useCounterStore()

// onMounted(() => {
//   store.getData()
// })

// const move = () => {
//   router.push("/videoplayer")
// }
</script>
<style>
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.body_section {
  margin-top: 56px;
}
</style>
