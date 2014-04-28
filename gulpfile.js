/*jslint indent: 2 todo: true*/
// TODO: minify dist/css
var gulp = require('gulp'),
  // note that this invokes itself, returning the gulpLoadPlugins object
  plg = require('gulp-load-plugins')();

var cleanDirs = ['dist/'],
  sassSrcGlob = './src/sass/*.scss',
  cssDistGlob = './dist/css/*.css',
  cssSrcOut = './src/css/',
  cssDistOut = './dist/css',
  srcBase = 'src/';

gulp.task('default', ['preview']);

gulp.task('clean', function () {
  'use strict';
  return gulp.src(cleanDirs)
    .pipe(plg.clean({read: false, force: true}));
});

gulp.task('compileStyles', ['clean'], function () {
  'use strict';
  gulp.src(sassSrcGlob)
    .pipe(plg.rubySass())
    .pipe(gulp.dest(cssSrcOut));

  return gulp.src(cssSrcOut + '*', { base: srcBase })
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', ['compileStyles'], function () {
  'use strict';
  gulp.src(cssDistGlob)
    .pipe(plg.minifyCss())
    .pipe(plg.rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(plg.header('/* Compiled on <%- prettyDate %> */\n', { prettyDate: plg.util.date(Date.now()) }))
    .pipe(gulp.dest(cssDistOut));
});

// Open index in a browser to preview current progress
gulp.task('preview', ['minify'], function () {
  'use strict';
  return gulp.src('./index.html')
    .pipe(plg.open());
});