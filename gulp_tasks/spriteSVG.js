'use strict';

const gulp = require('gulp');
const newer = require('gulp-newer'); // фильтрует и пропускает далее более новые файлы, чем находящиеся в указанном месте
const imageMin = require('gulp-imagemin');
const svgMin = require('imagemin-svgo');
const remember = require('gulp-remember'); // каждый раз кеширует цепочку обработки, если в новой итерации нет закешированных ранее файлов - добавляет их в цепочку обработки
const svgstore = require('gulp-svgstore'); // склеивает svg в 1
const rename = require('gulp-rename');
const debug = require('gulp-debug');

module.exports = function (options) {
    return function() {
        return gulp.src(options.src, {since: gulp.lastRun('spriteSVG')})
            .pipe(newer(options.dest))
            .pipe(imageMin([
                svgMin({
                    plugins: [
                        {removeDimensions: true},
                        {removeAttrs: false},
                        {removeElementsByAttr: false},
                        {removeStyleElement: false},
                        {removeViewBox: false}
                    ]
                })
            ]))
            .pipe(remember('spriteSVG'))
            .pipe(debug({tittle: 'spriteSVG:'}))
            .pipe(svgstore({inlineSvg: true}))
            .pipe(rename({basename: 'sprite', suffix: '.min'}))
            .pipe(gulp.dest(options.dest));
    };
};