import { Server } from 'socket.io'
import { ProductManager } from '../ProductManager.js'
import { MsgModel } from '../DAO/models/msgs.model.js'

const productManager = new ProductManager('productos.json')

export const connectSocket = (httpServer) => {
  const socketServer = new Server(httpServer)

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
    socket.on('msg_front_to_back', async (msg) => {
      const msgCreated = await MsgModel.create(msg)
      const msgs = await MsgModel.find({})
      socketServer.emit('msg_back_to_front', msgs)
    })
  })
}
