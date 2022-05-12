const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'))

//style paths
const sassFiles = './src/Styles/*.scss',
    cssDest = './src/Styles/css/';

gulp.task('styles', function(){
    return gulp.src(sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssDest));
});

gulp.task('watch',function() {
    gulp.watch(sassFiles,gulp.series("styles"));
});