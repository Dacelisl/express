import { ticketService } from '../services/ticket.services.js'

import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'

class TicketController {
  async getTickets(req, res) {
    try {
      const tickets = await ticketService.getTickets()
      return sendSuccessResponse(res, tickets)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getTicketById(req, res) {
    const ticketId = req.params.tid
    try {
      const response = await ticketService.getTicketById(ticketId)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getTicketByTicketNumber(req, res) {
    const ticketNum = req.params.tnum
    try {
      const response = await ticketService.getTicketByTicketNumber(parseInt(ticketNum))
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getTicketsByCustomerDNI(req, res) {
    const ticketCustomer = req.params.cid
    console.log('customr', ticketCustomer);
    try {
      const response = await ticketService.getTicketsByCustomerDNI(ticketCustomer)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getTicketsByEmployeeDNI(req, res) {
    const ticketEmployee = req.params.eid
    try {
      const response = await ticketService.getTicketsByEmployeeDNI(ticketEmployee)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async createTicket(req, res) {
    const newTicket = req.body
    try {
      const response = await ticketService.createTicket(newTicket)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async updateTicket(req, res) {
    const data = req.body
    try {
      const resUpdate = await ticketService.updateTicket(data)
      return sendSuccessResponse(res, resUpdate)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async deleteTicket(req, res) {
    try {
      const ticketId = req.params.tid
      const response = await ticketService.deleteTicket(ticketId)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
}
export const ticketController = new TicketController()
