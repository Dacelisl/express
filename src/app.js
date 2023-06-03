import express from 'express'
import handlebars from 'express-handlebars'
import path from 'path'
import { __dirname } from './utils/utils.js'
import { connectMongo } from './utils/connectMongo.js'
import { connectSocket } from './utils/socketServer.js'
import { productsRouter } from './routers/router.products.js'
import { CartsRouter } from './routers/router.cart.js'
import { routerView } from './routers/router.views.js'
import { testSocketChatRouter } from './routers/test.socket.chat.router.js'

const app = express()
const port = 8080

const httpServer = app.listen(port, () => console.log(`listen on http://localhost:${port}`))
connectSocket(httpServer)
connectMongo()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

app.use('/api/products', productsRouter)
app.use('/api/carts', CartsRouter)
app.use('/realtimeproducts', routerView)
app.use('/test-chat', testSocketChatRouter)

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'Not Found',
    data: {},
  })
})
