import type { RollupOptions } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import babel from '@rollup/plugin-babel';
import ttypescript from 'ttypescript'; 
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import { visualizer } from "rollup-plugin-visualizer";
import clear from 'rollup-plugin-clear';
import fs from 'node:fs';
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = require("./package.json");
path.resolve();

const entry = 'src/index.ts'
const componentsDir = 'src/components'
const componentsName = fs.readdirSync(path.resolve(componentsDir))
const componentsEntry = componentsName.map(
  (name) => `${componentsDir}/${name}/index.tsx`
)

const plugins: RollupOptions["plugins"] = [
  postcss({
    // extract: true, // 独立导出css文件 ，使用组件时需要单独引入
    namedExports: true,
    minimize: true,
    modules: true,
    extensions: [".less", ".css"],
  }), // 处理css、less 文件
  nodeResolve({
    extensions: [".js", ".jsx", ".ts", ".tsx", ".less"], //允许我们加载第三方模块
  }),
  clear({
    targets: ['./dist']
  }),
  babel(),
  commonjs(),
  typescript({ 
    typescript: ttypescript,
    // declarationDir: "./types"
  }),
  visualizer(),
];

const config: RollupOptions = {
  input: [entry, ...componentsEntry],
  // 移除项目依赖
  external: Object.keys(pkg.devDependencies),
  output: [
    {
      preserveModules: true, // 使用原始模块名作为文件名
      dir: path.join(__dirname, '/dist'),
      format: "es",
      exports: "auto",
      // sourcemap: true,
      assetFileNames: (chunkInfo) => {
        const { name } = chunkInfo;
        const { ext, dir, base } = path.parse(name!);
        if (ext !== '.css') return '[name].[ext]';
        // 规范 style 的输出格式
        return path.join(dir, 'style', base);
      }
    }
  ],
  plugins,
};

export default config;
