'use strict';

const gulp = require('gulp');
const multipipe = require('multipipe');
const newer = require('gulp-newer'); // фильтрует и пропускает далее более новые файлы, чем находящиеся в указанном месте
const sourcemaps = require('gulp-sourcemaps'); // позволяет смотреть отдельно уже склеенные в 1 файлы
const remember = require('gulp-remember'); // каждый раз кеширует цепочку обработки, если в новой итерации нет закешированных ранее файлов - добавляет их в цепочку обработки
const concat = require('gulp-concat'); // для склеивания js файлов
const jsMin = require('gulp-jsmin');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const debug = require('gulp-debug');

module.exports = function (options) {
	return function() {
		return multipipe(
			gulp.src(options.src, {since: gulp.lastRun('js')}),
			newer(options.dest),
			sourcemaps.init(),
			remember('js'),
			debug({title: 'js:'}),
			concat(`${options.bundleName}.js`),
			sourcemaps.write(),
			gulp.dest(options.dest),
			jsMin(),
			rename({suffix: '.min'}),
			gulp.dest(options.dest)
		).on('error', notify.onError(function(err) {
			return {
				title: 'js:',
				message: err.message
			};
		}));
	};
};