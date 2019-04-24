import fs from 'fs'
import path from 'path'
import chai from 'chai'
import sinon from 'sinon'
const sandbox = sinon.createSandbox()
const expect = chai.expect

import Config from '../../../api/util/Config'
import Files from '../../../api/lib/Files'

const ROOT_DIR = path.join(__dirname, '..', '..', '..', '..')
const CONFIG_FILE_PATH = path.join(__dirname, '..', '..', '..', '..', 'config', 'config.json')
let CONFIG_FILE_CONTENT: string = ''

const DEFAULT_TEMPLATE_FILE = path.join(ROOT_DIR, 'client/readme.html')
const DEFAULT_DATA_FILE = path.join(ROOT_DIR, 'stream_control_pp.json')
const MANUAL_TEMPLATE_FILE = path.join(__dirname, 'template.cspp')
const MANUAL_DATA_FILE = path.join(__dirname, 'data.json')
const MANUAL_DATA = {p1_name: 'hello', p2_name: 'world'}

let CURRENT_DATA_FILE = DEFAULT_DATA_FILE
let CURRENT_TEMPLATE_FILE = DEFAULT_TEMPLATE_FILE

describe('Files API', () => {

	before(() => {
		CONFIG_FILE_CONTENT = fs.readFileSync(CONFIG_FILE_PATH, 'utf8')
	})

	beforeEach(() => {
		stubConfig()
	})

	afterEach(() => {
		fs.writeFileSync(CONFIG_FILE_PATH, CONFIG_FILE_CONTENT)
		if(fs.existsSync(DEFAULT_DATA_FILE))
			fs.unlinkSync(DEFAULT_DATA_FILE)
		if(fs.existsSync(MANUAL_DATA_FILE))
			fs.unlinkSync(MANUAL_DATA_FILE)
		
		sandbox.restore()
	})

	it('should return the correct default data file', () => {
		expect(Files.getDataFilepath()).to.be.equal(DEFAULT_DATA_FILE)
	})

	it('should return the default template file', () => {
		expect(Files.getTemplateFilepath()).to.be.equal(DEFAULT_TEMPLATE_FILE)
	})

	it('should set the template file correctly', () => {
		Files.setTemplateFilepath(MANUAL_TEMPLATE_FILE)
		expect(Files.getTemplateFilepath()).to.be.equal(MANUAL_TEMPLATE_FILE)
	})

	it('should set the data file correctly', () => {
		Files.setDataFilepath(MANUAL_DATA_FILE)
		expect(Files.getDataFilepath()).to.be.equal(MANUAL_DATA_FILE)
	})

	it('should write the data correctly', () => {
		expect(fs.existsSync(MANUAL_DATA_FILE)).to.be.false
		Files.writeToDataFile(MANUAL_DATA)
		expect(fs.existsSync(MANUAL_DATA_FILE)).to.be.true
		expect(JSON.parse(fs.readFileSync(MANUAL_DATA_FILE, 'utf8'))).to.deep.equal(MANUAL_DATA)
	})

})

const stubConfig = () => {

	const fakeGet = (...args: unknown[]) => {
		// prop: string
		const prop = args[0] as string
		switch(prop){
			case 'dataFile': return CURRENT_DATA_FILE
			case 'templateFile': return CURRENT_TEMPLATE_FILE
		}
		throw new Error()
	}

	const fakeSet = (...args: unknown[]) => {
		// prop: string, value: string
		const prop = args[0] as string
		const value = args[1] as string
		console.log(prop)
		console.log(value)
		switch(prop){
			case 'dataFile': 
				CURRENT_DATA_FILE = value
				break
			case 'templateFile':
				CURRENT_TEMPLATE_FILE = value
				break
		}
		return{}
	}

	sandbox.stub(Config, 'get').callsFake(fakeGet)
	sandbox.stub(Config, 'set').callsFake(fakeSet)
}