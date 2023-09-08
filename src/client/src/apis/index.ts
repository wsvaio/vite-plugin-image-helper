import { createAPI } from "@wsvaio/api";

const { get } = createAPI({
	baseURL: "/api",
});

export const getPaths = get<{ q: { name: string[] }; d: { path: string; names: string[] }[] }>("/paths");

// export const getFile = get<{ q: { path: string; name: string } }>("/file");

export const getFileInfo = get<{ q: { path: string } }>("/file/info");

export const joinFileUrl = (path: string, name: string) => `/api/file?path=${path}&name=${name}`;
