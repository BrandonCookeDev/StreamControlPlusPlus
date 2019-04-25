const { app, BrowserWindow } = require('electron')
require('./dist/api/server'); // launch the api

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadFile('client/splash.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Plugin Installations
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const rimraf = require('rimraf')
const scppPlugin = require('./plugins/plugin')

const PLUGIN_PATH = path.join(__dirname, 'plugins')

////////////////////////////////
// Error Handler
///////////////////////////////
function errHandler(err) {
  console.error(err)
  scppPlugin.uninstall()
  process.exit(1)
}
process.on('exit', errHandler)
process.on('SIGINT', errHandler)
process.on('uncaughtException', errHandler)
process.on('unhandledRejection', errHandler)

/**
 * installPlugins - IIFE
 * 
 * This function iterates through the plugins/ folder
 * and gathers every *.zip file inside of it. It then
 * unzips this file, runs its expected install.js file,
 * and then deletes the unzipped folder. This should effectively
 * install the plugin on-startup every time.
 */
~function installPlugins(){
  console.log('installing pluggins')

  // get all target zip file absolute paths
  const pluginPaths = fs.readdirSync(PLUGIN_PATH).map(file => {
    if(path.extname(file) === '.zip')
      return path.join(__dirname, file)
  })

  // parse out and store the target resulting directory paths
  const pluginDirectories = pluginPaths.map(pluginZipPath => 
    path.join(path.dirname(pluginZipPath), path.basename(pluginZipPath))
  )

  // unzip each target zip file
  pluginPaths.forEach(pluginZipPath => {
    zlib.unzipSync(fs.readFileSync(pluginZipPath))
  })

  // run each plugin directory's install.js
  pluginDirectories.forEach(pluginDir => {
    require(path.join(pluginDir, 'install.js'))
  })

  // delete each plugin directory
  pluginDirectories.forEach(pluginDir => {
    fs.unlinkSync(pluginDir)
  })
}()