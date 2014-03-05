var gulp       = require('gulp');
var gutil      = require('gulp-util');
var browserify = require('gulp-browserify');
var uglify     = require('gulp-uglify');
var clean      = require('gulp-clean');

var config = {
  name:    'PasswordWidget',
  dest:    'build',
  scripts: 'lib/passwordwidget.js',
  specs:   'test/specs.js'
};

gulp.task('scripts', function() {
  gulp.src(config.scripts)
    .pipe(browserify({
      standalone: config.name,
      debug:      !gutil.env.production
    }))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(gulp.dest(config.dest));
});

gulp.task('specs', function() {
  gulp.src(config.specs)
    .pipe(browserify({
      debug: true
    }))
    .pipe(gulp.dest(config.dest));
});

gulp.task('clean', function() {
  gulp.src(config.dest, {read: false})
    .pipe(clean());
});

gulp.task('default', ['scripts']);
/* vim:set ts=2 sw=2 et fdm=marker: */
