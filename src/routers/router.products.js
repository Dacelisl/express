import express from 'express'
import { ProductManager, productsExect } from '../ProductManager.js'

const productos = new ProductManager('productos.json')
productsExect() 
export const productsRouter = express.Router() 

productsRouter.get('/', async (req, res) => {
  let limit = req.query.limit
  const data = await productos.getProducts().then((response) => {
    return response
  })
  if (limit) {
    const resultado = data.slice(0, limit)
    res.status(200).json(resultado)
  } else {
    res.status(200).json({
      status: 'succes',
      msg: 'ok',
      data: data,
    })
  }
})
productsRouter.get('/products/:qid', async (req, res) => {
  const productId = parseInt(req.params.qid)
  const data = await productos.getProducts()
  const productFind = data.find((product) => product.id == productId)
  if (productFind) {
    res.status(200).json({
      status: 'succes',
      msg: 'ok',
      data: productFind,
    })
  } else {
    res.status(400).json({
      status: 'error',
      msg: 'product not found',
      data: {},
    })
  }
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
  return res.status(200).json({
    status: 'ok',
    msg: resAdd,
    data: {},
  })
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
  return res.status(200).json({ message: resUpdate })
})
productsRouter.delete('/', async (req, res) => {
  const dataProduct = req.body
  const resDelete = await productos
    .deleteProduct(dataProduct.id)
    .then((response) => {
      return response
    })
  return res.status(200).json({ message: resDelete })
})
