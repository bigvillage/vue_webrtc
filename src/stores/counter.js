import { ref, computed } from "vue"
import { defineStore } from "pinia"
// import axios from "axios"

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0)
  const lists = ref([])
  const videoPlayer = ref(null)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  // const getData = async () => {
  //   try {
  //     const url = "http://125.7.235.226:70/eldata"
  //     const response = await axios({
  //       method: "get",
  //       url: url,
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     })
  //     lists.value = response.data
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // const videoData = async (data) => {
  //   try {
  //     const response = await axios({
  //       method: "get",
  //       headers: {
  //         "Content-Type": "application/json"
  //         // "range":
  //       },
  //       data: data
  //     })
  //     videoPlayer.value = response.data
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  return {
    count,
    doubleCount,
    increment,
    // getData,
    lists,
    // videoData,
    videoPlayer
  }
})
