#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from 'node:fs';
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = require("../package.json");

const program = new Command();

/**
 * generators 列表，从 generators 文件夹动态获取
 */
const generators = fs
  .readdirSync(`${__dirname}/generators`)
  .filter((f) => !f.startsWith('.'))
  .map((f) => {
    return {
      name: `${f.padEnd(15)} - ${chalk.gray(require(`./generators/${f}/meta.json`).description)}`,
      value: f,
      short: f,
    };
  });

/**
 * @description: 初始化项目，设置命令提示，获取项目名称
 * @return {Promise<string>}
 */
function init(){

  return new Promise(function(resolve) {
    program
    .name(Object.keys(pkg.bin)[0])  // 在usage最前面添加项目名称，与usage配套使用。控制台打印：Usage: app-cli <command> [options]
    .usage('<command> [options]')   // 使用建议，与yargs一样：usage里的内容会打印在最前面
    .version(pkg.version, '-v, --version')
    .command('init <dirName>')
    .description('create a new project')
    .alias('i')
    .action((appName) => {
      resolve(appName);
    })

    program.parse(process.argv);
  })
}

/**
 * @description: 获取项目打包工具类型
 * @return {Promise<string>} 工具类型
 */
function getAppType() {
 return new Promise(function(resolve) {
   inquirer.prompt([
     {
       name: 'type',
       message: 'Select the Packaging tool type',
       type: 'list',
       choices: generators
     }
   ]).then(function(args) {
     const { type } = args;
     resolve(type);
   })
 })
}

/**
 * @description: 执行构造器函数
 * @param {string} generatorPath 构造器路径
 * @param {string} name 项目名
 * @param {string} type 模板类型
 * @return {*}
 */
async function runGenerator(generatorPath, name, type) {
  const { default: Generator } = await import(generatorPath);
  const generator = new Generator({name, type});
  return generator.run(() => {
    if (name) {
      // if (process.platform !== `linux` || process.env.DISPLAY) {
        // clipboardy.writeSync(`cd ${name}`);
        console.log('📋 Copied to clipboard, just use Ctrl+V');
      // }
    }
    console.log('✨ File Generate Done');
    // resolve(true);
  });
}

async function run() {
  const name = await init();
  const type = await getAppType();

  try {
    return runGenerator(`./generators/${type}/index.js`, name, type);
  } catch (e) {
    console.error(chalk.red(`> Generate failed`), e);
    process.exit(1);
  }
}

run()