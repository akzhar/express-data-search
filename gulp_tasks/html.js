'use strict';

const gulp = require('gulp');
const multipipe = require('multipipe');
const sourcemaps = require('gulp-sourcemaps'); // позволяет смотреть отдельно уже склеенные в 1 файлы
const pug = require('gulp-pug');
const htmlMin = require('gulp-htmlmin');
const notify = require('gulp-notify');
const debug = require('gulp-debug');
const pages = {
	accounts: { href: 'accounts.html', description: 'Поиск аккаунтов в AD' },
	computers: { href: 'computers.html', description: 'Поиск компьютеров в AD' },
	printers: { href: 'printers.html', description: 'Поиск принтеров' },
	phones: { href: 'phones.html', description: 'Поиск телефонов' }
};
// const fs = require('fs');
// const data = JSON.parse( fs.readFileSync('./filename.json', { encoding: 'utf8' }) );

module.exports = function (options) {
	return function() {
		return multipipe(
			gulp.src(options.src),
			sourcemaps.init(),
			pug({
				data: {
					// in Pug get the key value as locals['key']
					'pages': pages
				}
			}),
			sourcemaps.write(),
			htmlMin(),
			debug({title: 'html:'}),
			gulp.dest(options.dest)
		).on('error', notify.onError(function(err) {
			return {
				title: 'HTML',
				message: err.message
			};
		}));
	};
};