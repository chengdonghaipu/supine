import {task, series} from 'gulp';
// import { watchFiles } from '../util/watch-files';
import './clean';
import * as path from 'path';
import {spawn, spawnSync} from 'child_process';
import {resolve as resolvePath} from 'path';
import * as chalk from 'chalk';
import {copyFiles} from '../util/copy-file';
import * as fs from 'fs';
// import {mapDir} from '../util/map-dir';

const packages = ['dy-form', 'dy-form-zorro'];
/*function copyFile(cb: () => void) {
  copyFiles(`${process.cwd()}/`, '*.*', `${process.cwd()}/app/`);
  copyFiles(`${process.cwd()}/src/`, '**', `${process.cwd()}/app/src/`);
  cb();
}*/


/*function cleanAssets() {
  return src(path.join(process.cwd(), 'dist', 'assets'), { read: false, allowEmpty: true })
    .pipe(gulpClean(null));
}

function copyAssets(cd: () => void) {
  copyFiles(path.join(process.cwd(), 'assets'), '**', path.join(process.cwd(), 'dist', 'gms', 'assets'));
  cd();
}*/

export function tsCompile(binary: 'tsc' | 'ngc', flags: string[]) {
  return new Promise((resolve, reject) => {
    const binaryPath = resolvePath(`./node_modules/typescript/bin/${binary}`);
    flags.unshift(binaryPath);
    const childProcess = spawn('node', flags, {shell: true});

    // Pipe stdout and stderr from the child process.
    childProcess.stdout.on('data', (data: string | Buffer) => console.log(`${data}`));
    childProcess.stderr.on('data', (data: string | Buffer) => console.error(chalk.red(`${data}`)));
    childProcess.on('exit', (exitCode: number) => {
      exitCode === 0 ? resolve() : reject(`${binary} compilation failure`);
    });
  });
}

function version(cd: () => void) {
  const json = require(path.join(process.cwd(), 'package.json'));

  const vs = json?.version;

  if (!vs) {
    throw Error(``);
  }

  packages.forEach(value => {
    const packagePath = path.join(process.cwd(), 'dist', value, 'package.json');

    const packageJson = require(packagePath);

    packageJson.version = vs;

    const strPackage = fs.readFileSync(packagePath).toString().replace(/PACKAGE_VERSION/g, vs);

    fs.writeFileSync(packagePath, strPackage, {encoding: 'utf8'});

    const addPath = path.join(process.cwd(), 'dist', value, 'schematics', 'ng-add', 'index.js');

    const str = fs.readFileSync(addPath).toString().replace(/PACKAGE_VERSION/g, vs);

    fs.writeFileSync(addPath, str);
  });
  cd();
}

function build(cd: () => void) {
  packages.forEach(async (name) => {
    const result = spawnSync('ng', ['build', name, '--prod'],
      {
        cwd: process.cwd(),
        shell: true,
        env: process.env,
        stdio: 'pipe'
      });

    if (result.status !== 0) {
      console.log(result);
    }

    const basePath = path.join(process.cwd(), 'projects', name);

    await tsCompile('tsc', ['-p', path.join(basePath, 'tsconfig.schematics.json')]);


    copyFiles(path.join(basePath, 'schematics'), '**/schema.json', path.join(process.cwd(), 'dist', name, 'schematics'));
    copyFiles(path.join(basePath, 'schematics'), 'collection.json', path.join(process.cwd(), 'dist', name, 'schematics'));
    copyFiles(path.join(basePath, 'schematics'), 'migration.json', path.join(process.cwd(), 'dist', name, 'schematics'));
    copyFiles(path.join(basePath, 'schematics'), '*/files/**', path.join(process.cwd(), 'dist', name, 'schematics'));
    copyFiles(path.join(basePath, 'readme-image'), '**', path.join(process.cwd(), 'dist', name, 'readme-image'));
  });
  cd();
}

function publish(cd: () => void) {
  packages.forEach(async (name) => {
    const result = spawnSync('npm', ['publish', '--access', 'public'],
      {
        cwd: path.join(process.cwd(), 'dist', name),
        shell: true,
        env: process.env,
        stdio: 'pipe'
      });

    if (result.status !== 0) {
      console.log(result.stderr.toString());
    }
  });

  cd();

}


task('build:app', series(build));
task('build:version', series(version));
task('build:publish', series(publish));
// task('build:app:test', series(replaceMapLayerCtor));


