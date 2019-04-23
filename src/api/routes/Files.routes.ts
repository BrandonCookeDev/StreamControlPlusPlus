import {Router} from 'express'
const router = Router()
import Files from '../lib/Files'
import log from '../util/Logger'

function setTemplateHandler(req: Express.Request, res: Express.Response){
	log.info('/files/templateFile POST called')
	let templateFile = req //.body.template_file

}

function getTemplateHandler(req: Express.Request, res: Express.Response){
	log.info('/files/templateFile GET called')
}

function getDataHandler(req: Express.Request, res: Express.Response){
	log.info('/files/data GET called')
}

function setDataHandler(req: Express.Request, res: Express.Response){
	log.info('/files/data POST called [%s]', req)
}

router.get('/files/templateFile', getTemplateHandler)
router.post('/files/templateFile', setTemplateHandler)
router.get('/files/data', getDataHandler)
router.post('/files/data', setDataHandler)
export default router