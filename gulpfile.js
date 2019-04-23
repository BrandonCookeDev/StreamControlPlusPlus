const path = require('path')
const gulp = require('gulp')
const ts = require('gulp-typescript')
const watch = require('gulp-watch')
const mocha = require('gulp-mocha')
const cp = require('child_process')

const tsProd = ts.createProject('tsconfig.json')
const TS_DIR = path.join(__dirname, 'src')
const JS_DIR = path.join(__dirname, 'dist')

function tsc(){
	return gulp.src(TS_DIR + '/**/*.ts')
		.pipe(tsProd())
		.pipe(gulp.dest(JS_DIR))
}

function run(cb){
	cp.exec('npm start', function(err, stdout, stderr){
		if(err){
			console.error(err)
			process.exit(1)
			cb(err)
		}
		console.log(stdout)
		console.error(stderr)
		cb()
	})
}

function test(){
	return gulp.src(JS_DIR + '/test/**/*.test.js')
		.pipe(mocha())
}

exports.tsc = tsc
exports.test = gulp.series(tsc, test)
exports.run = gulp.series(tsc, run)