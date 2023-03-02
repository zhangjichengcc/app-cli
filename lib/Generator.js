import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import logSymbols from "log-symbols";
import download from "download-git-repo";
import { spawnSync } from "child_process";
import { readdir, readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

class Generator {
  constructor(opts) {
    /**
     * @description: 自定义 package.json 配置
     * @type {Object}
     */
    this.package = {};
    /**
     * @description: 源模板路径
     * @type {string}
     */
    this.sourcePath = '';
    /**
     * @description: 目标路径
     * @type {string}
     */
    this.targetPath = opts.name;
    /**
     * @description: generators 类型
     * @type {string}
     */
    this.type = opts.type;
    /**
     * @description: prompt 问答结果（不包含package.json配置内容）
     * @type {Object}
     */
    this.prompts = {};
    /**
     * @description: 复制忽略文件
     * @type {Array<{[key: string]: any}>}
     */
    this.copyIgnore = [
      'node_modules'
    ]
  }

  /**
   * @description: 生成问答
   * @return {void}
   */  
  prompting() {
    this.prompts = {}
  }

  /**
   * @description: 执行问答交互
   * @param {*} prompts 问答内容
   * @return {Promise<Object>}
   */
  prompt(prompts) {
    return inquirer.prompt(prompts)
  }

  /**
   * 下载指定模版
   * @param {string} downLoadURL 下载链接
   * @param {string} target 目标目录
   * @returns {void}
   */
  downloadProject(downLoadURL, target) {
    const { error } = spawnSync("git", ["--version"]);
    const githubUrl = downLoadURL.replace(
      /^git@github\.com:(.*)\.git$/,
      `github:$1#main`
    );
    if (error) {
      console.log(
        logSymbols.warning,
        chalk.yellow("未添加Git环境变量引起，添加Git与git管理库的环境变量即可；")
      );
      console.log(
        logSymbols.info,
        chalk.green("或直接到模板地址下载：", downLoadURL)
      );
      return Promise.reject(error);
    }
    return new Promise(function (resolve, reject) {
      const spinner = ora("正在下载模板...");
      spinner.start();
      download(githubUrl, target, function (err) {
        if (err) {
          spinner.fail("模板下载失败");
          if (err.toString().includes("status 128")) {
            console.log(
              "\n",
              logSymbols.warning,
              chalk.yellow(
                "Git默认开启了SSL验证，请尝试执行下面命令，关闭验证后再重试；"
              )
            );
            console.log(
              logSymbols.info,
              chalk.green("git config --global http.sslVerify false")
            );
          }
          reject(err);
        } else {
          spinner.succeed("模板下载成功");
          resolve();
        }
      });
    });
  }

  /**
   * @description: 复制文件
   * @param {string} source 原始路径
   * @param {string} target 模板路径
   * @return {*}
   */  
  async copyFiles(source, target) {
    if (source.includes('package.json')) {
      const str = await readFile(source, { encoding: 'utf8' });
      const data = JSON.parse(str);
      // 遍历 package.json 写入配置项
      Object.entries(data).forEach(function([key, value]) {
        data[key] = value;
      })
      writeFile(target, JSON.stringify(data, null, 2));
    } else {
      copyFile(source, target);
    }
  }
  
  /**
   * @description: 复制文件目录
   * @param {string} source 复制原始路径
   * @param {string} target 复制模板路径
   * @return {*}
   */  
  copyDirSync(source, target) {
    return new Promise((resolve, reject) => {
      mkdir(target)
      .then(() => readdir(source, {withFileTypes: true}))
      .then(async files => {
        for(const file of files) {
          const { name } = file;
          // 过滤忽略列表文件
          if (this.copyIgnore.includes(name)) continue;
          const isDir = file.isDirectory(),
          sourcePath = path.join(source, name),
          targetPath = path.join(target, name);
          if (isDir) {
            await this.copyDirSync(sourcePath, targetPath);
          } else {
            await this.copyFiles(sourcePath, targetPath);
            console.log(`create: ${chalk.gray(targetPath)}`);
          }
        }
        resolve('Completion of project creation !');
      })
      .catch(err => {
        reject(err?.message);
      })
    })
  }

  /**
   * @description: 入口函数
   * @return {*}
   */  
  async run() {
    await this.prompting();
    return this.copyDirSync(this.sourcePath, this.targetPath);
  }

}

export default Generator;