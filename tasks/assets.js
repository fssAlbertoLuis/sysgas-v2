const { src, dest } = require('gulp');

function copyHtml() {
  src('app/renderer/**/*.css').pipe(dest('build/renderer'));
  src([
    'app/main/**/*.json',
    'app/main/**/*.sqlite3',
    'app/main/**/*.ico'
  ]).pipe(dest('build/main'));
  return src('app/renderer/index.html').pipe(dest('build/renderer'));
}

copyHtml.displayName = 'copy-html';

exports.copyHtml = copyHtml;
