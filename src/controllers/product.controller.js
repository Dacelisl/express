import { productService } from '../services/product.services.js'
import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'

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
          dataProduct.session = { email: req.session.user.email, isAdmin: req.session.user.rol === 'admin', user: req.session.user.firstName, message: req.flash('homeMessage') }
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
      return sendErrorResponse(res, error)
    }
  }
  async getProductId(req, res) {
    try {
      const productId = req.params.pid
      const productFound = await productService.findById(productId)
      res.render('product', productFound.payload)
    } catch (error) {
      req.logger.error('something went wrong getProductId', error)
      return sendErrorResponse(res, error)
    }
  }
  async getProductCode(req, res) {
    try {
      const productCode = req.params.code
      const response = await productService.findByCode(productCode)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error('something went wrong getProductCode', e)
      return sendErrorResponse(res, error)
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
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error('Something went wrong createProduct', error)
      return sendErrorResponse(res, error)
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
        stock: data.stock,
      }
      newProduct.id = req.params.pid
      const resUpdate = await productService.updateOne(newProduct)
      return sendSuccessResponse(res, resUpdate)
    } catch (error) {
      req.logger.error('something went wrong updateProduct', e)
      return sendErrorResponse(res, error)
    }
  }
  async deleteProduct(req, res) {
    try {
      const productId = req.params.pid
      const resDelete = await productService.deletedOne(productId)
      return sendSuccessResponse(res, resDelete)
    } catch (error) {
      req.logger.error('something went wrong deleteProduct', e)
      return sendErrorResponse(res, error)
    }
  }
}
export const productController = new ProductController()
