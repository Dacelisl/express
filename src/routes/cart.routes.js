import express from 'express'
import { cartController } from '../controllers/cart.controller.js'
import { registeredUser, adminAccess } from '../middleware/auth.js'
export const CartRoutes = express.Router()

CartRoutes.get('/', registeredUser, cartController.getAll)
CartRoutes.get('/:cid', cartController.getCartId)
CartRoutes.post('/', cartController.createCart)
CartRoutes.post('/:cid/product/:pid', registeredUser, cartController.addProduct)
CartRoutes.put('/:cid/product/:pid', adminAccess, cartController.updateAddToCart)
CartRoutes.put('/:cid', registeredUser, cartController.updateCart)
CartRoutes.delete('/:cid/product/:pid', registeredUser, cartController.deletedProduct)
CartRoutes.delete('/:cid', adminAccess, cartController.deleteCart)
CartRoutes.get('/current/cart', cartController.currentCart)
