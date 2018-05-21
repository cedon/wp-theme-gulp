/* eslint-env es6 */
'use strict';

/* Import dependencies */
import gulp from 'gulp';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import colors from 'ansi-colors';
import cssnano from 'gulp-cssnano';
import eslint from 'gulp-eslint';
import log from 'fancy-log';
import gulpif from 'gulp-if';
import image from 'gulp-image';
import newer from 'gulp-newer';
import partialImport from 'postcss-partial-import';
import phpcs from 'gulp-phpcs';
import postcss from 'gulp-postcss';
import print from 'gulp-print';
import replace from 'gulp-string-replace';
import requireUncached from 'require-uncached';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import sort from 'gulp-sort';
import tabify from 'gulp-tabify';
import uglify from 'gulp-uglify';
import wppot from 'gulp-wp-pot';

// Ger variables from command line parameters
var themeName, i = process.argv.indexOf("--theme");
var buildMode, ii = process.argv.indexOf("--mode");

// Test to make sure --theme is defined and stop execution with error if not
if (i > 1) {
    themeName = process.argv[i + 1];
} else {
    log.error('No Theme Specified. Exiting Gulp.');
    process.exit(1);
}

var themePath = '../' + themeName +'/';
var config = require(themePath + 'config/theme-config.js');

const paths = {
    css: {
        src: [themePath + 'src/css/*.css'],
        dest: themePath,
        sass: [themePath + 'src/sass/style.scss']
    },
    js: {
        src: [themePath + 'src/js/*.js'],
        dest: themePath + 'js/',
        libs: [themePath+ '/src/js/libs/**/*.js'],
        libsDest: [themePath + '/js']
    },
    php: {
        src: [themePath + '**/*.php'],
        dest: themePath
    },
    images: {
        src: [themePath + 'src/img/'],
        dest: themePath + 'img/'
    },
    languages: {
        src: [themePath + '**/*.php'],
        dest: themePath + 'languages/' + config.theme.slug + '.pot'
    },
    logs: themePath + 'src/logs/'
};

// Instantiate BrowserSync
const server = browserSync.create();

function serve(done) {
    if (config.dev.browserSync.live) {
        server.init({
            browser: ['chrome', 'C:\\\\Program Files\\\\Firefox Developer Edition\\\\firefox.exe'],
            open: 'external',
            proxy: config.dev.browserSync.proxy,
            port: config.dev.browserSync.port,
            reloadDelay: 2000
        });
    }
}

function reload(done) {
    config = requireUncached(themePath + 'config/theme-config.js');
    if (config.dev.browserSync.live) {
        if (server.paused) {
            server.resume();
        }
        server.reload();
    } else {
        server.pause();
    }
    done();
}
