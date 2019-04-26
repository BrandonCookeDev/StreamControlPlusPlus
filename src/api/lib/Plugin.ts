import log from '../util/Logger'

export default class Plugin implements Plugin.IPlugin{

	public name: string = ''
	public filepath: string
	public active: boolean = false

	constructor(name: string, filepath: string, active: boolean){
		this.name = name
		this.filepath = filepath
		this.active = active
	}

}

namespace Plugin{
	export interface IPlugin{
		name: string
		filepath: string
		active: boolean
	}
}