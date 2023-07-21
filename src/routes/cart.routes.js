import express from 'express'
import { cartController } from '../controllers/cart.controller.js'
export const CartRoutes = express.Router()

CartRoutes.get('/', cartController.getAll)
CartRoutes.get('/:cid', cartController.getCartId)
CartRoutes.post('/', cartController.createCart)
CartRoutes.post('/:cid/product/:pid', cartController.addProduct)
CartRoutes.put('/:cid/product/:pid', cartController.updateAddToCart)
CartRoutes.put('/:cid', cartController.updateCart)
CartRoutes.delete('/:cid/products/:pid', cartController.deletedProduct)
CartRoutes.delete('/:cid', cartController.deleteCart)
/* CartRoutes.delete('/:cid', cartController.deleteAllProducts) */
