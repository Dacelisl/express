import express from 'express'
import { CartManager } from '../CartManager.js'

const cart = new CartManager('Carritos.json')

export const CartsRouter = express.Router()

CartsRouter.post('/', async (req, res) => {
  const resAdd = await cart.createCart().then((response) => {
    return response
  })
  return res.json(resAdd)
})

CartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid)
  const pid = parseInt(req.params.pid)
  const resAdd = await cart.addProductsToCart(pid, cid).then((response) => {
    return response
  })
  return res.json(resAdd)
})
