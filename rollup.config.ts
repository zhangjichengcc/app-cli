/*
 * @Author: zhangjicheng
 * @Date: 2022-07-11 11:42:43
 * @LastEditors: zhangjicheng
 * @LastEditTime: 2023-02-28 15:18:08
 * @FilePath: /create-app/rollup.config.ts
 */
import type { RollupOptions } from "rollup";
// import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve"; // 帮助rollup查找外部模块
import commonjs from "@rollup/plugin-commonjs"; // 将commonjs转es6模块
import filesize from "rollup-plugin-filesize"; // 显示打包后包大小
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import eslint from "@rollup/plugin-eslint";
// import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import ttypescript from 'ttypescript'; 
// import ts from "rollup-plugin-typescript2";
import packageJSON from "./package.json";

// const { TERSER } = process.env;

const plugins: RollupOptions['plugins'] = [
  json(),
  nodeResolve({ preferBuiltins: true }),
  commonjs(),
  typescript({
    typescript: ttypescript,
  }),
  filesize(),
  // terser(),
  eslint({
    throwOnError: true,
    include: ["src/**/*.ts"],
    exclude: ["node_modules/**", "lib/**"],
  }),
];

export default {
  input: "src/create-app.ts",

  output: [
    {
      file: packageJSON.bin["app-cli"],
      format: "es",
      exports: "auto",
      banner: "#!/usr/bin/env node",
    },
  ],
  plugins,
} as RollupOptions;
