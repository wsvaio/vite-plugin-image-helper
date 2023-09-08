import type { App } from "vue";
import piniaPluginPersist from "@wsvaio/pinia-plugin-persist";

const pinia = createPinia();
// pinia 持久化
pinia.use(piniaPluginPersist({
	key: import.meta.env.VITE_PROJECT_NAME,

}));

export default (app: App) => {
	app.use(pinia);
};
