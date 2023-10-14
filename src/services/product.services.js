import { productFactory, userFactory } from '../DAO/factory.js'
import { mailServices } from '../services/mail.services.js'
import { parsedQuery, isValid } from '../utils/utils.js'
import dataConfig from '../config/process.config.js'
import ProductDTO from '../DAO/DTO/product.dto.js'

class ProductServices {
  validateProduct(dataProduct) {
    const requiredProperties = ['title', 'description', 'category', 'price', 'thumbnail', 'code', 'owner', 'stock']
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
        payload: {},
        message: `Error getting data ${error.message}`,
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
        message: 'product found',
        payload: payload,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 401,
        message: `Error ${error}`,
        payload: {},
      }
    }
  }
  async findByCode(code) {
    return await productFactory.getProductByCode(code)
  }
  async createOne(dataProduct) {
    const dataDTO = new ProductDTO({ dataProduct })
    this.validateProduct(dataDTO)
    try {
      const createProduct = await productFactory.saveProduct(dataDTO)
      return {
        status: 'Success',
        code: 201,
        message: 'product created',
        payload: createProduct,
      }
    } catch (error) {
      return {
        code: 500,
        status: 'error',
        message: `Error al crear el producto: ${error.message}`,
        payload: {},
      }
    }
  }
  async searchOwner(mail, pid) {
    const userOwner = await userFactory.getUserByEmail(mail)
    const product = await productFactory.getProductByID(pid)
    return userOwner.email === product.owner || userOwner.rol === 'admin'
  }
  async deletedOne(productId) {
    const productFound = await productFactory.getProductByID(productId)
    if (productFound.owner !== 'admin') {
      const userOwner = await userFactory.getUserByEmail(productFound.owner)
      if (userOwner.rol === 'premium') {
        await mailServices.productNotificationMail(userOwner, productFound)
      }
    }
    const deleted = await productFactory.deleteProduct(productId)
    return deleted
  }
  async updateOne(dataProduct) {
    const updateProduct = await productFactory.updateProduct(dataProduct)
    return updateProduct
  }
}
export const productService = new ProductServices()
