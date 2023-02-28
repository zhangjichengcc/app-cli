import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import logSymbols from "log-symbols";
import download from "download-git-repo";
import { spawnSync } from "child_process";
import fs from 'node:fs';
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Generator {
  constructor(opts) {
    this.name = opts.name;
    this.type = opts.type;
    this.prompts = {};
    this.githubRepo = '';
  }

  prompting() {
    this.prompts = {}
  }

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
   * @description: 获取模板类型
   * @param {string} generatorType
   * @return {void}
   */
  getTemplateType(generatorType) {
    const templates = fs
      .readdirSync(`${__dirname}/generators/${generatorType}/packages`)
      .filter((f) => !f.startsWith('.'))
      .map((f) => {
        return {
          name: `${f.padEnd(15)} - ${chalk.gray(require(`./generators/${generatorType}/packages/${f}/meta.json`).description)}`,
          value: f,
          short: f,
        };
      });
    return new Promise(function(resolve) {
      inquirer.prompt([
        {
          name: 'template',
          message: `What's your plugin used for?`,
          type: 'list',
          choices: templates
        }
      ]).then(function(args) {
        const { template } = args;
        resolve(template);
      })
    })
  }

  // https://juejin.cn/post/6986462081444741134
  readDirSync(currentDirPath, callback) {
    return new Promise(function(resolve, reject) {
      fs.readFileSync(currentDirPath, { withFileTypes: true }).forEach(function(dirent) {
        const filePath = path.join(currentDirPath, dirent.name);
        if (dirent.isFile()) {
          resolve(filePath, dirent);
        } else if (dirent.isDirectory()) {
          walkSync(filePath, callback);
        }
      })
    })
  }

  async run() {
    
    const template = await this.getTemplateType(this.type);
    await this.prompting();

    console.log(this.prompts, template, this.name, this.type)
    // this.downloadProject(this.githubRepo, this.name);
  }

}

export default Generator;