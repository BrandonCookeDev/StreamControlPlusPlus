import express from 'express'
const app = express();

//import bp from 'body-parser'
import compression from 'compression'

app.use(compression())
app.use(express.json())
app.use(express.urlencoded())

import fileRoutes from './routes/Files.routes'
import configRoutes from './routes/Config.routes'
import pluginRoutes from './routes/Plugins.routes'
import electronRoutes from './routes/Electron.routes'
app.use('/api', fileRoutes)
app.use('/api', configRoutes)
app.use('/api', pluginRoutes)
app.use('/api', electronRoutes)

app.get('/api/ping', function(req: express.Request, res: express.Response){
	res.sendStatus(200)
})

const PORT = process.env.PORT || 6161;
app.listen(PORT, function(err: Error){
	if(err){
		alert('Services failed to launch!')
		process.exit(1)
	}
	else console.log('Services listening on %s', PORT)
})