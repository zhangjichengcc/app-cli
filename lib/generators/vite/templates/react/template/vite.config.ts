import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "node:fs";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

function resolve(str: string) {
  return path.resolve(__dirname, str);
}

/** 入口文件 */
const MAIN_ENTER = "packages/index.ts";
/** 组件文件夹 */
const COMPONENTS_DIR = "packages";

/** 获取组件名称 */
const componentsName = fs.readdirSync(COMPONENTS_DIR).filter((name) => {
  const dir = path.resolve(COMPONENTS_DIR, name);
  const isDir = fs.lstatSync(dir).isDirectory();
  return isDir && fs.readdirSync(dir).includes("index.ts");
});

/** 取组件入口 */
const COMPONENTS_ENTER = componentsName.map(
  (name) => `${COMPONENTS_DIR}/${name}/index.tsx`
);

/** 忽略打包的依赖 */
const peerComponents = Object.keys(pkg.dependencies);

export default defineConfig({
  build: {
    outDir: "lib",
    // 防止 vite 将 rgba() 颜色转化为 #RGBA 十六进制
    cssTarget: "chrome61",
    lib: {
      entry: [MAIN_ENTER, ...COMPONENTS_ENTER],
      name: "index",
      fileName: (format) => `index.${format}.js`,
      formats: ["es"],
    },
    // cssCodeSplit: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: peerComponents,
      output: {
        dir: "lib", // 输出目录
        // entryFileNames: "[name]/index.js", // 每个组件的输出文件名
        // 每个组件的 CSS 文件
        assetFileNames: "[name]/index.css",
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name.endsWith("js")) {
            return chunkInfo.name;
          }
          return "[name]/index.js";
        },
        format: "es", // 输出格式
        // exports: "named", // 输出方式
        // preserveModules: true, // 是否保留模块

        inlineDynamicImports: false, //! 当使用 manualChucks 时，内链导入需要显式关闭
        globals: {
          react: "react",
          "react-dom": "react-dom",
        },
        manualChunks(id) {
          if (id.includes("packages/")) {
            // 将组件文件夹作为单独的 chunk
            const chunks = id.split("/");
            const componentName = chunks[chunks.length - 2];
            return componentName;
          }

          if (id.includes("node_modules")) {
            return "vendor.js";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@packages": resolve("packages"),
    },
  },
  plugins: [
    dts({
      exclude: resolve("node_modules/**"),
      entryRoot: resolve("packages"),
    }),
    splitVendorChunkPlugin(),
    react(),
  ],
});
