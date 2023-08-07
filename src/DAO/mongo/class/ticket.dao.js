import { TicketModel } from '../models/ticket.model.js'

class TicketDAO {
  getAll = async () => {
    const tickets = await TicketModel.find({})
    return tickets
  }
  getById = async (id) => {
    const ticket = await TicketModel.findById(id).lean()
    return ticket
  }

  add = async (ticket) => {
    const newTicket = await TicketModel.create(ticket)
    return newTicket
  }
}

export const ticketDAO = new TicketDAO()
