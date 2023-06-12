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
    res.render('realTimeProducts', payload)
  } catch (error) {
    throw new Error(error)
  }
})
routerView.get('/products', async (req, res) => {
  try {
    const payload = await productService.getAll({})
    res.render('home', payload)
  } catch (error) {
    throw new Error(error)
  }
})
routerView.get('/:qid', async (req, res) => {
  const productId = req.params.qid
  try {
    const payload = await productService.findById(productId)
    res.render('product', payload.payload)
  } catch (error) {
    throw new Error(error)
  }
})
