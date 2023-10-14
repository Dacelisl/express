import { Types } from 'mongoose'
import { cartFactory, productFactory } from '../DAO/factory.js'
import { isValid } from '../utils/utils.js'

class CartServices {
  async createCart() {
    try {
      const createdCart = await cartFactory.createEmptyCart()
      return {
        status: 'Success',
        code: 201,
        payload: createdCart,
        message: 'cart created',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 401,
        payload: {},
        message: `Error createCart ${error}`,
      }
    }
  }
  async getCartWithProducts(cartId) {
    try {
      isValid(cartId)
      const cart = await cartFactory.getCartWithProducts(cartId)
      if (!cart) {
        return {
          status: 'Fail',
          code: 404,
          payload: {},
          message: 'The cart does not exist',
        }
      }
      return {
        status: 'Success',
        code: 200,
        payload: cart,
        message: 'Cart with products retrieved successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        payload: {},
        message: `Error getCartWithProducts: ${error}`,
      }
    }
  }
  async addToCart(cartId, productId, quantity, user) {
    try {
      const quant = parseInt(quantity) ? quantity : 1
      if (!Types.ObjectId.isValid(cartId)) return await this.createOne(productId)
      const cart = await cartFactory.getCartByID(cartId)
      if (!cart) {
        const productFound = await productFactory.getProductByID(productId)
        if (user !== undefined && user.rol === 'premium' && productFound.owner === user.email) {
          return {
            status: 'Fail',
            code: 401,
            payload: {},
            message: `You can't add products you created`,
          }
        }
        const newCart = await cartFactory.createCart(cartId, productId, quant)
        return {
          status: 'success',
          code: 201,
          payload: newCart,
          message: 'product added successfully',
        }
      }
      const product = cart.products.find((p) => p.productId.toString() === productId)
      if (user !== undefined && user.rol === 'premium' && product.owner === user.email) {
        return {
          status: 'Fail',
          code: 401,
          payload: {},
          message: `You can't add products you created`,
        }
      }
      if (product) {
        product.quantity += quant
        await cart.save()
      } else {
        cart.products.push({ productId, quantity: quant })
        await cart.save()
      }
      return {
        status: 'success',
        code: 201,
        payload: cart,
        message: 'product added successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        payload: {},
        message: `Error addToCart ${error}`,
      }
    }
  }
  async deletedProduct(cartId, productId) {
    try {
      isValid(cartId)
      isValid(productId)
      const cart = await cartFactory.getCartByID(cartId)
      if (!cart) {
        return {
          status: 'Fail',
          code: 400,
          message: 'The car does not exist',
          payload: {},
        }
      }
      const product = cart.products.filter((p) => {
        if (p.productId.toString() === productId) {
          p.quantity -= 1
          return p.quantity > 0
        }
        return true
      })

      cart.products = product
      await cart.save()
      return {
        status: 'Success',
        code: 204,
        message: 'Product deleted successfully',
        payload: cart,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Error deletedProduct ${error}`,
        payload: {},
      }
    }
  }
  async deleteAllProducts(cartId) {
    try {
      isValid(cartId)
      const cart = await cartFactory.getCartByID(cartId)
      if (!cart) {
        return {
          status: 'Fail',
          code: 400,
          payload: {},
          message: 'The cart does not exist',
        }
      }
      cart.products = []
      await cart.save()
      return {
        status: 'Success',
        code: 204,
        payload: cart,
        message: 'All products deleted successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        payload: {},
        message: `Error deleteAllProducts: ${error}`,
      }
    }
  }
  async deleteCart(_id) {
    try {
      isValid(_id)
      const result = await cartFactory.deleteCart(_id)
      if (!result) {
        return {
          status: 'Fail',
          code: 404,
          payload: result,
          message: 'The cart does not exist',
        }
      }
      return {
        status: 'Success',
        code: 204,
        payload: result,
        message: 'Cart deleted successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        payload: {},
        message: `Error deleteCart: ${error}`,
      }
    }
  }
  async updateCart(cartId, products) {
    try {
      const cart = await cartFactory.getCartByID(cartId)
      if (!cart) {
        return {
          status: 'Fail',
          code: 404,
          payload: {},
          message: 'Cart not found',
        }
      }
      cart.products = products.map((product) => ({
        productId: product._id,
        quantity: product.quantity,
      }))

      await cart.save()
      return {
        status: 'success',
        code: 201,
        payload: cart,
        message: 'products added successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        payload: {},
        message: `Error updateCart ${error}`,
      }
    }
  }
}
export const cartService = new CartServices()
