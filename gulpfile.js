/**
 * Created by Tareq Boulakjar. from angulartypescript.com
 */
var gulp = require('gulp');

var assetsDev = 'assets/';
var assetsProd = 'src/';

var appDev = 'dev/';
var appProd = 'app/';

/* Mixed */
var ext_replace = require('gulp-ext-replace');

/* CSS */
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var cssnano = require('cssnano');

/* JS & TS */
//var jsuglify = require('gulp-uglify');
var typescript = require('gulp-typescript');

/* Images */
var imagemin = require('gulp-imagemin');

var tsProject = typescript.createProject('./src/tsconfig.json');



gulp.task('build-css-style', function () {
    return gulp.src('src/assets/css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(postcss([precss, autoprefixer, cssnano]))
        .pipe(sourcemaps.write())
        .pipe(ext_replace('.css'))
        .pipe(gulp.dest('src/assets/css/'));
});


gulp.task('watch', function () {
    // gulp.watch( '**/*.html', ['build-html']);
    // gulp.watch( '**/*.ts', ['build-ts']);
    //'build-css','build-css-edu','build-css','build-css-edu',
    gulp.watch('**/*.scss', ['build-css-style']);
    //gulp.watch( 'img/*', ['build-img']);
});

gulp.task('default', ['watch', 'build-css-style']);

