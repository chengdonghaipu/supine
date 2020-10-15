'use strict';

/**
 * Load the TypeScript compiler, then load the TypeScript gulpfile which simply loads all
 * the tasks. The tasks are really inside tools/gulp/tasks.
 */

const path = require('path');

/**
 * 根目录
 * @type {string}
 */
const projectDir = __dirname;
const tsconfigPath = path.join(projectDir, 'tools/gulp/tsconfig.json');
const tsconfig = require(tsconfigPath);

if (projectDir.includes(' ')) {
  console.error('Error: 目录错误  中间不能有空格 请重命名');
  process.exit(1);
}


require('ts-node').register({
  project: tsconfigPath
});

require('tsconfig-paths').register({
  baseUrl: path.dirname(tsconfigPath), // \tools\gulp
  paths: tsconfig.compilerOptions.paths
});

require('./tools/gulp/gulpfile');
// require('./tools/package-tools/find-build-config');
// require('./tools/releases/npm-push-releases');
// require('./tools/package-tools/rollup-globals');
