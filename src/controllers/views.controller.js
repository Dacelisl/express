import { productService } from '../services/product.services.js'
import { sendErrorResponse } from '../utils/utils.js'

class ViewsController {
  async getAllProducts(req, res) {
    const opcionesConsulta = {}
    opcionesConsulta.limit = parseInt(req.query.limit)
    opcionesConsulta.page = req.query.page
    opcionesConsulta.sort = req.query.sort
    opcionesConsulta.query = req.query.query
    try {
      const dataProduct = await productService.getAll(opcionesConsulta)
      dataProduct.session = { email: req.session.user.email, isAdmin: req.session.user.rol === 'admin', user: req.session.user.firstName, message: req.session.user.message }
      res.render('realTimeProducts', dataProduct)
    } catch (error) {
      req.logger.error('something went wrong getAllProducts', error)
      return sendErrorResponse(res, error)
    }
  }
  async addProduct(req, res) {
    res.render('addProduct', {})
  }
  async createProduct(req, res) {
    let message = ''
    try {
      const data = req.body
      const newProduct = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        thumbnail: data.thumbnail,
        code: data.code,
        owner: req.session.user ? req.session.user.email : 'admin',
        stock: data.stock,
      }
      await productService.createOne(newProduct)
      message = `Producto agregado con éxito.`
      return res.render('addProduct', { message })
    } catch (e) {
      req.logger.error('something went wrong createProduct', e)
      message = `Producto no agregado`
      return res.render('addProduct', { message })
    }
  }
}
export const viewController = new ViewsController()
