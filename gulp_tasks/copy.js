'use strict';

const gulp = require('gulp');
const newer = require('gulp-newer'); // фильтрует и пропускает далее более новые файлы, чем находящиеся в указанном месте
const debug = require('gulp-debug');

module.exports = function (options) {
    return function() {
        return gulp.src(options.src, {since: gulp.lastRun(options.taskName)})
            .pipe(newer(options.dest))
            .pipe(debug({title: options.debugTitle}))
            .pipe(gulp.dest(options.dest));
    };
};