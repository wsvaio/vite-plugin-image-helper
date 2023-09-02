import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		open: true,
	},
	plugins: [
		vue(),
	],
	build: {
		target: "esnext",
		outDir: resolve(__dirname, "../../dist/client"),
		minify: false, // 'esbuild',
		emptyOutDir: true,
	},
});
