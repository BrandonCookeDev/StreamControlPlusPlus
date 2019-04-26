import fs from 'fs'
import path from 'path'
import Plugin from '../lib/Plugin'
import Config from './Config'
import log from './Logger'
import { debug } from 'util';

const ROOT_DIR = path.join(__dirname, '..', '..', '..')
const PLUGIN_PATH = path.join(ROOT_DIR, 'plugins')

export default class PluginUtil{

	public static getAll(): Plugin[] {
		log.debug('PluginUtil.getAll called')
		const zipFiles = fs.readdirSync(PLUGIN_PATH).filter((filename: string) => path.extname(filename) === '.zip')
		const plugins: Plugin[] = zipFiles.map((zipFilename: string) => {
			const name = zipFilename.substring(0, zipFilename.length - path.extname(zipFilename).length)
			const isActive = PluginUtil.isActive(name)
			return new Plugin(name, path.join(PLUGIN_PATH, zipFilename), isActive)
		})
		return plugins
	}

	public static getAllActive(): Plugin[] {
		log.debug('PluginUtil.getAllActive called')
		return PluginUtil.getAll().filter((plugin: Plugin) => plugin.active)
	}

	public static getAllInactive(): Plugin[] {
		log.debug('PluginUtil.getAllInactive called')
		return PluginUtil.getAll().filter((plugin: Plugin) => !plugin.active)
	}

	public static isActive(pluginName: string): boolean{
		log.debug('PluginUtil.isActive called: %s', pluginName)
		const activePlugins: string[] = Config.get('plugins')
		return activePlugins.includes(pluginName)
	}

	public static activate(pluginName: string): void{
		log.debug('PluginUtil.active called: %s', pluginName)
		const configPluginList: string[] = Config.get('plugins')
		console.log(configPluginList)
		console.log(!configPluginList.includes(pluginName))
		if(!configPluginList.includes(pluginName))
			configPluginList.push(pluginName)
		console.log(configPluginList)
		Config.set('plugins', configPluginList)
		log.debug(Config.read())
	}

	public static deactivate(pluginName: string): void{
		log.debug('PluginUtil.deactive called: %s', pluginName)
		const configPluginList: string[] = Config.get('plugins')
		console.log(configPluginList)
		if(configPluginList.includes(pluginName))
			configPluginList.splice(configPluginList.indexOf(pluginName), 1)
		console.log(configPluginList)
		Config.set('plugins', configPluginList)
		log.debug(Config.read())
	}
}
