var gulp = require('gulp')
// var concat = require('gulp-concat')
var runSequence = require('run-sequence')

// CSS things
var postcss		 = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
// var cssnext		= require('postcss-cssnext')
var csswring	  = require('csswring')

// JavaScript things
var babel = require('gulp-babel')

// Halp
gulp.task('default', function () {
	console.log('Available tasks:')
	console.log('   build - Clean up, copy components, and build from source files')
	console.log('   clean - Remove files from past build runs')
	console.log('   copy  - Copy components into the app for use')
	console.log('   watch - Watch and rebuild on source file changes')
})

//  ===================================================== \\
//  	clean
//  ===================================================== //

gulp.task('clean', function(done) {
	require('del')([
		'app/css',
		'app/js'
	]).then(function() {
		done()
	})
})

//  ===================================================== \\
//  	copy
//  ===================================================== //

gulp.task('copy', [
	'copy-css',
	'copy-js'
])

gulp.task('copy-css', function() {
	return gulp.src([
		'node_modules/normalize.css/normalize.css',
		'node_modules/flexboxgrid/dist/flexboxgrid.min.css'
	])
	// TODO: minify and concatenate
	.pipe(gulp.dest('app/css'))
})

gulp.task('copy-js', function() {
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		// TODO: use minified react for production
		'node_modules/react/dist/react.js',
		'node_modules/react-dom/dist/react-dom.js'
	])
	// TODO: concatenate
	.pipe(gulp.dest('app/js'))
})

//  ===================================================== \\
//		build
//  ===================================================== //

gulp.task('build', function(done) {
	runSequence(
		'clean',
		['copy', 'build-css', 'build-js'],
	done)
})

gulp.task('build-css', function(done) {
	return gulp.src('src/css/**/*.css')
		.pipe(postcss([
			autoprefixer({ browsers: ['last 2 versions'] }),
			// cssnext,
			csswring
		]))
		// .pipe(concat('all.css'))
		.pipe(gulp.dest('app/css'))
})

gulp.task('build-js', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(babel({ presets: ['react'] }))
		// .pipe(concat('all.js'))
		.pipe(gulp.dest('app/js'))
})

//  ===================================================== \\
//		watch
//  ===================================================== //

gulp.task('watch', [
	'watch-css',
	'watch-js'
])

gulp.task('watch-css', function() {
	return gulp.watch('src/css/**/*.css', ['build-css'])
})

gulp.task('watch-js', function() {
	return gulp.watch('src/js/**/*.js', ['build-js'])
})
