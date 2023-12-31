import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		open: true,
	},
	plugins: [
		vue(),
		AutoImport({
			imports: [
				"vue",
				{
					"naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"],
				},
			],
		}),
		Components({
			resolvers: [NaiveUiResolver()],
		}),
	],

	build: {
		target: "esnext",
		outDir: resolve(__dirname, "../../dist/client"),
		minify: false, // 'esbuild',
		emptyOutDir: true,
	},
});
