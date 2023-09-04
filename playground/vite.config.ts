import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ImageHelper from "vite-plugin-image-helper";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), ImageHelper({ path: "/src/assets/images", port: 8848 })],
});
