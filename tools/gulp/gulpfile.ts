import {task, series} from 'gulp';
import './tasks';




task('start:dev', series(
  // 'clean',
  'start:site'
));
