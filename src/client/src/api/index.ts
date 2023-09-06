import { createAPI } from "@wsvaio/api";

const { get } = createAPI({
	baseURL: "/api",
});

export const getPaths = get<{ q: { name: string[] }; d: { path: string; names: string[] }[] }>("/paths");

export const getFile = get<{ q: { path: string } }>("/file");
