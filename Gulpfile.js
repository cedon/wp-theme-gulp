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

// Define theme paths
var root      = '../' + themename + '/',
    scss      = root + 'sass/',
    js        = root + 'js/',
    img       = root + 'images/',
    languages = root + 'languages/';

// Compile CSS from SASS w/ Autoprefixing
gulp.task('css', function() {
    return gulp.src(scss + '{style.scss,rtl.scss}')
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'expanded',
        indentType: 'tab',
        indentWidth: 1
    }).on('error', sass.logError))
    .pipe(postcss([
        autoprefixer('last 2 versions', '> 1%')
    ]))
    .pipe(sourcemaps.write(scss + 'maps'))
    .pipe(gulp.dest(root));
}); // End CSS

// Lint JavaScript Files
gulp.task('javascript' function() {
    return gulp.src([js + '*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest(js))
}); // End JavaScript

gulp.task('default', []);