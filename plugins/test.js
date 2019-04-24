'use strict';
const fs = require('fs')
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const rimraf = require('rimraf')
const {format} = require('util')

const plugin = require('./plugin')

const CLIENT_DIR =  path.join(__dirname, '..', 'client')
const SPLASH_PAGE_PATH = path.join(CLIENT_DIR, 'splash.html')
const SETTINGS_PAGE_PATH = path.join(CLIENT_DIR, 'views', 'settings-wrapper.html')
const MANIFEST_PATH = path.join(__dirname, 'manifest.txt')
const SPLASH_PAGE_COPY_PATH = format('%s.backup', SPLASH_PAGE_PATH)
const SETTINS_PAGE_COPY_PATH = format('%s.backup', SETTINGS_PAGE_PATH)

describe('SCPP Plugin Module', function(){

	before(function(){
		setup()
	})

	beforeEach(function(){
		plugin.init()
	})

	afterEach(function(){
		teardownEach()
	})

	after(function(done){
		teardown(done)
	})

	it('should initialize correctly', function(){
		// init called in beforeEach
		expect(fs.existsSync(SPLASH_PAGE_COPY_PATH)).to.be.true
		expect(fs.existsSync(SETTINS_PAGE_COPY_PATH)).to.be.true
		expect(fs.existsSync(MANIFEST_PATH)).to.be.true
	})

	it('should add a filepath to the manifest correctly', function(){
		let p1 = path.join(__dirname, 'test1.png')
		let p2 = path.join(__dirname, 'test/test3.html')
		plugin.addToManifest(p1)
		plugin.addToManifest(p2)
		let content = fs.readFileSync(MANIFEST_PATH, 'utf8')
		expect(new RegExp(p1).test(content)).to.be.true
		expect(new RegExp(p2).test(content)).to.be.true
	})

	it('should register views correctly', function(){
		throw new Error('not yet implemented')
	})

	it('should register styles correctly', function(){
		throw new Error('not yet implemented')
	})

	it('should register js files correctly', function(){
		throw new Error('not yet implemented')
	})

	it('should register images correctly', function(){
		throw new Error('not yet implemented')
	})

	it('should register api packages correctly', function(){
		throw new Error('not yet implemented')
	})

	it('should register a new settings page correctly', function(){
		throw new Error('not yet implemented')
	})

	it('should register a new nav link correctly', function(){
		throw new Error('not yet implemented')
	})

	it('should register a new config setting correctly', function(){
		throw new Error('not yet implemented')
	})

	it('should uninstall a plugin correctly', function(){
		throw new Error('not yet implemented')
	})

	it('should create a new empty plugin correctly', function(){
		throw new Error('not yet implemented')
	})

})

function setup(){
	createEmptyPlugin('scpp_plugin_test')
}

function teardown(done){
	rimraf(path.join(__dirname, 'scpp_plugin_test'), done)
}

function teardownEach(){
	if(fs.existsSync(SPLASH_PAGE_COPY_PATH)){
		console.log('restoring splash backup')
		fs.copyFileSync(SPLASH_PAGE_COPY_PATH, SPLASH_PAGE_PATH)
		console.log('deleting splash page copy')
		fs.unlinkSync(SPLASH_PAGE_COPY_PATH)
	}

	if(fs.existsSync(SETTINS_PAGE_COPY_PATH)){
		console.log('restoring settings backup')
		fs.copyFileSync(SETTINS_PAGE_COPY_PATH, SETTINGS_PAGE_PATH)
		console.log('deleting settings page copy')
		fs.unlinkSync(SETTINS_PAGE_COPY_PATH)
	}

	if(fs.existsSync(MANIFEST_PATH)){
		console.log('deleting manifest file')
		fs.unlinkSync(MANIFEST_PATH)
	}
}

function createEmptyPlugin(name){
	console.log('creating plugin %s', name)
	let folderPath = path.join(__dirname, name)
	if(fs.existsSync(folderPath))
		throw new Error('plugin ' + name + ' already exists!')
	
	let installFilePath = path.join(folderPath, 'install.js')
	let packageDirPath = path.join(folderPath, 'package')
	let viewsDirPath = path.join(packageDirPath, 'views')
	let cssDirPath = path.join(packageDirPath, 'css')
	let jsDirPath = path.join(packageDirPath, 'js')
	let imagesDirPath = path.join(packageDirPath, 'images')
	let apiDirPath = path.join(packageDirPath, 'api')

	fs.mkdirSync(folderPath)
	fs.writeFileSync(installFilePath, '');
	fs.mkdirSync(packageDirPath)
	fs.mkdirSync(viewsDirPath)
	fs.mkdirSync(cssDirPath)
	fs.mkdirSync(jsDirPath)
	fs.mkdirSync(imagesDirPath)
	fs.mkdirSync(apiDirPath)
}