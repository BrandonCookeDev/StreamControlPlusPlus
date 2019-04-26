import {Router, Request, Response} from 'express'
import ElectronUtil from '../util/ElectronUtil'
import log from '../util/Logger'

const router = Router()

const reloadHandler = (req: Request, res: Response) => {
	try{	
		ElectronUtil.reload()
		res.sendStatus(200)
	} catch(e){
		log.error(e)
		res.send(e.message).status(500).end()
	}
}

router.get('/app/reload', reloadHandler)

export default router