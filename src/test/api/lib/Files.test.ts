import fs from 'fs'
import path from 'path'
import chai from 'chai'
const expect = chai.expect

import Config from '../../../api/util/Config'
import Files from '../../../api/lib/Files'

const DEFAULT_TEMPLATE_FILE = ''
const DEFAULT_DATA_FILE = 'stream_controll_pp.json'
const MANUAL_TEMPLATE_FILE = path.join(__dirname, 'template.cspp')
const MANUAL_DATA_FILE = path.join(__dirname, 'data.json')
const MANUAL_DATA = {"p1_name": "hello", "p2_name": "world"}

describe('Files API', function(){

	before(function(){
		Config.set("dataFile", DEFAULT_DATA_FILE)
		Config.set("templateFile", DEFAULT_TEMPLATE_FILE)
	})

	afterEach(function(){
		if(fs.existsSync(DEFAULT_DATA_FILE))
			fs.unlinkSync(DEFAULT_DATA_FILE)
		
		Config.set("dataFile", DEFAULT_DATA_FILE)
		Config.set("templateFile", DEFAULT_TEMPLATE_FILE)
	})

	it('should return the correct default data file', function(){
		expect(Files.getDataFilepath()).to.be.equal(DEFAULT_DATA_FILE)
	})

	it('should return null for the default template file', function(){
		expect(Files.getTemplateFilepath()).to.be.null;
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