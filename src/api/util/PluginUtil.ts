import fs from 'fs'
import path from 'path'
import Plugin from '../lib/Plugin'
import Config from './Config'

const ROOT_DIR = path.join(__dirname, '..', '..', '..')
const PLUGIN_PATH = path.join(ROOT_DIR, 'plugins')

export default class PluginUtil{

	public static getAll(): Plugin[] {
		const zipFiles = fs.readdirSync(PLUGIN_PATH).filter((filename: string) => path.extname(filename) === '.zip')
		const plugins: Plugin[] = zipFiles.map((zipFilename: string) => {
			const name = zipFilename.substring(0, zipFilename.length - path.extname(zipFilename).length)
			const isActive = PluginUtil.isActive(name)
			return new Plugin(name, path.join(PLUGIN_PATH, zipFilename), isActive)
		})
		return plugins
	}

	public static getAllActive(): Plugin[] {
		return PluginUtil.getAll().filter((plugin: Plugin) => plugin.active)
	}

	public static getAllInactive(): Plugin[] {
		return PluginUtil.getAll().filter((plugin: Plugin) => !plugin.active)
	}

	public static isActive(pluginName: string): boolean{
		const activePlugins: string[] = Config.get('plugins')
		return activePlugins.includes(pluginName)
	}
}
