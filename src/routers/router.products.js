import express from 'express'
import { ProductServices } from '../services/product.services.js'

const productService = new ProductServices()
export const productsRouter = express.Router()

productsRouter.get('/', async (req, res) => {
  const opcionesConsulta = {}
  opcionesConsulta.limit = parseInt(req.query.limit)
  opcionesConsulta.page = req.query.page
  opcionesConsulta.sort = req.query.sort
  opcionesConsulta.query = req.query.query
  opcionesConsulta.baseUrl = req.baseUrl
  try {
    const data = await productService.getAll(opcionesConsulta)
    res.render('home', data)
  } catch (error) {
    throw new Error(error)
  }
})

productsRouter.get('/:qid', async (req, res) => {
  const productId = parseInt(req.params.qid)
  const data = await productService.findById(productId)
  res.render('home', { data })
})

productsRouter.post('/', async (req, res) => {
  try {
    const dataProduct = req.body
    const createProduct = await productService.createOne({
      title: dataProduct.nombre,
      description: dataProduct.description,
      category: dataProduct.category,
      price: dataProduct.price,
      thumbnail: dataProduct.thumbnail,
      code: dataProduct.code,
      stock: dataProduct.stock,
    })
    return res.status(201).json({
      status: 'success',
      msg: 'product created',
      data: createProduct,
    })
  } catch (e) {
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
      category: dataProduct.category,
      price: dataProduct.price,
      thumbnail: dataProduct.thumbnail,
      code: dataProduct.code,
      stock: dataProduct.stock,
    })
    return res.status(201).json({
      status: 'success',
      msg: 'product uptaded',
      data: { _id: id, title, description, price, thumbnail, code, stock },
    })
  } catch (e) {
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
    return res.status(200).json({
      status: 'success',
      msg: 'product deleted',
      data: {},
    })
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    })
  }
})
