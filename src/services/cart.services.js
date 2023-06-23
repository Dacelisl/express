import { Types } from 'mongoose'
import { CartsModel } from '../DAO/models/carts.model.js'
import { isValid } from '../utils/utils.js'

export class CartServices {
  async createCart() {
    try {
      const createdCart = await CartsModel.create({})
      return {
        status: 'Success',
        code: 201,
        data: createdCart,
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
  async getCartWithProducts(cartId) {
    try {
      isValid(cartId)
      const cart = await CartsModel.findOne({ _id: cartId }).populate('products.productId')
      if (!cart) {
        return {
          status: 'Fail',
          code: 404,
          data: {},
          msg: 'The cart does not exist',
        }
      }
      return {
        status: 'Success',
        code: 200,
        data: cart,
        msg: 'Cart with products retrieved successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        data: {},
        msg: `Error: ${error}`,
      }
    }
  }
  async createOne(productId) {
    try {
      isValid(productId)
      const cart = { productId: productId, quantity: 1 }
      const createdCart = await CartsModel.create({ products: [cart] })
      return {
        status: 'Success',
        code: 201,
        data: createdCart,
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
  async addToCart(cartId, productId, quantity) {
    try {
      const quant = parseInt(quantity) ? quantity : 1
      if (!Types.ObjectId.isValid(cartId)) return await this.createOne(productId)
      const cart = await CartsModel.findById(cartId)
      if (!cart) {
        const newCart = await CartsModel.create({
          _id: cartId,
          products: [{ productId, quantity: quant }],
        })
        return {
          status: 'success',
          code: 201,
          data: newCart,
          msg: 'product added successfully',
        }
      }
      const product = cart.products.find((p) => p.productId.toString() === productId)
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
        data: cart,
        msg: 'product added successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        msg: `Error ${error}`,
      }
    }
  }
  async deletedProduct(cartId, productId) {
    try {
      isValid(cartId)
      isValid(productId)
      const cart = await CartsModel.findById(cartId)
      if (!cart) {
        return {
          status: 'Fail',
          code: 400,
          data: {},
          msg: 'The car does not exist',
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
        code: 200,
        data: cart,
        msg: 'Product deleted successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        msg: `Error ${error}`,
      }
    }
  }
  async deleteAllProducts(cartId) {
    try {
      isValid(cartId)
      const cart = await CartsModel.findById(cartId)
      if (!cart) {
        return {
          status: 'Fail',
          code: 400,
          data: {},
          msg: 'The cart does not exist',
        }
      }
      cart.products = []
      await cart.save()
      return {
        status: 'Success',
        code: 200,
        data: cart,
        msg: 'All products deleted successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        msg: `Error: ${error}`,
      }
    }
  }
  async deleteCart(_id) {
    try {
      isValid(_id)
      const result = await CartsModel.deleteOne({ _id })
      if (result.deletedCount === 0) {
        return {
          status: 'Fail',
          code: 404,
          data: {},
          msg: 'The cart does not exist',
        }
      }
      return {
        status: 'Success',
        code: 200,
        data: {},
        msg: 'Cart deleted successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        msg: `Error: ${error}`,
      }
    }
  }
  async updateCart(cartId, products) {
    try {
      const cart = await CartsModel.findById(cartId)
      if (!cart) {
        return {
          status: 'Fail',
          code: 404,
          data: {},
          msg: 'Cart not found',
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
        data: cart,
        msg: 'products added successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        msg: `Error ${error}`,
      }
    }
  }
}
