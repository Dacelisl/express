import express from 'express'
import { ProductManager, productsExect } from '../ProductManager.js'

const productos = new ProductManager('productos.json')
/* productsExect() */
export const productsRouter = express.Router()

productsRouter.get('/', async (req, res) => {
  let limit = parseInt(req.query.limit)
  let data = await productos.getProducts(limit)
  res.render('home', data)
})
productsRouter.get('/:qid', async (req, res) => {
  const productId = parseInt(req.params.qid)
  const data = await productos.getProductById(productId)
  res.render('home', data)
})
productsRouter.post('/', async (req, res) => {
  const dataProduct = req.body
  const resAdd = await productos
    .addProduct({
      title: dataProduct.nombre,
      description: dataProduct.description,
      price: dataProduct.price,
      thumbnail: dataProduct.thumbnail,
      code: dataProduct.code,
      stock: dataProduct.stock,
    })
    res.render('addProduct', {})
  /* return res.json(resAdd) */
})
productsRouter.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid)
  const dataProduct = req.body
  const resUpdate = await productos.updateProduct(productId, {
    title: dataProduct.nombre,
    description: dataProduct.description,
    price: dataProduct.price,
    thumbnail: dataProduct.thumbnail,
    code: dataProduct.code,
    stock: dataProduct.stock,
  })
  return res.json(resUpdate)
})
productsRouter.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid)
  const resDelete = await productos.deleteProduct(productId)
  return res.json(resDelete)
})
