import dataConfig from '../config/process.config.js'
import { connectMongo } from '../utils/connectMongo.js'
import { logger } from '../utils/logger.js'

export let cartFactory, productFactory, userFactory, chatFactory, ticketFactory, recoveryCodeFactory

switch (dataConfig.persistence) {
  case 'mongo':
    connectMongo()
    const { cartDAO } = await import('./mongo/class/carts.dao.js')
    cartFactory = cartDAO
    const { productDAO } = await import('./mongo/class/products.dao.js')
    productFactory = productDAO
    const { userDAO } = await import('./mongo/class/users.dao.js')
    userFactory = userDAO
    const { chatDAO } = await import('./mongo/class/chat.dao.js')
    chatFactory = chatDAO
    const { ticketDAO } = await import('./mongo/class/ticket.dao.js')
    ticketFactory = ticketDAO
    const { RecoveryCodesDAO } = await import('./mongo/class/recoveryCodes.dao.js')
    recoveryCodeFactory = RecoveryCodesDAO
    break
  case 'memory':
    logger.info('Persistence with Memory')
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
