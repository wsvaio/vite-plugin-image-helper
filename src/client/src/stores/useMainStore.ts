import { defineStore } from "pinia";

export default defineStore("main", {
	state: () => ({
		size: 32,
		theme: "light" as "light" | "dark",

	}),
	actions: {

	},
	getters: {},
});
