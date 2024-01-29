import { ticketFactory } from '../DAO/factory.js'
import { isValid } from '../utils/utils.js'

class TicketServices {
  async getTickets() {
    try {
      const tickets = await ticketFactory.getTickets()
      if (!tickets) {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, Tickets not found getTickets`,
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'all tickets',
        payload: tickets,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: `error getting all tickets : getTickets ${error}`,
        payload: {},
      }
    }
  }
  async getTicketById(uid) {
    try {
      isValid(uid)
      const ticketFound = await ticketFactory.getTicketById(uid)
      if (!ticketFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'Ticket not exist getTicketById',
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'ticket found',
        payload: ticketFound,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error getTicketById ${error}`,
        payload: {},
      }
    }
  }
  async getTicketByTicketNumber(ticketNumber) {
    try {
      const ticketFound = await ticketFactory.getTicketByTicketNumber(ticketNumber)
      if (!ticketFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'Ticket not exist getTicketByTicketNumber',
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'ticket found',
        payload: ticketFound,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error getTicketByEmail ${error}`,
        payload: {},
      }
    }
  }
  async getTicketsByCustomerDNI(customerId) {
    try {
      const ticketFound = await ticketFactory.getTicketsByCustomerDNI(customerId)
      if (!ticketFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'Ticket not exist getTicketsByCustomerDNI',
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'ticket found',
        payload: ticketFound,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error getTicketsByCustomerDNI ${error}`,
        payload: {},
      }
    }
  }
  async getTicketsByEmployeeDNI(employeeId) {
    try {
      const ticketFound = await ticketFactory.getTicketsByEmployeeDNI(employeeId)
      if (!ticketFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'Ticket not exist getTicketsByEmployeeDNI',
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'ticket found',
        payload: ticketFound,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error getTicketsByEmployeeDNI ${error}`,
        payload: {},
      }
    }
  }
  async createTicket(ticket) {
    try {
      const newTicket = await ticketFactory.createTicket(ticket)
      if (!newTicket) {
        return {
          status: 'Fail',
          code: 400,
          message: 'ticket created properties are missing or undefined',
          payload: {},
        }
      }
      return {
        status: 'Success',
        code: 201,
        message: 'ticket created',
        payload: newTicket,
      }
    } catch (error) {
      return {
        code: 500,
        status: 'error',
        message: `Error to createTicket: ${error}`,
        payload: {},
      }
    }
  }
  async updateTicket(ticket) {
    try {
      const ticketFound = await ticketFactory.getTicketByTicketNumber(ticket.ticketNumber)
      if (!ticketFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'Ticket not exist : updateTicket',
          payload: {},
        }
      }
      const ticketUpdate = await ticketFactory.updateTicket(ticket)
      if (ticketUpdate.modifiedCount > 0) {
        const responseUpdate = await ticketFactory.getTicketByTicketNumber(ticket.ticketNumber)
        return {
          status: 'success',
          code: 200,
          message: 'ticket update successfully',
          payload: responseUpdate,
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error updateTicket`,
          payload: ticketUpdate,
        }
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error updateTicket : ${error}`,
        payload: {},
      }
    }
  }
  async deleteTicket(id) {
    try {
      const ticket = await ticketFactory.getTicketById(id)
      if (!ticket) {
        return {
          status: 'error',
          code: 404,
          message: 'Ticket not found',
          payload: {},
        }
      }
      const result = await ticketFactory.deleteTicket(id)
      if (result.deletedCount > 0) {
        return {
          status: 'Success',
          code: 204,
          message: 'ticket deleted successfully',
          payload: {},
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, ticket not found deleteTicket`,
          payload: {},
        }
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: `Something went wrong deleteTicket: ${error}`,
        payload: {},
      }
    }
  }
}
export const ticketService = new TicketServices()
