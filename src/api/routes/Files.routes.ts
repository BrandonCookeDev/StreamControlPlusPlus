import {Router} from 'express'
const router = Router()
import Files from '../lib/Files'

function setTemplateHandler(req: Express.Request, res: Express.Response){
	let templateFile = req //.body.template_file

}

function getTemplateHandler(req: Express.Request, res: Express.Response){

}

function getDataHandler(req: Express.Request, res: Express.Response){

}

function setDataHandler(req: Express.Request, res: Express.Response){

}

router.get('/files/templateFile', getTemplateHandler)
router.post('/files/templateFile', setTemplateHandler)
router.get('/files/data', getDataHandler)
router.post('/files/data', setDataHandler)
export default router