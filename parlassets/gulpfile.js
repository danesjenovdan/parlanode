const gulp     = require('gulp');
const uglify   = require('gulp-uglify');
const pump     = require('pump');
const rename   = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');

gulp.task('js', function ( cb ) {
  pump([
      gulp.src('js/script.js'),
      uglify(),
      rename('script.min.js'),
      gulp.dest('js')
    ],
    cb
  );
});

gulp.task('css', function ( cb ) {
  pump([
      gulp.src('scss/style.css'),
      cleanCSS({ compatibility : 'ie8' }),
      rename('style.min.css'),
      gulp.dest('css')
    ],
    cb
  );
});

gulp.task('build', [ 'js', 'css' ]);