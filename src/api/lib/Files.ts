import fs from 'fs'
import path from 'path'
import log from '../util/Logger'
import config from '../util/Config'

export default class Files {

	static getTemplateFilepath(){
		log.debug('Files.getTemplateFilepath called')
		return config.get('templateFile')
	}

	static setTemplateFilepath(filepath: string){
		log.debug(`Files.setTemplateFilepath called [${filepath}]`)
		config.set('templateFile', filepath)
	}

	static getDataFilepath(){
		log.debug('Files.getDataFilepath called')
		return config.get('dataFile')
	}

	static setDataFilepath(filepath: string){
		log.debug(`Files.setDataFilepath called [${filepath}]`)
		config.set('dataFile', filepath)
	}

	static getFromDataFile(): Object{
		log.debug(`Files.getFromDataFile called. File: ${config.get('dataFile')}`)
		let dataFile = config.get('dataFile')
		return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
	}

	static writeToDataFile(data: Object){
		log.debug(`Files.writeToDataFile called. File: ${config.get('dataFile')}, Data: ${JSON.stringify(data)}`)
		let dataFile = config.get('dataFile')
		fs.writeFileSync(dataFile, JSON.stringify(data, null, 4), 'utf8')
	}

}