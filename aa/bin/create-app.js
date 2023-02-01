#!/usr/bin/env node

// const program = require('commander');
// const inquirer = require('inquirer');
// const package = require('../package.json');

import { program } from "commander";
import inquirer from 'inquirer';
import fs from 'fs';
const packageData = JSON.parse(fs.readFileSync('package.json', 'utf8'))
// import * as packageData from '../package.json';

console.log(packageData.version);

program
  .version(packageData.version)
  .command('create <projectName>')
  .description('create a new project')
  .alias('c')
  .option('-r, --react', 'react template')
  .option('-v, --vue', 'vue template')
  .option('-v2, --vue2', 'vue2 template')
  .option('-v3, --vue3', 'vue3 template')
  .action((projectName, options) => {
    console.log(projectName, options)
  })

program.parse(process.argv)

// https://juejin.cn/post/6979511969736818701

// https://juejin.cn/post/6911987404039520270#heading-11

// https://blog.csdn.net/ZhaoQM_script/article/details/120631231