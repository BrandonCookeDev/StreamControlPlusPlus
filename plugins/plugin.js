'use strict';

const fs = require('fs')
	, path = require('path')
	, ncp = require('ncp').ncp
	, {format} = require('util')

//PATHS
const CLIENT_DIR =  path.join(__dirname, '..', 'client')
const API_DIR = path.join(__dirname, '..', 'src', 'api')
const IMAGES_DIR = path.join(CLIENT_DIR, 'images')
const VIEWS_DIR = path.join(CLIENT_DIR, 'views')
const CSS_DIR = path.join(CLIENT_DIR, 'styles')
const JS_DIR = path.join(CLIENT_DIR, 'js')
const SPLASH_PAGE_PATH = path.join(CLIENT_DIR, 'splash.html')
const SETTINGS_PAGE_PATH = path.join(CLIENT_DIR, 'views', 'settings-wrapper.html')
const MANIFEST_PATH = path.join(__dirname, 'manifest.txt')
const SPLASH_PAGE_COPY_PATH = format('%s.backup', SPLASH_PAGE_PATH)
const SETTINS_PAGE_COPY_PATH = format('%s.backup', SETTINGS_PAGE_PATH)

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
	fs.writeFile(MANIFEST_PATH, 'SCPP PLUGIN MANIFEST:\n')
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
			targetDirectory = CSS_DIR
			break
		case 'CSS':
			targetExtension = '.css'
			targetDirectory = JS_DIR
			break
		case 'IMAGE':
			targetExtension = '*'
			targetDirectory = IMAGES_DIR
			break
		default:
			throw new Error('Unsupported Type: ' + type)
	}


	let dirpath = path.normalize(dirname)
	fs.readdirSync(dirpath).foreach(file => {
		if(path.extname(file) === targetExtension){
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

function registerApi(dirname){
	let dirpath = path.normalize(dirname)
	let apiContents = fs.readdirSync(dirpath)
	if(apiContents.includes(['lib', 'routes', 'util']))
		throw new Error('API Package must include the following: lib/ routes/ util/')
	
	return new Promise((resolve, reject) => {
		ncp(dirpath, API_DIR, function(err){
			if(err) reject(err)
			else {
				addToManifest(format('%s/%s', API_DIR, dirname))
				resolve()
			}
		})
	})
}

function registerSettingPage(targetFilepath, tabName){
	let tabElement = format(SETTINGS_TEMPLATE, targetFilepath, tabName)
	
	// append nav string in case we need to call this function again
	tabElement += '\n' + SETTINGS_STRING

	let content = fs.readFileSync(SETTINGS_PAGE_PATH)
	content.replace(SETTINGS_REGEX, tabElement)
	fs.writeFileSync(SETTINGS_PAGE_PATH, content)
}

function registerNavbarLink(targetFilepath, navIconFilepath){
	let navElement = format(NAV_TEMPLATE, targetFilepath, navIconFilepath)
	
	// append nav string in case we need to call this function again
	navElement += '\n' + NAV_STRING

	let content = fs.readFileSync(SPLASH_PAGE_PATH)
	content.replace(NAV_REGEX, navElement)
	fs.writeFileSync(SPLASH_PAGE_PATH, content)
}

function registerConfigSetting(){
	
}

function uninstall(){
	// delete files registered in the manifest
	let filesToDelete = fs.readFileSync(MANIFEST_PATH).split('\n')
	filesToDelete.shift() // remove the title line
	filesToDelete.foreach(absFilepath => {
		fs.unlinkSync(absFilepath)
	})
	
	// reinstate backups
	if(fs.existsSync(SPLASH_PAGE_COPY_PATH))
		fs.copyFileSync(SPLASH_PAGE_COPY_PATH, SPLASH_PAGE_PATH)
	if(fs.existsSync(SETTINGS_PAGE_COPY_PATH))
		fs.copyFileSync(SETTINS_PAGE_COPY_PATH, SETTINGS_PAGE_PATH)

	// 
}

function createEmptyPlugin(name){
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

	fs.mkdirSync(name)
	fs.writeFileSync(installFilePath, INSTALL_FILE_PREFIX);
	fs.mkdirSync(packageDirPath)
	fs.mkdirSync(viewsDirPath)
	fs.mkdirSync(cssDirPath)
	fs.mkdirSync(jsDirPath)
	fs.mkdirSync(imagesDirPath)
	fs.mkdirSync(apiDirPath)
}