import { cartService } from '../services/cart.services.js'
import { ticketServices } from '../services/ticket.services.js'
import userDTO from '../DAO/DTO/user.DTO.js'

class CartController {
  async createCart(req, res) {
    try {
      const createdCart = await cartService.createCart()
      return res.status(201).json(createdCart)
    } catch (error) {
      return res.status(401).json({ error: `Error ${error}` })
    }
  }
  async addProduct(req, res) {
    const cid = req.params.cid ? req.params.cid : req.session.user.cart
    const pid = req.params.pid
    const quant = req.body
    const resAdd = await cartService.addToCart(cid, pid, quant)
    return res.json(resAdd)
  }
  async deletedProduct(req, res) {
    const cid = req.session.user.cart || req.params.cid
    const pid = req.params.pid
    const resAdd = await cartService.deletedProduct(cid, pid)
    return res.json(resAdd)
  }
  /* async deleteAllProducts(req, res) {
  const cid = req.params.cid
  const resAdd = await cartService.deleteAllProducts(cid)
  return res.json(resAdd)
} */
  async deleteCart(req, res) {
    const cid = req.session.user.cart || req.params.cid
    const resAdd = await cartService.deleteCart(cid)
    return res.json(resAdd)
  }

  async currentCart(req, res) {
    const dataUser = req.session.user.cart
    if (!dataUser) return res.redirect('/api/sessions/login')
    return res.status(200).json(dataUser)
  }

  async getCartId(req, res) {
    const cartId = req.params.cid || req.session.user.cart
    const payload = await cartService.getCartWithProducts(cartId)
    
    /* return res.render('table', {payload}) */
     return res.json(payload)
    
    
  }

  async getAll(req, res) {
    const user = req.session.user
    if (!user) return res.redirect('/api/sessions/login')
    user.isAdmin = user.rol === 'admin'
    if (req.query.isUpdating) {
      return res.status(201).json(user)
    }
    res.render('cart', { user })
  }

  async updateAddToCart(req, res) {
    const cid = req.session.user.cart || req.params.cid
    const pid = req.params.pid
    const quant = req.body.quantity
    const resAdd = await cartService.addToCart(cid, pid, quant)
    return res.json(resAdd)
  }
  async updateCart(req, res) {
    const cid = req.session.user.cart || req.params.cid
    const products = req.body.products
    const resUpdate = await cartService.updateCart(cid, products)
    return res.json(resUpdate)
  }

  purchaseCart = async (req, res) => {
    const id = req.params.cid
    const infoUser = new userDTO(req.session.user)
    const response = await ticketServices.purchaseCart(id, infoUser)
    return res.status(200).json(response)
  }

  getTicketById = async (req, res) => {
    const id = req.params.cid
    const response = await ticketServices.getTicketById(id)
    return res.status(201).json(response)
    /* return res.render('ticket', { ticket: response.result }) */
  }
}
export const cartController = new CartController()
