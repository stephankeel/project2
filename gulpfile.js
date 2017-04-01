var gulp = require('gulp');
var spawn = require('child_process').spawn;
var spawnSync = require('child_process').spawnSync;
const gulpExe = require.resolve('./node_modules/.bin/gulp');

// for initial start, take a look the the README.md in the server folder
gulp.task('start-prod', ['build-prod-client', 'run-server']);
gulp.task('build-prod-client', function () {
    spawnSync('npm', ['run','build-prod'], {stdio: 'inherit', cwd: 'client', shell: true});
});
gulp.task('run-server', function () {
    spawn(gulpExe, [], {stdio: 'inherit', cwd: 'server', shell: true});
});

gulp.task('install', ['npm-install-server', 'npm-install-client']);
gulp.task('npm-install-server', function () {
    spawnSync('npm', ['install'], {stdio: 'inherit', cwd: 'server', shell: true});
});
gulp.task('npm-install-client', function () {
    spawnSync('npm', ['install'],  {stdio: 'inherit', cwd: 'client', shell: true});
});

gulp.task('test', ['npm-test-server']);
gulp.task('npm-test-server', function () {
    spawnSync('npm', ['test'], {stdio: 'inherit', cwd: 'server', shell: true});
});
gulp.task('npm-test-client', function () {
    spawnSync('npm', ['test'],  {stdio: 'inherit', cwd: 'client', shell: true});
});

