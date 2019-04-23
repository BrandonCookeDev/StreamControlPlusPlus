import {Router, Request, Response} from 'express'
const router = Router()
import Files from '../lib/Files'
import log from '../util/Logger'

function setTemplateHandler(req: Request, res: Response){
	log.info(`/files/templateFile POST called [${JSON.stringify(req.body)}]`)
	let templateFile = req //.body.template_file

}

function getTemplateHandler(req: Request, res: Response){
	log.info('/files/templateFile GET called')
}

function getDataHandler(req: Request, res: Response){
	log.info('/files/data GET called')
}

function setDataHandler(req: Request, res: Response){
	log.info(`/files/data POST called [${JSON.stringify(req.body)}]`)
}

router.get('/files/templateFile', getTemplateHandler)
router.post('/files/templateFile', setTemplateHandler)
router.get('/files/data', getDataHandler)
router.post('/files/data', setDataHandler)
export default router