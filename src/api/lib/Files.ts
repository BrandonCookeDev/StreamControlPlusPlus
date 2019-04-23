import fs from 'fs'
import path from 'path'
import log from '../util/Logger'

export default class Files {

	static TEMPLATE_FILE: string
	static DATA_FILE: string

	static getTemplateFilepath(){
		log.debug('Files.getTemplateFilepath called')
		return Files.TEMPLATE_FILE
	}

	static setTemplateFilepath(filepath: string){
		log.debug(`Files.setTemplateFilepath called [${filepath}]`)
		Files.TEMPLATE_FILE = filepath
	}

	static getDataFilepath(){
		log.debug('Files.getDataFilepath called')
		return Files.DATA_FILE
	}

	static setDataFilepath(filepath: string){
		log.debug(`Files.setDataFilepath called [${filepath}]`)
		Files.DATA_FILE = filepath
	}

	static getFromDataFile(): Object{
		log.debug('Files.getFromDataFile called')
		return JSON.parse(fs.readFileSync(Files.DATA_FILE, 'utf8'))
	}

	static writeToDataFile(data: Object){
		log.debug(`Files.writeToDataFile called [${JSON.stringify(data)}]`)
		fs.writeFileSync(Files.DATA_FILE, JSON.stringify(data, null, 4))
	}

}