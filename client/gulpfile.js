var gulp = require('gulp');
var spawnSync = require('child_process').spawnSync;
const ngExe = require.resolve('./node_modules/.bin/ng');


gulp.task('default', ['watch-and-build']);

gulp.task('watch-and-build', function () {
  spawnSync(ngExe, ['build', '-w'], {stdio: 'inherit', shell: true});
});

gulp.task('watch-and-build-without-logs', function () {
  spawnSync(ngExe, ['build', '-w'], {shell: true});
});
