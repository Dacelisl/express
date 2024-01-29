import { ProductModel } from '../models/product.model.js'
import { ProductDTO } from '../../DTO/product.dto.js'

class ProductDAO {
  async getProductsFilter(queryFilter, page, limitValue, sorting) {
    try {
      const products = await ProductModel.find(queryFilter)
        .skip((page - 1) * limitValue)
        .limit(limitValue)
        .sort({ price: sorting })
        .lean()
      const formattedProducts = products.map((product) => (product ? new ProductDTO(product) : null))
      return formattedProducts
    } catch (error) {
      throw new Error(`function DAO getProductsFilter  ${error}`)
    }
  }
  async getAllProducts() { 
    try {
      const allProducts = await ProductModel.find().lean()
      const formattedProducts = allProducts.map((product) => (product ? new ProductDTO(product) : null))
      return formattedProducts
    } catch (error) {
      throw new Error(`function DAO getAllProducts  ${error}`)
    }
  }
  async getProductByID(id) {
    try {
      const product = await ProductModel.findById(id)
      return product ? new ProductDTO(product) : null
    } catch (error) {
      throw new Error(`function DAO getProductByID  ${error}`)
    }
  }
  async getProductByCode(code) {
    try {
      const product = await ProductModel.findOne({ code: code })
      return product ? new ProductDTO(product) : null
    } catch (error) {
      throw new Error(`function DAO getProductByCode ${error}`)
    }
  }
  async getTotalProducts(query) {
    try {
      const productCount = await ProductModel.countDocuments(query)
      return productCount
    } catch (error) {
      throw new Error(`function DAO getTotalProducts ${error}`)
    }
  }
  async saveProduct(dataProduct) {
    try {
      const result = await ProductModel.create(dataProduct)
      return result
    } catch (error) {
      throw new Error(`function DAO saveProduct ${error}`)
    }
  }
  async deleteProduct(objectId) {
    try {
      const result = await ProductModel.deleteOne({ _id: objectId })
      return result
    } catch (error) {
      throw new Error(`function DAO deleteProduct ${error}`)
    }
  }
  async updateProduct(dataProduct) {
    try {
      const { id, name, description, category, price, thumbnail, code, provider, stock, profitPercentage } = dataProduct
      const result = await ProductModel.updateOne({ _id: id }, { id, name, description, category, price, thumbnail, code, provider, stock, profitPercentage })
      return result
    } catch (error) {
      throw new Error(`function DAO updateProduct ${error}`)
    }
  }
}
export const productDAO = new ProductDAO()
