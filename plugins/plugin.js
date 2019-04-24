'use strict';

const fs = require('fs')
	, path = require('path')
	, ncp = require('ncp').ncp

const CLIENT_DIR =  path.join(__dirname, '..', 'client')
const VIEWS_DIR = path.join(CLIENT_DIR, 'views')
const CSS_DIR = path.join(CLIENT_DIR, 'styles')
const JS_DIR = path.join(CLIENT_DIR, 'js')

const API_DIR = path.join(__dirname, '..', 'src', 'api')

function register(type, dirname){
	
	let targetExtension, targetDirectory
	switch(type){
		case 'VIEWS':
			targetExtension = '.html'
			targetDirectory = VIEWS_DIR
			break
		case 'JS':
			targetExtension = '.js'
			targetDirectory = CSS_DIR
			break
		case 'CSS':
			targetExtension = '.css'
			targetDirectory = JS_DIR
			break
	}


	let dirpath = path.normalize(dirname)
	fs.readdirSync(dirpath).foreach(file => {
		if(path.extname(file) === targetExtension)
			fs.copyFileSync(path.join(dirname, file), path.join(targetDirectory, file))
	})
}

function registerViews(dirname){
	register('VIEWS', dirname)
}

function registerStyles(dirname){
	register('CSS', dirname)
}

function registerJs(dirname){
	register('JS', dirname)
}

function registerApi(dirname){
	let dirpath = path.normalize(dirname)
	let apiContents = fs.readdirSync(dirpath)
	if(apiContents.includes(['lib', 'routes', 'util']))
		throw new Error('API Package must include the following: lib/ routes/ util/')
	
	return new Promise((resolve, reject) => {
		ncp(dirname, API_DIR, function(err){
			if(err) reject(err)
			else resolve()
		})
	})
}
