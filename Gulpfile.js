var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path  = require('path'),

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

    // Add SASS Libraries for includePath
const SASS_INCLUDE_PATHS = [
    path.join(__dirname, 'bower_components/normalize-scss'),
    path.join(__dirname, 'bower_components/susy/sass'),
    path.join(__dirname, 'bower_components/bourbon/app/assets'),
    path.join(__dirname, 'bower_components/neat/core'),
    path.join(__dirname, 'bower_components/sassline/assets/sass'),
    path.join(__dirname, 'bower_components/sassymaps/sass'),
    path.join(__dirname, 'bower_components/zen-grids/sass'),
    path.join(__dirname, 'bower_components/megatype')
];

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
    languages = root + 'languages/',
    logs      = root + 'logs/';

// Compile CSS from SASS w/ Autoprefixing
gulp.task('css', function() {
    return gulp.src(scss + '{style.scss,rtl.scss}')
    .pipe(sourcemaps.init())
    .pipe(sass({
        includePaths: SASS_INCLUDE_PATHS,
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
gulp.task('javascript', function() {
    return gulp.src([js + '*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest(js))
}); // End JavaScript

// Check PHP Files Against WordPress Coding Standards
gulp.task('php', function() {
    return gulp.src([root + '**/*.php'])
    .pipe(phpcs({
        bin: 'phpcs',
        standard: 'WordPress',
        warningSeverity: 0
    }))
    .pipe(phpcs.reporter('file', {path: logs + 'phpcs.log'}))
});

// Optimize Images
gulp.task('images', function() {
    return gulp.src(img + 'RAW/**/*.{jpg,JPG,png}')
    .pipe(newer(img))
    .pipe(image())
    .pipe(gulp.dest(img))
});

// Watch Task
gulp.task('watch', function() {
   browserSync.init({
       open: 'external',
       proxy: 'wp.jldc.dev',
       port: 8080
   });
   gulp.watch([root + '**/*.css', root + '**/*.scss'], ['css']);
   gulp.watch(root + '**/*.js', ['javascript']);
   gulp.watch(img + 'RAW/**/*.{jpg,JPG,png}', ['images']);
   gulp.watch(root + '**/*').on('change', browserSync.reload);
});

gulp.task('default', ['watch']);
