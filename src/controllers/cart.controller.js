import { cartService } from '../services/cart.services.js'
import { ticketServices } from '../services/ticket.services.js'
import userDTO from '../DAO/DTO/user.DTO.js'

class CartController {
  async createCart(req, res) {
    try {
      const createdCart = await cartService.createCart()
      return res.status(201).json(createdCart)
    } catch (error) {
      req.logger.error('something went wrong createCart', error)
      return res.status(401).json({ error: `Error ${error}` })
    }
  }
  async addProduct(req, res) {
    try {
      const cid = req.params.cid ? req.params.cid : req.session.user.cart
      const pid = req.params.pid
      const quant = req.body
      const resAdd = await cartService.addToCart(cid, pid, quant)
      return res.json(resAdd)
    } catch (error) {
      req.logger.error('something went wrong addProduct', error)
    }
  }
  async deletedProduct(req, res) {
    try {
      const cid = req.session.user.cart || req.params.cid
      const pid = req.params.pid
      const resAdd = await cartService.deletedProduct(cid, pid)
      return res.json(resAdd)
    } catch (error) {
      req.logger.error('something went wrong deletedProduct', error)
    }
  }
  /* async deleteAllProducts(req, res) {
  const cid = req.params.cid
  const resAdd = await cartService.deleteAllProducts(cid)
  return res.json(resAdd)
} */
  async deleteCart(req, res) {
    try {
      const cid = req.session.user.cart || req.params.cid
      const resAdd = await cartService.deleteCart(cid)
      return res.json(resAdd)
    } catch (error) {
      req.logger.error('something went wrong deleteCart', error)
    }
  }

  async currentCart(req, res) {
    try {
      const dataUser = req.session.user.cart
      if (!dataUser) return res.redirect('/api/sessions/login')
      return res.status(200).json(dataUser)
    } catch (error) {
      req.logger.error('something went wrong currentCart', error)
    }
  }

  async getCartId(req, res) {
    try {
      const cartId = req.params.cid || req.session.user.cart
      const payload = await cartService.getCartWithProducts(cartId)
      /* return res.render('table', {payload}) */
      return res.json(payload)
    } catch (error) {
      req.logger.error('something went wrong getCartId', error)
    }
  }

  async getAll(req, res) {
    try {
      const user = req.session.user
      if (!user) return res.redirect('/api/sessions/login')
      user.isAdmin = user.rol === 'admin'
      if (req.query.isUpdating) {
        return res.status(201).json(user)
      }
      res.render('cart', { user })
    } catch (error) {
      req.logger.error('something went wrong getAll', error)
    }
  }

  async updateAddToCart(req, res) {
    try {
      const cid = req.session.user.cart || req.params.cid
      const pid = req.params.pid
      const quant = req.body.quantity
      const resAdd = await cartService.addToCart(cid, pid, quant)
      return res.json(resAdd)
    } catch (error) {
      req.logger.error('something went wrong updateAddToCart', error)
    }
  }
  async updateCart(req, res) {
    try {
      const cid = req.session.user.cart || req.params.cid
      const products = req.body.products
      const resUpdate = await cartService.updateCart(cid, products)
      return res.json(resUpdate)
    } catch (error) {
      req.logger.error('something went wrong updateCart', error)
    }
  }

  purchaseCart = async (req, res) => {
    try {
      const id = req.params.cid
      const infoUser = new userDTO(req.session.user)
      const response = await ticketServices.purchaseCart(id, infoUser)
      return res.status(200).json(response)
    } catch (error) {
      req.logger.error('something went wrong purchaseCart', error)
    }
  }

  getTicketById = async (req, res) => {
    try {
      const id = req.params.cid
      const response = await ticketServices.getTicketById(id)
      return res.status(201).json(response)
      /* return res.render('ticket', { ticket: response.result }) */
    } catch (error) {
      req.logger.error('something went wrong getTicketById', error)
    }
  }
}
export const cartController = new CartController()
