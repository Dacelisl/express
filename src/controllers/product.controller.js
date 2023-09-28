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
      const dataProduct = await productService.getAll(opcionesConsulta)
      if (dataProduct.status === 'Success') {
        if (req.session.user) {
          dataProduct.session = { email: req.session.user.email, isAdmin: req.session.user.rol === 'admin', user: req.session.user.firstName, message: req.flash('info') }
          req.session.user.message = null
        }
        if (opcionesConsulta.isUpdating) {
          return res.status(200).json(dataProduct)
        } else {
          res.render('home', dataProduct)
        }
      } else {
        req.logger.error('something went wrong ')
        return res.status(500).json({
          status: 'error',
          payload: {},
          message: 'something went wrong :(',
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
      const productFound = await productService.findById(productId)
      res.render('product', productFound.payload)
    } catch (error) {
      req.logger.error('something went wrong getProductId', error)
    }
  }
  async createProduct(req, res) {
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
      const createProduct = await productService.createOne(newProduct)
      return res.status(201).json({
        status: 'success',
        message: 'product created',
        payload: createProduct,
      })
    } catch (e) {
      req.logger.error('something went wrong createProduct', e)
      return res.status(500).json({
        status: 'error',
        message: `Something went wrong :( ${e}`,
        payload: {},
      })
    }
  }
  async updateProduct(req, res) {
    try {
      const data = req.body
      const newProduct = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        thumbnail: data.thumbnail,
        code: data.code,
        owner: data.owner,
        stock: data.stock,
      }
      newProduct.id = req.params.pid
      const resUpdate = await productService.updateOne(newProduct)
      return res.status(200).json({
        status: 'success',
        message: 'product uptaded',
        payload: resUpdate,
      })
    } catch (e) {
      req.logger.error('something went wrong updateProduct', e)
      return res.status(500).json({
        status: 'error',
        message: `Something went wrong :( ${e}`,
        payload: {},
      })
    }
  }
  async deleteProduct(req, res) {
    try {
      const productId = req.params.pid
      const resDelete = await productService.deletedOne(productId)
      return res.status(204).json({
        status: 'success',
        code: 204,
        payload: resDelete,
        message: 'product deleted',
      })
    } catch (e) {
      req.logger.error('something went wrong deleteProduct', e)
      return res.status(500).json({
        status: 'error',
        code: 500,
        message: `Something went wrong :( ${e}`,
        payload: {},
      })
    }
  }
}
export const productController = new ProductController()
