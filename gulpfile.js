'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');


var src = {
  js: [
    'gulpfile.js', 'app.js', 'server/**/*.js'
  ]
};

gulp.task('jshint', () => {
  return gulp.src(src.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('start', () => {
  nodemon({
    script: 'app.js',
    ext: 'js html',
    env: {
      'NODE_ENV': 'development'
    },
    tasks: ['jshint']
  });
});

gulp.task('default', ['start']);
