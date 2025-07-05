import { defineStore } from "pinia";
export default defineStore("user", {
  state() {
    return {
      userInfo: {},
    };
  },
  actions: {},
  persist: true,
});
