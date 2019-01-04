// Dependencies
const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const notify = require('gulp-notify')
const livereload = require('gulp-livereload')
const sass = require('gulp-sass')
const autoprefix = require('gulp-autoprefixer')
const bower = require('gulp-bower')

const config = {
  bootstrapDir: './bower_components/bootstrap',
  fontawesomeDir: './bower_components/font-awesome',
  publicDir: './public',
  bowerDir: './bower_components',
}

// Task
gulp.task('bower', () => bower().pipe(gulp.dest(config.bowerDir)))

gulp.task('fonts', () =>
  gulp
    .src(`${config.bowerDir}/font-awesome/fonts/**.*`)
    .pipe(gulp.dest('./public/assets/fonts'))
)

gulp.task('css', () =>
  gulp
    .src('./public/assets/sass/style.scss')
    .pipe(
      sass({
        includePaths: [
          `${config.bootstrapDir}/scss`,
          `${config.fontawesomeDir}/scss`,
        ],
      })
    )
    .pipe(gulp.dest(`${config.publicDir}/assets/css`))
)

gulp.task('server', () => {
  // listen for changes
  livereload.listen()
  // configure nodemon
  nodemon({
    // the script to run the app
    //	  exec: 'node-inspector & node --debug',
    nodeArgs: ['--debug'],
    script: 'bin/www',
    ext: 'js ejs json css html',
    ignore: ['public/*'],
  }).on('restart', () => {
    // when the app has restarted, run livereload.
    gulp
      .src('*.*')
      .pipe(
        livereload({
          start: true,
        })
      )
      .pipe(notify('Restarted Server & Reloading page...'))
  })
})

gulp.task('client', () => {
  gulp.src('public/**/*.{js,css,html}').pipe(
    livereload({
      start: true,
    })
  )
})

gulp.task('watch', () => {
  gulp.watch('./public/assets/sass/**/*.scss', ['css'])
  livereload.listen()
  gulp.watch('public/**/*.{js,css,html}', ['client'])
})

gulp.task('default', ['watch', 'server'])
gulp.task('build', ['bower', 'fonts', 'css'])
