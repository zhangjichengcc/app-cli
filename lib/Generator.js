import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import ejs from 'ejs';
import logSymbols from "log-symbols";
import download from "download-git-repo";
import { spawnSync, exec } from "child_process";
import { readdir, readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, ms)
  })
}

/**
 * @description: 构造器
 * @return {Generator}
 */
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
      'node_modules',
      'package.json',
      'package-lock.json',
      'stats.html' // 
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
   * @description: ejs 替换模版参数
   * @param {string} template 模板字符串
   * @param {object} options 参数集合
   * @return {string} 替换结果
   */  
  replaceFile(template, options) {
    const data = ejs.render(template, options);
    return data;
  }

  /**
   * @description: 复制文件
   * @param {string} source 原始路径
   * @param {string} target 模板路径
   * @return {*}
   */  
  async copyFiles(source, target) {
    // 处理 package.json 文件，将配置项写入
    if (source.includes('_package.json')) {
      const packageStr = await readFile(source, { encoding: 'utf8' });
      const str = this.replaceFile(packageStr, this.package);
      await writeFile(target.replace('_package.json', 'package.json'), str);
    } else {
      await copyFile(source, target);
    }
  }
  
  /**
   * @description: 复制文件目录
   * @param {string} source 复制原始路径
   * @param {string} target 复制模板路径
   * @return {Promise<Array<string>>}
   */  
  copyDirSync(source, target) {
    const fileList = [];
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
            const files = await this.copyDirSync(sourcePath, targetPath);
            fileList.push(...files);
          } else {
            await this.copyFiles(sourcePath, targetPath);
            fileList.push(targetPath);
            // console.log(`create: ${chalk.gray(targetPath)}`);
          }
        }
        resolve(fileList);
      })
      .catch(err => {
        reject(err?.message);
      })
    })
  }

  /**
   * @description: 执行脚本
   * @param {string} command
   * @return {Promise<Array<string>>}
   */
  execSync(command, options = {}) {
    return new Promise(function(resolve, reject) {
      exec(command, options, function(error, stdout){
        const stdoutList = [];
        if(stdout) stdoutList.push(stdout);
        if (error) {
          reject(error)
        } else {
          resolve(stdoutList);
        }
      })
    })
  }

  /**
   * @description: 写入模板
   * @return {*}
   */  
  async writing() {
    const spinner = ora('Create template...\n');
    spinner.start();
    await sleep(3000);
    return this.copyDirSync(this.sourcePath, this.targetPath)
    .then((fileList) => {
      spinner.succeed('Template is created');
      fileList.forEach(file => console.log('create:', chalk.gray(file)));
    })
    .catch(err => {
      spinner.fail(chalk.red('Template creation failure'));
      return Promise.reject(err);
    })
  }

  /**
   * @description: 结束前执行
   * @return {*}
   */  
  beforeFinished () {
    // do somethings
  }

  /**
   * @description: 入口函数
   * @return {*}
   */  
  async run() {
    try {
      await this.prompting();
      await this.writing();
      await this.beforeFinished();
    } catch(err) {
      return Promise.reject(err);
    }
  }
}

export default Generator;