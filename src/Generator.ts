// import { program } from "commander";
import inquirer, { QuestionCollection } from "inquirer";
import chalk from "chalk";
import ora from "ora";
import logSymbols from "log-symbols";
import download from "download-git-repo";
import { spawnSync } from "child_process";
// import packageData from "../package.json";

export interface GenerateConstructor {
  name: string;
}

class Generator {
  /** 项目名【文件名】 */
  readonly name: string;
  public prompts: {[key: string]: string};
  public githubRepo: string;
  
  constructor(opts: GenerateConstructor) {
    this.name = opts.name;
    this.prompts = {};
    this.githubRepo = '';
  }

  prompting() {
    this.prompts = {}
  }

  prompt(prompts: QuestionCollection) {
    return inquirer.prompt(prompts)
  }

  /**
   * 下载指定模版
   * @param downLoadURL 
   * @param target 
   * @returns 
   */
  downloadProject(downLoadURL: string, target: string) {
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
    return new Promise<void>(function (resolve, reject) {
      const spinner = ora("正在下载模板...");
      spinner.start();
      download(githubUrl, target, function (err: string) {
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

  async run() {
    await this.prompting();
    this.downloadProject(this.githubRepo, this.name);
  }

}

export default Generator;