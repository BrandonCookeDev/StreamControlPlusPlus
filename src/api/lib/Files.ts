import fs from 'fs'
import path from 'path'
import log from '../util/Logger'
import config from '../util/Config'

export default class Files {

	public static getTemplateFilepath(){
		log.debug('Files.getTemplateFilepath called')
		const filepath = config.get('templateFile')
		return path.isAbsolute(filepath) ? filepath : path.resolve(filepath)
	}

	public static setTemplateFilepath(filepath: string){
		log.debug(`Files.setTemplateFilepath called [${filepath}]`)
		config.set('templateFile', filepath)
	}

	public static getDataFilepath(){
		log.debug('Files.getDataFilepath called')
		const filepath = config.get('dataFile')
		return path.isAbsolute(filepath) ? filepath : path.resolve(filepath)
	}

	public static setDataFilepath(filepath: string){
		log.debug(`Files.setDataFilepath called [${filepath}]`)
		config.set('dataFile', filepath)
	}

	public static getDataFileDirname(){
		log.debug('Files.getDataFileDirname called')
		const dirpath = config.get('dataFile')
		return path.isAbsolute(dirpath) ? dirpath : path.resolve(dirpath)
	}

	public static getFromDataFile(): object{
		log.debug(`Files.getFromDataFile called. File: ${config.get('dataFile')}`)
		const dataFile = config.get('dataFile')
		return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
	}

	public static writeToDataFile(data: object){
		log.debug(`Files.writeToDataFile called. File: ${config.get('dataFile')}, Data: ${JSON.stringify(data)}`)
		const dataFile = config.get('dataFile')
		fs.writeFileSync(dataFile, JSON.stringify(data, null, 4), 'utf8')
	}

}