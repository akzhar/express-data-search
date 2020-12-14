'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const debug = require('gulp-debug');

module.exports = function (options) {
    return function() {
        return gulp.src(options.src, {since: gulp.lastRun('eslint')})
            .pipe(eslint())
            .pipe(debug({title: 'eslint:'}))
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    };
};