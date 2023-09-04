import { join } from "node:path";
import { readdirSync, statSync, watch } from "node:fs";
import { type PluginOption, type ResolvedConfig, normalizePath } from "vite";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";
import { DIR_CLIENT } from "./dir";

export default (options?: { path?: string | string[]; port?: number }) => {
	const { path = "/src/assets/images", port = 7747 } = options || {};
	let paths = Array.isArray(path) ? path : [path];
	let config: ResolvedConfig;
	let fastify: FastifyInstance;

	return {
		name: "vite-plugin-image-helper",
		apply: "serve",

		configResolved(_config) {
			// 提取配置
			config = _config;

			// 递归path
			const result: string[] = [];
			const deep = (path: string) => {
				result.push(normalizePath(path));
				const dirs = readdirSync(join(config.root, path));
				for (const dir of dirs) {
					const stats = statSync(join(config.root, path, dir));
					if (stats.isDirectory()) deep(join(path, dir));
				}
			};
			paths.forEach(item => deep(item));

			paths = result;
		},

		buildStart() {
			fastify = Fastify();

			fastify.register(fastifyStatic, { root: DIR_CLIENT });

			paths.forEach(item => {
				fastify.register(fastifyStatic, { root: join(config.root, item), prefix: item, decorateReply: false });
			});

			fastify.register(fastifyWebsocket);

			fastify.register(async () => {
				fastify.get("/ws", { websocket: true }, conn => {
					paths.forEach(item => {
						const watcher = watch(join(config.root, item));
						watcher.on("change", () => {
							conn.write("");
						});
						conn.on("close", () => {
							watcher.close();
						});
					});
				});
			});

			fastify.get("/api/paths", () => {
				const result: { path: string; names: any[] }[] = [];
				paths.forEach(item =>
					result.push({
						path: item,
						names: readdirSync(join(config.root, item)).filter(sub => statSync(join(config.root, item, sub)).isFile()),
					})
				);
				return result;
			});

			paths.forEach(item => {
				fastify.get(`/api${item}/:name`, async req => {
					return statSync(join(config.root, item, (req.params as any).name));
				});
			});

			fastify.get("/api/options", () => ({ path, port }));

			fastify.listen({ port });
		},

		buildEnd() {
			fastify?.close();
		},
	} as PluginOption;
};
