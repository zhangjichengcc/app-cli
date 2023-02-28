import type { RollupOptions } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import ttypescript from 'ttypescript'; 
import commonjs from "@rollup/plugin-commonjs";
import { createRequire } from "node:module";
// import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const pkg = require("./package.json");
path.resolve();

const plugins: RollupOptions["plugins"] = [
  nodeResolve(),
  commonjs(),
  typescript({ 
    typescript: ttypescript,
    declarationDir: "./declare",
  })
];

const config: RollupOptions = {
  input: "src/main.ts",
  // 移除项目依赖
  external: Object.keys(pkg.dependencies),
  output: [
    {
      file: pkg.main,
      format: "es",
      exports: "auto",
    },
    {
      file: pkg.module,
      format: "cjs",
      exports: "auto",
    },
  ],
  plugins,
};

export default config;
