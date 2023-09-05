import { productFactory } from '../DAO/factory.js'
import { parsedQuery, isValid } from '../utils/utils.js'
import dataConfig from '../config/process.config.js'
import ProductDTO from '../DAO/DTO/product.DTO.js'

class ProductServices {
  validateProduct(dataProduct) {
    const requiredProperties = ['title', 'description', 'category', 'price', 'thumbnail', 'code', 'stock', 'owner']
    const missingProperties = requiredProperties.filter((property) => !(property in dataProduct))
    if (missingProperties.length > 0) {
      throw new Error(`Validation error: Missing properties - ${missingProperties.join(', ')}`)
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
  async createOne(dataProduct) {
    const dataDTO = new ProductDTO(dataProduct)
    this.validateProduct(dataDTO)
    const createProduct = await productFactory.saveProduct(dataDTO)
    return createProduct
  }
  async deletedOne(objectId) {
    const deleted = await productFactory.deleteProduct(objectId)
    return deleted
  }
  async updateOne(dataProduct) {
    const dataDTO = new ProductDTO(dataProduct)
    if (!dataDTO.id) throw new Error('invalid _id')
    this.validateProduct(dataDTO)
    const updateProduct = await productFactory.updateProduct(dataDTO)
    return updateProduct
  }
}
export const productService = new ProductServices()
