'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rimraf = require('gulp-rimraf');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var eslint = require('gulp-eslint');
var plumber = require('gulp-plumber');
var nodemon = require('gulp-nodemon');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync');


// browserSync({
//     server: true,
//     port: 8000
// }, function(err, bs) {
//     console.log(bs.options.getIn(["urls", "local"]));
// });

////////////
// General Tasks

gulp.task('default', ['build', 'serve', 'watch']);
gulp.task('build', ['js', 'css', 'html', 'assets']);
gulp.task('watch', ['watch:js', 'watch:css', 'watch:html'])
gulp.task('serve', function() {
    nodemon({
        script: './app.js',
        ext: 'js css ejs html',
        ignore: ['public/*', 'client/*', 'node_modules/*']
    });
});

gulp.task('watch.lint', function() {
    return gulp.watch(['./**/*.js', '!./node_modules/**', '!./public/bower_components/**'], ['lint'])
});
gulp.task('lint', function() {
    console.log('watch!');
    return gulp.src([
            './**/*.js',
            '!./public/js/**/*.js',
            '!gulpfile.js',
            '!./node_modules/**',
            '!./public/bower_components/**'
        ])
        .pipe(eslint())
        .pipe(eslint.format());
})

////////////
// Javascript Tasks

gulp.task('js', ['clean:js'], function() {
    return gulp.src('client/js/**/*.js') // input files
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('bundle.min.js'))
        //for this project, I had to add the following options because there was
        //an issue with minifying the code and Angular not injecting dependencies
        // David U.
        .pipe(uglify({ mangle: false, compress:true, output: { beautify: false }} ))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js')); // output files
});

gulp.task('watch:js', function() {
    return gulp.watch('client/js/**/*.js', ['js']);
});

gulp.task('clean:js', function() {
    return gulp.src('public/js', {
            read: false
        })
        .pipe(rimraf());
});

////////////
// CSS Tasks

gulp.task('css', ['clean:css'], function() {
    return gulp.src(['client/scss/**/*.scss', 'client/scss/**/*.sass'])
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'));
});

gulp.task('watch:css', function() {
    return gulp.watch(['client/scss/**/*.scss', 'client/scss/**/*.sass'], ['css']);
});

gulp.task('clean:css', function() {
    return gulp.src('public/css', {
            read: false
        })
        .pipe(rimraf());
});

////////////
// HTML Tasks

gulp.task('html', ['clean:html'], function() {
    return gulp.src('client/html/**/*.html')
        .pipe(gulp.dest('public/html'));
});

gulp.task('watch:html', function() {
    return gulp.watch('client/html/**/*.html', ['html']);
});

gulp.task('clean:html', function() {
    return gulp.src('public/html', {
            read: false
        })
        .pipe(rimraf());
});

////////////
// assets Tasks
gulp.task('assets', function() {
    return gulp.src('client/assets/**')
        .pipe(gulp.dest('public/assets'));
});
