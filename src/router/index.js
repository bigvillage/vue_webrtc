import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import videoPlayer from "../views/videoPlayer.vue"
import testView from "../views/TestView.vue"
import zoomView from "../views/ZoomView.vue"
import videoConference from "../views/VideoConference.vue"

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory("/"),
  routes: [
    {
      path: "/zoom/home",
      name: "home",
      component: HomeView
    },
    {
      path: "/zoom/videoplayer",
      name: "videoplayer",
      component: videoPlayer
    },
    {
      path: "/zoom/test",
      name: "test",
      component: testView
    },
    {
      path: "/zoom",
      name: "zoom",
      component: zoomView
    },
    {
      path: "/zoom/videoconference",
      name: "videoconference",
      component: videoConference
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
