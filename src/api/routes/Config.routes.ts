import {Router, Request, Response} from 'express'
import Config from '../util/Config'
import log from '../util/Logger'

const router = Router()

const getPropHandler = (req: Request, res: Response) => {
	try{	
		const prop = req.params.prop
		const val = Config.get(prop)
		res.send(val).status(200).end()
	} catch(e){
		log.error(e)
		res.send(e.message).status(500).end()
	}
}

const setPropHandler = (req: Request, res: Response) => {
	try{
		const prop = req.body.prop
		const val = req.body.value
		Config.set(prop, val)
		res.sendStatus(200).end()
	} catch(e){
		log.error(e)
		res.send(e.message).status(500).end()
	}
}

router.get('/config/get/:prop', getPropHandler)
router.post('/config/set', setPropHandler)

export default router