import fs from 'fs'
import path from 'path'
import chai from 'chai'
const expect = chai.expect

import Config from '../../../api/util/Config'
import Files from '../../../api/lib/Files'

const CONFIG_FILE_PATH = path.join(__dirname, '..', '..', '..', '..', 'config', 'config.json')
let CONFIG_FILE_CONTENT: string = ''

const DEFAULT_TEMPLATE_FILE = ''
const DEFAULT_DATA_FILE = 'stream_control_pp.json'
const MANUAL_TEMPLATE_FILE = path.join(__dirname, 'template.cspp')
const MANUAL_DATA_FILE = path.join(__dirname, 'data.json')
const MANUAL_DATA = {"p1_name": "hello", "p2_name": "world"}

describe('Files API', function(){

	before(function(){
		CONFIG_FILE_CONTENT = fs.readFileSync(CONFIG_FILE_PATH, 'utf8')
	})

	afterEach(function(){
		fs.writeFileSync(CONFIG_FILE_PATH, CONFIG_FILE_CONTENT)
		if(fs.existsSync(DEFAULT_DATA_FILE))
			fs.unlinkSync(DEFAULT_DATA_FILE)
	})

	it('should return the correct default data file', function(){
		expect(Files.getDataFilepath()).to.be.equal(DEFAULT_DATA_FILE)
	})

	it('should return null for the default template file', function(){
		expect(Files.getTemplateFilepath()).to.be.equal('');
	})

	it('should set the template file correctly', function(){
		Files.setTemplateFilepath(MANUAL_TEMPLATE_FILE)
		expect(Files.getTemplateFilepath()).to.be.equal(MANUAL_TEMPLATE_FILE)
	})

	it('should set the data file correctly', function(){
		Files.setDataFilepath(MANUAL_DATA_FILE)
		expect(Files.getDataFilepath()).to.be.equal(MANUAL_DATA_FILE)
	})

	it('should write the data correctly', function(){
		expect(fs.existsSync(DEFAULT_DATA_FILE)).to.be.false
		Files.writeToDataFile(MANUAL_DATA)
		expect(fs.existsSync(DEFAULT_DATA_FILE)).to.be.true
		expect(JSON.parse(fs.readFileSync(DEFAULT_DATA_FILE, 'utf8'))).to.deep.equal(MANUAL_DATA)
	})

})