const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const ts = require('gulp-typescript')
const watch = require('gulp-watch')
const mocha = require('gulp-mocha')
const cp = require('child_process')
const ncp = require('ncp').ncp
const archiver = require('archiver')
const rimraf = require('rimraf')

const plugin = require('./plugins/plugin')
const tsProd = ts.createProject('tsconfig.json')
const ROOT_DIR = path.join(__dirname)
const TS_DIR = path.join(__dirname, 'src')
const JS_DIR = path.join(__dirname, 'dist')
const TEST_FILES = [
	JS_DIR + '/test/**/*.test.js',
	'plugins/test.js'
]

function deleteRecursive(src){
	return new Promise(function(resolve, reject){
		rimraf(src, e => {
			if(e) return reject(e)
			else return resolve()
		})
	})
}

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
	return gulp.src(TEST_FILES)
		.pipe(mocha())
}

async function backup(cb){
	try{
		await plugin.backup()
		cb()
	} catch(e){
		cb(e)
	}
}

async function forceBackup(cb){
	try{
		await deleteRecursive(path.join(ROOT_DIR, 'backups'))
		await plugin.backup()
		cb()
	} catch(e){
		cb(e)
	}
}

async function restore(cb){
	try{
		await plugin.restore()
		cb()
	} catch(e){
		cb(e)
	}
}

async function restoreConfig(cb){
	try{
		await plugin.restoreConfig()
		cb()
	} catch(e){
		cb(e)
	}
}

async function refresh(cb){
	try{
		await plugin.init()
		await plugin.uninstall()
		cb()
	} catch(e){
		cb(e)
	}
}

async function pluginInit(cb){
	try{
		await plugin.init()
		cb()
	} catch(e){
		cb(e)
	}
}

function testPluginSetup(cb){
	let pluginDir = path.join(__dirname, 'plugins', 'helloworld-example')
	let targetDir = path.join(__dirname, 'plugins', 'helloworld')
	ncp(pluginDir, targetDir, e => {
		if(e) 
			return cb(e)

		try{
			let zipPath = path.join(__dirname, 'plugins', 'helloworld.zip')
			let zipWriteStream = fs.createWriteStream(zipPath)
				.on('close', () => {
					console.log('successfully zipped %s to %s', 
						targetDir, 
						zipPath
					)
					rimraf(targetDir, e => cb(e))
				})
				.on('error', e => {
					console.error(e)
					rimraf(targetDir, e => cb(e))
				})

			let zip = archiver('zip')
			zip.pipe(zipWriteStream)
			zip.directory(targetDir, false)
			zip.finalize()
		} catch(e){
			return cb(e)
		}
	})
}

exports.tsc = tsc
exports.mocha = exports.test
exports.refresh = refresh
exports.backup = backup
exports.forceBackup = forceBackup
exports.restore = restore
exports.restoreConfig = restoreConfig
exports.pluginInit  = pluginInit
exports.testPluginSetup = testPluginSetup
exports.test = gulp.series(tsc, test)
exports.run = gulp.series(tsc, run)