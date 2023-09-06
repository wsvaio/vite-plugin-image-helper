import { join } from "node:path";
import { readdirSync, statSync, watch } from "node:fs";
import { type PluginOption, type ResolvedConfig } from "vite";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";
import c from "picocolors";
import { normalizePath } from "vite";
import { DIR_CLIENT } from "./dir";

const flat = (root: string, path: string, ...names: string[]) => {
	path = normalizePath(path);
	const result: { path: string; names: string[] }[] = [];
	const active = { path, names: [] as string[] };

	result.push(active);

	for (const item of readdirSync(join(root, path))) {
		const stats = statSync(join(root, path, item));
		if (stats.isDirectory()) result.push(...flat(root, join(path, item), ...names));
		else if (stats.isFile() && (!names.length || names.some(sub => item.includes(sub)))) active.names.push(item);
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

		configureServer(server) {
			const printUrls = server.printUrls;
			server.printUrls = () => {
				printUrls();

				const colorUrl = (url: string) => c.yellow(url.replace(/:(\d+)\//, (_, port) => `:${c.bold(port)}/`));
				console.log(
					`  ${c.green("➜")}  ${c.bold("ImageHelper")}: ${colorUrl(
						`${config.server.https ? "https" : "http"}://localhost:${port}/`
					)}`
				);
			};
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

			fastify.get("/api/paths", req =>
				paths
					.map(item =>
						flat(
							config.root,
							item,
							...(Array.isArray((req.query as any).name)
								? (req.query as any).name
								: (req.query as any).name
									? [(req.query as any).name]
									: [])
						)
					)
					.flat()
			);

			fastify.get("/api/file", async req => statSync(join(config.root, (req.query as any).path)));

			fastify.listen({ port });
		},

		buildEnd() {
			fastify?.close();
		},
	} as PluginOption;
};
