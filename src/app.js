import express from 'express'
import handlebars from 'express-handlebars'
import path from 'path'
import { __dirname } from './utils.js'
import { productsRouter } from './routers/router.products.js'
import { CartsRouter } from './routers/router.cart.js'
import { routerView } from './routers/router.views.js'
import { Server } from 'socket.io'
import { ProductManager } from './ProductManager.js'

const productManager = new ProductManager('productos.json')
const app = express()
const port = 8080

const httpServer = app.listen(port, () =>
  console.log(`listen on http://localhost:${port}`)
)
const socketServer = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

/* eventos del Socket */

socketServer.on('connection', (socket) => {
  console.log('cliente socketServer conectado')
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado')
  })
  socket.on('addProduct', async (product) => {
    await productManager.addProduct(product)
    const newProducts = await productManager.getProducts()
    socket.emit('updateProducts', newProducts.data) 
  })
  socket.on('deleteProduct', async (productId) => {
    await productManager.deleteProduct(productId)
    const newProducts = await productManager.getProducts()
    socket.emit('updateProducts', newProducts.data) 
  })
})

/* app.use(express.static('public')) */
app.use(express.static(__dirname + '/public'))

app.use('/api/products', productsRouter)
app.use('/api/carts', CartsRouter)
app.use('/realtimeproducts', routerView)

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'Not Found',
    data: {},
  })
})
