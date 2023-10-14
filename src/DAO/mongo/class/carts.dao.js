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
    try {
      const cart = await CartsModel.findById(cartId)
      return cart
    } catch (error) {
      return error
    }
  }
  deleteCart = async (objectId) => {
    const result = await CartsModel.deleteOne({ _id: objectId })
    return result
  }
  removeProductsFromCart = async (cartId, productToRemove) => {
    try {
      const cart = await CartsModel.findByIdAndUpdate(cartId, { $pull: { products: { productId: { $in: productToRemove } } } }, { new: true })
      if (!cart) {
        throw new Error('Cart not found')
      }
      return cart
    } catch (error) {
      throw new Error(`Error removing products from cart: ${error.message}`)
    }
  }
}
export const cartDAO = new Cart()
