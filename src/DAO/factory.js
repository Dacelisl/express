import dataConfig from '../config/process.config.js'
import { connectMongo } from '../utils/connectMongo.js'

export let cartFactory, productFactory, userFactory

switch (dataConfig.persistence) {
  case 'mongo':
    console.log('Mongo connect')
    connectMongo()
    const { cartDAO } = await import('./mongo/class/carts.dao.js')
    cartFactory = cartDAO
    const { productDAO } = await import('./mongo/class/products.dao.js')
    productFactory = productDAO
    const { userDAO } = await import('./mongo/class/users.dao.js')
    userFactory = userDAO
    break
  case 'memory':
    console.log('Persistence with Memory')

    const { default: cartMemory } = await import('./memory/CartManager.js')
    cartFactory = cartMemory
    const { default: productMemory } = await import('./memory/ProductManager.js')
    productFactory = productMemory
    const { default: userMemory } = await import('./memory/CartManager.js')
    userFactory = userMemory

    break
  default:
    break
}
