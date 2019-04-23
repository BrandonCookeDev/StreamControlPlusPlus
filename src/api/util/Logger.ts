import winston from 'winston'

const Logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: winston.format.simple(),
	transports:[
		new winston.transports.Console()
	]
})

export default Logger;