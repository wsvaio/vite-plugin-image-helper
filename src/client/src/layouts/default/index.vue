<script lang="ts" setup>
import { usePayload } from "@wsvaio/use";
import LHeader from "./layouts/header/index.vue";
import LContent from "./layouts/content/index.vue";
import LDrawer from "./layouts/drawer/index.vue";
import type { Actions, Payload } from ".";

usePayload<Payload, Actions>({
	params: { name: "" },
	fileInfo: {},
	show: false,
	select: 0,
	$mode: "provide"
});
</script>

<template>
	<n-layout h="full">
		<l-header />
		<l-content />
		<l-drawer />
		<n-back-top />
	</n-layout>
</template>
