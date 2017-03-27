var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var mocha = require('gulp-mocha');
var babel = require("gulp-babel");

gulp.task('server', function() {
  var server = require('./dist/lib/server/index.js');
});

// Copy static folder
gulp.task('copyStatic', ['copyTemplates'], function() {
  'use strict';
  return gulp.src(['lib/**/*.json'])
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('copyTemplates', function() {
  'use strict';
  return gulp.src(['templates/**/*.*'])
        .pipe(gulp.dest('dist/templates'));
});

// Copy index.js
gulp.task('copyIndex', function() {
  'use strict';
  return gulp.src(['index.js'])
        .pipe(gulp.dest('dist/'));
});

// Transpile ES6 source files into JavaScript
gulp.task('build', ['copyIndex','copyStatic'], function() {
  'use strict';
  return gulp.src(['lib/**/*.js'])
    .pipe($.cached('*.js'))
    .pipe(babel({optional: ['es7.classProperties']}))
    .pipe(gulp.dest('dist/lib'));
});

// Transpile ES6 source files into JavaScript
gulp.task('buildTest', function() {
  'use strict';
  return gulp.src(['test/lib/**/*.js'])
    .pipe($.cached('*.js'))
    .pipe(babel({optional: ['es7.classProperties']}))
    .pipe(gulp.dest('dist/lib'));
});

// Run Hapi server and realod on changes
gulp.task('serve', function() {
  'use strict';
  $.nodemon({
    script: './dist/lib/server/index.js',
    execMap: {
      'js': 'node_modules/babel/bin/babel-node.js'
    },
    ignore: ['gulpfile.js', 'node_modules', 'test']
  });
});

// Clean built directory
gulp.task('clean', function (callback) {
  'use strict';
  var del = require('del');
  del(['dist'], callback);
});

// Run lab tests
gulp.task('e2e', function() {
  'use strict';
  return gulp.src(['test/e2e/**/*.js'])
    .pipe($.lab('-v -l -C -T node_modules/lab-babel'));
});


gulp.task('unit', function () {
    return gulp.src(['test/unit/**/*.js'])
      .pipe($.lab('-v -l -C -T node_modules/lab-babel'));
});

gulp.task('default', ['serve']);
gulp.task('test', [ 'e2e', 'unit']);

