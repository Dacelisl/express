import { Server } from 'socket.io'
import { MsgModel } from '../DAO/models/msgs.model.js'
import { ProductServices } from '../services/product.services.js'
import { CartServices } from '../services/cart.services.js'

const productService = new ProductServices()
const cartService = new CartServices()

export const connectSocket = (httpServer) => {
  const socketServer = new Server(httpServer)

  socketServer.on('connection', (socket) => {
    console.log('cliente socketServer conectado')
    socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado')
    })
    socket.on('addProduct', async (product) => {
      const { title, description, price, thumbnail, code, stock } = product
      await productService.createOne(title, description, price, thumbnail, code, stock)
      const newProducts = await productService.getAll({ limit: 20 })
      socket.emit('updateProducts', newProducts.payload)
    })
    socket.on('productToCart', async (productId) => {
      await cartService.addToCart('', productId)
      socket.emit('updateCart')
    })
    socket.on('searchCart', async (cart) => {
      const CartProducts = await cartService.getCartWithProducts(cart)
      socket.emit('cartFound', CartProducts.data.products)
    })
    socket.on('deleteProduct', async (productId) => {
      await productService.deletedOne(productId)
      const newProducts = await productService.getAll({ limit: 20 })
      socket.emit('updateProducts', newProducts.payload)
    })
    socket.on('msg_front_to_back', async (msg) => {
      const msgCreated = await MsgModel.create(msg)
      const msgs = await MsgModel.find({})
      socketServer.emit('msg_back_to_front', msgs)
    })
  })
}
