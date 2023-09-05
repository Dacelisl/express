import { productService } from '../services/product.services.js'

class ViewsController {
  async getAllProducts(req, res) {
    const opcionesConsulta = {}
    opcionesConsulta.limit = parseInt(req.query.limit)
    opcionesConsulta.page = req.query.page
    opcionesConsulta.sort = req.query.sort
    opcionesConsulta.query = req.query.query
    try {
      const payload = await productService.getAll(opcionesConsulta)
      payload.session = { email: req.session.user.email, isAdmin: req.session.user.rol === 'admin', user: req.session.user.firstName, message: req.session.user.message }
      res.render('realTimeProducts', payload)
    } catch (error) {
      req.logger.error('something went wrong getAllProducts', error)
    }
  }
  async addProduct(req, res) {
    res.render('addProduct', {})
  }
  async createProduct(req, res) {
    let message = ''
    try {
      const data = req.body
      const dataProduct = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        thumbnail: data.thumbnail,
        code: data.code,
        owner: data.owner,
        stock: data.stock,
      }
      await productService.createOne({ dataProduct })
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
