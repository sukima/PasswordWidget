var gulp       = require('gulp');
var gutil      = require('gulp-util');
var browserify = require('gulp-browserify');
var uglify     = require('gulp-uglify');
var clean      = require('gulp-clean');

var paths = {
  dest:    'build',
  scripts: 'lib/PasswordWidget.js',
  specs:   'test/specs.js'
};

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(browserify({
      standalown: true,
      debug: !gutil.env.production
    }))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(gulp.dest(paths.dest));
});

gulp.task('specs', function() {
  gulp.src(paths.specs)
    .pipe(browserify({
      standalown: true,
      debug: true
    }))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('clean', function() {
  gulp.src(paths.dest, {read: false})
    .pipe(clean());
});

gulp.task('default', ['scripts']);
/* vim:set ts=2 sw=2 et fdm=marker: */
