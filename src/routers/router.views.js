import express from "express";
import { ProductManager } from '../ProductManager.js'
const productos = new ProductManager('productos.json')

export const routerView = express.Router()

routerView.get('/', async (req, res) => {
  let limit = parseInt(req.query.limit)
  let data = await productos.getProducts(limit)
  res.render('realTimeProducts', data)
})
routerView.get('/:qid', async (req, res) => {
  const productId = parseInt(req.params.qid)
  const data = await productos.getProductById(productId)
  res.render('realTimeProducts', data)
})


