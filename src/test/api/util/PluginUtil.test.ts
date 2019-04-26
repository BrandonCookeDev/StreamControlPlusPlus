import fs from 'fs'
import path from 'path'
import chai from 'chai'
const expect = chai.expect

// PATHS
const ROOT_DIR = path.join(__dirname, '..', '..', '..', '..')
const PLUGIN_PATH = path.join(ROOT_DIR, 'plugins')
const CONFIG_PATH = path.join(ROOT_DIR, 'config', 'config.json')
const CONFIG_BACKUP = path.join(ROOT_DIR, 'config', 'config.backup')
const TEST_PLUGIN1 = path.join(PLUGIN_PATH, 'test_plugin1.zip')
const TEST_PLUGIN2 = path.join(PLUGIN_PATH, 'test_plugin2.zip')
const TEST_PLUGIN3 = path.join(PLUGIN_PATH, 'test_plugin3.zip')
const TEST_PLUGIN4 = path.join(PLUGIN_PATH, 'test_plugin4.zip')


describe('Plugin Utilities', function(){

	beforeEach(setup)

	afterEach(teardown)

	

})

const setup = () => {
	const configContent = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
	fs.writeFileSync(CONFIG_BACKUP, configContent)

	// add more fake plugins to the config file
	configContent.plugins.concat([
		'test_plugin1',
		'test_plugin2',
	])

	fs.writeFileSync(TEST_PLUGIN1, '')
	fs.writeFileSync(TEST_PLUGIN2, '')
	fs.writeFileSync(TEST_PLUGIN3, '')
	fs.writeFileSync(TEST_PLUGIN4, '')
}

const teardown = () => {
	fs.copyFileSync(CONFIG_BACKUP, CONFIG_PATH)
	fs.unlinkSync(CONFIG_BACKUP)

	if(fs.existsSync(TEST_PLUGIN1))
		fs.unlinkSync(TEST_PLUGIN1)
	
	if(fs.existsSync(TEST_PLUGIN2))
		fs.unlinkSync(TEST_PLUGIN2)
	
	if(fs.existsSync(TEST_PLUGIN3))
		fs.unlinkSync(TEST_PLUGIN3)
	
	if(fs.existsSync(TEST_PLUGIN4))
		fs.unlinkSync(TEST_PLUGIN4)
	
}