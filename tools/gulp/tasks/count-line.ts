import { mapDir } from '../util/map-dir';
import { series, task } from 'gulp';
import * as path from 'path';


function countLine(cd: () => void) {
  const pathList = [
    'src',
    'tools',
    'deprecated',
    'e2e',
    'src/app/libs/map-webgl',
    'src/app/pages/map-webgl',
  ];

  let count = 0;

  pathList.forEach(dir => {
    const basePath = path.join(process.cwd(), dir);
    let curCount = 0;

    mapDir(basePath, (file: Buffer) => {
      const temp = file.toString().split('\n').length;
      count += temp;
      curCount += temp;
    }, () => {
    });

    console.log(`目录: ${dir}  行数: ${curCount}`);

  });
  console.log(`总行数: ${count}`);

  cd && cd();
}

task('count:line', series(countLine));
