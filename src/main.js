// import './assets/main.css'

import { createApp } from "vue"
import { createPinia } from "pinia"
// import VideoJs from "@/util/videojs.js"
import videojs from "video.js"
// import "videojs-contrib-hls"
// 비디오 영상을 제대로 만들어주는 css
import "video.js/dist/video-js.css"
// import "videojs-contrib-hls"
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"

import App from "@/App.vue"
import router from "./router"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.config.globalProperties.$videojs = videojs
// app.use(VideoJs)

app.mount("#app")
