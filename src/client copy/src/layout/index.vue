<!-- eslint-disable vue/first-attribute-linebreak -->
<script setup lang="ts">
import { reactive, ref } from "vue";
import { NAnchorLink, useMessage } from "naive-ui";
import childrenCard from "../components/childrenCard/index.vue";

const images = ref<Record<any, any>>([]);
const refreshImages = () => {
	fetch("/api/paths/tree")
		.then(data => data.json())
		.then(data => {
			images.value.length = 0;
			images.value.push(...data);
			console.log(images.value);
		})
		.catch(error => {
			document.write(error);
		});
};
refreshImages();

const ws = new WebSocket(`ws://${location.host}/ws`);

ws.addEventListener("message", refreshImages);
const active = ref<boolean>(false);
const drawerData = ref<Record<any, any>>({});
const handleClick = (path: string, item: Record<any, any>) => {
	console.log(path, item);

	active.value = true;

	fetch(`/api/file?path=${path}/${item}`)
		.then(data => data.json())
		.then(data => {
			drawerData.value = { ...data, url: `${path}/${item}`, name: item };
		});
};

const convertFileSize = (bytes: number) => {
	const sizes = ["B", "KB", "MB"];
	const k = 1024;
	if (bytes === 0)
		return "0 Byte";
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const convertedSize = Number.parseFloat((bytes / k ** i).toFixed(2));
	return `${convertedSize} ${sizes[i]}`;
};

const timeStamp = (dateTime: Date, format = "Y-M-D"): string => {
	const date = new Date(dateTime);
	const o: Record<any, any> = {
		Y: date.getFullYear(),
		M: `0${date.getMonth() + 1}`.slice(-2),
		D: `0${date.getDate()}`.slice(-2),
		h: `0${date.getHours()}`.slice(-2),
		m: `0${date.getMinutes()}`.slice(-2),
		s: `0${date.getSeconds()}`.slice(-2),
	};
	return format.replace(/[YMDhms]+/g, match => o[match[0]]);
};
const message = useMessage();
const copy = async (path: string) => {
	await navigator.clipboard.writeText(path);
	message.success("复制成功");
};
</script>

<template>
	<div class="atlas" :style="{ gridTemplateRows: `repeat(${images.length}, 1fr)` }">
		<div v-for="item_list in images" class="atlas--item">
			<div class="variety-section">
				<div class="variety-section--decoration" />
				<div class="variety-section--title">
					{{ item_list.path }}
				</div>
			</div>
			<div class="atlas--list">
				<div v-for="item in item_list?.names" class="atlas--img" @click="handleClick(item_list.path, item)">
					<n-tooltip trigger="hover">
						<template #trigger>
							<img :src="`${item_list.path}/${item}`" />
						</template>
						{{ item }}
					</n-tooltip>
				</div>
			</div>
			<childrenCard v-if="item_list.children?.length > 0" :item="item_list?.children" :path="item_list?.path" @handle-click="handleClick" />
		</div>
	</div>
	<n-drawer v-model:show="active" :width="502" placement="bottom" height="450">
		<n-drawer-content title="图片信息" closable>
			<div class="image">
				<div class="image--box">
					<img :src="`${drawerData?.url}`" alt="" />
				</div>
				<div class="image--describe">
					<div>名称: {{ drawerData.name }}</div>
					<div style="display: flex; align-items: center;">
						路径：<n-anchor-link>{{ drawerData.url }}</n-anchor-link>
						<n-button style="margin-left: 32px;" type="info" @click="copy(drawerData.url)">
							复制
						</n-button>
					</div>
					<div>大小: {{ convertFileSize(drawerData.size) }}</div>
					<div>创建时间: {{ timeStamp(drawerData.birthtime, "Y-M-D hh:mm:ss") }}</div>
				</div>
			</div>
		</n-drawer-content>
	</n-drawer>
</template>

<style scoped lang="less">
body {
	-webkit-backface-visibility: hidden;
	backface-visibility: hidden;
}

.atlas {

	padding: 16px;
	display: grid;
	gap: 32px;
	border-radius: 15px;

	&--item {
		display: grid;
		grid-template-rows: repeat(2, max-content);
		gap: 32px;
	}

	&--list {
		display: grid;
		grid-template-columns: repeat(auto-fill, 120px);
		gap: 16px;
		justify-content: center;
	}

	&--title {
		font-size: 32px;
		font-weight: 700;
	}

	&--children {
		display: grid;
		margin: 16px;

		gap: 32px;

		&--item {
			padding: 32px 16px;
			border-radius: 15px;
			box-shadow: 0px 0px 20px 0 #D0EFFF;
		}
	}

	&--img {
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

		&:hover {
			transform: translate3d(0, 0, 0) scale3d(1.1, 1.1, 1);
		}

		img {
			aspect-ratio: 1 / 1;
			width: 100%;
			object-fit: contain;

		}
	}
}

.image {
	display: grid;
	grid-template-columns: 180px 1fr;
	gap: 32px;
	padding: 16px;

	&--box {
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

		&:hover {
			transform: translate3d(0, 0, 0) scale3d(1.1, 1.1, 1);
		}

		img {
			width: 150px;
			height: 150px;
		}

	}

	&--describe {
		display: grid;
		grid-template-rows: repeat(3, max-content);
		gap: 16px;

		&>div {
			font-size: 16px;
			font-weight: 500;
		}
	}
}

.variety-section {
	display: grid;
	grid-template-columns: max-content 1fr;
	grid-template-rows: max-content max-content;
	align-content: center;
	align-items: center;
	padding: 0 32px;

	&--decoration {
		grid-column: span 1;
		grid-row: span 1;
		width: 12px;
		height: 40px;
		margin-right: 16px;
		background: linear-gradient(45deg, rgb(0 144 255 / 100%) 0%, rgb(186 255 240 / 100%) 100%);
		border-radius: 12px;

	}

	&--title {
		grid-column: span 1;
		grid-row: span 1;
		color: #181818;
		font-size: 32px;
		font-weight: 700;
		line-height: 48px
	}
}
</style>
