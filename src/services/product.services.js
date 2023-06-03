import { ProductsModel } from '../DAO/models/products.model.js'

export class ProductServices {
  validateProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log('All Fields are required')
      throw new Error('validation error: All Fields are required.')
    }
  }
  async getAll() {
    const products = await ProductsModel.find({})
    return products
  }

  async createOne(title, description, price, thumbnail, code, stock) {
    this.validateProduct(title, description, price, thumbnail, code, stock)
    const createProduct = await ProductsModel.create({ title, description, price, thumbnail, code, stock })
    return createProduct
  }

  async deletedOne(_id) {
    const deleted = await ProductsModel.deleteOne({ _id: _id })
    return deleted
  }

  async updateOne(_id, title, description, price, thumbnail, code, stock) {
    if (!_id) throw new Error('invalid _id')
    this.validateProduct(title, description, price, thumbnail, code, stock)
    const updateProduct = await ProductsModel.updateOne({ _id: id }, { title, description, price, thumbnail, code, stock })
    return updateProduct
  }
}
