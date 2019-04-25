'use strict';
const fs = require('fs')
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const rimraf = require('rimraf')
const {format} = require('util')

const plugin = require('./plugin')

// STRINGS
const TEST_PLUGIN_NAME = 'scpp_test_plugin'
const NAV_TEMPLATE = '<a class="nav-item nav-link tight-spacing" onclick="return hotswap(\'views/%s\')" href="#"><img src="images/%s"></a>'
const SETTINGS_TEMPLATE = '<a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" onclick="return hotswapTab(\'views/%s\')" role="tab" aria-controls="nav-home" aria-selected="true">%s</a>'
const FAKE_SETTINGS_PAGE_HTML = '<div><form action="POST"><input type="text" name="hello" /><input type="submit" value="submit" /></form></div>'
const FAKE_NAV_PAGE_HTML = ''
const FAKE_SETTINGS_TAB_NAME = 'test'

// PATHS
const CLIENT_DIR =  path.join(__dirname, '..', 'client')
const API_DIR = path.join(__dirname, '..', 'src', 'api')
const IMAGES_DIR = path.join(CLIENT_DIR, 'images')
const VIEWS_DIR = path.join(CLIENT_DIR, 'views')
const CSS_DIR = path.join(CLIENT_DIR, 'styles')
const JS_DIR = path.join(CLIENT_DIR, 'js')
const CONFIG_FILE_PATH = path.join(__dirname, '..', 'config', 'config.json')
const SPLASH_PAGE_PATH = path.join(CLIENT_DIR, 'splash.html')
const SETTINGS_PAGE_PATH = path.join(CLIENT_DIR, 'views', 'settings-wrapper.html')
const MANIFEST_PATH = path.join(__dirname, 'manifest.txt')
const CONFIG_MANIFEST_PATH = path.join(__dirname, 'manifest.config.txt')
const SPLASH_PAGE_COPY_PATH = format('%s.backup', SPLASH_PAGE_PATH)
const SETTINGS_PAGE_COPY_PATH = format('%s.backup', SETTINGS_PAGE_PATH)
const FAKE_SETTINGS_PAGE_PATH = path.join(__dirname, 'fake_settings.html')
const FAKE_NAV_PAGE_PATH = path.join(__dirname, 'fake_nav.html')
const FAKE_NAV_IMAGE_PATH = path.join(__dirname, 'test.png')

// FILES
const TEST_IMAGE_FILE = path.join(IMAGES_DIR, 'test.png')
const TEST_HTML_FILE = path.join(VIEWS_DIR, 'test.html')
const TEST_CSS_FILE = path.join(CSS_DIR, 'test.css')
const TEST_JS_FILE = path.join(JS_DIR, 'test.js')
const TEST_API_LIB_FILE = path.join(API_DIR, 'lib/lib-test.js')
const TEST_API_UTIL_FILE = path.join(API_DIR, 'util/util-test.js')
const TEST_API_ROUTES_FILE = path.join(API_DIR, 'routes/routes-test.js')

// BACKUPS
const CONFIG_BACKUP = fs.readFileSync(CONFIG_FILE_PATH, 'utf8')

describe('SCPP Plugin Module', function(){

	before(function(){
		setup()
	})

	beforeEach(function(){
		plugin.init()
	})

	afterEach(function(){
		fs.writeFileSync(CONFIG_FILE_PATH, CONFIG_BACKUP)
		teardownEach()
	})

	after(function(done){
		teardown(done)
	})

	it('should initialize correctly', function(){
		// init called in beforeEach
		expect(fs.existsSync(SPLASH_PAGE_COPY_PATH)).to.be.true
		expect(fs.existsSync(SETTINGS_PAGE_COPY_PATH)).to.be.true
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
		plugin.registerViews(path.join(__dirname, TEST_PLUGIN_NAME, 'package', 'views'))
		expect(fs.existsSync(TEST_HTML_FILE), 'html file does not exist in client').to.be.true

		let manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8').split('\n')
		expect(manifestContent.includes(TEST_HTML_FILE), 'html file not in manifest').to.be.true
	})

	it('should register styles correctly', function(){
		plugin.registerStyles(path.join(__dirname, TEST_PLUGIN_NAME, 'package', 'styles'))
		expect(fs.existsSync(TEST_CSS_FILE), 'css file does not exist in client').to.be.true

		let manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8').split('\n')
		expect(manifestContent.includes(TEST_CSS_FILE), 'css file not in manifest').to.be.true
	})

	it('should register js files correctly', function(){
		plugin.registerJs(path.join(__dirname, TEST_PLUGIN_NAME, 'package', 'js'))
		expect(fs.existsSync(TEST_JS_FILE), 'js file does not exist in client').to.be.true

		let manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8').split('\n')
		expect(manifestContent.includes(TEST_JS_FILE), 'js file not in manifest').to.be.true
	})

	it('should register images correctly', function(){
		plugin.registerImages(path.join(__dirname, TEST_PLUGIN_NAME, 'package', 'images'))
		expect(fs.existsSync(TEST_IMAGE_FILE), 'image file does not exist in client').to.be.true

		let manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8').split('\n')
		expect(manifestContent.includes(TEST_IMAGE_FILE), 'image file not in manifest').to.be.true
	})

	it('should register api packages correctly', async function(){
		plugin.registerApi(path.join(__dirname, TEST_PLUGIN_NAME, 'package', 'api'))
		expect(fs.existsSync(TEST_API_LIB_FILE), 'lib file does not exist in client').to.be.true
		expect(fs.existsSync(TEST_API_UTIL_FILE), 'util file does not exist in client').to.be.true
		expect(fs.existsSync(TEST_API_ROUTES_FILE), 'routes file does not exist in client').to.be.true

		let manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8').split('\n')
		expect(manifestContent.includes(TEST_API_LIB_FILE), 'lib file not in manifest').to.be.true
		expect(manifestContent.includes(TEST_API_UTIL_FILE), 'util file not in manifest').to.be.true
		expect(manifestContent.includes(TEST_API_ROUTES_FILE), 'routes file not in manifest').to.be.true

		return true
	})

	it('should register a new settings page correctly', function(){
		fs.writeFileSync(FAKE_SETTINGS_PAGE_PATH, FAKE_SETTINGS_PAGE_HTML, 'utf8')
		plugin.registerSettingPage(FAKE_SETTINGS_PAGE_PATH, FAKE_SETTINGS_TAB_NAME)

		const expected = format(SETTINGS_TEMPLATE, FAKE_SETTINGS_PAGE_PATH, FAKE_SETTINGS_TAB_NAME)
		const actual = fs.readFileSync(SETTINGS_PAGE_PATH, 'utf8')
		expect(actual.indexOf(expected) >= 0, 'Expected Settings html is not in the settings file').to.be.true
	})

	it('should register a new nav link correctly', function(){
		fs.writeFileSync(FAKE_NAV_PAGE_PATH, FAKE_NAV_PAGE_HTML, 'utf8')
		plugin.registerNavbarLink(FAKE_NAV_PAGE_PATH, FAKE_NAV_IMAGE_PATH)

		const expected = format(NAV_TEMPLATE, FAKE_NAV_PAGE_PATH, FAKE_NAV_IMAGE_PATH)
		const actual = fs.readFileSync(SPLASH_PAGE_PATH, 'utf8')
		expect(actual.indexOf(expected) >= 0, 'Expected Navbar html is not in the splash file').to.be.true
	})

	it('should register a new config setting correctly', function(){
		let CONFIG_PROP = 'test_property'
		let CONFIG_DEFAULT = 'default, lol'
		plugin.registerConfigSetting(CONFIG_PROP, CONFIG_DEFAULT)

		let configContent = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf8'))
		expect(configContent.hasOwnProperty(CONFIG_PROP), 'config doesn\'t contain expected property').to.be.true
		expect(configContent[CONFIG_PROP]).to.be.equal(CONFIG_DEFAULT)
	})

	it('should uninstall a plugin correctly', function(){
		throw new Error('not yet implemented')
	})

	it('should create a new empty plugin correctly', function(){
		throw new Error('not yet implemented')
	})

})

function setup(){
	createEmptyPlugin(TEST_PLUGIN_NAME)
}

function teardown(done){
	rimraf(path.join(__dirname, TEST_PLUGIN_NAME), done)
}

function teardownEach(){

	if(fs.existsSync(SPLASH_PAGE_COPY_PATH)){
		console.log('restoring splash backup')
		fs.copyFileSync(SPLASH_PAGE_COPY_PATH, SPLASH_PAGE_PATH)
		console.log('deleting splash page copy')
		fs.unlinkSync(SPLASH_PAGE_COPY_PATH)
	}

	if(fs.existsSync(SETTINGS_PAGE_COPY_PATH)){
		console.log('restoring settings backup')
		fs.copyFileSync(SETTINGS_PAGE_COPY_PATH, SETTINGS_PAGE_PATH)
		console.log('deleting settings page copy')
		fs.unlinkSync(SETTINGS_PAGE_COPY_PATH)
	}

	if(fs.existsSync(MANIFEST_PATH)){
		console.log('deleting manifest file')
		fs.unlinkSync(MANIFEST_PATH)
	}

	if(fs.existsSync(FAKE_SETTINGS_PAGE_PATH))
		fs.unlinkSync(FAKE_SETTINGS_PAGE_PATH)

	if(fs.existsSync(FAKE_NAV_PAGE_PATH))
		fs.unlinkSync(FAKE_NAV_PAGE_PATH)

	if(fs.existsSync(TEST_HTML_FILE))
		fs.unlinkSync(TEST_HTML_FILE)

	if(fs.existsSync(TEST_CSS_FILE))
		fs.unlinkSync(TEST_CSS_FILE)

	if(fs.existsSync(TEST_JS_FILE))
		fs.unlinkSync(TEST_JS_FILE)

	if(fs.existsSync(TEST_IMAGE_FILE))
		fs.unlinkSync(TEST_IMAGE_FILE)

	if(fs.existsSync(TEST_API_LIB_FILE))
		fs.unlinkSync(TEST_API_LIB_FILE)

	if(fs.existsSync(TEST_API_LIB_FILE))
		fs.unlinkSync(TEST_API_LIB_FILE)

	if(fs.existsSync(TEST_API_UTIL_FILE))
		fs.unlinkSync(TEST_API_UTIL_FILE)

	if(fs.existsSync(TEST_API_ROUTES_FILE))
		fs.unlinkSync(TEST_API_ROUTES_FILE)
}

function createEmptyPlugin(name){
	console.log('creating plugin %s', name)
	let folderPath = path.join(__dirname, name)
	if(fs.existsSync(folderPath))
		throw new Error('plugin ' + name + ' already exists!')
	
	let installFilePath = path.join(folderPath, 'install.js')
	let packageDirPath = path.join(folderPath, 'package')
	let viewsDirPath = path.join(packageDirPath, 'views')
	let cssDirPath = path.join(packageDirPath, 'styles')
	let jsDirPath = path.join(packageDirPath, 'js')
	let imagesDirPath = path.join(packageDirPath, 'images')
	let apiDirPath = path.join(packageDirPath, 'api')
	let apiLibDirPath = path.join(apiDirPath, 'lib')
	let apiUtilDirPath = path.join(apiDirPath, 'util')
	let apiRoutesDirPath = path.join(apiDirPath, 'routes')

	fs.mkdirSync(folderPath)
	fs.writeFileSync(installFilePath, '')
	fs.mkdirSync(packageDirPath)
	fs.mkdirSync(viewsDirPath)
	fs.mkdirSync(cssDirPath)
	fs.mkdirSync(jsDirPath)
	fs.mkdirSync(imagesDirPath)
	fs.mkdirSync(apiDirPath)
	fs.mkdirSync(apiLibDirPath)
	fs.mkdirSync(apiUtilDirPath)
	fs.mkdirSync(apiRoutesDirPath)

	fs.writeFileSync(path.join(imagesDirPath, 'test.png'))
	fs.writeFileSync(path.join(viewsDirPath, 'test.html'))
	fs.writeFileSync(path.join(cssDirPath, 'test.css'))
	fs.writeFileSync(path.join(jsDirPath, 'test.js'))
	fs.writeFileSync(path.join(imagesDirPath, 'test.png'))
	fs.writeFileSync(path.join(apiLibDirPath, 'lib-test.js'))
	fs.writeFileSync(path.join(apiUtilDirPath, 'util-test.js'))
	fs.writeFileSync(path.join(apiRoutesDirPath, 'routes-test.js'))
	
}