import fs from 'fs'
import path from 'path'
import log from './Logger'

export default class Config {

	static CONFIG_FILE: string = path.join(__dirname, '..', '..', '..', 'config', 'config.json')

	static read(): any {
		log.debug('Config.read called')
		return JSON.parse(fs.readFileSync(Config.CONFIG_FILE, 'utf8'))
	}

	static write(data: object): void {
		log.debug(`Config.write called: ${JSON.stringify(data)}`)
		fs.writeFileSync(Config.CONFIG_FILE, JSON.stringify(data, null, 4))
	}

	static get(propname: string): any | null {
		log.debug(`Config.get called: ${propname}`)
		let content = Config.read()
		if (content.hasOwnProperty(propname))
			return content[propname]
		else return null
	}

	static set(propname: string, value: string): void {
		log.debug(`Config.set called: ${propname} ${value}`)
		let content = Config.read()
		content[propname] = value
		Config.write(content)
	}

}