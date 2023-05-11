import express from 'express'
import { ProductManager, productsExect } from '../ProductManager.js'

const productos = new ProductManager('productos.json')
productsExect()
export const productsRouter = express.Router()

productsRouter.get('/', async (req, res) => {
  let limit = parseInt(req.query.limit)
  const data = await productos.getProducts().then((response) => {
    return response
  })
  if (limit) {
    const resultado = data.data.slice(0, limit)
    res.json(resultado)
  } else {
    res.json(data)
  }
})
productsRouter.get('/:qid', async (req, res) => {
  const productId = parseInt(req.params.qid)
  const data = await productos.getProductById(productId)
  res.json(data)
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
    .then((response) => {
      return response
    })
  return res.json(resAdd)
})
productsRouter.put('/', async (req, res) => {
  const dataProduct = req.body
  const resUpdate = await productos
    .updateProduct(dataProduct.id, {
      title: dataProduct.nombre,
      description: dataProduct.description,
      price: dataProduct.price,
      thumbnail: dataProduct.thumbnail,
      code: dataProduct.code,
      stock: dataProduct.stock,
    })
    .then((response) => {
      return response
    })
  return res.json(resUpdate)
})
productsRouter.delete('/', async (req, res) => {
  const dataProduct = req.body
  const resDelete = await productos
    .deleteProduct(parseInt(dataProduct.id))
    .then((response) => {
      return response
    })
  return res.json(resDelete)
})
