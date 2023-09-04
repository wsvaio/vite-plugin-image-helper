<script setup lang="ts">
import { reactive, ref } from "vue";

const images = ref<string[]>([]);
const refreshImages = () => {
	fetch("/api/paths")
		.then(data => data.json())
		.then(data => {
			images.value.length = 0;
			images.value.push(...data);
		})
		.catch(error => {
			document.write(error);
		});
};
refreshImages();

const ws = new WebSocket(`ws://${location.host}/ws`);

ws.addEventListener("message", refreshImages);
</script>

<template>
	<div>
		<img v-for="item in images" :src="`/images/${item}`" :title="item" :alt="item" />
	</div>
</template>

<style scoped>
div {
	display: grid;
	grid-template-columns: repeat(auto-fill, 48px);
	gap: 16px;
}

img {
	aspect-ratio: 1 / 1;
	width: 100%;
	object-fit: contain;
	cursor: pointer;
}
</style>
