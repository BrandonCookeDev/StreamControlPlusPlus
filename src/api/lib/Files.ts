import fs from 'fs'
import path from 'path'
import log from '../util/Logger'

export default class Files {

	static TEMPLATE_FILE: string | null = null
	static DATA_FILE: string = 'stream_controll_pp.json'

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
		log.debug(`Files.getFromDataFile called. File: ${Files.DATA_FILE}`)
		return JSON.parse(fs.readFileSync(Files.DATA_FILE, 'utf8'))
	}

	static writeToDataFile(data: Object){
		log.debug(`Files.writeToDataFile called. File: ${Files.DATA_FILE}, Data: ${JSON.stringify(data)}`)
		fs.writeFileSync(Files.DATA_FILE, JSON.stringify(data, null, 4), 'utf8')
	}

}