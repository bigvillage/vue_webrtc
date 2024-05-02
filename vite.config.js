import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";

export default defineConfig({
  define: {
    global: {},
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "/zoom",
  server: {
    https: {
      key: fs.readFileSync("./pem/STAR.saerom.co.kr_key.pem"),
      cert: fs.readFileSync("./pem/STAR.saerom.co.kr_crt.pem"),
    },
    proxy: {
      "/getVideoData": {
        changeOrigin: true,
        target: "http://127.0.0.1:5173/getVideoData",
        rewrite: (path) => path.replace(/^\/getVideoData/, ""),
      },
      "/videoTest": {
        changeOrigin: true,
        target: "http://127.0.0.1:5173/videoTest",
        rewrite: (path) => path.replace(/^\/videoTest/, "/videoTest"),
      },
    },
    hmr: {
      path: "socket.io",
      port: 3001,
    },
    host: "local.saerom.co.kr",
    // https: true
  },
  build: {},
});
