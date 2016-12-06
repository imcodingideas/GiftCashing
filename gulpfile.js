const gulp = require('gulp'),
     sass = require('gulp-sass'),
     autoprefix = require('gulp-autoprefixer'),
     notify = require("gulp-notify"),
     bower = require('gulp-bower');

let config = {
    bootstrapDir: './bower_components/bootstrap',
    fontawesomeDir: './bower_components/font-awesome',
    publicDir: './public',
    bowerDir: './bower_components'
}

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

// Watch task
gulp.task('watch',function() {
    gulp.watch('./public/assets/sass/**/*.scss', ['css']);
});

gulp.task('default', ['bower', 'fonts', 'css']);