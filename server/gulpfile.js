var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence');

gulp.task('default', function () {
    runSequence('build', ['watch', 'run']);
});

gulp.task('watch', function () {
    gulp.watch(['./**/*.ts', '!./public/**/*'], ['build']);
});

gulp.task('run', function () {
    spawn('node', ['app.js'], {stdio: 'inherit'});
});

gulp.task('build', function () {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject()).js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./'));
});
