#!/usr/bin/env node

const program = require('commander');
const package = require('../package.json');

console.log(package.version);

program
  .version(package.version)
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