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
  opcionesConsulta.isUpdating = !!req.query.isUpdating
  try {
    const data = await productService.getAll(opcionesConsulta)
    if (data.status === 'Success') {
      if (req.session.user) {
        data.session = { email: req.session.user.email, isAdmin: req.session.user.rol === 'admin' ? true : false, user: req.session.user.firstName, message: req.flash('info') }
        req.session.user.message = null
      }
      if (opcionesConsulta.isUpdating) {
        return res.status(200).json(data)
      } else {
        res.render('home', data)
      }
    } else {
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      })
    }
  } catch (error) {
    throw new Error(error)
  }
})
productsRouter.get('/:pid', async (req, res) => {
  const productId = req.params.pid
  const data = await productService.findById(productId)
  res.render('home', { data })
})
productsRouter.post('/', async (req, res) => {
  try {
    const dataProduct = req.body
    const createProduct = await productService.createOne({
      title: dataProduct.title,
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
      payload: createProduct,
    })
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      payload: {},
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
    const productId = req.params.pid
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
      e,
      data: {},
    })
  }
})
