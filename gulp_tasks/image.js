'use strict';

const gulp = require('gulp');
const newer = require('gulp-newer'); // фильтрует и пропускает далее более новые файлы, чем находящиеся в указанном месте
const imageMin = require('gulp-imagemin');
const pngMin = require('imagemin-pngquant');
const jpegMin = require('imagemin-jpeg-recompress');
const svgMin = require('imagemin-svgo');
const gulpif = require('gulp-if');
const path = require('path');
const cwebp = require('gulp-cwebp');
const debug = require('gulp-debug');

module.exports = function (options) {
	return function() {
		return gulp.src(options.src, {since: gulp.lastRun('image')})
			.pipe(newer(options.dest))
			.pipe(imageMin([
				pngMin({quality: '80'}),
				jpegMin({progressive: true, method: 'ms-ssim'}),
				svgMin({
					plugins: [
						{removeDimensions: true},
						{removeAttrs: false},
						{removeElementsByAttr: false},
						{removeStyleElement: false},
						{removeViewBox: false}
					]
				}),
			]))
			.pipe(gulp.dest(options.dest))
			.pipe(debug({title: 'image:'}))
			.pipe(gulpif(function(file) {
				return path.extname(file.path) !== '.svg';
			}, cwebp()))
			.pipe(debug({title: 'webp:'}))
			.pipe(gulp.dest(options.dest));
	};
};