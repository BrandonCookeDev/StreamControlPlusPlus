import fs from 'fs'
import path from 'path'
import log from './Logger'

export default class Config {

	public static CONFIG_FILE: string = path.join(__dirname, '..', '..', '..', 'config', 'config.json')

	public static read(): any {
		log.debug('Config.read called')
		return JSON.parse(fs.readFileSync(Config.CONFIG_FILE, 'utf8'))
	}

	public static write(data: object): void {
		log.debug(`Config.write called: ${JSON.stringify(data)}`)
		fs.writeFileSync(Config.CONFIG_FILE, JSON.stringify(data, null, 4))
	}

	public static get(propname: string): any | null {
		log.debug(`Config.get called: ${propname}`)
		const content = Config.read()
		if (content.hasOwnProperty(propname))
			return content[propname]
		else return null
	}

	public static set(propname: string, value: string): void {
		log.debug(`Config.set called: ${propname} ${value}`)
		const content = Config.read()
		content[propname] = value
		Config.write(content)
	}

}