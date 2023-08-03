import { CartsModel } from '../models/carts.model.js'

class Cart {
  createEmptyCart = async () => {
    const result = await CartsModel.create({})
    return result
  }
  createCart = async (cartId, productId, quant) => {
    const result = await CartsModel.create({
      _id: cartId,
      products: [{ productId, quantity: quant }],
    })
    return result
  }
  getCartWithProducts = async (cartId) => {
    const products = CartsModel.findOne({ _id: cartId }).populate('products.productId')
    return products
  }
  getCartByID = async (cartId) => {
    const cart = await CartsModel.findById(cartId)
    return cart
  }
  deleteCart = async (id) => {
    const result = await CartsModel.deleteOne({ _id: id })
    return result
  }
}
export const cartDAO = new Cart()
