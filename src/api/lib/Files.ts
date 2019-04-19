import fs from 'fs'
import path from 'path'

export default class Files {

	static TEMPLATE_FILE: string

	static getTemplateFilepath(){
		return this.TEMPLATE_FILE
	}

	static setTemplateFilepath(filepath: string){
		Files.TEMPLATE_FILE = filepath
	}

	static writeToTemplateFile(data: Object){
		fs.writeFileSync(Files.TEMPLATE_FILE, JSON.stringify(data, null, 4));
	}

}