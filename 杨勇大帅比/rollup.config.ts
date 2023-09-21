import type { RollupOptions } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import ttypescript from "ttypescript";
import clear from "rollup-plugin-clear";
import commonjs from "@rollup/plugin-commonjs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");
path.resolve();

const plugins: RollupOptions["plugins"] = [
  clear({
    targets: ["./lib"],
  }),
  nodeResolve(),
  commonjs(),
  typescript({
    typescript: ttypescript,
    declarationDir: "lib/declare",
    // ? 由于配置文件使用了ts，所以在 tsconfig.js 配置中将 rollup.config.ts加入到了include中，这里需要将其排除，不需要打包
    exclude: ["./rollup.config.ts"],
  }),
];

const config: RollupOptions = {
  input: "src/main.ts",
  // 移除项目依赖
  external: Object.keys(pkg.dependencies),
  output: [
    {
      preserveModules: true,
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
      // file: pkg.module,
      format: "cjs",
      exports: "auto",
    },
  ],
  plugins,
};

export default config;
