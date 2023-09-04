<script setup lang="ts">
import { reactive, ref } from "vue";

const images = ref<string[]>([]);
const refreshImages = () => {
	fetch("/api/images")
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

const options = ref({ path: "" });
const refreshOptions = () => {
	fetch("/api/options")
		.then(data => data.json())
		.then(data => (options.value = data))
		.catch(error => {
			document.write(error);
		});
};
refreshOptions();

const ws = new WebSocket(`ws://${location.host}`);

ws.addEventListener("message", refreshImages);
const active = ref<boolean>(false);
const drawerDate = reactive({});
const handleClick = (item: string) => {
	active.value = true;
	navigator.clipboard.writeText(`${options.value.path}/${item}`);
};
</script>

<template>
	<div class="atlas">
		<div v-for="item in images" class="atlas--img" @click="handleClick(item)">
			<n-tooltip trigger="hover">
				<template #trigger>
					<img :src="`/images/${item}`" />
				</template>
				{{ item }}
			</n-tooltip>
		</div>
	</div>
	<n-drawer v-model:show="active" :width="502" placement="bottom">
		<n-drawer-content title="斯通纳">
			《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。
		</n-drawer-content>
	</n-drawer>
</template>

<style scoped>
.atlas {
	padding: 16px;
	display: grid;
	grid-template-columns: repeat(auto-fill, 120px);
	gap: 16px;
	justify-content: center;
}

.atlas--img {
	padding: 16px;
	/* background-color: #fff; */
	/* background: linear-gradient(90deg to right, white, #f5f5f5); */
	background: linear-gradient(151deg, #FFFFFF 5%, #D0EFFF 75%);
	border-radius: 8px;
	transition: all 0.5s;
	box-shadow: 5px 5px 10px #D0EFFF,
		-5px -5px 10px #ffffff,
		inset 10px 10px 20px #D0EFFF,
		inset -10px -10px 20px #ffffff;
	transform-origin: center center;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.atlas--img:hover {
	transform: scale3d(1.1, 1.1, 1);
}

img {
	aspect-ratio: 1 / 1;
	width: 100%;
	object-fit: contain;

}
</style>
