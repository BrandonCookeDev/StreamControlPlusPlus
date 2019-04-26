'use strict';
const path = require('path')
let plugin = require('../plugin')

const PACKAGE_PATH = path.join(__dirname, 'package')

plugin.registerViews(path.join(PACKAGE_PATH, 'views'))
plugin.registerStyles(path.join(PACKAGE_PATH, 'styles'))
plugin.registerJs(path.join(PACKAGE_PATH, 'js'))
plugin.registerImages(path.join(PACKAGE_PATH, 'images'))
plugin.registerApi(path.join(PACKAGE_PATH, 'api'))

plugin.registerSettingPage('views/helloworld.settings.html', 'helloworld')
plugin.registerConfigSetting('helloworld_api_key', 'AB4738Efa$2kaefs')
plugin.registerNavbarLink('views/helloworld.html', 'images/helloworld.png')