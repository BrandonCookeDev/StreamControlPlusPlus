import {Router} from 'express'
const router = Router()
import Files from '../lib/Files'

function setTemplateHandler(req: Express.Request, res: Express.Response){
	let templateFile = req //.body.template_file

}

router.get('/files/templateFile', setTemplateHandler)
export default router