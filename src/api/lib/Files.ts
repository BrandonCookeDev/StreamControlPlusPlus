import fs from 'fs'
import path from 'path'
import log from '../util/Logger'
import config from './Config'

export default class Files {

	static TEMPLATE_FILE: string | null = config.get("templateFile")
	static DATA_FILE: string = config.get("dataFile")

	static getTemplateFilepath(){
		log.debug('Files.getTemplateFilepath called')
		return config.get("dataFile")
	}

	static setTemplateFilepath(filepath: string){
		log.debug(`Files.setTemplateFilepath called [${filepath}]`)
		config.set("templateFile", filepath)
	}

	static getDataFilepath(){
		log.debug('Files.getDataFilepath called')
		return config.get("dataFile")
	}

	static setDataFilepath(filepath: string){
		log.debug(`Files.setDataFilepath called [${filepath}]`)
		config.set("dataFile", filepath)
	}

	static getFromDataFile(): Object{
		log.debug(`Files.getFromDataFile called. File: ${Files.DATA_FILE}`)
		return JSON.parse(fs.readFileSync(Files.DATA_FILE, 'utf8'))
	}

	static writeToDataFile(data: Object){
		log.debug(`Files.writeToDataFile called. File: ${Files.DATA_FILE}, Data: ${JSON.stringify(data)}`)
		let dataFile = config.get("dataFile")
		fs.writeFileSync(dataFile, JSON.stringify(data, null, 4), 'utf8')
	}

}