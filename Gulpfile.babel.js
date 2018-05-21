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

var basePath = '../' + themeName +'/';
var config = require(basePath + 'config/theme-config.js');

const paths = {
    css: {
        src: [basePath + 'src/css/*.css'],
        dest: basePath,
        sass: [basePath + 'src/sass/style.scss']
    },
    js: {
        src: [basePath + 'src/js/*.js'],
        dest: basePath + 'js/',
        libs: [basePath+ '/src/js/libs/**/*.js'],
        libsDest: [basePath + '/js']
    },
    php: {
        src: [basePath + '**/*.php'],
        dest: basePath
    },
    images: {
        src: [basePath + 'src/img/'],
        dest: basePath + 'img/'
    },
    languages: {
        src: [basePath + '**/*.php'],
        dest: basePath + 'languages/' + config.theme.slug + '.pot'
    }
};
