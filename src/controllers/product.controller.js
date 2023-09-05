import { productService } from '../services/product.services.js'

class ProductController {
  async getAllProducts(req, res) {
    const { limit, page, sort, query } = req.query
    const opcionesConsulta = {
      limit: parseInt(limit),
      page,
      sort,
      query,
      baseUrl: req.baseUrl,
      isUpdating: !!req.query.isUpdating,
    }
    try {
      const data = await productService.getAll(opcionesConsulta)
      if (data.status === 'Success') {
        if (req.session.user) {
          data.session = { email: req.session.user.email, isAdmin: req.session.user.rol === 'admin', user: req.session.user.firstName, message: req.flash('info') }
          req.session.user.message = null
        }
        if (opcionesConsulta.isUpdating) {
          return res.status(200).json(data)
        } else {
          res.render('home', data)
        }
      } else {
        req.logger.error('something went wrong ')
        return res.status(500).json({
          status: 'error',
          msg: 'something went wrong :(',
          data: {},
        })
      }
    } catch (error) {
      req.logger.error('Error getting the products', error)
      res.status(500).json({ error: 'Error getting the products' })
    }
  }
  async getProductId(req, res) {
    try {
      const productId = req.params.pid
      const data = await productService.findById(productId)
      res.render('home', { data })
    } catch (error) {
      req.logger.error('something went wrong getProductId', error)
    }
  }
  async createProduct(req, res) {
    try {
      const data = req.body
      const dataProduct = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        thumbnail: data.thumbnail,
        code: data.code,
        owner: req.session.user ? req.session.user.email : 'admin',
        stock: data.stock,
      }
      const createProduct = await productService.createOne(dataProduct)
      return res.status(201).json({
        status: 'success',
        msg: 'product created',
        payload: createProduct,
      })
    } catch (e) {
      req.logger.error('something went wrong createProduct', e)
      return res.status(500).json({
        status: 'error',
        msg: `Something went wrong :( ${e}`,
        payload: {},
      })
    }
  }
  async updateProduct(req, res) {
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
      dataProduct.id = req.params.pid
      const resUpdate = await productService.updateOne(dataProduct)
      return res.status(201).json({
        status: 'success',
        msg: 'product uptaded',
        data: resUpdate,
      })
    } catch (e) {
      req.logger.error('something went wrong updateProduct', e)
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      })
    }
  }
  async deleteProduct(req, res) {
    try {
      const productId = req.params.pid
      const resDelete = await productService.deletedOne(productId)
      return res.status(200).json({
        status: 'success',
        msg: 'product deleted',
        data: resDelete,
      })
    } catch (e) {
      req.logger.error('something went wrong deleteProduct', e)
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        e,
        data: {},
      })
    }
  }
}
export const productController = new ProductController()
