import express from 'express'
import compression from 'express-compression'
import session from 'express-session'
import handlebars from 'express-handlebars'
import MongoStore from 'connect-mongo'
import path from 'path'
import { __dirname } from './utils/utils.js'
import { addLogger, logger } from './utils/logger.js'
import { connectMongo } from './utils/connectMongo.js'
import { connectSocket } from './utils/socketServer.js'
import { isAdmin } from './middleware/auth.js'
import { errorHandler } from './middleware/errors.js'
import { ProductRoutes } from './routes/products.routes.js'
import { RecoveryCodesRoutes } from './routes/recoveryCodes.routes.js'
import { CartRoutes } from './routes/cart.routes.js'
import { ViewRoutes } from './routes/views.routes.js'
import { chatRoutes } from './routes/chat.routes.js'
import { MockRoutes } from './routes/mock.routes.js'
import { MailRoutes } from './routes/mail.routes.js'
import { SessionRoutes } from './routes/session.routes.js'
import { initPassport } from './config/passport.config.js'
import passport from 'passport'
import flash from 'connect-flash'
import dataConfig from './config/process.config.js'

const app = express()
app.use(addLogger)
app.use(compression())

const httpServer = app.listen(dataConfig.port, () => logger.info(`listen on http://localhost:${dataConfig.port}, mode:`, dataConfig.mode))
connectSocket(httpServer)
connectMongo()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: dataConfig.url_mongo,
      ttl: 7200,
    }),
    secret: dataConfig.secret,
    resave: true,
    saveUninitialized: true,
  })
)
app.use(flash())
app.use('/api/products', ProductRoutes)
app.use('/api/carts', CartRoutes)
app.use('/realtimeproducts', isAdmin, ViewRoutes)
app.use('/test-chat', chatRoutes)
app.use('/api/sessions/', SessionRoutes)
app.use('/recover', RecoveryCodesRoutes)
app.use('/api/mock/', MockRoutes)
app.use('/mail', MailRoutes)
app.get('/loggerTest', (req, res) => {
  req.logger.debug('ingresando a un proceso importante debug')
  req.logger.http('ingresando a un proceso importante http')
  req.logger.info('ingresando a un proceso importante info')
  req.logger.warning('ingresando a un proceso importante warning')
  req.logger.error('ingresando a un proceso importante error')
  req.logger.fatal('ingresando a un proceso importante fatal')
  res.send({ message: 'fin del proceso heavy exito!!!' })
})
app.use(errorHandler)

initPassport()
app.use(passport.authorize())
app.use(passport.session())

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'Not Found',
    data: {},
  })
})
