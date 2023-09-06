<script lang="ts" setup>
import { useRequest } from "vue-request";
import { usePayload } from "@wsvaio/use";
import { getFile, getPaths } from "@/api";

const payload = usePayload<
{
	name: string;
	expandedNames: string[] | null;
	activeInfo: Record<any, any>;
},
{
	打开抽屉: { activeInfo: { path: string } };
}
>({
	name: "",
	expandedNames: null as string[] | null,
	activeInfo: {} as Record<any, any>,
});

const { data, loading } = useRequest(
	async () => await getPaths({ q: { name: payload.name.split(" ").filter(item => !!item) } }),
	{
		refreshDeps: () => [payload.name],
		initialData: [],
		onSuccess(data) {
			if (payload.expandedNames === null) payload.expandedNames = data?.map(item => item.path);
		},
	}
);

payload.$use("打开抽屉")(async ({ activeInfo: { path } }) => {
	payload.$action({ activeInfo: await getFile({ q: { path } }) });
});
</script>

<template>
	<n-layout>
		<n-layout-header>
			<n-input v-model:value="payload.name" />
		</n-layout-header>
		<n-layout-content content-style="padding: 24px;">
			<n-spin :show="loading">
				<n-collapse v-model:expanded-names="payload.expandedNames">
					<n-collapse-item v-for="item in data" hoverable :title="item.path" :name="item.path">
						<template #header-extra>{{ item.names.length }}个文件</template>
						<n-space v-if="item.names.length">
							<n-tooltip v-for="sub in item.names" trigger="hover" placement="bottom" eff>
								<template #trigger>
									<n-button
										size="large"
										p="0"
										w="!40px"
										h="!40px"
										@click="
											payload.$action({ $name: '打开抽屉', show: true, activeInfo: { path: `${item.path}/${sub}` } })
										"
									>
										<template #icon>
											<!-- <img
												class="drop-shadow"
												:src="`${item.path}/${sub}`"
												:alt="sub"
												object="contain"
												w="full"
												h="full"
											/> -->
											<!-- <n-image
												:src="`${item.path}/${sub}`"
												:alt="sub"
												:img-props="{ style: { flex: '1 1 0', width: '100%', height: '100%' } }"
												object-fit="contain"
												class="drop-shadow"
												preview-disabled
											/> -->
											<n-image
												:img-props="{ style: { width: '100%' } }"
												:src="`${item.path}/${sub}`"
												:alt="sub"
												flex="1 justify-center"
												object-fit="contain"
												class="drop-shadow"
												preview-disabled
											/>
										</template>
									</n-button>
								</template>
								{{ sub }}
							</n-tooltip>
						</n-space>
						<n-empty v-else />
					</n-collapse-item>
				</n-collapse>
			</n-spin>
		</n-layout-content>
		<n-layout-footer>built by @wsvaio, powered by Iconify Last update: 2023/09/03 07:17 (3 days ago)</n-layout-footer>
	</n-layout>

	<n-drawer v-model:show="payload.show" placement="bottom">
		<n-drawer-content closable title="文件详情">
			<n-layout has-sider :content-style="{ height: '100%' }" :style="{ height: '100%' }">
				<n-layout-sider :content-style="{ display: 'flex' }">
					<n-image
						:img-props="{ style: { width: '100%' } }"
						:src="payload.activeInfo.path"
						flex="1 justify-center"
						object-fit="contain"
						class="drop-shadow"
					/>
				</n-layout-sider>
				<n-layout-content>
					<n-a>{{ payload.activeInfo.path }}</n-a>
					{{ payload.activeInfo }}
				</n-layout-content>
			</n-layout>
		</n-drawer-content>
	</n-drawer>
</template>

<style scoped lang="less">
.drop-shadow {
	// background: linear-gradient(red, blue) center / 1px 1px;
	filter: drop-shadow(1px 1px 1px rgba(127, 127, 127, 0.5));
}
</style>
