// Dependencies
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var bower = require('gulp-bower');

var config = {
  bootstrapDir: './bower_components/bootstrap',
  fontawesomeDir: './bower_components/font-awesome',
  publicDir: './public',
  bowerDir: './bower_components'
}

// Task
gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(config.bowerDir))
});

gulp.task('fonts', function() {
  return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
    .pipe(gulp.dest('./public/assets/fonts'));
});

gulp.task('css', function() {
  return gulp.src('./public/assets/sass/style.scss')
    .pipe(sass({
      includePaths: [config.bootstrapDir + '/scss', config.fontawesomeDir + '/scss'],
    }))
    .pipe(gulp.dest(config.publicDir + '/assets/css'));
});

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
  }).on('restart', function() {
    // when the app has restarted, run livereload.
    gulp.src('*.*')
      .pipe(livereload({
        start: true
      }))
      .pipe(notify('Restarted Server & Reloading page...'));
  })
});

gulp.task('client', function() {
  gulp.src('public/**/*.{js,css,html}')
    .pipe(livereload({
      start: true
    }));
});

gulp.task('watch', function() {
	gulp.watch('./public/assets/sass/**/*.scss', ['css']);
  livereload.listen();
  gulp.watch('public/**/*.{js,css,html}', ['client']);
});

gulp.task('default', ['watch', 'server']);
gulp.task('build', ['bower', 'fonts', 'css']);
