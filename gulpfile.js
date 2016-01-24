var gulp = require("gulp")

var dirs = {
	dist: './app',
	src: './src'
}

gulp.task("default", function () {
	console.log("Available tasks:")
	console.log("  watch     - Build and watch everything")
	console.log("  watch-css - Build and watch just the CSS files")
	console.log("  watch-js  - Build and watch just the JS files")
	console.log("  ")
	console.log("  build     - Just build everything one time")
	console.log("  build-css - Just build the CSS one time")
	console.log("  build-js  - Just build the JS files one time")
	console.log("  ")
	console.log("  clean     - Remove files from past builds")
})

//  ===================================================== \\
//		Meta
//  ===================================================== //

var runSequence = require("run-sequence")

gulp.task("build", function(done) {
	runSequence(
		"clean",
		[ "build-css", "build-js" ],
	done)
})

gulp.task("watch", function(done) {
	runSequence(
		"clean",
		[ "watch-css", "watch-js" ],
	done)
})

//  ===================================================== \\
//  	clean
//  ===================================================== //

var del = require("del")

gulp.task("clean", function(done) {
	del([
		dirs.dist + "/css",
		dirs.dist + "/js"
	])
	.then(function() {
		done()
	})
})

//  ===================================================== \\
//		CSS
//  ===================================================== //

var autoprefixer = require("autoprefixer")
var concat       = require("gulp-concat")
// var cssnext   = require("postcss-cssnext")
var csswring     = require("csswring")
var postcss      = require("gulp-postcss")

gulp.task("build-css", function(done) {
	return gulp.src([
			"node_modules/normalize.css/normalize.css",
			"node_modules/flexboxgrid/dist/flexboxgrid.css",
			dirs.src + "/css/**/*.css"
		])
		.pipe(concat("app.css"))
		.pipe(postcss([
			autoprefixer({ browsers: ["last 2 versions"] }),
			// cssnext,
			csswring({ preserveHacks: true, removeAllComments: true })
		]))
		.pipe(gulp.dest("app/css"))
})

gulp.task("watch-css", ["build-css"], function() {
	return gulp.watch(dirs.src + "/css/**/*.css", ["build-css"])
})

//  ===================================================== \\
//		JS
//  ===================================================== //

var assign     = require("lodash.assign")
var babelify   = require("babelify")
var browserify = require("browserify")
var buffer     = require("vinyl-buffer")
var source     = require("vinyl-source-stream")
var uglify     = require("gulp-uglify")
var watchify   = require("watchify")

var babelifyOptions = {
	presets: [ "es2015", "react" ]
}
var browserifyOptions = {
	debug: true,
	entries: [dirs.src + "/js/app.js"],
	extensions: [".js", ".json", ".jsx"]
}

function bundle(src) {
	return src.bundle()
		.pipe(source("app.js"))
		//.pipe(buffer())
		//.pipe(uglify({ mangle: false }))
		.pipe(gulp.dest(dirs.dist + "/js"))
}

gulp.task("build-js", function() {
	var b = browserify(browserifyOptions)
	b.transform(babelify, babelifyOptions)
	return bundle(b)
})

gulp.task("watch-js", function() {
	var bw = watchify(browserify(assign({}, watchify.args, browserifyOptions)))
		bw.transform(babelify, babelifyOptions)
		bw.on("update", buildify)
		bw.on("log", console.log.bind(console))

	function buildify() {
		return bundle(bw)
	}

	return buildify()
})

