'use strict';

// const $ = require('gulp-load-plugins')();

const gulp = require('gulp');
const multipipe = require('multipipe');
const sourcemaps = require('gulp-sourcemaps'); // позволяет смотреть отдельно уже склеенные в 1 файл;
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const cssMin = require('gulp-clean-css');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const debug = require('gulp-debug');

module.exports = function (options) {

    return function() {
        return multipipe(
            gulp.src(options.src),
            sourcemaps.init(),
            stylus(),
            autoprefixer(),
            sourcemaps.write(),
            gulp.dest(options.dest),
            cssMin(),
            rename({suffix: '.min'}),
            debug({title: 'style:'}),
            gulp.dest(options.dest)
        ).on('error', notify.onError(function(err) {
            return {
                title: 'CSS',
                message: err.message
            };
        }));
    };
};