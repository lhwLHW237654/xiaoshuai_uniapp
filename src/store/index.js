import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
const pinia = createPinia();
if (typeof window !== 'undefined') {
    pinia.use(piniaPluginPersistedstate);
}
export default pinia;
