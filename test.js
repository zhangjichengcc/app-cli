import { readdir, readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import ora from 'ora';
import chalk from "chalk";
import ejs from 'ejs';

function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, ms)
  })
}

async function copyFiles(source, target) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve();
    }, 1000);
  })
  // if (source.includes('package.json')) {
  //   const str = await readFile(source, { encoding: 'utf8' });
  //   const data = JSON.parse(str);
  //   data.name = '666';
  //   writeFile(target, JSON.stringify(data, null, 2));
  // } else {
  //   copyFile(source, target);
  // }
}

async function copyDirSync(source, target) {
  // await mkdir(target);
  await readdir(source, {withFileTypes: true}).then(async function(files) {

    for(const file of files) {
      const { name } = file;
      if (['node_modules'].includes(name)) continue;
      const isDir = file.isDirectory();
      const sourcePath = path.join(source, name),
      targetPath = path.join(target, name);
      if (isDir) {
        // await copyDirSync(sourcePath, targetPath);
      } else {
        // spinner.start(targetPath);
        copyFiles(sourcePath, targetPath);
        console.log(`create: ${chalk.gray(targetPath)}`);
        // spinner.succeed();
      }
    }
    console.log('copy dir')

    // console.log('copyDirSync success');
    // files.forEach(async function(file) {
    //   const { name } = file;
    //   if (['node_modules'].includes(name)) return;
    //   const isDir = file.isDirectory();
    //   const sourcePath = path.join(source, name),
    //   targetPath = path.join(target, name);
    //   if (isDir) {
    //     await copyDirSync(sourcePath, targetPath);
    //   } else {
    //     await copyFiles(sourcePath, targetPath);
    //     // console.log('file write', targetPath)
    //   }
    // })
  })
}

async function runSpinner() {
  const spinner = ora(`Loading ${chalk.blue('unicorns')}`);
  spinner.start();
  await sleep(1000);
  spinner.text = `Loading ${chalk.green('unicorns')}`;
  await sleep(1500);
  spinner.succeed()
}



async function ejsTest() {
  const obj = {
    name: 'tom',
    age: '12',
  }
  const str = await readFile('./ejsdemo.json', { encoding: 'utf8' });
  const data = ejs.render(str, obj);
  writeFile('./test.json', data);
  debugger
}

// ejsTest()


// copyDirSync('./lib/generators/rollup/templates/pureJavascript/template', './test').then(function() {
//   debugger
// });
// spinner.spinner();
// runSpinner()

async function f1() {
  await sleep(1000);
  // return Promise.reject('555');
  throw new Error('666');
}

async function run() {
  try {
    await f1()
  } catch (err) {
    console.log(err)
  }
}

run()