import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	clean: false,
	dts: true,
	format: ["cjs", "esm"],
});
