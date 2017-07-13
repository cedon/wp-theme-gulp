var gulp = require('gulp'),
    gutil = require('gulp-util'),

    // Prepare & Optimize Code
    autoprefixer = require('autoprefixer'),
    browserSync  = require('browser-sync').create(),
    image        = require('gulp-image'),
    jshint       = require('gulp-jshint'),
    phpcs        = require('gulp-phpcs'),
    postcss      = require('gulp-postcss'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),

    // Only Work with New or Updated Files
    newer        = require('gulp-newer');

// Define variable from --theme parameter
var themename, i = process.argv.indexOf("--theme");

// Test to see if --theme parameter has been used and stop execution if not
if (i > -1) {
    themename = process.argv[i + 1];
    gutil.log('You are currently working with the', gutil.colors.green(themename), 'theme');
} else {
    gutil.log(gutil.colors.bgRed('!!FATAL ERROR!!'), 'No Theme Specified. Exiting Gulp.');
    process.exit(1);
}

gulp.task('default', []);