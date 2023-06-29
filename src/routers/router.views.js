import express from 'express'
import { ProductServices } from '../services/product.services.js'

const productService = new ProductServices()
export const routerView = express.Router()

routerView.get('/', async (req, res) => {
  const opcionesConsulta = {}
  opcionesConsulta.limit = parseInt(req.query.limit)
  opcionesConsulta.page = req.query.page
  opcionesConsulta.sort = req.query.sort
  opcionesConsulta.query = req.query.query
  try {
    const payload = await productService.getAll(opcionesConsulta)
    payload.session = { email: req.session.user.email, isAdmin: req.session.user.isAdmin, user: req.session.user.firstName, message: req.session.user.message }
    res.render('realTimeProducts', payload)
  } catch (error) {
    throw new Error(error)
  }
})
/* routerView.get('/:qid', async (req, res) => {
  const productId = req.params.qid
  try {
    const payload = await productService.findById(productId)
    res.render('product', payload.payload)
  } catch (error) {
    throw new Error(error)
  }
}) */
routerView.get('/addProduct', async (req, res) => {
  res.render('addProduct', {})
})
routerView.post('/add', async (req, res) => {
  let message = ''
  try {
    const dataProduct = req.body
    await productService.createOne({
      title: dataProduct.title,
      description: dataProduct.description,
      category: dataProduct.category,
      price: dataProduct.price,
      thumbnail: dataProduct.thumbnail,
      code: dataProduct.code,
      stock: dataProduct.stock,
    })
    message = `Producto agregado con éxito.`
    return res.render('addProduct', { message })
  } catch (e) {
    message = `Producto no agregado`
    return res.render('addProduct', { message })
  }
})
