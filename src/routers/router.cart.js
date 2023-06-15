import express from 'express'
import { CartServices } from '../services/cart.services.js'

const cartService = new CartServices()
export const CartsRouter = express.Router()

//create void cart
CartsRouter.post('/', async (req, res) => {
  try {
    const createdCart = await cartService.createCart()
    return res.status(201).json(createdCart)
  } catch (error) {
    return res.status(401).json({ error: `Error ${error}` })
  }
})
//add product to cart
CartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  const quant = req.body
  const resAdd = await cartService.addToCart(cid, pid, quant)
  return res.json(resAdd)
})
//Delete product in cart
CartsRouter.delete('/:cid/products/:pid', async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  const resAdd = await cartService.deletedProduct(cid, pid)
  return res.json(resAdd)
})
//Delete all products in cart
/* CartsRouter.delete('/:cid', async (req, res) => {
  const cid = req.params.cid
  const resAdd = await cartService.deleteAllProducts(cid)
  return res.json(resAdd)
}) */
//Delete cart
CartsRouter.delete('/:cid', async (req, res) => {
  const cid = req.params.cid
  const resAdd = await cartService.deleteCart(cid)
  return res.json(resAdd)
})
CartsRouter.get('/:cid', async (req, res) => {
  const cartId = req.params.cid
  const payload = await cartService.getCartWithProducts(cartId)
  return res.json(payload)
})
CartsRouter.get('/', async (req, res) => {
  res.render('cart', {})
})
