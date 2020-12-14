'use strict';

const gulp = require('gulp');
const server = require('browser-sync').create();

module.exports = function (options) {
    return function() {
        server.init({
            server: options.root,
            notify: false,
            open: true,
            cors: true,
            host: options.ip,
            ui: false
        });
        gulp.watch(options.watch).on('change', server.reload);
    };
};