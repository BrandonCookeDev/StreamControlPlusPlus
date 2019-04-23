import {Router, Request, Response} from 'express'
const router = Router()
import Files from '../lib/Files'
import log from '../util/Logger'


function getTemplateHandler(req: Request, res: Response){
	try{
		log.debug('/files/templateFile GET called')
	} catch(e){
		log.error(`/files/templateFile error: ${e}`)
		res.send(e.message).status(500).end()
	}

}

function setTemplateHandler(req: Request, res: Response){
	try{
		log.debug(`/files/templateFile POST called [${JSON.stringify(req.body)}]`)
		let templateFile = req.body.template_file
		Files.setTemplateFilepath(templateFile)
		res.sendStatus(200).end()
	} catch(e){
		log.error(`/files/templateFile POST error: ${e}`)
		res.send(e.message).status(500).end()
	}
}

function getDataFileHandler(req: Request, res: Response){
	try{
		log.debug('/files/dataFile GET called')
	} catch(e){
		log.error(`/files/dataFile error: ${e}`)
		res.send(e.message).status(500).end()
	}

}

function setDataFileHandler(req: Request, res: Response){
	try{	
		log.debug('/files/dataFile POST called')
		let dataFile = req.body.data_file
		Files.setDataFilepath(dataFile)
		res.sendStatus(200)
	} catch(e){
		log.error(`/files/dataFile POST error: ${e}`)
		res.send(e.message).status(500).end()
	}
}

function getDataHandler(req: Request, res: Response){
	try{
		log.debug('/files/data GET called')
	} catch(e){
		log.error(`/files/data error: ${e}`)
		res.send(e.message).status(500).end()
	}
	
}

function setDataHandler(req: Request, res: Response){
	try{
		log.debug(`/files/data POST called: ${JSON.stringify(req.body)}`)
		let data = req.body
		Files.writeToDataFile(data)
		res.sendStatus(200)
	} catch(e){
		log.error(`/files/data POST error: ${e}`)
		res.send(e.message).status(500).end()
	}
}

router.get('/files/templateFile', getTemplateHandler)
router.post('/files/templateFile', setTemplateHandler)
router.get('/files/dataFile', getDataFileHandler)
router.post('/files/dataFile', setDataFileHandler)
router.get('/files/data', getDataHandler)
router.post('/files/data', setDataHandler)
export default router