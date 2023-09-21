# React + TypeScript + Vite + Storybook

React + TypeScript 开发 react 组件模版，支持按需加载；[Storybook](https://storybook.js.org/) 生成操作手册

## 文件说明

- `.storybook`: storybook 配置文件  
- `example`: 预览示例，用于开发组件时直接引入调试，也可通过 `link` 来验证打包结果  
- `packages`: 组件目录  
- `stories`: storybook 组件配置，用于生成组件说明  

## 如何使用

- 安装依赖

   ``` bash
   pnpm install
   ```

   注意，当前版本若使用 yarn 作为包管理器，会出现 storybook 启动失败的问题

   ``` bash
   storybook: '^7.4.2',  
   yarn: '1.22.18',
   ```

- 组件编写

   packages 文件夹中有组件示例，直接修改即可，可以在 example 文件中，添加组件的引用，来进行组件的预览开发

   ./example/App.ts

   ``` js
   import Button from "@packages/Button";

   function App() {
   return (
      <>
         <h1>Vite + React</h1>
         <Button>button</Button>
      </>
   );
   }

   export default App;
   ```

- 开启预览

   ``` bash
   npm start
   ```

   此时即可在浏览器看到上面引入的组件效果

- 打包组件

   ``` bash
   npm run build
   ```

- 验证打包结果及调试

   这里我们通过 软链 `pnpm link` 的方式来调试

   ```bash
      pnpm link -g // 建立软链

      pnpm link <packageName> // 关联
   ```

   我们在 example 中修改组件的引入，改为引入package的方式

   ``` js
   - import Button from "@packages/Button";
   + import Button from "<packageName>"

   function App() {
   return (
      <>
         <h1>Vite + React</h1>
         <Button>button</Button>
      </>
   );
   }

   export default App;
   ```

   此时我们即可在浏览器看到组件效果，并且当你修改组件原码后，执行 `npm run build` 浏览器会自动更新组件

## storybook

根据[官网](https://storybook.js.org/)及示例来编写操作文档

启动

``` bash
npm run storybook
```

打包文档

``` bash
npm run build-storybook
```
