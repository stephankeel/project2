var gulp = require('gulp');
var spawnSync = require('child_process').spawnSync;


gulp.task('default', ['watch-and-build']);

gulp.task('watch-and-build', function () {
  spawnSync('.\\node_modules\\.bin\\ng', ['build', '-w'], {stdio: 'inherit', shell: true});
});

gulp.task('watch-and-build-without-logs', function () {
  spawnSync('.\\node_modules\\.bin\\ng', ['build', '-w'], {shell: true});
});
