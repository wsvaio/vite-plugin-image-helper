import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ImageHelper from "vite-plugin-image-helper";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"~/": __dirname,
			"@/": `${resolve(__dirname, "src")}/`,
			"#/": `${resolve(__dirname, "types")}/`,
		},

	},
	plugins: [vue(), ImageHelper({
		path: [
			"/src/assets/images",
			"@/assets/images",
			"@/assets/images",
			"@/assets/images",

		],
		port: 8848
	})],
});
