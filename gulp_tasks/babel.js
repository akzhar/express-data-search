'use strict';

const gulp = require('gulp');
const newer = require('gulp-newer'); // фильтрует и пропускает далее более новые файлы, чем находящиеся в указанном месте
const babel = require('gulp-babel'); // транспалер в старый ECMAScript синтаксис
const debug = require('gulp-debug');
const rename = require('gulp-rename');

module.exports = function (options) {
    return function() {
        return gulp.src(options.src, {since: gulp.lastRun('babel')})
            .pipe(newer(options.dest))
            .pipe(babel())
            .pipe(rename({dirname: ''}))
            .pipe(debug({title: 'babel:'}))
            .pipe(gulp.dest(options.dest));
    };
};