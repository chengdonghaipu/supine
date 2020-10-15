import * as path from 'path';
import * as fs from 'fs';

export function mapDir(dir: string, callback: any, finish: any) {
  const files = fs.readdirSync(dir, { encoding: 'utf8' });

  files.forEach((filename, index) => {
    const pathname = path.join(dir, filename);

    const stats = fs.statSync(pathname);

    if (stats.isDirectory()) {
      mapDir(pathname, callback, finish);
    } else if (stats.isFile()) {
      if (['.json', '.less'].includes(path.extname(pathname))) {  // 排除 目录下的 json less 文件
        return;
      }

      const data = fs.readFileSync(pathname, { encoding: 'utf8' });

      callback && callback(data, pathname);
    }

    if (index === files.length - 1) {
      finish && finish();
    }
  });
}
