import {watch, TaskFunction} from 'gulp';

/** Function that watches a set of file globs and runs given Gulp tasks if a given file changes. */
export function watchFiles(fileGlob: string | string[], tasks: TaskFunction,
                           debounceDelay = 700) {
  watch(fileGlob, {delay: debounceDelay}, tasks);
}
