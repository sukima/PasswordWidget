var fs          = require('fs');
var streamqueue = require('streamqueue');
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var browserify  = require('gulp-browserify');
var uglify      = require('gulp-uglify');
var clean       = require('gulp-clean');
var header      = require('gulp-header');
var concat      = require('gulp-concat');
var bower       = require('gulp-bower');
var serve       = require('gulp-serve');
var pkg         = require('./package.json');

function es5_shim() {
  var es5Path = require.resolve('es5-shim');
  gutil.log('Packaging ' + gutil.colors.blue('es5-shim'));
  return gulp.src(es5Path);
}

var config = {
  name:     'PasswordWidget',
  destName: 'passwordwidget.js',
  destDir:  'dist',
  header:   'lib/header.ejs',
  scripts:  'lib/passwordwidget.js',
  specs:    'test/specs.js'
};

gutil.log('Environment', gutil.colors.blue(gulp.env.production ? 'Production' : 'Development'));

gulp.task('main', function() {
  var preamble = fs.readFileSync(config.header, 'utf8');
  var stream = streamqueue({objectMode: true});

  var bundle = gulp.src(config.scripts)
    .pipe(browserify({
      insertGlobals:    false,
      insertGlobalVars: false,
      standalone:       config.name,
      debug:            !gutil.env.production
    }));

  if (gutil.env.shim) { stream.queue(es5_shim()); }
  stream.queue(bundle);

  stream.done()
    .pipe(gutil.env.shim ? concat(config.destName) : gutil.noop())
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(header(preamble, pkg))
    .pipe(gulp.dest(config.destDir));

  gutil.log('Saved ' + gutil.colors.blue(config.name) +
    (gutil.env.shim ? ' (with es5-shim)' : '') +
    (gutil.env.production ? ' (minified)' : ' (debug)') +
    ' to ' + gutil.colors.magenta(config.destDir +'/'+ config.destName));
});

gulp.task('specs', function() {
  gulp.src(config.specs)
    .pipe(browserify({
      insertGlobals:    false,
      insertGlobalVars: false,
      debug:            true
    }))
    .pipe(gulp.dest(config.destDir));

  gutil.log('Saved specs to ' +
    gutil.colors.magenta(config.destDir +'/specs.js'));
});

gulp.task('bower', function() {
  bower('public/bower_components/');
});

gulp.task('serve', ['bower', 'main'], serve([
  config.destDir,
  'public',
  'commonPasswords.json'
]));

gulp.task('clean', function() {
  gulp.src(config.destDir, {read: false})
    .pipe(clean());
});

gulp.task('default', ['main', 'specs', 'bower']);
/* vim:set ts=2 sw=2 et fdm=marker: */
