import { join } from "node:path";
import { readdirSync, statSync, watch } from "node:fs";
import { type PluginOption, type ResolvedConfig, normalizePath } from "vite";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";
import { DIR_CLIENT } from "./dir";

const deep = (root: string, path: string) => {
	path = normalizePath(path);
	const result = { path, names: [], children: [] };
	const dirs = readdirSync(join(root, path));
	for (const dir of dirs) {
		const stats = statSync(join(root, path, dir));
		if (stats.isDirectory()) result.children.push(deep(root, join(path, dir)));
		else if (stats.isFile()) result.names.push(dir);
	}
	return result;
};

export default (options?: { path?: string | string[]; port?: number }) => {
	const { path = "/src/assets/images", port = 7747 } = options || {};

	let paths = Array.isArray(path) ? path : [path];

	let config: ResolvedConfig;
	let fastify: FastifyInstance;

	return {
		name: "vite-plugin-image-helper",
		apply: "serve",

		configResolved(_config) {
			config = _config;
		},

		buildStart() {
			fastify = Fastify();

			fastify.register(fastifyStatic, { root: DIR_CLIENT });

			paths.forEach(item =>
				fastify.register(fastifyStatic, { root: join(config.root, item), prefix: item, decorateReply: false })
			);

			fastify.register(fastifyWebsocket);

			fastify.register(async () =>
				fastify.get("/ws", { websocket: true }, conn => {
					paths.forEach(item => {
						const watcher = watch(join(config.root, item));
						watcher.on("change", () => conn.write(""));
						conn.on("close", () => watcher.close());
					});
				})
			);

			fastify.get("/api/paths", () => paths.map(item => deep(config.root, item)));

			fastify.get("/api/file", async req => statSync(join(config.root, (req.query as any).path)));

			// fastify.get("/api/options", () => ({ path, port }));

			fastify.listen({ port });
		},

		buildEnd() {
			fastify?.close();
		},
	} as PluginOption;
};
