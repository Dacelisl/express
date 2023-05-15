import express from 'express'
import { CartManager } from '../CartManager.js'
const cart = new CartManager('Carritos.json')

export const CartsRouter = express.Router()

CartsRouter.post('/', async (req, res) => {
  const resAdd = await cart.createCart()
  return res.json(resAdd)
})

CartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid)
  const pid = parseInt(req.params.pid)
  const resAdd = await cart.addProductsToCart(pid, cid)
  return res.json(resAdd)
})
CartsRouter.get('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid)
  const data = await cart.getProductsInCart(cartId)
  return res.json(data)
})
