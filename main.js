const { app, BrowserWindow } = require('electron')
require('./dist/api/server'); // launch the api

// Plugin Installations
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const unzipper = require('unzipper')
const scppPlugin = require('./plugins/plugin')

const PLUGIN_PATH = path.join(__dirname, 'plugins')

////////////////////////////////
// Error Handler
///////////////////////////////
function errHandler(err) {
  console.error(err)

  console.log('running pluggin uninstallation')
  scppPlugin.uninstall()
  process.exit(1)
}
process.on('exit', errHandler)
process.on('SIGINT', errHandler)
process.on('SIGTERM', errHandler)
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
~async function installPlugins(){
  console.log('installing pluggins')
  scppPlugin.init()

  // get all target zip file absolute paths
  let pluginZips = []
  fs.readdirSync(PLUGIN_PATH).forEach(file => {
    if(path.extname(file) === '.zip'){
      console.log('found plugin zip: %s', file)
      pluginZips.push(path.join(PLUGIN_PATH, file))
    }
  })

  if(pluginZips <= 0){
    console.log('no plugins to install')
    return
  }
  else console.log('found %d plugins...', pluginZips.length)

  for(let i in pluginZips){
    let pluginZipPath = pluginZips[i]      
    let filename = path.basename(pluginZipPath)
    let zipName = filename.substring(0, filename.length - path.extname(pluginZipPath).length)
    let zipDest = path.join(PLUGIN_PATH, zipName)

    console.log('unzipping: %s', zipName)
    await unzip(pluginZipPath, zipDest)

    console.log('installing: %s', zipName)
    require(path.join(zipDest, 'install.js'))

    console.log('removing dir: %s', zipDest)
    await recursiveDelete(zipDest)
  }

  // run the application
  console.log('starting application')
  return true
}()


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



function unzip(filepath, destPath){
  return new Promise(function(resolve, reject){
    fs.createReadStream(filepath)
      .pipe(unzipper.Extract({path: destPath}))
      .on('close', () => {
        console.log('successfully unzipped %s to %s', 
          filepath, 
          destPath
        )
        return resolve()
      })
      .on('error', e => {
        console.error(e)
        return reject(e)
      })
  })  
}

function recursiveDelete(dirpath){
  return new Promise(function(resolve, reject){
    rimraf(dirpath, e => {
      if(e) return reject(e)
      
      console.log('deleted %s', dirpath)
      return resolve()
    })
  })
}
