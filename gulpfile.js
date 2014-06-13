var gulp = require('gulp');

gulp.task('build', function() {
	gulp.src('src/*.js')
		.pipe(traceur({
			sourceMap: true,
			blockBinding: true,
			modules: 'register'
		}))
		.pipe(gulp.dest('dist'));
});