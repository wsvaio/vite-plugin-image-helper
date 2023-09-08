<script setup lang="ts">
import { usePayload } from "@wsvaio/use";
import { useRequest } from "vue-request";
import type { Actions, Payload } from "../..";
import { joinFileUrl } from "@/apis";

const payload = usePayload<Payload, Actions>({ $mode: "inject" });
const { params } = $(payload);
let expandedNames = $ref<string[] | null>(null);

const { data } = useRequest(
	async () => await getPaths({ q: { name: params?.name?.split(" ")?.filter(item => !!item) } }),
	{
		refreshDeps: () => [params.name],
		initialData: [],
		onSuccess(data) {
			if (expandedNames === null) expandedNames = data?.map(item => item.path);
		},
		// manual: true,
	}
);

const main = useMainStore();
</script>

<template>
	<n-layout-content content-style="padding: 24px;">
		<n-collapse v-model:expanded-names="expandedNames">
			<n-collapse-item v-for="item in data" hoverable :title="item.path" :name="item.path">
				<template #header-extra>{{ item.names.length }}</template>
				<n-space v-if="item.names.length">
					<n-tooltip v-for="sub in item.names" trigger="hover" placement="bottom" eff>
						<template #trigger>
							<n-button
								h="!auto"
								p="!0"
								@click="payload.$action({ $name: '打开抽屉', show: true, fileInfo: { path: item.path, name: sub } })"
							>
								<n-image
									:src="joinFileUrl(item.path, sub)"
									:alt="sub"
									:width="main.size"
									:height="main.size"
									:style="{ margin: `${main.size / 4}px` }"
									flex="1 justify-center"
									object-fit="contain"
									class="drop-shadow"
									preview-disabled
									lazy
								/>
							</n-button>
						</template>
						{{ sub }}
					</n-tooltip>
				</n-space>
				<n-empty v-else />
			</n-collapse-item>
		</n-collapse>
	</n-layout-content>
</template>

<style lang="less" scoped></style>
