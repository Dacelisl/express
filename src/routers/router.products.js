import express from 'express'
import { ProductManager, productsExect } from '../ProductManager.js'
import { ProductServices } from '../services/product.services.js'

const productos = new ProductManager('productos.json')
const productService = new ProductServices()
/* productsExect() */
export const productsRouter = express.Router()

productsRouter.get('/', async (req, res) => {
  /* let limit = parseInt(req.query.limit)
  let data = await productos.getProducts(limit)
  res.render('home', {data}) */
  try {
    const products = await productService.getAll()
    return res.status(200).json({
      status: 'success',
      msg: 'products list',
      data: products,
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    })
  }
})

productsRouter.get('/:qid', async (req, res) => {
  const productId = parseInt(req.params.qid)
  const data = await productos.getProductById(productId)
  res.render('home', {})
})

productsRouter.post('/', async (req, res) => {
  try {
    const dataProduct = req.body
    const createProduct = await productService.createOne({
      title: dataProduct.nombre,
      description: dataProduct.description,
      price: dataProduct.price,
      thumbnail: dataProduct.thumbnail,
      code: dataProduct.code,
      stock: dataProduct.stock,
    })
    /* res.render('addProduct', {}) */
    return res.status(201).json({
      status: 'success',
      msg: 'product created',
      data: createProduct,
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    })
  }
})

productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid)
    const dataProduct = req.body
    const resUpdate = await productService.updateOne(productId, {
      title: dataProduct.nombre,
      description: dataProduct.description,
      price: dataProduct.price,
      thumbnail: dataProduct.thumbnail,
      code: dataProduct.code,
      stock: dataProduct.stock,
    })
    /*  return res.json(resUpdate) */
    return res.status(201).json({
      status: 'success',
      msg: 'product uptaded',
      data: { _id: id, title, description, price, thumbnail, code, stock },
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    })
  }
})

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid)
    const resDelete = await productService.deletedOne(productId)
    /*  return res.json(resDelete) */
    return res.status(200).json({
      status: 'success',
      msg: 'product deleted',
      data: {},
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    })
  }
})
