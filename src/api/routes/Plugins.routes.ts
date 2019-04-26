import {Router, Request, Response} from 'express'
import PluginUtil from '../util/PluginUtil'
import log from '../util/Logger'

const router = Router()

const getAllHandler = (req: Request, res: Response) => {
	log.debug('/plugins/getAll called')
	try{
		const plugins = PluginUtil.getAll()
		res.send(plugins).status(200).end()
	} catch(e){
		log.error(e)
		res.send(e.message).status(500).end()
	}
}

const getAllActiveHandler = (req: Request, res: Response) => {
	log.debug('/plugins/getAllActive called')
	try{
		const plugins = PluginUtil.getAllActive()
		res.send(plugins).status(200).end()
	} catch(e){
		log.error(e)
		res.send(e.message).status(500).end()
	}
}

const getAllInactiveHandler = (req: Request, res: Response) => {
	log.debug('/plugins/getAllInactive called')
	try{
		const plugins = PluginUtil.getAllInactive()
		res.send(plugins).status(200).end()
	} catch(e){
		log.error(e)
		res.send(e.message).status(500).end()
	}
}

const getIsActiveHandler = (req: Request, res: Response) => {
	log.debug('/plugins/getIsActive called [%s]', req.params.pluginName)
	try{
		const pluginName = req.params.pluginName
		const isActive = PluginUtil.isActive(pluginName)
		res.send(isActive).status(200).end()
	} catch(e){
		log.error(e)
		res.send(e.message).status(500).end()
	}
}

router.get('/plugins/getAll', getAllHandler)
router.get('/plugins/isActive/:pluginName', getIsActiveHandler)
router.get('/plugins/getAllActive', getAllActiveHandler)
router.get('/plugins/getAllInactive', getAllInactiveHandler)

export default router