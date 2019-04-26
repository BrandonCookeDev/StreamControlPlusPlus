import fs from 'fs'
import path from 'path'
import chai from 'chai'
const expect = chai.expect

import Plugin from '../../../api/lib/Plugin'
import PluginUtil from '../../../api/util/PluginUtil'

// STRINGS
const TEST_PLUGIN1_NAME = 'test_plugin1'
const TEST_PLUGIN2_NAME = 'test_plugin2'
const TEST_PLUGIN3_NAME = 'test_plugin3'
const TEST_PLUGIN4_NAME = 'test_plugin4'

// PATHS
const ROOT_DIR = path.join(__dirname, '..', '..', '..', '..')
const PLUGIN_PATH = path.join(ROOT_DIR, 'plugins')
const CONFIG_PATH = path.join(ROOT_DIR, 'config', 'config.json')
const CONFIG_BACKUP = path.join(ROOT_DIR, 'config', 'config.backup')
const TEST_PLUGIN1_PATH = path.join(PLUGIN_PATH, TEST_PLUGIN1_NAME + '.zip')
const TEST_PLUGIN2_PATH = path.join(PLUGIN_PATH, TEST_PLUGIN2_NAME + '.zip')
const TEST_PLUGIN3_PATH = path.join(PLUGIN_PATH, TEST_PLUGIN3_NAME + '.zip')
const TEST_PLUGIN4_PATH = path.join(PLUGIN_PATH, TEST_PLUGIN4_NAME + '.zip')

const p1: Plugin = new Plugin('helloworld', path.join(PLUGIN_PATH, 'helloworld.zip'), true)
const p2: Plugin = new Plugin(TEST_PLUGIN1_NAME, TEST_PLUGIN1_PATH, true)
const p3: Plugin = new Plugin(TEST_PLUGIN2_NAME, TEST_PLUGIN2_PATH, false)
const p4: Plugin = new Plugin(TEST_PLUGIN3_NAME, TEST_PLUGIN3_PATH, true)
const p5: Plugin = new Plugin(TEST_PLUGIN4_NAME, TEST_PLUGIN4_PATH, false)

const EXPECTED_PLUGINS: Plugin[] = [p1, p2, p3, p4, p5]
const EXPECTED_ACTIVE: Plugin[] = [p1, p2, p4]
const EXPECTED_INACTIVE: Plugin[] = [p3, p5]

describe('Plugin Utilities', () => {

	beforeEach(() => setup())

	afterEach(() => teardown())


	it('should get the correct list of all plugins', () => {
		expect(PluginUtil.getAll()).to.have.deep.members(EXPECTED_PLUGINS)
	})

	it('should return the correct plugin active status', () => {
		expect(PluginUtil.isActive(TEST_PLUGIN1_NAME)).to.be.true
		expect(PluginUtil.isActive(TEST_PLUGIN2_NAME)).to.be.false
		expect(PluginUtil.isActive(TEST_PLUGIN3_NAME)).to.be.true
		expect(PluginUtil.isActive(TEST_PLUGIN4_NAME)).to.be.false
	})

	it('should return the correct list of active plugins', () => {
		expect(PluginUtil.getAllActive()).to.have.deep.members(EXPECTED_ACTIVE)
	})

	it('should return the correct list of inactive plugins', () => {
		expect(PluginUtil.getAllInactive()).to.have.deep.members(EXPECTED_INACTIVE)
	})
})

const setup = () => {
	const backup = fs.readFileSync(CONFIG_PATH, 'utf8')
	fs.writeFileSync(CONFIG_BACKUP, backup)

	let configContent = JSON.parse(backup)
	// add more fake plugins to the config file
	configContent.plugins = configContent.plugins.concat([
		TEST_PLUGIN1_NAME,
		TEST_PLUGIN3_NAME,
	])
	fs.writeFileSync(CONFIG_PATH, JSON.stringify(configContent, null, 4), 'utf8')
	console.log(configContent)

	fs.writeFileSync(TEST_PLUGIN1_PATH, '')
	fs.writeFileSync(TEST_PLUGIN2_PATH, '')
	fs.writeFileSync(TEST_PLUGIN3_PATH, '')
	fs.writeFileSync(TEST_PLUGIN4_PATH, '')
}

const teardown = () => {
	fs.copyFileSync(CONFIG_BACKUP, CONFIG_PATH)
	fs.unlinkSync(CONFIG_BACKUP)

	if(fs.existsSync(TEST_PLUGIN1_PATH))
		fs.unlinkSync(TEST_PLUGIN1_PATH)
	
	if(fs.existsSync(TEST_PLUGIN2_PATH))
		fs.unlinkSync(TEST_PLUGIN2_PATH)
	
	if(fs.existsSync(TEST_PLUGIN3_PATH))
		fs.unlinkSync(TEST_PLUGIN3_PATH)
	
	if(fs.existsSync(TEST_PLUGIN4_PATH))
		fs.unlinkSync(TEST_PLUGIN4_PATH)
	
}