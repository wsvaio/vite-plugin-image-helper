import { join } from "node:path";
import { readdirSync, statSync, watch } from "node:fs";
import type { PluginOption, ResolvedConfig } from "vite";

import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";
import c from "picocolors";
import { normalizePath } from "vite";
import { DIR_CLIENT } from "./dir";

export default (options?: { path?: string | string[]; port?: number; ws?: boolean }) => {
	const { path = "/src/assets", port = 7747, ws = true } = options || {};

	let paths = Array.isArray(path) ? path : [path];

	let config: ResolvedConfig;
	let fastify: FastifyInstance;

	const resolveAlias = (path: string) => {
		let result = "";
		if (
			!config.resolve.alias.some(item => {
				if (typeof item.find == "string" ? path.startsWith(item.find) : item.find.test(path)) {
					result = join(item.replacement, path.replace(item.find, ""));
					return true;
				}
				return false;
			})
		)
			result = join(config.root, path);
		return result;
	};

	const flat = (path: string, ...names: string[]) => {
		path = normalizePath(path);
		const result: { path: string; names: string[] }[] = [];
		const active = { path, names: [] as string[] };

		result.push(active);

		for (const item of readdirSync(resolveAlias(path))) {
			const stats = statSync(resolveAlias(join(path, item)));
			if (stats.isDirectory()) result.push(...flat(join(path, item), ...names));
			else if (stats.isFile() && (!names.length || names.some(sub => item.includes(sub)))) active.names.push(item);
		}

		return result;
	};

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

			fastify.get("/api/file", (req, reply) => {
				const { path = "", name = "" } = req.query as any;
				return reply.sendFile(name, resolveAlias(path));
			});

			if (ws) {
				fastify.register(fastifyWebsocket);

				fastify.register(async () =>
					fastify.get("/ws", { websocket: true }, conn => {
						paths.forEach(item => {
							const watcher = watch(resolveAlias(item));
							watcher.on("change", () => conn.write(""));
							conn.on("close", () => watcher.close());
						});
					})
				);
			}

			fastify.get("/api/paths", req =>
				paths
					.map(item =>
						flat(
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

			fastify.get("/api/file/info", async req => statSync(resolveAlias((req.query as any).path)));

			fastify.listen({ port });
		},

		buildEnd() {
			fastify?.close();
		},
	} as PluginOption;
};
