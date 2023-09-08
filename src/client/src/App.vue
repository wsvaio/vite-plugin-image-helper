<script lang="ts" setup>
import { darkTheme, dateZhCN, lightTheme, zhCN } from "naive-ui";
import LayoutDefault from "./layouts/default/index.vue";
import useMainStore from "./stores/useMainStore";

const main = useMainStore();
</script>

<template>
	<n-config-provider
		:theme="main.theme == 'light' ? lightTheme : darkTheme"
		:locale="zhCN"
		:date-locale="dateZhCN"
		abstract
		:theme-overrides="{
			common: {
				primaryColor: '#EC5E42',
				primaryColorHover: '#CF523A',
				primaryColorPressed: '#963C2A',
				primaryColorSuppl: '#EC5E42',

			},
		}"
	>
		<!-- <n-theme-editor> -->
		<n-message-provider>
			<layout-default />
			<n-global-style />
		</n-message-provider>
		<!-- </n-theme-editor> -->
	</n-config-provider>
</template>
