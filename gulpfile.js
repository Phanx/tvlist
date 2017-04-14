const gulp = require("gulp")

const config = {
	dirs: {
		dist : "./app",
		src  : "./src"
	},
	babelify: {
		presets    : ["es2015", "react"]
	},
	browserify: {
		debug      : true,
		extensions : [".js", ".json", ".jsx"]
	},
	uglifyify: {
		global     : true
	}
}

gulp.task("default", function() {
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

const runSequence = require("run-sequence")

gulp.task("build", function(done) {
	runSequence(
		"clean",
		["build-css", "build-js"],
	done)
})

gulp.task("watch", function(done) {
	runSequence(
		"clean",
		["watch-css", "watch-js"],
	done)
})

//  ===================================================== \\
//  	clean
//  ===================================================== //

const del = require("del")

gulp.task("clean", function(done) {
	del([
		config.dirs.dist + "/css",
		config.dirs.dist + "/js"
	])
	.then(function() {
		done()
	})
})

//  ===================================================== \\
//		CSS
//  ===================================================== //

//const autoprefixer = require("autoprefixer")
const concat       = require("gulp-concat")
const cssnext      = require("postcss-cssnext")
const csswring     = require("csswring")
const postcss      = require("gulp-postcss")

gulp.task("build-css", function() {
	return gulp.src([
			"node_modules/normalize.css/normalize.css",
			"node_modules/flexboxgrid/dist/flexboxgrid.css",
			config.dirs.src + "/css/**/*.css"
		])
		.pipe(concat("app.css"))
		.pipe(postcss([
			//autoprefixer({ browsers: ["last 2 versions"] }),
			cssnext({ browsers: ["last 2 versions"] }),
			csswring({ preserveHacks: true, removeAllComments: true })
		]))
		.pipe(gulp.dest(config.dirs.dist + "/css"))
})

gulp.task("watch-css", ["build-css"], function() {
	return gulp.watch(config.dirs.src + "/css/**/*.css", ["build-css"])
})

//  ===================================================== \\
//		JS
//  ===================================================== //

const babelify   = require("babelify")
const browserify = require("browserify")
// const buffer     = require("vinyl-buffer")
const source     = require("vinyl-source-stream")
// const uglify     = require("gulp-uglify")
// const uglifyify  = require("uglifyify")
const watchify   = require("watchify")

function bundle(src) {
	return src.bundle()
		.pipe(source("app.js"))
		//.pipe(buffer())
		//.pipe(uglify({ mangle: false }))
		.pipe(gulp.dest(config.dirs.dist + "/js"))
}

gulp.task("build-js", function() {
	const b = browserify(config.dirs.src + "/js/app.js", config.browserify)
	b.transform(babelify, config.babelify)
	//b.transform(uglifyify, config.uglifyify)
	return bundle(b)
})

gulp.task("watch-js", function() {
	function buildify(bw) {
		return bundle(bw)
	}

	const bw = watchify(browserify(config.dirs.src + "/js/app.js", Object.assign({}, watchify.args, config.browserify)))
		bw.transform(babelify, config.babelify)
		//b.transform(uglifyify, config.uglifyify)
		bw.on("update", buildify)
		bw.on("error", console.log.bind(console))
		bw.on("log", console.log.bind(console))

	return buildify(bw)
})
