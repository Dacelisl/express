import express from 'express'
import 'express-async-errors'
import compression from 'express-compression'
import session from 'express-session'
import handlebars from 'express-handlebars'
import MongoStore from 'connect-mongo'
import path from 'path'
import { __dirname } from './utils/utils.js'
import { addLogger, logger } from './utils/logger.js'
import { connectMongo } from './utils/connectMongo.js'
import { connectSocket } from './utils/socketServer.js'
import { errorHandler } from './middleware/errors.js'
import { ProductRoutes } from './routes/products.routes.js'
import { RoleRoutes } from './routes/role.routes.js'
import { ServiceRoutes } from './routes/service.routes.js'
import { UserRoutes } from './routes/user.routes.js'
import { EmployeeRoutes } from './routes/employee.routes.js'
import { TicketRoutes } from './routes/ticket.routes.js'
import { EmployeePerformanceRoutes } from './routes/employeePerformance.routes.js'
/* import { adminAccess } from './middleware/auth.js'
import { RecoveryCodesRoutes } from './routes/recoveryCodes.routes.js'
import { chatRoutes } from './routes/chat.routes.js'
import { MailRoutes } from './routes/mail.routes.js'
import { initPassport } from './config/passport.config.js'
import passport from 'passport' */
import flash from 'connect-flash'
import dataConfig from './config/process.config.js'

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

const app = express()
app.use(addLogger)
app.use(compression())

const httpServer = app.listen(dataConfig.port, () => logger.info(`listen on http://localhost:${dataConfig.port}, mode:`, dataConfig.mode))
connectSocket(httpServer)
connectMongo()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentacion CoderShop',
      description: 'rutas de los modulos Products y Carts del proyecto coderShop',
    },
  }, */
//  apis: [`${__dirname}/docs/**/*.yaml`],
//}
/* const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs)) */

app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

const store = MongoStore.create({
  mongoUrl: dataConfig.url_mongo,
  ttl: dataConfig.ttl,
  collection: 'sessions',
})
app.use(
  session({
    store,
    secret: dataConfig.secret,
    resave: true,
    saveUninitialized: true,
  })
)
app.use(flash())
app.use('/api/products', ProductRoutes)
app.use('/api/users', UserRoutes)
app.use('/api/employee', EmployeeRoutes)
app.use('/api/role', RoleRoutes)
app.use('/api/service', ServiceRoutes)
app.use('/api/tickets', TicketRoutes)
app.use('/api/performance', EmployeePerformanceRoutes)
/* 
app.use('/realtimeproducts', adminAccess, ViewRoutes)
app.use('/api/chat', chatRoutes
app.use('/recover', RecoveryCodesRoutes)
app.use('/api/mock/', MockRoutes)
app.use('/mail', MailRoutes) */

/* initPassport()
app.use(passport.authorize())
app.use(passport.session()) */

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    message: `Not Found: ${res.message}`,
    payload: {},
  })
})
app.use(errorHandler)
