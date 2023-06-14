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
      const { title, description, category, price, thumbnail, code, stock } = product
      await productService.createOne(title, description, category, price, thumbnail, code, stock)
      const newProducts = await productService.findByCode(code)
      socket.emit('loadProduct', newProducts)
    })
    socket.on('productToCart', async (cartId, productId) => {
      await cartService.addToCart(cartId, productId)
      socket.emit('updateCart')
    })
    socket.on('searchCart', async (cart) => {
      const CartProducts = await cartService.getCartWithProducts(cart)
      socket.emit('cartFound', CartProducts)
    })
    socket.on('createNewCart', async () => {
      const newCart = await cartService.createCart()
      socket.emit('cartCreated', newCart)
    })
    socket.on('deleteCart', async (idCart) => {
      const deleteCart = await cartService.deleteCart(idCart)
      socket.emit('updateDeleteCart')
    })

    socket.on('searchProductByCategory', async (category) => {
      const query = 'category:' + category
      const productsByCategory = await productService.getAll({ query: query })
      socket.emit('updateProducts', productsByCategory.payload)
      socket.emit('updateFooter', productsByCategory)
    })

    socket.on('deleteProduct', async (productId) => {
      await productService.deletedOne(productId)
      const newProducts = await productService.getAll({ limit: 10 })
      socket.emit('updateProducts', newProducts.payload)
    })
    socket.on('deleteProductInCart', async (carId, productId) => {
      await cartService.deletedProduct(carId, productId)
      const updateCart = await cartService.getCartWithProducts(carId)
      socket.emit('cartFound', updateCart)
    })
    socket.on('msg_front_to_back', async (msg) => {
      const msgCreated = await MsgModel.create(msg)
      const msgs = await MsgModel.find({})
      socketServer.emit('msg_back_to_front', msgs)
    })
  })
}
