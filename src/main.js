import { createSSRApp } from "vue";
import pinia from "@/store/index.js";
import App from "./App.vue";
import uView from "./uni_modules/vk-uview-ui";
uni.$u.config.unit = "rpx";
import "./style.css";

export function createApp() {
  const app = createSSRApp(App);
  app.use(uView);
  app.use(pinia);
  return {
    app,
    pinia,
  };
}
