<!-- eslint-disable import/no-self-import -->
<script lang='ts' setup>
import childrenCard from "./index.vue";

const { item, path } = defineProps<{
	item: Record<any, any>;
	path: string;
}>();
const emits = defineEmits(["handleClick"]);
onMounted(() => {
	console.log(item);
});
const handleClick = (path: string, item: Record<any, any>) => {
	emits("handleClick", path, item);
};
</script>

<template>
	<div class="atlas--children">
		<!-- {{ item }} -->
		<div v-for="children_data in item" class=" atlas--children--item">
			<div class="variety-section">
				<div class="variety-section--decoration" />
				<div class="variety-section--title">
					{{ children_data?.path.split(`${path}`)[1] }}
				</div>
			</div>
			<div class="atlas--children--list">
				<div v-for="children_item in children_data?.names" class="atlas--children--img" @click="handleClick(children_data.path, children_item)">
					<n-tooltip trigger="hover">
						<template #trigger>
							<img :alt="children_item" :src="`${children_data?.path}/${children_item}`" />
						</template>
						{{ children_item }}
					</n-tooltip>
				</div>
			</div>
			<div v-if="children_data?.children?.length > 0" class="atlas--children"
				:style="{ gridTemplateColumns: `repeat(${item.children?.length}, 1fr)` }">
				<childrenCard :item="children_data?.children" :path="children_data?.path"
					@handle-click="handleClick" />
			</div>
		</div>
	</div>
</template>

<style scoped lang="less">
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

.atlas--children {
	display: grid;
	padding: 8px;
	gap: 32px;

	&--item {
		padding: 32px 16px;
		border-radius: 15px;
		box-shadow: 0px 0px 20px 0 #D0EFFF;
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
</style>
