/*
 * @Author: zhangjicheng
 * @Date: 2022-07-11 11:42:43
 * @LastEditors: zhangjicheng
 * @LastEditTime: 2023-02-02 01:17:33
 * @FilePath: /create-app/rollup.config.ts
 */
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve"; // 帮助rollup查找外部模块
import commonjs from "rollup-plugin-commonjs"; // 将commonjs转es6模块
import filesize from "rollup-plugin-filesize"; // 显示打包后包大小
import { terser } from "rollup-plugin-terser"; // 压缩代码
import { eslint } from "rollup-plugin-eslint";
import ts from "rollup-plugin-typescript2";
// import path from 'path';
import packageJSON from "./package.json";

const { TERSER } = process.env;

const plugins = [
  resolve({
    browser: true,
  }),
  commonjs({
    include: ["node_modules/**"],
  }),
  babel({
    exclude: "node_modules/**", // 只编译我们的源代码
  }),
  filesize(),
  TERSER ? terser() : "",
  eslint({
    throwOnError: true,
    include: ["src/**/*.ts"],
    exclude: ["node_modules/**", "lib/**"],
  }),
  ts(),
];

export default {
  input: "src/create-app.ts",
  output: [
    {
      file: "create-app.cjs",
      format: "cjs",
      exports: "auto",
    },
    {
      file: "create-app.js",
      format: "esm",
      exports: "auto",
    },
  ],
  plugins,
};
