<center>

# vite-plugin-image-helper

一个 vite 插件，可以帮助开发者方便的使用图片

[![Size](https://img.shields.io/bundlephobia/minzip/vite-plugin-image-helper/latest)](https://www.npmjs.com/package/vite-plugin-image-helper) [![Version](https://img.shields.io/npm/v/vite-plugin-image-helper)](https://www.npmjs.com/package/vite-plugin-image-helper) [![Languages](https://img.shields.io/github/languages/top/wsvaio/vite-plugin-image-helper)](https://www.npmjs.com/package/vite-plugin-image-helper) [![License](https://img.shields.io/npm/l/vite-plugin-image-helper)](https://www.npmjs.com/package/vite-plugin-image-helper) [![Star](https://img.shields.io/github/stars/wsvaio/vite-plugin-image-helper)](https://github.com/wsvaio/vite-plugin-image-helper) [![Download](https://img.shields.io/npm/dm/vite-plugin-image-helper)](https://www.npmjs.com/package/vite-plugin-image-helper)

</center>



## 安装

```bash
npm i -D vite-plugin-image-helper
```

添加至您的 vite.config.ts：

```ts
// vite.config.ts
import ImageHelper from "vite-plugin-image-helper";

export default {
	resolve: {
		alias: {
			"@/": `${resolve(__dirname, "src")}/`,
		},
	},
	plugins: [
		ImageHelper({
			// 配置静态资源存放的路径（可以解析配置的resolve.alias）
			path: "@/assets", // or "/src/assets" or ["@/assets", ...]
			// 配置帮助页面的端口
			port: 7747,
			// 开启websocket，若对path中的文件进行了改动，可以实时更新
			ws: true,
		}),
	],
};
```

之后您便可在`localhost:7747`打开查看



## 源码

源码可以在 [GitHub 仓库](https://github.com/wsvaio/vite-plugin-image-helper) 中找到。

## 贡献

如果您发现`vite-plugin-image-helper`中有任何问题或缺少某些功能，请随时提交问题或请求。

我们欢迎您的贡献，包括提交错误修复、添加新功能或改进文档。
