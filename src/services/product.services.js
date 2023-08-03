import { productFactory } from '../DAO/factory.js'
import { parsedQuery, isValid } from '../utils/utils.js'
import dataConfig from '../config/process.config.js'

class ProductServices {
  validateProduct(title, description, category, price, thumbnail, code, stock) {
    if (!title || !description || !category || !price || !thumbnail || !code || !stock) {
      throw new Error('validation error: All Fields are required.')
    }
  }
  async getAll({ limit, page, sort, query, baseUrl, isUpdating }) {
    const limitValue = limit ? parseInt(limit) : 10
    const pageNumber = page ? parseInt(page) : 1
    const sorting = sort === 'desc' ? -1 : 1
    const queryFilter = query ? parsedQuery(query) : {}
    try {
      const payload = await productFactory.getProducts(queryFilter, page, limitValue, sorting)
      const totalProducts = await productFactory.getTotalProducts(queryFilter)
      const totalPages = Math.ceil(totalProducts / limitValue)

      const hasNextPage = pageNumber < totalPages
      const hasPrevPage = pageNumber > 1

      return {
        status: 'Success',
        code: 200,
        payload,
        totalPages,
        prevPage: hasPrevPage ? pageNumber - 1 : null,
        nextPage: hasNextPage ? pageNumber + 1 : null,
        pageNumber,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `http://localhost:${dataConfig.port}${baseUrl}?limit=${limitValue}&query=${encodeURIComponent(query)}&page=${pageNumber - 1}` : null,
        nextLink: hasNextPage ? `http://localhost:${dataConfig.port}${baseUrl}?limit=${limitValue}&query=${encodeURIComponent(query)}&page=${pageNumber + 1}` : null,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 404,
        msg: `Error getting data ${error.message}`,
        payload: {},
      }
    }
  }
  async findById(_id) {
    try {
      isValid(_id)
      const payload = await productFactory.getProductByID(_id)
      return {
        status: 'Success',
        code: 201,
        payload: payload,
        msg: 'cart created',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 401,
        msg: `Error ${error}`,
      }
    }
  }
  async createOne({ title, description, category, price, thumbnail, code, stock }) {
    this.validateProduct(title, description, category, price, thumbnail, code, stock)
    const createProduct = await productFactory.saveProduct(title, description, category, price, thumbnail, code, stock)
    return createProduct
  }
  async deletedOne(objectId) {
    const deleted = await productFactory.deleteProduct(objectId)
    return deleted
  }
  async updateOne({ _id, title, description, category, price, thumbnail, code, stock }) {
    if (!_id) throw new Error('invalid _id')
    this.validateProduct(title, description, category, price, thumbnail, code, stock)
    const updateProduct = await productFactory.updateProduct(_id, title, description, category, price, thumbnail, code, stock)
    return updateProduct
  }
}
export const productService = new ProductServices()
