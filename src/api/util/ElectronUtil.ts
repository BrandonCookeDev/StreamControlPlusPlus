import {app} from 'electron'

export default class ElectronUtil{

	public static reload(){
		app.emit('reloadWindow')
	}

}