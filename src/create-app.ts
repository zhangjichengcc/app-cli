// #!/usr/bin/env node

import { program } from "commander";
// import inquirer from "inquirer";
// import chalk from "chalk";
// import ora from "ora";
// import logSymbols from "log-symbols";
// import download from "download-git-repo";
// import { spawnSync } from "child_process";
import { createRequire } from "node:module";
// import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const pkg = require("../package.json");
// import packageData from "../package.json";

// const packageData = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const templateList = {
  Vue: "git@github.com:zhangjichengcc/create-app.git",
  React: "git@github.com:zhangjichengcc/create-ap.git",
  gitbook: "git@github.com:zhangjichengcc/create-app.git",
  docsify: "git@github.com:zhangjichengcc/create-app.git",
} as const;

type TemplateKeys = keyof typeof templateList;

/**
 * @description: 下载项目模板
 * @param {*} downLoadURL
 * @param {*} target
 * @return {*}
 */
// function downloadProject(downLoadURL: string, target: string) {
//   const { error } = spawnSync("git", ["--version"]);
//   const githubUrl = downLoadURL.replace(
//     /^git@github\.com:(.*)\.git$/,
//     `github:$1#main`
//   );
//   if (error) {
//     console.log(
//       logSymbols.warning,
//       chalk.yellow("未添加Git环境变量引起，添加Git与git管理库的环境变量即可；")
//     );
//     console.log(
//       logSymbols.info,
//       chalk.green("或直接到模板地址下载：", downLoadURL)
//     );
//     return Promise.reject(error);
//   }
//   return new Promise<void>(function (resolve, reject) {
//     const spinner = ora("正在下载模板...");
//     spinner.start();
//     download(githubUrl, target, function (err: string) {
//       if (err) {
//         spinner.fail("模板下载失败");
//         if (err.toString().includes("status 128")) {
//           console.log(
//             "\n",
//             logSymbols.warning,
//             chalk.yellow(
//               "Git默认开启了SSL验证，请尝试执行下面命令，关闭验证后再重试；"
//             )
//           );
//           console.log(
//             logSymbols.info,
//             chalk.green("git config --global http.sslVerify false")
//           );
//         }
//         reject(err);
//       } else {
//         spinner.succeed("模板下载成功");
//         resolve();
//       }
//     });
//   });
// }

/**
 * @description: 初始化项目模板
 * @return {*}
 */
// function initProject() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "projectName",
//         message: "请输入项目名称",
//       },
//       {
//         type: "list",
//         name: "frameTemplate",
//         message: "请选择框架类型",
//         choices: ["Vue", "React", "gitbook", "docsify"],
//       },
//     ])
//     .then((reason: { projectName: string; frameTemplate: TemplateKeys }) => {
//       const {
//         projectName,
//         frameTemplate,
//       }: {
//         projectName: string;
//         frameTemplate: TemplateKeys;
//       } = reason;
//       const downLoadURL = templateList[frameTemplate];
//       downloadProject(downLoadURL, projectName)
//         .then(() => {
//           console.log(logSymbols.success, chalk.green("项目初始化完成"));
//         })
//         .catch((err) => {
//           console.log(
//             "\n",
//             logSymbols.info,
//             chalk.yellow(`失败原因：${err}`),
//             "\n",
//             `请尝试直接下载模板：git clone ${downLoadURL}`
//           );
//         });
//     });
// }




function run() {
  program
  .name(Object.keys(pkg.bin)[0])  // 在usage最前面添加项目名称，与usage配套使用。控制台打印：Usage: lio-imooc-test <command> [options]
  .usage('<command> [options]')// 使用建议，与yargs一样：usage里的内容会打印在最前面
  .version(pkg.version, '-v, --version')
  // .command("init")
  // .description("create a new project")
  // .alias("i")
  // .action(() => {
  //   initProject();
  // });

  program.parse(process.argv);
}

// const run = async (config) => {
//   process.send && process.send({ type: 'prompt' });
//   process.emit('message', { type: 'prompt' });

//   let { type } = config;
//   if (!type) {
//     const answers = await inquirer.prompt([
//       {
//         name: 'type',
//         message: 'Select the boilerplate type',
//         type: 'list',
//         choices: generators,
//       },
//     ]);
//     type = answers.type;
//   }

//   try {
//     return runGenerator(`./generators/${type}`, config);
//   } catch (e) {
//     console.error(chalk.red(`> Generate failed`), e);
//     process.exit(1);
//   }
// };

run()

