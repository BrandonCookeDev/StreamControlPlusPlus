import fs from 'fs'
import path from 'path'
import chai from 'chai'
const expect = chai.expect

import Config from '../../../api/util/Config'

const ROOT_DIR = path.join(__dirname, '..', '..', '..', '..')
const CONFIG_FILE_PATH = path.join(__dirname, '..', '..', '..', '..', 'config', 'config.json')
let CONFIG_FILE_CONTENT: string = ''

const DEFAULT_DATA_FILE = 'stream_control_pp.json'
const DEFAULT_TEMPLATE_FILE = 'client/readme.html'
const MANUAL_DATA_FILE = path.join(__dirname, 'test_stream_control_pp.json')
const MANUAL_TEMPLATE_FILE = path.join(__dirname, 'test_template_file.cspp')
const MANUAL_PROPERTY = 'test_property'
const MANUAL_PROPERTY_VALUE = 'test_value'

describe('Config utility', () => {

	before(() => {
		CONFIG_FILE_CONTENT = fs.readFileSync(CONFIG_FILE_PATH, 'utf8')
	})

	afterEach(() => {
		fs.writeFileSync(CONFIG_FILE_PATH, CONFIG_FILE_CONTENT)
	})
	
	it('should get the correct data file', () => {
		expect(Config.get('dataFile')).to.be.equal(DEFAULT_DATA_FILE)
	})

	it('should get the correct template file', () => {
		expect(Config.get('templateFile')).to.be.equal(DEFAULT_TEMPLATE_FILE)
	})

	it('should overwrite the data file', () => {
		Config.set('dataFile', MANUAL_DATA_FILE)
		expect(Config.get('dataFile')).to.be.equal(MANUAL_DATA_FILE)
	})

	it('should overwrite the template file', () => {
		Config.set('templateFile', MANUAL_TEMPLATE_FILE)
		expect(Config.get('templateFile')).to.be.equal(MANUAL_TEMPLATE_FILE)
	})

	it('should correctly read the file', () => {
		expect(Config.read()).to.deep.equal(JSON.parse(CONFIG_FILE_CONTENT))
	})

	it('should correctly write to the file', () => {
		let newProp = {[MANUAL_PROPERTY]: MANUAL_PROPERTY_VALUE}
		Config.write(newProp)
		expect(Config.get('dataFile')).to.be.null
		expect(Config.get('templateFile')).to.be.null
		expect(Config.get(MANUAL_PROPERTY)).to.be.equal(MANUAL_PROPERTY_VALUE)
	})
})