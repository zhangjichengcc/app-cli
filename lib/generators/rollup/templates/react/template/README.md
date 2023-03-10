# Create-app react plugin

> react 组件开发模板

采用 rollup 进行项目打包，pnpm 作为包管理器，插件以 react@16 less 进行开发

## how to use

``` shell
# 打包
$ pnpm build

# 测试
$ pnpm link -g # 链接到全局依赖
$ cd <targetDir>
$ pnpm link <packageName> # 引入依赖包
```

## ⚠️注意

在我们做组件开发时，若当前组件与引用的项目都是用了相同的**核心依赖**，则会出现项目中引用了两次相同依赖的问题【关心第三点】

``` plain
Uncaught Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
```

这通常是由于组件库中 一些公用依赖写入了 package.json 的 `dependencies` 字段中，这显然是不好的，此时我们可以将依赖移入 `devDependencies` 中，并指定 `peerDependencies` 来告诉使用者，哪些是同行依赖【核心依赖】。

``` diff
{
  # ...
  "peerDependencies": {
+    "react": ">=16.9.0",
+    "react-dom": ">=16.9.0"
  },
  "dependencies": {
-    "react": "^18.2.0",
-    "react-dom": "^18.2.0",
  },
  "devDependencies": {
+    "react": "^18.2.0",
+    "react-dom": "^18.2.0",
  }
}
```

当我们使用 `npm link` / `pnpm link` 等方式进行测试时，上面的方法也许并没有解决问题（上面的方法是必要的，但由于link方式的特殊性，可能并不生效）此时我们可以手动在插件项目中指定核心依赖到目标项目对应的依赖项，以此来暂时解决该问题

例如：

``` bash
# 项目目录 /Users/name/workSpace/project/reactDemo
$ pwd
> /Users/name/workSpace/project/reactDemo

# 插件目录 /Users/name/workSpace/plugins/reactPlugin
$ npm link /Users/name/workSpace/project/reactDemo/node_modules/react
$ npm link /Users/name/workSpace/project/reactDemo/node_modules/react-dom
```

若需要取消 link， 可以通过 npm list 查看相应软链，并通过 `npm unlink` 来取消软链

``` bash
$ pnpm list
> react link: /Users/name/workSpace/project/reactDemo/node_modules/react
> react-dom link: /Users/name/workSpace/project/reactDemo/node_modules/react-dom

$ pnpm unlink /Users/name/workSpace/project/reactDemo/node_modules/react

$ pnpm unlink /Users/name/workSpace/project/reactDemo/node_modules/react-dom

```
