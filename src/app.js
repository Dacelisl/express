import express from 'express'
import compression from 'express-compression'
import session from 'express-session'
import handlebars from 'express-handlebars'
import MongoStore from 'connect-mongo'
import path from 'path'
import { __dirname } from './utils/utils.js'
import { connectMongo } from './utils/connectMongo.js'
import { connectSocket } from './utils/socketServer.js'
import { isAdmin } from './middleware/auth.js'
import { errorHandler } from './middleware/errors.js'
import { ProductRoutes } from './routes/products.routes.js'
import { CartRoutes } from './routes/cart.routes.js'
import { ViewRoutes } from './routes/views.routes.js'
import { chatRoutes } from './routes/chat.routes.js'
import { MockRoutes } from './routes/mock.routes.js'
import { SessionRoutes } from './routes/session.routes.js'
import { initPassport } from './config/passport.config.js'
import passport from 'passport'
import flash from 'connect-flash'
import dataConfig from './config/process.config.js'

const app = express()
app.use(compression())

const httpServer = app.listen(dataConfig.port, () => console.log(`listen on http://localhost:${dataConfig.port}, mode:`, dataConfig.mode))
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
app.use('/api/mock/', MockRoutes)
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
