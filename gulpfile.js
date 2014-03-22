var fs         = require('fs');
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var browserify = require('gulp-browserify');
var uglify     = require('gulp-uglify');
var clean      = require('gulp-clean');
var header     = require('gulp-header');
var pkg        = require('./package.json');

var config = {
  name:    'PasswordWidget',
  dest:    'build',
  header:  'lib/header.ejs',
  scripts: 'lib/passwordwidget.js',
  specs:   'test/specs.js'
};

gulp.task('main', function() {
  var preamble = fs.readFileSync(config.header, 'utf8');
  gulp.src(config.scripts)
    .pipe(browserify({
      standalone: config.name,
      debug:      !gutil.env.production
    }))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(header(preamble, pkg))
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

gulp.task('default', ['main', 'specs'], function() {
  gutil.log('Saved ' + config.name +
    (gutil.env.production ? ' (minified)' : ' (debug)') +
    ' to ' + config.dest);
});
/* vim:set ts=2 sw=2 et fdm=marker: */
