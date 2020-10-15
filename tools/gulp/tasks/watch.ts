/*
import { task } from 'gulp';
import { watchFiles } from '../util/watch-files';
import { /!*spawnSync, *!/spawn } from 'child_process';
import { join } from 'path';
const electron = require('electron-connect').server.create();

function startApp(cb?: any) {
  const result = spawn('tsc', ['-p', 'tsconfig-serve.json'], {
    stdio: 'inherit',
    shell: true,
    cwd: join(process.cwd(), '')
  });

  result.addListener('close', (event) => {
    if (+event === 0) {
      console.log('主线程ts 编译完成...');
    }
    !cb && electron.start();
    cb && electron.restart();
  });
  cb && cb();
}

task('main:watch', () => {
  const glob = [`${process.cwd()}/main.ts`, `${process.cwd()}/main/!**!/!*.ts`];
  watchFiles(glob, (cb) => startApp(cb));
  startApp();
});
*/
