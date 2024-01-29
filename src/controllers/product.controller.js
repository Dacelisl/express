import { productService } from '../services/product.services.js'
import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts()
      return sendSuccessResponse(res, products)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getProductsFilter(req, res) {
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
      const dataProduct = await productService.getProductsFilter(opcionesConsulta)
      if (dataProduct.status === 'Success') {
        return res.json(dataProduct)
      } else {
        req.logger.error('something went wrong ')
        return res.status(500).json({
          status: 'error',
          payload: {},
          message: 'something went wrong :(',
        })
      }
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getProductId(req, res) {
    const productId = req.params.pid
    try {
      const productFound = await productService.getProductByID(productId)
      return sendSuccessResponse(res, productFound)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getProductCode(req, res) {
    const productCode = req.params.code
    try {
      const productFound = await productService.getProductByCode(productCode)
      return sendSuccessResponse(res, productFound)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async createProduct(req, res) {
    try {
      const { name, description, category, price, thumbnail, code, provider, stock, profitPercentage } = req.body
      const newProduct = { name, description, category, price, thumbnail, code, provider, stock, profitPercentage }
      const response = await productService.createProduct(newProduct)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async updateProduct(req, res) {
    try {
      const data = req.body
      const newProduct = {
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        thumbnail: data.thumbnail,
        code: data.code,
        provider: data.provider,
        stock: data.stock,
        profitPercentage: data.profitPercentage,
      }
      newProduct.id = req.params.pid
      const resUpdate = await productService.updateProduct(newProduct)
      return sendSuccessResponse(res, resUpdate)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async deleteProduct(req, res) {
    const productId = req.params.pid
    try {
      const resDelete = await productService.deleteProduct(productId)
      return sendSuccessResponse(res, resDelete)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
}
export const productController = new ProductController()
