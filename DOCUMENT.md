# Development process

## 目录结构

``` bash
.
├── CONTRIBUTING.md                      # 贡献
├── DOCUMENT.md                          # 开发文档
├── LICENSE
├── README.md
├── cli.js                               # 入口文件
├── lib
│   ├── Generator.js                     # 构造器
│   ├── generators                       # 构造器集合
│   │   ├── docsify                      # docsify 文档构造器
│   │   │   ├── index.js                 # 构建脚本
│   │   │   ├── meta.json                # 构造器说明
│   │   │   └── template                 # 项目模板
│   │   │       ├── README.md
│   │   │       ├── _package.json        # package 副本，注意需要格式化相关信息
│   │   │       ├── package.json
│   │   │       └── ...
│   │   ├── rollup                       # rollup 打包工具构造器
│   │   │   ├── index.js                 # 构造器脚本
│   │   │   ├── meta.json                # 构造器说明
│   │   │   └── templates                # 模板目录
│   │   │       ├── pureJavascript       # 纯 js 模板
│   │   │       │   ├── meta.json            
│   │   │       │   └── template              
│   │   │       ├── react                # react 模板
│   │   │       │   ├── meta.json
│   │   │       │   └── template
│   │   │       └── vue                  # vue 模板
│   │   │           ├── meta.json
│   │   │           └── template
│   │   └── vite                         # vite 打包工具构造器
│   │       ├── index.js
│   │       ├── meta.json
│   │       └── templates
│   │           ├── pureJavascript
│   │           │   ├── meta.json
│   │           │   └── template
│   │           ├── react
│   │           │   ├── meta.json
│   │           │   └── template
│   │           └── vue
│   │               ├── meta.json
│   │               └── template
│   └── run.js                           # 启动文件
├── package.json
└── pnpm-lock.yaml
```

## 修改package.json

clone 的 `package.json` 文件为副本（`_package.json`），是根据交互获取的 `name、description、author`等参数进行替换生成新的 `package.json`

``` json
{
  "name": "<%= name %>",
  "version": "<%= version %>",
  "description": "<%= description %>",
  "author": "<%= author %> <<%= mail %>>",
  "scripts": {
    // ...
  },
  "devDependencies": {
    // ...
  }
}
```

每个 `template` 需要复制一份 `package.json`，命名为 `_package.json`

## 参考文献

[如何开发一个cli工具](https://juejin.cn/post/6979511969736818701)

[手把手教你实现一个cli工具](https://juejin.cn/post/6911987404039520270)

[nodejs 中读取 package.json 文件内容](https://blog.csdn.net/ZhaoQM_script/article/details/120631231)
