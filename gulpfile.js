/*---Подключили gulp---*/
const gulp = require('gulp');

/*---Подключили browser-sync---*/
const browserSync = require('browser-sync').create();

/*---Подключим плагин rename для сжатия файла main.css---*/
const rename = require("gulp-rename");

/*---Задача для Static server (browser-sync)---*/
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change',browserSync.reload);
});



/*---Подключили плагин шаблонов gulp-pug---*/
const pug = require('gulp-pug');

/*---Задача для компиляции шаблонов gulp-pug---*/
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});



/*---Подключили плагин для стилей gulp-sass---*/
const sass = require('gulp-sass');

/*---Задача для компиляции стилей gulp-sass---*/
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.sass')
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'));
});


/*---Подключаем плагин gulp.spritesmith---*/
const spritesmith = require('gulp.spritesmith');

/*---Задача для компиляции  gulp.spritesmith---*/
gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath:'../images/sprite.png',
        cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});



/*---Подключаем плагин rimraf для чистки папки build---*/
const rimraf = require('rimraf');

/*---Задача плагина rimraf---*/
gulp.task('clean', function del(cb) {
    return rimraf('build',cb)
});



/*---Задача копировать fonts из папки source в папку build---*/
gulp.task('copy:fonts', function () {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});



/*---Задача копировать images из папки source в папку build---*/
gulp.task('copy:images', function () {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('build/images'));
});



/*---Задача объединяет копировать images и fonts из папки source в папку build---*/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/*---Задача которая будет следить и компилировать изменения в html и css ---*/
gulp.task('watch', function () {
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.sass', gulp.series('styles:compile'));

});

/*---Задача при запуске gulp запустит все команды default ---*/

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile','styles:compile','sprite','copy'),
    gulp.parallel('watch', 'browser-sync')
    )
);

