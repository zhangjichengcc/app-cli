import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

function resolve(str: string) {
  return path.resolve(__dirname, str);
}

/** 入口文件 */
const MAIN_ENTER = "src/index.ts";

/** 忽略打包的依赖 */
const peerComponents = Object.keys(pkg.dependencies);

export default defineConfig({
  build: {
    outDir: "lib",
    lib: {
      entry: [MAIN_ENTER],
      name: "index",
      // fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: peerComponents,
      output: [
        {
          preserveModules: true, // 使用原始模块名作为文件名
          chunkFileNames: "es/[name]-[hash].js",
          entryFileNames: "es/[name].js",
          dir: "lib",
          format: "es",
          exports: "auto",
        },
        {
          preserveModules: true,
          chunkFileNames: "cjs/[name]-[hash].js",
          entryFileNames: "cjs/[name].js",
          dir: "lib",
          format: "cjs",
          exports: "auto",
        },
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  plugins: [
    dts({
      exclude: resolve("node_modules/**"),
      entryRoot: resolve("src"),
      outDir: "lib/declare",
    }),
  ],
});
