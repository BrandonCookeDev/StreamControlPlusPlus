import winston from 'winston'

const Logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'debug', //todo change this property
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.splat(),
		winston.format.timestamp(),
		winston.format.simple(),
	),
	transports:[
		new winston.transports.Console()
	],
})

export default Logger;