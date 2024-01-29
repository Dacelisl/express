import winston from 'winston'
import path from 'path'
import dataConfig from '../config/process.config.js'
import { __dirname, extractFunctionAndFile } from '../utils/utils.js'

export let logger = ''

const myCustomLevels = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
}
const myCustomFormat = winston.format((info) => {
  if (info.level === 'error') {
    const { functionName, fileName } = extractFunctionAndFile(info)
    info.message = `something went wrong in the ${functionName} function of the ${fileName} file`
    return info
  }
  return info
})
const formatWithTimestamp = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`
  })
)
if (dataConfig.mode === 'development') {
  logger = winston.createLogger({
    levels: myCustomLevels.levels,
    transports: [
      new winston.transports.Console({
        level: 'debug',
      }),
      new winston.transports.Console({
        level: 'http',
      }),
      new winston.transports.Console({
        level: 'info',
        format: winston.format.colorize({ all: true }),
      }),
      new winston.transports.Console({
        level: 'warning',
      }),
      new winston.transports.File({
        filename: path.join(__dirname, '/utils/logs/errors.dev.log'),
        level: 'error',
        format: winston.format.combine( formatWithTimestamp),
      }),
      new winston.transports.File({
        filename: path.join(__dirname, '/utils/logs/errors.dev.log'),
        level: 'fatal',
        format: formatWithTimestamp,
      }),
    ],
  })
} else {
  logger = winston.createLogger({
    levels: myCustomLevels.levels,
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.simple()),
      }),
      new winston.transports.Console({
        level: 'warning',
      }),
      new winston.transports.File({
        filename: path.join(__dirname, '/utils/logs/errors.prod.log'),
        level: 'error',
        format: winston.format.combine(formatWithTimestamp, myCustomFormat()),
      }),
      new winston.transports.File({
        filename: path.join(__dirname, '/utils/logs/errors.prod.log'),
        level: 'fatal',
        format: formatWithTimestamp,
      }),
    ],
  })
}

export const addLogger = (req, res, next) => {
  req.logger = logger
  next()
}
