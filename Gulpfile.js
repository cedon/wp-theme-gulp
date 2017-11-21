var gulp    = require('gulp'),
    gconcat = require('gulp-concat'),
    guglify = require('gulp-uglify'),
    gutil   = require('gulp-util'),
    path    = require('path'),
    pump    = require('pump'),

    // Prepare & Optimize Code
    autoprefixer = require('autoprefixer'),
    browserSync  = require('browser-sync').create(),
    image        = require('gulp-imagemin'),
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
    path.join(__dirname, 'bower_components/breakpoint-sass/stylesheets'),
    path.join(__dirname, 'bower_components/neat/core'),
    path.join(__dirname, 'bower_components/sassline/assets/sass'),
    path.join(__dirname, 'bower_components/sassymaps/sass'),
    path.join(__dirname, 'bower_components/zen-grids/sass'),
    path.join(__dirname, 'bower_components/megatype')
];

// Define variable from --theme parameter
var themename, i = process.argv.indexOf("--theme");

// Define test server install location from --env parameter
var wpenv, ii = process.argv.indexOf("--env");

// Test to see if --theme parameter has been used and stop execution if not
if (i > -1) {
    themename = process.argv[i + 1];
} else {
    gutil.log(gutil.colors.bgRed('!!FATAL ERROR!!'), 'No Theme Specified. Exiting Gulp.');
    process.exit(1);
}

if ( ii > -1 ) {
    wpenv = process.argv[ii + 1];
} else {
    gutil.log(gutil.colors.bgYellow('!!WARNING!!'), 'No Environment Specified. Using Default of \'wpdev\'');
    wpenv = 'wpdev';
}

gutil.log('You are currently working with the', gutil.colors.green(themename), 'theme using the', gutil.colors.cyan(wpenv), 'environment');


// Define theme paths
var root      = '../' + themename + '/',
    scss      = root + 'sass/',
    js        = root + 'js/',
    jssrc     = js + 'src/',
    img       = root + 'images/',
    languages = root + 'languages/',
    logs      = root + 'logs/';

// Define WordPress Environment Path
var wwwroot   = '../../../zSite/' + wpenv + '/',
    wpthemes  = wwwroot + 'wp-content/themes/',
    themeroot = wpthemes + themename + '/',
    wwwproxy  = wpenv + '.dev';


// Copy Files to WordPress Installation
gulp.task('copy', function () {
   return gulp.src([root + '**/*.php', root + 'style.css', root + 'js/**/*.js', root + 'languages/*', root + 'images/*', '!' + root + 'images/RAW{,/**}'], {base: '.'})
       .pipe(gulp.dest(themeroot))
});

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
    return gulp.src([jssrc + '*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest(js))
}); // End JavaScript

// Minify JavaScript Files
gulp.task('jsmin', function(cb) {
    pump([
        gulp.src(jssrc + '*.js'),
        gconcat('script.js'),
        guglify(jssrc + 'script.js'),
        gulp.dest(js + '/dist')
    ],
        cb
    );
}); // End JavaScript Minify

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
    return gulp.src(img + 'RAW/**/*.{jpg,JPG,png,gif,GIF,svg,SVG}')
    .pipe(newer(img))
    .pipe(image())
    .pipe(gulp.dest(img))
});

// Watch Task
gulp.task('watch', function() {
   browserSync.init({
       browser: ['chrome', 'C:\\\\Program Files\\\\Firefox Developer Edition\\\\firefox.exe'],
       open: 'external',
       proxy: wwwproxy,
       port: 8080,
       reloadDelay: 2000
   });
   gulp.watch([root + '**/*.css', root + '**/*.scss'], ['css', 'copy']);
   gulp.watch(root + '**/*.js', ['javascript', 'copy']);
   gulp.watch(root + '**/*.php', ['copy']);
   gulp.watch(img + 'RAW/**/*.{jpg,JPG,png,gif,GIF,svg,SVG}', ['images', 'copy']);
   gulp.watch(root + '**/*').on('change', browserSync.reload);
});

gulp.task('default', ['copy', 'watch']);
