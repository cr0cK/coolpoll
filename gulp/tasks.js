'use strict';

var settings    = require('./settings'),
    gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    concat      = require('gulp-concat'),
    less        = require('gulp-less'),
    minifyCss   = require('gulp-minify-css'),
    minifyHtml  = require('gulp-minify-html'),
    jshint      = require('gulp-jshint'),
    iconfont    = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate'),
    rename      = require('gulp-rename');

var tasks = {};

tasks.clean = function () {
  return gulp
    .src('./www/*', {read: false})
    .pipe(clean());
  };

tasks.buildFont = function () {
  return gulp.src('./svg/*.svg')
    .pipe(iconfont({
      fontName: 'cr0cK',
      normalize: true
    }))
    .on('codepoints', function (codepoints) {
      gulp.src('templates/font.css')
        .pipe(consolidate('lodash', {
          glyphs: codepoints,
          fontName: 'cr0cK',
          fontPath: '../fonts/',
          className: 'icon'
        }))
        .pipe(rename('font.less'))
        .pipe(gulp.dest('./less/'));
    })
    .pipe(gulp.dest('www/fonts/'));
};

tasks.buildLess = function () {
  return gulp
    .src('./less/main.less')
    .pipe(less())
    .pipe(minifyCss())
    .pipe(gulp.dest('./www/css'));
};

tasks.buildBowerComponents = function () {
  return gulp
    .src(settings.bowerComponents)
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest('./www/js'));
};

tasks.buildJS = function () {
  return gulp
    .src('js/**/*')
    .pipe(concat('source.js'))
    .pipe(gulp.dest('./www/js'));
};

tasks.lintJS = function () {
  return gulp
    .src(['js/**/*', '!js/bower_components'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
};

tasks.copyJSON = function () {
  return gulp
    .src('json/**/*')
    .pipe(gulp.dest('./www/json'));
};

tasks.copyGraphics = function () {
  return gulp
    .src('graphics/**/*')
    .pipe(gulp.dest('./www/graphics'));
};

tasks.buildHtml = function () {
  return gulp
    .src('./html/*.html')
    // .pipe(minifyHtml())
    .pipe(gulp.dest('./www'));
};

module.exports = tasks;
