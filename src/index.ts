import { join } from "node:path";
import { readdirSync, watch } from "node:fs";
import type { PluginOption, ResolvedConfig } from "vite";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";
import { DIR_CLIENT } from "./dir";

export default (options?: { path?: string; port?: number }) => {
	let { path = "/src/assets/images", port = 7747 } = options || {};
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

			fastify.register(fastifyStatic, { root: join(config.root, path), prefix: "/images/", decorateReply: false });

			fastify.register(fastifyWebsocket);

			fastify.register(async () => {
				fastify.get("/", { websocket: true }, conn => {
					const watcher = watch(join(config.root, path));

					watcher.on("change", () => {
						conn.write("");
					});

					conn.on("close", () => {
						watcher.close();
					});
				});
			});

			fastify.get("/api/images", () => readdirSync(join(config.root, path)));
			fastify.get("/api/options", () => ({ path, port }));

			fastify.listen({ port });
		},

		buildEnd() {
			fastify?.close();
		},
	} as PluginOption;
};
