var gulp = require('gulp');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');

var browserSync = require('browser-sync').create();

gulp.task('browsersync', function() {
  browserSync.init({
    proxy: "localhost:3000"
  });

  return gulp.watch("./*.js", ['reload'])
})

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('build', function() {
  return gulp.src('./app.js')
             .pipe(webpack(Object.assign({}, webpackConfig, {
               watch: true,
             })))
             .pipe(gulp.dest('./dist/'));
});

// gulpとタスク名を指定しないと default が起動します。
// gulp.task('default', ['build', 'browsersync']);
gulp.task('default', ['build']);
