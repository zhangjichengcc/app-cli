# @app-cli/rollup

app-cli 配备的rollup模版

项目采用 rollup 进行打包，使用 typescript 开发

## 注意

因为本模板中 `rollup.config` 文件采用 typescript 编写，使用 `@rollup/plugin-typescript` 插件进行代码编译，舍弃 babel（两者功能重复），若需要使用 babel 进行编译，则可以将配置文件改为 .js

配置如下

``` js
/* rollup.config.js */

// ...
import babel from "@rollup/plugin-babel";

const plugins = [

  // ...

  /** 推荐使用 @rollup/plugin-typescript 来处理 ts 文件，因为 babel 对 ts 的处理不是很好
  若需要使用 babel 来进行其他代码处理，则可以使用babel */
  babel({
    babelHelpers: "bundled",
    exclude: ["node_modules/**"],
    extensions: [
      '.ts', // babel 默认不识别 ts，这里需要手动添加
      ...DEFAULT_EXTENSIONS,
    ],
    presets: [
      [
        "@babel/env",
        {
          // "modules": false ，否则 Babel 会在 Rollup 有机会做处理之前，将我们的模块转成 CommonJS ，导致 Rollup 的一些处理失败。
          modules: false,
        },
      ],
      // 处理 ts
      "@babel/preset-typescript",
    ],
  }),
];

const config = {
  input: "src/main.ts",
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
```

``` json
/* .babelrc */

{
  "presets": [
    [
      "@babel/env",
      {
        // "modules": false ，否则 Babel 会在 Rollup 有机会做处理之前，将我们的模块转成 CommonJS ，导致 Rollup 的一些处理失败。
        "modules": false
      }
    ],
    "@babel/preset-typescript"
  ]
}
```

``` json
/* package.json */

{
  // ...
  "devDependencies": {
    "@babel/core": "^7.20.12",
    "@babel/plugin-external-helpers": "^7.18.6",
    "@babel/plugin-transform-runtime": "^7.19.6",
    "@babel/preset-env": "^7.20.2",
    "@babel/preset-typescript": "^7.18.6",
  }
}
```
