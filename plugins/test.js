'use strict';
const fs 	= require('fs')
const path 	= require('path')
const chai 	= require('chai')
const expect = chai.expect
const rimraf = require('rimraf')
const ncp 	 = require('ncp').ncp
const {format} = require('util')

const plugin = require('./plugin')

// STRINGS
const TEST_PLUGIN_NAME = 'scpp_test_plugin'
const NAV_TEMPLATE = '<a class="nav-item nav-link tight-spacing" onclick="return hotswap(\'%s\')" href="#"><img src="%s"></a>'
const SETTINGS_TEMPLATE = '<a class="nav-item nav-link" id="nav-home-tab" data-toggle="tab" onclick="return hotswapTab(\'%s\')" role="tab" aria-controls="nav-home" aria-selected="true">%s</a>'
const FAKE_SETTINGS_PAGE_HTML = '<div><form action="POST"><input type="text" name="hello" /><input type="submit" value="submit" /></form></div>'
const FAKE_NAV_PAGE_HTML = ''
const FAKE_SETTINGS_TAB_NAME = 'test'
const FAKE_EMPTY_PLUGIN_NAME = 'test_empty_plugin'

// PATHS
const SRC_PATH = path.join(__dirname, '..', 'src')
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
const FAKE_EMPTY_PLUGIN_PATH = path.join(__dirname, FAKE_EMPTY_PLUGIN_NAME)
const CLIENT_BACKUP_PATH = path.join(__dirname, '..', 'client.backup')
const SRC_BACKUP_PATH = path.join(__dirname, '..', 'src.backup')
const TEST_PLUGIN_PATH = path.join(__dirname, TEST_PLUGIN_NAME)

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

	before(function(done){
		setup(done)
	})

	beforeEach(function(done){
		plugin.init()

		// backup client and src dirs
		doBackups()
			.then(() => done())
			.catch(done)
	})

	afterEach(function(done){
		this.timeout(5000)
		fs.writeFileSync(CONFIG_FILE_PATH, CONFIG_BACKUP)
		teardownEach(done)
	})

	after(function(done){
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

		Promise.all([
			deleteRecursiveIfExists(TEST_PLUGIN_PATH),
			deleteRecursiveIfExists(FAKE_EMPTY_PLUGIN_PATH)
		])
		.then(() => done())
		.catch(done)
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
		this.timeout(5000)

		fakeInstall()

		const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8').split('\n')
		manifestContent.shift() // remove the title line
		expect(manifestContent.includes(TEST_HTML_FILE), 'html file does not exist in the manifest').to.be.true
		expect(manifestContent.includes(TEST_CSS_FILE), 'css file does not exist in the manifest').to.be.true
		expect(manifestContent.includes(TEST_JS_FILE), 'js file does not exist in the manifest').to.be.true
		expect(manifestContent.includes(TEST_IMAGE_FILE), 'image file does not exist in the manifest').to.be.true
		expect(manifestContent.includes(TEST_API_LIB_FILE), 'api lib file does not exist in the manifest').to.be.true
		expect(manifestContent.includes(TEST_API_UTIL_FILE), 'api util file does not exist in the manifest').to.be.true
		expect(manifestContent.includes(TEST_API_ROUTES_FILE), 'api routes file does not exist in the manifest').to.be.true

		expect(fs.existsSync(TEST_HTML_FILE), 'html file is not installed').to.be.true
		expect(fs.existsSync(TEST_CSS_FILE), 'css file is not installed').to.be.true
		expect(fs.existsSync(TEST_JS_FILE), 'js file is not installed').to.be.true
		expect(fs.existsSync(TEST_IMAGE_FILE), 'image file is not installed').to.be.true
		expect(fs.existsSync(TEST_API_LIB_FILE), 'api lib file is not installed').to.be.true
		expect(fs.existsSync(TEST_API_UTIL_FILE), 'api util file is not installed').to.be.true
		expect(fs.existsSync(TEST_API_ROUTES_FILE), 'api routes file is not installed').to.be.true
		
		plugin.uninstall()

		expect(fs.existsSync(TEST_HTML_FILE), 'html file is still installed after uninstall called').to.be.false
		expect(fs.existsSync(TEST_CSS_FILE), 'css file is still installed after uninstall called').to.be.false
		expect(fs.existsSync(TEST_JS_FILE), 'js file is still installed after uninstall called').to.be.false
		expect(fs.existsSync(TEST_IMAGE_FILE), 'image file is still installed after uninstall called').to.be.false
		expect(fs.existsSync(TEST_API_LIB_FILE), 'api lib file is still installed after uninstall called').to.be.false
		expect(fs.existsSync(TEST_API_UTIL_FILE), 'api util file is still installed after uninstall called').to.be.false
		expect(fs.existsSync(TEST_API_ROUTES_FILE), 'api routes file is still installed after uninstall called').to.be.false
	})

	it('should create a new empty plugin correctly', function(){
		plugin.createEmptyPlugin(FAKE_EMPTY_PLUGIN_NAME)

		const fakePluginPackagePath = path.join(FAKE_EMPTY_PLUGIN_PATH, 'package')

		const fakePluginViewsPath = path.join(fakePluginPackagePath, 'views')
		const fakePluginJsPath = path.join(fakePluginPackagePath, 'js')
		const fakePluginCssPath = path.join(fakePluginPackagePath, 'styles')
		const fakePluginImagesPath = path.join(fakePluginPackagePath, 'images')
		const fakePluginApiPath = path.join(fakePluginPackagePath, 'api')
		const fakePluginApiLibPath = path.join(fakePluginPackagePath, 'api', 'lib')
		const fakePluginApiUtilPath = path.join(fakePluginPackagePath, 'api', 'util')
		const fakePluginApiRoutesPath = path.join(fakePluginPackagePath, 'api', 'routes')
		const fakePluginInstallFile = path.join(FAKE_EMPTY_PLUGIN_PATH, 'install.js')

		expect(fs.existsSync(fakePluginViewsPath), 'empty plugin views folder does not exist').to.be.true
		expect(fs.existsSync(fakePluginJsPath), 'empty plugin js folder does not exist').to.be.true
		expect(fs.existsSync(fakePluginCssPath), 'empty plugin styles folder does not exist').to.be.true
		expect(fs.existsSync(fakePluginImagesPath), 'empty plugin images folder does not exist').to.be.true
		expect(fs.existsSync(fakePluginApiPath), 'empty plugin api folder does not exist').to.be.true
		expect(fs.existsSync(fakePluginApiLibPath), 'empty plugin api lib folder does not exist').to.be.true
		expect(fs.existsSync(fakePluginApiUtilPath), 'empty plugin api util folder does not exist').to.be.true
		expect(fs.existsSync(fakePluginApiRoutesPath), 'empty plugin api routes folder does not exist').to.be.true
		expect(fs.existsSync(fakePluginInstallFile), 'empty plugin install file does not exist').to.be.true

	})

})

function setup(done){
	createEmptyPlugin(TEST_PLUGIN_NAME, done)
}

function teardown(done){
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

	// restore backups and delete folders
	// also delete the fake plugin if it exists
	restoreBackups()
		.then(() => deleteRecursiveIfExists(TEST_PLUGIN_NAME))
		.then(() => deleteRecursiveIfExists(FAKE_EMPTY_PLUGIN_PATH))
		.then(() => done())
		.catch(done)
}


function teardownEach(done){
	teardown(done)	
}

function createEmptyPlugin(name, done){
	console.log('creating plugin %s', name)
	deleteRecursiveIfExists(TEST_PLUGIN_PATH)
		.then(() => {
			let installFilePath = path.join(TEST_PLUGIN_PATH, 'install.js')
			let packageDirPath = path.join(TEST_PLUGIN_PATH, 'package')
			let viewsDirPath = path.join(packageDirPath, 'views')
			let cssDirPath = path.join(packageDirPath, 'styles')
			let jsDirPath = path.join(packageDirPath, 'js')
			let imagesDirPath = path.join(packageDirPath, 'images')
			let apiDirPath = path.join(packageDirPath, 'api')
			let apiLibDirPath = path.join(apiDirPath, 'lib')
			let apiUtilDirPath = path.join(apiDirPath, 'util')
			let apiRoutesDirPath = path.join(apiDirPath, 'routes')
		
			fs.mkdirSync(TEST_PLUGIN_PATH)
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
		})
		.then(() => done())
		.catch(done)
}

function fakeInstall(){
	console.log('Running fake install')
	fs.writeFileSync(TEST_HTML_FILE, '<!Doctype html>', 'utf8')
	fs.writeFileSync(TEST_CSS_FILE, 'body{color: white;}', 'utf8')
	fs.writeFileSync(TEST_JS_FILE, '\'use strict\';', 'utf8')
	fs.writeFileSync(TEST_IMAGE_FILE, '')
	fs.writeFileSync(TEST_API_LIB_FILE, '\'use strict\';', 'utf8')
	fs.writeFileSync(TEST_API_UTIL_FILE, '\'use strict\';', 'utf8')
	fs.writeFileSync(TEST_API_ROUTES_FILE, '\'use strict\';', 'utf8')
	
	let content = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf8'))
	content['hello'] = 'world'
	fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(content, null, 4), 'utf8')

	fs.appendFileSync(MANIFEST_PATH, TEST_HTML_FILE + '\n')
	fs.appendFileSync(MANIFEST_PATH, TEST_CSS_FILE + '\n')
	fs.appendFileSync(MANIFEST_PATH, TEST_JS_FILE + '\n')
	fs.appendFileSync(MANIFEST_PATH, TEST_API_LIB_FILE + '\n')
	fs.appendFileSync(MANIFEST_PATH, TEST_API_UTIL_FILE + '\n')
	fs.appendFileSync(MANIFEST_PATH, TEST_API_ROUTES_FILE + '\n')
	fs.appendFileSync(MANIFEST_PATH, TEST_IMAGE_FILE + '\n')
}

function copyRecursive(src, dest){
	return new Promise(function(resolve, reject){
		console.log('copying: %s to %s', src, dest)
		if(fs.existsSync(src))
			ncp(src, dest, err => {
				if(err)
					return reject(err)
				else resolve()
			})
		else reject(new Error('src directory must exist'))
	})
}

function deleteRecursiveIfExists(target){
	return new Promise(function(resolve, reject){
		console.log('deleting: %s', target)
		if(fs.existsSync(target))
			rimraf(target, err => {
				if(err)
					return reject(err)
				else resolve()
			})
		else resolve()
	})
}

function doBackups(){
	return Promise.all([
		copyRecursive(CLIENT_DIR, CLIENT_BACKUP_PATH),
		copyRecursive(SRC_PATH, SRC_BACKUP_PATH)
	])
}

function restoreBackups(){
	return Promise.all([
		copyRecursive(CLIENT_BACKUP_PATH, CLIENT_DIR),
		copyRecursive(SRC_BACKUP_PATH, SRC_PATH)
	])
	.then(() => {
		return Promise.all([
			deleteRecursiveIfExists(SRC_BACKUP_PATH),
			deleteRecursiveIfExists(CLIENT_BACKUP_PATH)
		])
	})
}