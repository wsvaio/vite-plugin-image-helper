<script setup lang="ts">
import { usePayload } from "@wsvaio/use";
import { dateFormat } from "@wsvaio/utils";
import type { Actions, Payload } from "../..";
import { joinFileUrl } from "@/apis";

const payload = usePayload<Payload, Actions>({ $mode: "inject" });
const { fileInfo } = $(payload);
const main = useMainStore();
payload.$use("打开抽屉")(async ({ fileInfo: { path, name } }) => {
	payload.$action({ fileInfo: await getFileInfo({ q: { path: `${path}/${name}` } }) });
});

const message = useMessage();
const copy = async (text?: string) => {
	if (!text) return;
	await navigator.clipboard.writeText(text);
	message.success("复制成功");
};

const options = $computed(() => [
	{ value: 0, label: `${fileInfo.path}/${fileInfo.name}` },
	{
		value: 1,
		label: `import ${fileInfo.name.split(".")[0]} from "${fileInfo.path}/${fileInfo.name}";`,
	},
	{ value: 2, label: `<img src="${`${fileInfo.path}/${fileInfo.name}`}" />` },
	{ value: 3, label: `url("${`${fileInfo.path}/${fileInfo.name}`}")` },
]);

const label = $computed(() => options.find(item => item.value == main.select)?.label);
</script>

<template>
	<n-drawer v-model:show="payload.show" placement="bottom">
		<n-drawer-content
			closable
			:title="fileInfo.name"
			:body-content-style="{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '16px' }"
		>
			<n-image
				:src="joinFileUrl(fileInfo.path, fileInfo.name)"
				:alt="fileInfo.name"
				:width="168"
				:height="168"
				object-fit="contain"
				class="drop-shadow"
			/>
			<n-space vertical>
				<div class="flex ~ items-center">
					<n-popselect v-model:value="main.select" :options="options" trigger="click" placement="right">
						<n-button text>
							<div class="i-ic:baseline-toc" text="24px" />
						</n-button>
					</n-popselect>
					<n-button ml=".5em" text class="text-16px hover:underline" @click="copy(label)">
						{{ label }}
					</n-button>
				</div>

				<n-space mt="auto" vertical>
					<n-tag>{{ `${fileInfo.size / 1000}kb` }}</n-tag>
					<n-tag>{{ dateFormat(fileInfo.birthtime) }}</n-tag>
				</n-space>
			</n-space>
		</n-drawer-content>
	</n-drawer>
</template>

<style lang="less" scoped></style>
