import { ticketServices } from '../services/ticket.services.js'
import userDTO from '../DAO/DTO/user.DTO.js'
import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'

class TicketController {
  purchaseCart = async (req, res) => {
    try {
      const id = req.params.cid
      const infoUser = new userDTO(req.session.user)
      const response = await ticketServices.purchaseCart(id, infoUser)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error('something went wrong purchaseCart', error)
      return sendErrorResponse(res, error)
    }
  }
  getTicketById = async (req, res) => {
    try {
      const id = req.params.cid
      const response = await ticketServices.getTicketById(id)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error('something went wrong getTicketById', error)
      return sendErrorResponse(res, error)
    }
  }
  getTicketByCode = async (req, res) => {
    try {
      const code = req.params.cid
      const response = await ticketServices.getTicketByCode(code)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error('something went wrong getTicketByCode', error)
      return sendErrorResponse(res, error)
    }
  }
  async deleteTicket(req, res) {
    try {
      const code = req.params.cid
      const response = await ticketServices.deleteTicket(code)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error('something went wrong deleteTicket', error)
      return sendErrorResponse(res, error)
    }
  }
}
export const ticketController = new TicketController()
