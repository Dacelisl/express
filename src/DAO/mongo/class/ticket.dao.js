import { TicketModel } from '../models/ticket.model.js'

class TicketDAO {
  getAllOrders = async () => {
    const tickets = await TicketModel.find({})
    return tickets
  }
  getOrderById = async (id) => {
    const ticket = await TicketModel.findById(id).lean()
    return ticket
  }

  addOrder = async (ticket) => {
    const { code, purchase_datetime, amount, purchaser, products } = ticket
    const newTicket = await TicketModel.create({ code, purchase_datetime, amount, purchaser, products })
    return newTicket
  }
}

export const ticketDAO = new TicketDAO()
