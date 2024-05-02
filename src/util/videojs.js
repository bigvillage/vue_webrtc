import videojs from "video.js"
// import "videojs-contrib-hls"
export default {
  // Vue플러그인은 'install' 메서드를 가지는데 'app'매개변수를 통해 Vue 인스턴스에 접근가능
  install(app) {
    // vue3에서는 globalProperties속성을 사용하여 전역속성을 정의할 수 있음.
    const gp = app.config.globalProperties
    // video.js라이브러리를 vue애플리케이션 내에서 전역으로 사용할 수 있도록 $videojs라는 전역변수를 설정. 이렇게하면 모든 vue컴포넌트에서 video.js기능을 사용할 수 있음
    gp.$videojs = videojs
  }
}
