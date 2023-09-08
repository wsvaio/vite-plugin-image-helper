import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetUno,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

// @unocss-include
export default defineConfig({
	shortcuts: {

	},

	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons(),
	],
	transformers: [
		transformerDirectives(),
		transformerVariantGroup(),
	],
});
