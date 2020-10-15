import {task, src} from 'gulp';

// This import lacks type definitions.
const gulpClean = require('gulp-clean');

/** Deletes the output directory. */
task('clean', () => src(`${process.cwd()}/app`, { read: false }).pipe(gulpClean(null)));
