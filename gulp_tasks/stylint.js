'use strict';

const gulp = require('gulp');
const stylint = require('gulp-stylint');
const debug = require('gulp-debug');

module.exports = function (options) {
    return function() {
        return gulp.src(options.src, {since: gulp.lastRun('stylint')})
            .pipe(stylint({fix: true}))
            .pipe(debug({title: 'stylint:'}));
    };
};