#!/usr/bin/env node

import { program } from "commander";
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import ora from 'ora';
import logSymbols from 'log-symbols';
import download from "download-git-repo";
import { spawnSync } from "child_process";

const packageData = JSON.parse(fs.readFileSync('package.json', 'utf8'))

console.log(packageData.version);

const templateList = {
  Vue: 'git@github.com:zhangjichengcc/create-app.git',
  React: 'git@github.com:zhangjichengcc/create-ap.git',
  gitbook: 'git@github.com:zhangjichengcc/create-app.git',
  docsify: 'git@github.com:zhangjichengcc/create-app.git',
}

/**
 * @description: 下载项目模板
 * @param {*} downLoadURL
 * @param {*} target
 * @return {*}
 */
function downloadProject(downLoadURL, target) {
  const {
    error
  } = spawnSync("git", ["--version"]);
  const githubUrl = downLoadURL.replace(/^git@github\.com:(.*)\.git$/, `github:$1#main`);
  if (error) {
    console.log(logSymbols.warning, chalk.yellow("未添加Git环境变量引起，添加Git与git管理库的环境变量即可；"))
    console.log(logSymbols.info, chalk.green('或直接到模板地址下载：', downLoadURL));
    return Promise.reject(error);
  }
  return new Promise(function (resolve, reject) {
    const spinner = ora('正在下载模板...')
    spinner.start()
    download(
      githubUrl,
      target,
      // { clone: true },
      function (err) {
        if (err) {
          spinner.fail('模板下载失败');
          if (err.toString().includes("status 128")) {
            console.log('\n', logSymbols.warning, chalk.yellow("Git默认开启了SSL验证，请尝试执行下面命令，关闭验证后再重试；"))
            console.log(logSymbols.info, chalk.green("git config --global http.sslVerify false"))
          }
          reject(err)
        } else {
          spinner.succeed('模板下载成功');
          resolve()
        }
      }
    )
  })
}

/**
 * @description: 初始化项目模板
 * @return {*}
 */
function initProject() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '请输入项目名称',
    },
    {
      type: 'list',
      name: 'frameTemplate',
      message: '请选择框架类型',
      choices: ['Vue', 'React', 'gitbook', 'docsify']
    }
  ]).then(reason => {
    const {
      projectName,
      frameTemplate
    } = reason;
    const downLoadURL = templateList[frameTemplate];
    downloadProject(downLoadURL, projectName).then(() => {
      console.log('\n', logSymbols.success, chalk.green('项目初始化完成'));
    }).catch(err => {
      console.log('\n', logSymbols.info, chalk.yellow(`失败原因：${err}`), '\n', `请尝试直接下载模板：git clone ${downLoadURL}`);
    })
  })
}

program
  .version(packageData.version)
  .command('init')
  .description('create a new project')
  .alias('i')
  // .option('-r, --react', 'react template')
  // .option('-v, --vue', 'vue template')
  // .option('-v2, --vue2', 'vue2 template')
  // .option('-v3, --vue3', 'vue3 template')
  .action((projectName, options) => {
    initProject()
  })

program.parse(process.argv)



// https://juejin.cn/post/6979511969736818701

// https://juejin.cn/post/6911987404039520270#heading-11

// https://blog.csdn.net/ZhaoQM_script/article/details/120631231