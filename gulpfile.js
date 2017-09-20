// Plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const pump = require('pump');
const babel = require('gulp-babel');

// File Paths
const paths = {
    build: 'build',
    sass: 'src/sass',
    css: 'build/css',
    pug: 'src/pug/pages',
    img: 'src/images',
    js: 'src/scripts'
};

const plumberErrorHandler = {
    errorHandler: notify.onError({
        title: 'Gulp',
        message: 'Error: <%= error.message %>',
    }),
};

// Browsersync
gulp.task('browser-sync', function() {
    const files = [
        `${paths.css}**/*.css`,
    ];

    browserSync.init(files, {
        server: {
            baseDir: paths.build
        }
    });
});

// Process Styles
gulp.task('styles', function() {
    return gulp.src(`${paths.sass}/**/*.scss`)
        .pipe(plumber(plumberErrorHandler))
        .pipe(sourcemaps.init())
        .pipe(sass({ errLogToConsole: true }))
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.css))
        .pipe(reload({ stream: true }))
        .pipe(notify({ message: 'Styles task complete' }))
});

// Compile pug templates
gulp.task('templates', function buildHTML() {
    return gulp.src(`${paths.pug}/**/*.pug`)
        .pipe(plumber(plumberErrorHandler))
        .pipe(pug())
        .pipe(gulp.dest(paths.build))
        .pipe(reload({ stream: true }))
        .pipe(notify({ message: 'Templates task complete' }))
});

// Copy images
gulp.task('images', function buildHTML() {
    return gulp.src(`${paths.img}/**/*.jpg`)
        .pipe(gulp.dest(`${paths.build}/images`))
        .pipe(notify({ message: 'Images task complete' }))
});

// Scripts
gulp.task('scripts', function() {
    pump([
        plumber(plumberErrorHandler),
        gulp.src(`${paths.js}/**/*.js`),
        babel({
            presets: ['env']
        }),
        uglify(),
        gulp.dest(`${paths.build}/scripts`)
    ])
    .pipe(reload({ stream: true }))
});

// The default task
gulp.task('default', ['styles', 'images', 'scripts'], function() {
    gulp.start('templates');
});

// The watch task
gulp.task('watch', function() {
    gulp.start('default');
    gulp.watch([`${paths.js}/**/*.js`], ['scripts']);
    gulp.watch([`${paths.sass}/**/*.scss`], ['styles']);
    gulp.watch([`${paths.pug}/**/*.pug`], ['templates']);
    gulp.start('browser-sync');
});
