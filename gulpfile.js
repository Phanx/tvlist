var gulp = require('gulp')
// var concat = require('gulp-concat')
// TODO: add the stream merge thingy

// CSS
var postcss      = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
// var cssnext      = require('postcss-cssnext')
var csswring     = require('csswring')

// JavaScript
var babel = require('gulp-babel')

gulp.task('default', function () {
   console.log('Ribbit!')
})



gulp.task('build', [
   'copy',
   'build:css',
   'build:js'
])

gulp.task('build:css', function() {
   return gulp.src('src/css/**/*.css')
      .pipe(postcss([
         autoprefixer({ browsers: ['last 2 versions'] }),
         // cssnext,
         csswring
      ]))
      .pipe(gulp.dest('app/css'))
})

gulp.task('build:js', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(babel({ presets: ['react'] }))
		// .pipe(concat('all.js'))
		.pipe(gulp.dest('app/js'))
})



gulp.task('copy', [
   // Copy Bower components
	'copy:css',
	'copy:js'
])

gulp.task('copy:css', function() {
   // Copy CSS files from Bower components
   return gulp.src([
      'bower_components/flexboxgrid/css/flexboxgrid.min.css',
      'bower_components/normalize-css/normalize.css'
   ])
   // TODO: minimize things
   .pipe(gulp.dest('app/css/vnd'))
})

gulp.task('copy:js', function() {
   // Copy JS files from Bower components
   return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/react/react.min.js',
      'bower_components/react/react-dom.min.js'
   ])
   .pipe(gulp.dest('app/js/vnd'))
})



gulp.task('watch', [
   'watch:css',
   'watch:js'
])

gulp.task('watch:css', function() {
   return gulp.watch('src/css/**/*.css', ['build:css'])
})

gulp.task('watch:js', function() {
	return gulp.watch('src/js/**/*.js', ['build:js'])
})

