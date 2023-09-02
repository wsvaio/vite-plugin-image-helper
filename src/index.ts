import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, watch } from "node:fs";
import type { PluginOption, ResolvedConfig } from "vite";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (options?: { path: string }) => {
	let { path = "/src/assets/images" } = options || {};
	let config: ResolvedConfig;
	let fastify: FastifyInstance;
	return {
		name: "vite-plugin-image-helper",
		apply: "serve",

		configResolved(_config) {
			config = _config;
		},

		buildStart() {
			// if (!config || config?.command !== "serve") return;
			fastify = Fastify();

			fastify.register(fastifyStatic, { root: join(__dirname, "client") });

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
			fastify.get("/api/options", () => ({ path }));

			fastify.listen({ port: 8848 });
		},

		buildEnd() {
			fastify?.close();
		},

	} as PluginOption;
};
