'use strict';

const fs = require('fs')
	, path = require('path')
	, ncp = require('ncp').ncp
	, rimraf = require('rimraf')
	, {format} = require('util')

//PATHS
const CLIENT_DIR =  path.join(__dirname, '..', 'client')
const API_DIR = path.join(__dirname, '..', 'src', 'api')
const API_LIB_DIR = path.join(API_DIR, 'lib')
const API_UTIL_DIR = path.join(API_DIR, 'util')
const API_ROUTES_DIR = path.join(API_DIR, 'routes')
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

//STRINGS
const NAV_STRING = '<plugins_nav_tabs hidden />'
const SETTINGS_STRING = '<plugins_setting_tabs hidden />'
const INSTALL_FILE_PREFIX = '\'use strict\'\nconst plugin = require(\'../plugin\')'

//REGEX
const NAV_REGEX = new RegExp(/\<plugins_nav_tabs hidden \/\>/g)
const SETTINGS_REGEX = new RegExp(/\<plugins_setting_tabs hidden \/>/g)

//TEMPLATE
const NAV_TEMPLATE = '<a class="nav-item nav-link tight-spacing" onclick="return hotswap(\'views/%s\')" href="#"><img src="images/%s"></a>'
const SETTINGS_TEMPLATE = '<a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" onclick="return hotswapTab(\'views/%s\')" role="tab" aria-controls="nav-home" aria-selected="true">%s</a>'

function init(){
	fs.copyFileSync(SETTINGS_PAGE_PATH, SETTINGS_PAGE_COPY_PATH)
	fs.copyFileSync(SPLASH_PAGE_PATH, SPLASH_PAGE_COPY_PATH)
	fs.writeFileSync(MANIFEST_PATH, 'SCPP PLUGIN MANIFEST:\n')
	fs.writeFileSync(CONFIG_MANIFEST_PATH, 'SCPP CONFIG MANIFEST:\n')
}

function addToManifest(fileAbsPath){
	fs.appendFileSync(MANIFEST_PATH, format('\n%s', fileAbsPath))
}

function register(type, dirname){
	
	let targetExtension, targetDirectory
	switch(type){
		case 'VIEWS':
			targetExtension = '.html'
			targetDirectory = VIEWS_DIR
			break
		case 'JS':
			targetExtension = '.js'
			targetDirectory = JS_DIR
			break
		case 'CSS':
			targetExtension = '.css'
			targetDirectory = CSS_DIR
			break
		case 'IMAGE':
			targetExtension = '*'
			targetDirectory = IMAGES_DIR
			break
		case 'API_LIB':
			targetExtension = '.js',
			targetDirectory = API_LIB_DIR
			break
		case 'API_UTIL':
			targetExtension = '.js',
			targetDirectory = API_UTIL_DIR
			break
		case 'API_ROUTES':
			targetExtension = '.js',
			targetDirectory = API_ROUTES_DIR
			break
		default:
			throw new Error('Unsupported Type: ' + type)
	}


	let dirpath = path.normalize(dirname)
	fs.readdirSync(dirpath).forEach(file => {
		if(path.extname(file) === targetExtension || targetExtension === '*'){
			let fp = path.join(dirname, file)
			let tp = path.join(targetDirectory, file)
			fs.copyFileSync(fp, tp)
			addToManifest(tp)
		}
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

function registerImages(dirname){
	register('IMAGE', dirname)
}

function registerApi(dirname){
	let dirpath = path.normalize(dirname)
	let apiContents = fs.readdirSync(dirpath)
	if(apiContents.includes(['lib', 'routes', 'util']))
		throw new Error('API Package must include the following: lib/ routes/ util/')
	
	register('API_LIB', path.join(dirpath, 'lib'))
	register('API_UTIL', path.join(dirpath, 'util'))
	register('API_ROUTES', path.join(dirpath, 'routes'))
}

function registerSettingPage(targetFilepath, tabName){
	let tabElement = format(SETTINGS_TEMPLATE, targetFilepath, tabName)
	
	// append nav string in case we need to call this function again
	tabElement += '\n\t\t\t' + SETTINGS_STRING

	let content = fs.readFileSync(SETTINGS_PAGE_PATH, 'utf8')
	content = content.replace(SETTINGS_REGEX, tabElement)
	fs.writeFileSync(SETTINGS_PAGE_PATH, content, 'utf8')
}

function registerNavbarLink(targetFilepath, navIconFilepath){
	let navElement = format(NAV_TEMPLATE, targetFilepath, navIconFilepath)
	
	// append nav string in case we need to call this function again
	navElement += '\n\t\t' + NAV_STRING

	let content = fs.readFileSync(SPLASH_PAGE_PATH, 'utf8')
	content = content.replace(NAV_REGEX, navElement)
	fs.writeFileSync(SPLASH_PAGE_PATH, content, 'utf8')
}

function registerConfigSetting(propname, defaultValue){
	let configContent = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf8'))
	configContent[propname] = defaultValue
	fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(configContent, null, 4), 'utf8')
}

function uninstall(){
	// delete files registered in the manifest
	let filesToDelete = fs.readFileSync(MANIFEST_PATH, 'utf8').split('\n')
	filesToDelete.shift() // remove the title line
	filesToDelete.forEach(absFilepath => {
		if(fs.existsSync(absFilepath))
			fs.unlinkSync(absFilepath)
		else console.warn('no file exists to unlink: %s', absFilepath)
	})

	// remove elements from the config file that were injected (should we do this?)
	let configToDelete = fs.readFileSync(CONFIG_MANIFEST_PATH, 'utf8').split('\n')
	configToDelete.shift() //remove the title line
	let configContent = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf8'))
	configToDelete.forEach(prop => { 
		if(configContent.hasOwnProperty(prop))
			delete configContent[prop]
	})
	fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(configContent, null, 4), 'utf8')
	
	// reinstate backups
	if(fs.existsSync(SPLASH_PAGE_COPY_PATH))
		fs.copyFileSync(SPLASH_PAGE_COPY_PATH, SPLASH_PAGE_PATH)
	if(fs.existsSync(SETTINGS_PAGE_COPY_PATH))
		fs.copyFileSync(SETTINGS_PAGE_COPY_PATH, SETTINGS_PAGE_PATH)

	// 
}

function createEmptyPlugin(name){
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
	fs.mkdirSync(packageDirPath)
	fs.mkdirSync(viewsDirPath)
	fs.mkdirSync(cssDirPath)
	fs.mkdirSync(jsDirPath)
	fs.mkdirSync(imagesDirPath)
	fs.mkdirSync(apiDirPath)
	fs.mkdirSync(apiLibDirPath)
	fs.mkdirSync(apiUtilDirPath)
	fs.mkdirSync(apiRoutesDirPath)
	fs.writeFileSync(installFilePath, INSTALL_FILE_PREFIX, 'utf8')
}

module.exports = {
	init: init,
	uninstall: uninstall,
	addToManifest: addToManifest,
	registerViews: registerViews,
	registerStyles: registerStyles,
	registerJs: registerJs,
	registerImages: registerImages,
	registerApi: registerApi,
	registerSettingPage: registerSettingPage,
	registerNavbarLink: registerNavbarLink,
	registerConfigSetting: registerConfigSetting,
	createEmptyPlugin: createEmptyPlugin
}