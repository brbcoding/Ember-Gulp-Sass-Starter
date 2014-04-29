/*jslint indent: 2 todo: true*/
var gulp = require('gulp'),
  plg = require('gulp-load-plugins')(), // note that this invokes itself, returning the gulpLoadPlugins object
  pkg = require('./package.json');

var cleanDirs = ['dist/'],
  sassSrcGlob = './src/sass/*.scss',
  cssDistGlob = './dist/css/*.css',
  cssSrcOut = './src/css/',
  cssDistOut = './dist/css',
  srcBase = 'src/';

var banner = ['/**',
  ' * <%= pkg.name %>',
  ' * <%= pkg.description %>',
  ' * @author <%= pkg.author %>',
  ' * @version v<%= pkg.version %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('default', ['preview']);

// remove old stuff
gulp.task('clean', function () {
  'use strict';
  return gulp.src(cleanDirs)
    .pipe(plg.clean({read: false, force: true}));
});

// compile sass to css, then copy from src to dist
gulp.task('compileStyles', ['clean'], function () {
  'use strict';
  gulp.src(sassSrcGlob)
    .pipe(plg.rubySass())
    .pipe(gulp.dest(cssSrcOut));

  return gulp.src(cssSrcOut + '*', { base: srcBase })
    .pipe(gulp.dest('dist'));
});

// minify our css and add a banner
gulp.task('minify', ['compileStyles'], function () {
  'use strict';
  gulp.src(cssDistGlob)
    .pipe(plg.minifyCss())
    .pipe(plg.rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(plg.header(banner, { pkg: pkg }))
    .pipe(gulp.dest(cssDistOut));
});

// Open index in a browser to preview current progress
gulp.task('preview', ['minify'], function () {
  'use strict';
  return gulp.src('./index.html')
    .pipe(plg.open());
});