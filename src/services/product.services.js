import { productFactory } from '../DAO/factory.js'
import { parsedQuery, isValid } from '../utils/utils.js'
import dataConfig from '../config/process.config.js'

class ProductServices {
  validateProduct(dataProduct) {
    const requiredProperties = ['name', 'description', 'category', 'price', 'thumbnail', 'code', 'provider', 'stock', 'profitPercentage']
    const missingProperties = requiredProperties.filter((property) => {
      return !(property in dataProduct) || dataProduct[property] === undefined
    })
    if (missingProperties.length > 0) {
      throw new Error(`Validation error: Missing or undefined properties ${missingProperties}`)
    }
    return true
  }
  async getAllProducts() {
    try {
      const payload = await productFactory.getAllProducts()
      if (!payload) {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, products not found getAllProducts`,
          payload: {},
        }
      }
      return {
        status: 'Success',
        code: 201,
        message: 'products found getAllProducts',
        payload: payload,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Internal Server Error getAllProducts`,
        payload: {},
      }
    }
  }
  async getProductsFilter({ limit, page, sort, query, baseUrl }) {
    const limitValue = limit ? parseInt(limit) : 10
    const pageNumber = page ? parseInt(page) : 1
    const sorting = sort === 'desc' ? -1 : 1
    const queryFilter = query ? parsedQuery(query) : {}
    try {
      const payload = await productFactory.getProductsFilter(queryFilter, pageNumber, limitValue, sorting)
      const totalProducts = await productFactory.getTotalProducts(queryFilter)
      const totalPages = Math.ceil(totalProducts / limitValue)
      const hasNextPage = pageNumber < totalPages
      const hasPrevPage = pageNumber > 1
      if (!payload) {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, products not found getProductsFilter`,
          payload: {},
        }
      }
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
        message: `Error getting data getProductsFilter ${error.message}`,
      }
    }
  }
  async getProductByID(_id) {
    try {
      isValid(_id)
      const payload = await productFactory.getProductByID(_id)
      if (payload) {
        return {
          status: 'Success',
          code: 201,
          message: 'product found',
          payload: payload,
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, product not found getProductByID`,
          payload: {},
        }
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Internal Server Error getProductByID`,
        payload: {},
      }
    }
  }
  async getProductByCode(code) {
    try {
      const payload = await productFactory.getProductByCode(code)
      if (payload) {
        return {
          status: 'Success',
          code: 201,
          message: 'product found',
          payload: payload,
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, product not found getProductByCode`,
          payload: {},
        }
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Internal Server Error getProductByCode`,
        payload: {},
      }
    }
  }
  async createProduct(dataProduct) {
    try {
      this.validateProduct(dataProduct)
      const createProduct = await productFactory.saveProduct(dataProduct)
      if (!createProduct) {
        return {
          status: 'Fail',
          code: 400,
          message: 'Product created properties are missing or undefined',
          payload: {},
        }
      }
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
        message: `Error to save product: ${error.message}`,
        payload: {},
      }
    }
  }
  async deleteProduct(productId) {
    try {
      const productFound = await productFactory.getProductByID(productId)
      if (!productFound) {
        return {
          status: 'error',
          code: 404,
          message: 'Product not found',
          payload: {},
        }
      }
      const deleted = await productFactory.deleteProduct(productId)
      if (deleted.deletedCount > 0) {
        return {
          status: 'Success',
          code: 204,
          message: 'removed product',
          payload: {},
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, product not found deleteProduct`,
          payload: {},
        }
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: `Something went wrong :( ${error}`,
        payload: {},
      }
    }
  }
  async updateProduct(product) {
    try {
      const productFound = await productFactory.getProductByID(product.id)
      if (!productFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'product not exist deleteProduct',
          payload: {},
        }
      }
      const updateProduct = await productFactory.updateProduct(product)
      if (updateProduct.modifiedCount > 0) {
        const productUpdate = await productFactory.getProductByID(product.id)
        return {
          status: 'Success',
          code: 200,
          message: 'product update successfully',
          payload: productUpdate,
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error updateProduct`,
          payload: updateProduct,
        }
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Something went wrong :( ${error}`,
        payload: {},
      }
    }
  }
}
export const productService = new ProductServices()
