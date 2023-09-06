import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Unocss from "unocss/vite";

import ReactivityTransform from "@vue-macros/reactivity-transform/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@/": `${resolve(__dirname, "src")}/`,
		},
	},
	plugins: [
		vue({
			script: {
				propsDestructure: true,
				defineModel: true,
			},
		}),
		ReactivityTransform(),
		AutoImport({
			imports: ["vue"],
		}),
		Components({
			resolvers: [NaiveUiResolver()],
		}),
		Unocss(),
	],

	build: {
		target: "esnext",
		outDir: resolve(__dirname, "../../dist/client"),
		minify: false, // 'esbuild',
		emptyOutDir: true,
	},
});
