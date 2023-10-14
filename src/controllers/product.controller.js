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
  async getProductCode(req, res) {
    try {
      const productCode = req.params.code
      const productFound = await productService.findByCode(productCode)
      return res.status(200).json({
        status: 'success',
        message: 'product found',
        payload: productFound,
      })
    } catch (e) {
      req.logger.error('something went wrong getProductCode', e)
      return res.status(500).json({
        status: 'error',
        message: `Something went wrong :( ${e}`,
        payload: {},
      })
    }
  }
  async createProduct(req, res) {
    try {
      const { title, description, category, price, thumbnail, code, stock } = req.body
      const owner = req.session.user && req.session.user.rol === 'premium' ? req.session.user.email : 'admin'
      const newProduct = {
        title,
        description,
        category,
        price,
        thumbnail,
        code,
        owner,
        stock,
      }
      const response = await productService.createOne(newProduct)
      return res.status(response.code).json({
        status: response.status,
        message: response.message,
        payload: response.payload,
      })
    } catch (error) {
      req.logger.error('Something went wrong createProduct', error)
      return res.status(500).json({
        status: 'error',
        message: `Something went wrong :( ${error.message}`,
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
      const rol = req.session.user.rol
      const mail = req.session.user.email

      if (rol !== 'user') {
        if (rol === 'premium') {
          await productService.searchOwner(mail, productId)
        }
        const resDelete = await productService.deletedOne(productId)
        return res.status(204).json({
          status: 'success',
          code: 204,
          message: 'product deleted',
          payload: resDelete,
        })
      }
      return res.status(404).json({
        status: 'fail',
        code: 404,
        message: 'Product not found',
        payload: {},
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
