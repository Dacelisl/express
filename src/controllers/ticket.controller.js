import { ticketServices } from '../services/ticket.services.js'
import userDTO from '../DAO/DTO/user.DTO.js'

class TicketController {
  purchaseCart = async (req, res) => {
    try {
      const id = req.params.cid
      const infoUser = new userDTO(req.session.user)
      const response = await ticketServices.purchaseCart(id, infoUser)
      return res.status(response.code).json({
        status: response.status,
        code: response.code,
        message: response.message,
        payload: response.payload,
      })
    } catch (error) {
      req.logger.error('something went wrong purchaseCart', error)
      return res.status(500).json({
        status: 'error',
        message: `Something went wrong :( ${error.message}`,
        payload: {},
      })
    }
  }

  getTicketById = async (req, res) => {
    try {
      const id = req.params.cid
      const response = await ticketServices.getTicketById(id)
      return res.status(response.code).json({
        status: response.status,
        code: response.code,
        message: response.message,
        payload: response.payload,
      })
      /* return res.render('ticket', { ticket: response.result }) */
    } catch (error) {
      req.logger.error('something went wrong getTicketById', error)
      return res.status(500).json({
        status: 'error',
        message: `Something went wrong :( ${error.message}`,
        payload: {},
      })
    }
  }
  getTicketByCode = async (req, res) => {
    try {
      const code = req.params.cid
      const response = await ticketServices.getTicketByCode(code)
      console.log('data ticket', response)
      return res.status(response.code).json({
        status: response.status,
        code: response.code,
        message: response.message,
        payload: response.payload,
      })
    } catch (error) {
      req.logger.error('something went wrong getTicketByCode', error)
      return res.status(500).json({
        status: 'error',
        message: `Something went wrong :( ${error.message}`,
        payload: {},
      })
    }
  }
  async deleteTicket(req, res) {
    try {
      const code = req.params.cid
      const response = await ticketServices.deleteTicket(code)
      return res.status(response.code).json({
        status: response.status,
        code: response.code,
        message: response.message,
        payload: response.payload,
      })
    } catch (error) {
      req.logger.error('something went wrong deleteTicket', error)
      return res.status(500).json({
        status: 'error',
        message: `Something went wrong :( ${error.message}`,
        payload: {},
      })
    }
  }
}
export const ticketController = new TicketController()
