/* eslint-env es6 */
'use strict';

/* Import dependencies */
import gulp from 'gulp';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import cssnano from 'gulp-cssnano';
import cssnext from 'postcss-cssnext';
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
        sass: [themePath + 'src/sass/style.scss'],
        sassDest: [themePath + 'src/css/'],
        vars: themePath + 'config/cssVars.json'
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
    logs: themePath + 'src/logs/',
    www: {
        themePath: '../../../zSite/wpdev/',
        theme: '../../../zSite/wpdev/wp-content/themes/' + config.theme.slug + '/'
    }
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
    done();
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

// PHP Code Linting via PHPCS
export function php() {
    config = requireUncached(themePath + 'config/theme-config.js');
    return gulp.src(paths.php.src)
        .pipe(newer(paths.php.dest))
        .pipe(phpcs({
            bin: 'phpcs',
            standard: 'WordPress',
            warningSeverity: 0
        }))
        .pipe(phpcs.reporter('file', {path: paths.logs + 'phpcs.log'}))
        .pipe(gulp.dest(paths.php.dest))
}

// Process any SCSS Files
export function sassStyles() {
    return gulp.src(paths.css.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(tabify(2, true))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.css.sassDest))
}

// Process CSS through PostCSS
export function cssStyles() {
    let cssVars = requireUncached(paths.css.vars);
    return gulp.src(paths.css.src)
        .pipe(print())
        .pipe(phpcs({
            bin: 'phpcs',
            standard: 'WordPress',
            warningSeverity: 0
        }))
        .pipe(phpcs.reporter('file', {path: paths.logs + 'phpcs-css.log'}))
        .pipe(postcss([
            cssnext({
                browsers: config.dev.browserlist,
                features: {
                    applyRule: {
                        sets: cssVars.properties
                    },
                    customProperties: {
                        variables: cssVars.variables,
                    },
                    customMedia: {
                        extensions: cssVars.queries,
                    },
                    customSelectors: {
                        extensions: cssVars.selectors,
                    }
                }
            })
        ]))
        .pipe(gulpif(!config.dev.debug.styles, cssnano()))
        .pipe(gulp.dest(paths.css.dest))
}

// JavaScript processing
export function scripts() {
    config = requireUncached(themePath + 'config/theme-config.js');
    return gulp.src(paths.js.src)
        .pipe(newer(paths.js.dest))
        .pipe(eslint())
        .pipe(eslint.format('codeframe'))
        .pipe(babel())
        .pipe(gulpif(!config.dev.debug, uglify()))
        .pipe(gulp.dest(paths.js.dest))
}

// Copy any libraries used
export function jsLibs() {
    return gulp.src(paths.js.libs)
        .pipe(newer(paths.js.libsDest))
        .pipe(gulp.dest(paths.js.libsDest))
}

// Image optimization
export function images() {
    return gulp.src(paths.images.src, {allowEmpty: true})
        .pipe(newer(paths.images.dest))
        .pipe(image())
        .pipe(gulp.dest(paths.images.dest))
}

// Translation Function
export function translate() {
    return gulp.src(paths.languages.src)
        .pipe(sort())
        .pipe(wppot({
            domain: config.theme.slug,
            package: config.theme.slug,
            bugReport: config.theme.slug,
            lasTranslator: config.theme.author
        }))
        .pipe(gulp.dest(paths.languages.dest))
}

export function themeCopy() {
    return gulp.src([
        themePath + '**/*.php',
        themePath + 'style.css',
        themePath + 'js/**/*.js',
        themePath + 'languages/*',
        themePath + 'images/*',
        '!' + themePath + '/src/**/*'
        ],
        {
            allowEmpty: true,
            base: '.'
        }
    )
        .pipe(gulp.dest(paths.www.theme))
}

// Watchers
export function watch() {
    gulp.watch(paths.php.src, gulp.series(php, themeCopy, reload));
    gulp.watch(paths.css.vars, gulp.series(cssStyles, reload));
    gulp.watch(paths.css.sass, sassStyles);
    gulp.watch(paths.css.src, gulp.series(cssStyles, reload));
    gulp.watch(paths.js.src, gulp.series(gulp.parallel(scripts, jsLibs), reload));
    gulp.watch(paths.images.src, gulp.series(images, reload))
}

// Initial task sequence
const initialRun = gulp.series(php, gulp.parallel(scripts, jsLibs), sassStyles, cssStyles, images, themeCopy, serve, watch);

export default initialRun;