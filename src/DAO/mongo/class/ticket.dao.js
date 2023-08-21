import { TicketModel } from '../models/ticket.model.js'

class TicketDAO {
  getAllOrders = async () => {
    const tickets = await TicketModel.find({})
    return tickets
  }
  getOrderByCode = async (id) => {
    const ticket = await TicketModel.findOne({ code: id }).populate('products.productId')
    return ticket
  }

  addOrder = async (ticket) => {
    const { code, purchase_datetime, amount, purchaser, products } = ticket
    const newTicket = await TicketModel.create({ code, purchase_datetime, amount, purchaser, products })
    return newTicket
  }
}

export const ticketDAO = new TicketDAO()
