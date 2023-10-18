import { cartService } from '../services/cart.services.js'
import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'

class CartController {
  async createCart(req, res) {
    try {
      const createdCart = await cartService.createCart()
      return sendSuccessResponse(res, createdCart)
    } catch (error) {
      req.logger.error('something went wrong createCart', error)
      return sendErrorResponse(res, error)
    }
  }
  async addProduct(req, res) {
    try {
      const cid = req.params.cid || req.session.user.cart
      const user = req.session.user
      const pid = req.params.pid
      const quant = req.body
      const resAdd = await cartService.addToCart(cid, pid, quant, user)
      return sendSuccessResponse(res, resAdd)
    } catch (error) {
      req.logger.error('something went wrong addProduct', error)
      return sendErrorResponse(res, error)
    }
  }
  async deletedProduct(req, res) {
    try {
      const cid = req.session.user ? req.session.user.cart : req.params.cid
      const pid = req.params.pid
      const response = await cartService.deletedProduct(cid, pid)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error('something went wrong deletedProduct', error)
      return sendErrorResponse(res, error)
    }
  }
  async deleteCart(req, res) {
    try {
      const cid = req.params.cid
      const resDelete = await cartService.deleteCart(cid)
      return sendSuccessResponse(res, resDelete)
    } catch (error) {
      req.logger.error('something went wrong deleteCart', error)
      return sendErrorResponse(res, error)
    }
  }
  async currentCart(req, res) {
    try {
      const dataUser = req.session.user.cart
      if (!dataUser) return res.redirect('/api/users/login')
      return res.status(200).json(dataUser)
    } catch (error) {
      req.logger.error('something went wrong currentCart', error)
      return sendErrorResponse(res, error)
    }
  }
  async getCartId(req, res) {
    try {
      const cartId = req.params.cid || req.session.user.cart
      const response = await cartService.getCartWithProducts(cartId)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error('something went wrong getCartId', error)
      return sendErrorResponse(res, error)
    }
  }

  async getAll(req, res) {
    try {
      const user = req.session.user
      if (!user) return res.redirect('/api/users/login')
      user.isAdmin = user.rol === 'admin'
      if (req.query.isUpdating) {
        return res.status(201).json(user)
      }
      res.render('cart', { user })
    } catch (error) {
      req.logger.error('something went wrong getAll', error)
      return sendErrorResponse(res, error)
    }
  }
  async updateAddToCart(req, res) {
    try {
      const cid = req.session.user ? req.session.user.cart : req.params.cid
      const pid = req.params.pid
      const quant = req.body.quantity
      const user = req.session.user ? req.session.user.rol : undefined
      const resAdd = await cartService.addToCart(cid, pid, quant, user)
      return sendSuccessResponse(res, resAdd)
    } catch (error) {
      req.logger.error('something went wrong updateAddToCart', error)
      return sendErrorResponse(res, error)
    }
  }
  async updateCart(req, res) {
    try {
      const cid = req.params.cid
      const products = req.body.products
      const resUpdate = await cartService.updateCart(cid, products)
      return sendSuccessResponse(res, resUpdate)
    } catch (error) {
      req.logger.error('something went wrong updateCart', error)
      return sendErrorResponse(res, error)
    }
  }
}
export const cartController = new CartController()
