var gulp = require("gulp");
var babel = require("gulp-babel");
var uglifyjs = require('uglify-js');
var composer = require('gulp-uglify/composer');
var pump = require('pump');
const htmlmin = require('gulp-htmlmin');
var csso = require('gulp-csso');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');

var minify = composer(uglifyjs, console);
//таск на компиляцию екмаскрипт
var paths = {
    es1:['ES6/var.js'],
    es2:['ES6/var2.js']
};

gulp.task("default", function () {
    return gulp.src("ES6/*.js")
        .pipe(babel())
        .pipe(gulp.dest("CompileES6"));
});

//таск на минификацию js
gulp.task('compress', function (cb) {
    // the same options as described above
    var options = {};

    pump([
            gulp.src('CompileES6/*.js'),
            minify(options),
            gulp.dest('min-compile')
        ],
        cb
    );
});

//таск на минификацию html
gulp.task('minify', () => {
    return gulp.src('testHello.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('min-compile'));
});

//таск на минификацию css
// gulp.task('default', function () {
//     return gulp.src('main.css')
//         .pipe(csso())
//         .pipe(gulp.dest('min-compile'));
// });

gulp.task('development', function () {
    return gulp.src('main.css')
        .pipe(csso({
            restructure: false,
            sourceMap: true,
            debug: true
        }))
        .pipe(gulp.dest('min-compile'));
});

//таск на браузерсинк
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("testHello.html").on('change', browserSync.reload);
    gulp.watch("main.css").on('change', browserSync.reload);
    gulp.watch("concat/all.js").on('change', browserSync.reload);
    gulp.watch("CompileES6/var.js").on('change', browserSync.reload);
    gulp.watch("CompileES6/var2.js").on('change', browserSync.reload);
    gulp.watch("CompileES6/var.js", gulp.parallel('scripts'));
    gulp.watch("CompileES6/var2.js", gulp.parallel('scripts'));
});

//таск на конкатенацию
gulp.task('scripts', function() {
    return gulp.src(['./CompileES6/var.js', './CompileES6/var2.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./concat/'));
});

gulp.watch(paths.es1, gulp.parallel('default'));
gulp.watch(paths.es2, gulp.parallel('default'));


//gulp.watch(paths.es, gulp.parallel('default', 'compress'));

