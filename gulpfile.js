// Dependencies
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');

// Task
gulp.task('server', function() {
	// listen for changes
	livereload.listen();
	// configure nodemon
	nodemon({
		// the script to run the app
//	  exec: 'node-inspector & node --debug',
		nodeArgs: ['--debug'],
		script: 'bin/www',
		ext: 'js ejs json css html',
		"ignore": ["public/*"],
	}).on('restart', function(){
		// when the app has restarted, run livereload.
		gulp.src('*.*')
			.pipe(livereload({ start: true }))
			// .pipe(notify('Restarted Server & Reloading page...'));
	})
});

gulp.task('client', function() {
  gulp.src('public/**/*.{js,css,html}')
    .pipe(livereload({ start: true }));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('public/**/*.{js,css,html}', ['client']);
});

gulp.task('default', ['watch', 'server']);
