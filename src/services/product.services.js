import { ProductsModel } from '../DAO/models/products.model.js'
import { parsedQuery, isValid } from '../utils/utils.js'

export class ProductServices {
  validateProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log('All Fields are required')
      throw new Error('validation error: All Fields are required.')
    }
  }
  async getAll(search) {
    const limit = search.limit ? search.limit : 10
    const page = search.page ? parseInt(search.page) : 1
    const queryFilter = search.query ? parsedQuery(search.query) : {}
    try {
      const payload = await ProductsModel.find(queryFilter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ price: search.sort })
        .lean()

      const hasNextPage = page < payload.length
      const hasPrevPage = page > 1
      return {
        status: 'Success',
        code: 200,
        payload: payload,
        totalPages: payload.length,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: hasPrevPage ? `http://localhost:8080${search.baseUrl}?limit=${limit}&query=${encodeURIComponent(search.query)}&page=${page - 1}` : null,
        nextLink: hasNextPage ? `http://localhost:8080${search.baseUrl}?limit=${limit}&query=${encodeURIComponent(search.query)}&page=${page + 1}` : null,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 404,
        msg: `Error getting data ${error}`,
        payload: {},
      }
    }
  }

  async findById(productId) {
    try {
      isValid(productId)
      const payload = await ProductsModel.findOne({ _id: productId }).lean()
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
  async findByCode(code) {
    let product = await ProductsModel.findOne({ code: code })
    return product
  }
  async createOne(title, description, category, price, thumbnail, code, stock) {
    this.validateProduct(title, description, category, price, thumbnail, code, stock)
    const createProduct = await ProductsModel.create({ title, description, category, price, thumbnail, code, stock })
    return createProduct
  }

  async deletedOne(_id) {
    const deleted = await ProductsModel.deleteOne({ _id: _id })
    return deleted
  }

  async updateOne(_id, title, description, category, price, thumbnail, code, stock) {
    if (!_id) throw new Error('invalid _id')
    this.validateProduct(title, description, category, price, thumbnail, code, stock)
    const updateProduct = await ProductsModel.updateOne({ _id: id }, { title, description, category, price, thumbnail, code, stock })
    return updateProduct
  }
}
