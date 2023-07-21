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
      throw new Error(error)
    }
  }
  async addProduct(req, res) {
    res.render('addProduct', {})
  }
  async createProduct(req, res) {
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
  }
}
export const viewController = new ViewsController()
