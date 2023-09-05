import { ProductsModel } from '../models/products.model.js'

class Product {
  getProducts = async (queryFilter, page, limitValue, sorting) => {
    const products = ProductsModel.find(queryFilter)
      .skip((page - 1) * limitValue)
      .limit(limitValue)
      .sort({ price: sorting })
      .lean()
    return products
  }

  getProductByID = async (id) => {
    const user = await ProductsModel.findById(id)
    return user
  }

  getTotalProducts = async (query) => {
    const user = await ProductsModel.countDocuments(query)
    return user
  }

  saveProduct = async (dataProduct) => {
    const { title, description, category, price, thumbnail, code, stock, owner } = dataProduct
    const result = await ProductsModel.create({ title, description, category, price, thumbnail, code, owner, stock })
    return result
  }
  deleteProduct = async (objectId) => {
    const result = await ProductsModel.deleteOne({ _id: objectId })
    return result
  }

  updateProduct = async (dataProduct) => {
    const { title, description, category, price, thumbnail, code, stock, id, owner } = dataProduct
    const result = await ProductsModel.updateOne({ _id: id }, { title, description, category, price, thumbnail, code, owner, stock })
    return result
  }
}
export const productDAO = new Product()
