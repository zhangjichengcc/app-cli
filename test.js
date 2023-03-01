import { readdir, readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

async function copyFiles(source, target) {
  if (source.includes('package.json')) {
    const str = await readFile(source, { encoding: 'utf8' });
    const data = JSON.parse(str);
    data.name = '666';
    writeFile(target, JSON.stringify(data, null, 2));
  } else {
    copyFile(source, target);
  }
}

async function copyDirSync(source, target) {
  await mkdir(target);
  readdir(source, {withFileTypes: true}).then(function(files) {
    files.forEach(function(file) {
      const { name } = file;
      if (['node_modules'].includes(name)) return;
      const isDir = file.isDirectory();
      const sourcePath = path.join(source, name),
      targetPath = path.join(target, name)
      if (isDir) {
        copyDirSync(sourcePath, targetPath);
      } else {
        copyFiles(sourcePath, targetPath);
        console.log('file write', targetPath)
      }
    })
  })
}

function a() {
  throw new Error('error');
}

async function b() {
  try {
    a()
  } catch (err) {
    debugger
  }
}

// copyFile('./package.json');
// copyDirSync('./lib/generators/rollup/templates/pureJavascript/template', './test');
b();