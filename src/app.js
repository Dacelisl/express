import express from 'express'
import session from 'express-session'
import handlebars from 'express-handlebars'
import MongoStore from 'connect-mongo'
import path from 'path'
import { __dirname } from './utils/utils.js'
import { connectMongo } from './utils/connectMongo.js'
import { connectSocket } from './utils/socketServer.js'
import { ProductRoutes } from './routes/products.routes.js'
import { CartRoutes } from './routes/cart.routes.js'
import { ViewRoutes } from './routes/views.routes.js'
import { TestSocketChatRoutes } from './routes/test.socket.chat.routes.js'
import { SessionRoutes } from './routes/session.routes.js'
import { isAdmin } from './middleware/auth.js'
import { initPassport } from './config/passport.config.js'
import passport from 'passport'
import flash from 'connect-flash'
import dataConfig from './config/process.config.js'

const app = express()

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
      mongoUrl: `mongodb+srv://${dataConfig.userName}:${dataConfig.secretKey}@backendcoder.tu6mnjp.mongodb.net/${dataConfig.databaseName}?retryWrites=true&w=majority`,
      ttl: 7200,
    }),
    secret: 'accessKey',
    resave: true,
    saveUninitialized: true,
  })
)
app.use(flash())
app.use('/api/products', ProductRoutes)
app.use('/api/carts', CartRoutes)
app.use('/realtimeproducts', isAdmin, ViewRoutes)
app.use('/test-chat', TestSocketChatRoutes)
app.use('/api/sessions/', SessionRoutes)

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
