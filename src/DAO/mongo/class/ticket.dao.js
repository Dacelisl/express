import { TicketModel } from '../models/ticket.model.js'
import { ProductModel } from '../models/product.model.js'
import { ServiceModel } from '../models/service.model.js'
import { employeePerformanceDAO } from '../class/employeePerformance.dao.js'
import { TicketDTO } from '../../DTO/ticket.dto.js'
import { totalPrice } from '../../../utils/utils.js'

class TicketDAO {
  async getTickets() {
    try {
      let tickets = await TicketModel.find().populate('customerId', 'firstName lastName').populate('employeeId', 'firstName lastName').lean()

      tickets = await Promise.all(
        tickets.map(async (ticket) => {
          const items = await this.mapItemNames(ticket.items)
          return { ...ticket, items }
        })
      )

      const formattedTickets = tickets.map((ticket) => (ticket ? new TicketDTO(ticket) : null))
      return formattedTickets
    } catch (error) {
      throw new Error(`function DAO getTickets: ${error}`)
    }
  }
  async getTicketById(id) {
    try {
      let tickets = await TicketModel.findById(id).populate('customerId', 'firstName lastName email').populate('employeeId', 'firstName lastName email').lean()

      tickets.items = await this.mapItemNames(tickets.items)

      return tickets ? new TicketDTO(tickets) : null
    } catch (error) {
      throw new Error(`function DAO getTicketById  ${error}`)
    }
  }
  async getTicketByTicketNumber(ticketNumber) {
    try {
      let ticket = await TicketModel.findOne({ ticketNumber }).populate('customerId', 'firstName lastName email').populate('employeeId', 'firstName lastName email').lean()

      ticket.items = await this.mapItemNames(ticket.items)

      return ticket ? new TicketDTO(ticket) : null
    } catch (error) {
      throw new Error(`function DAO getTicketByTicketNumber  ${error}`)
    }
  }
  async getTicketsByCustomerDNI(customerId) {
    try {
      let tickets = await TicketModel.find({ customerId }).populate('customerId', 'firstName lastName email').populate('employeeId', 'firstName lastName email').lean()

      tickets = await Promise.all(
        tickets.map(async (ticket) => {
          const items = await this.mapItemNames(ticket.items)
          return { ...ticket, items }
        })
      )
      const formattedTickets = tickets.map((ticket) => (ticket ? new TicketDTO(ticket) : null))
      return formattedTickets
    } catch (error) {
      throw new Error(`function DAO getTicketByCustomerDNI  ${error}`)
    }
  }
  async getTicketsByEmployeeDNI(employeeId) {
    try {
      let tickets = await TicketModel.find({ employeeId }).populate('customerId', 'firstName lastName email').populate('employeeId', 'firstName lastName email').lean()
      tickets = await Promise.all(
        tickets.map(async (ticket) => {
          const items = await this.mapItemNames(ticket.items)
          return { ...ticket, items }
        })
      )
      const formattedTickets = tickets.map((ticket) => (ticket ? new TicketDTO(ticket) : null))
      return formattedTickets
    } catch (error) {
      throw new Error(`function DAO getTicketByEmployeeDNI  ${error}`)
    }
  }
  async createTicket(ticketData) {
    try {
      let ticket = totalPrice(ticketData)
      ticket.items = await this.mapItemNames(ticket.items)
      await employeePerformanceDAO.createEmployeePerformance(ticket)
      const result = await TicketModel.create(ticket)
      return result
    } catch (error) {
      throw new Error(`function DAO createTicket  ${error}`)
    }
  }
  async deleteTicket(id) {
    try {
      const result = await TicketModel.deleteOne({ _id: id })
      return result
    } catch (error) {
      throw new Error(`function DAO deleteTicketById  ${error}`)
    }
  }
  async updateTicket(updatedData) {
    try {
      const ticketNumber = updatedData.ticketNumber
      const itemsToUpdate = updatedData.items || []
      // Eliminar elementos existentes del array por su itemId
      await TicketModel.updateOne({ ticketNumber }, { $pull: { items: { itemId: { $in: itemsToUpdate.map((item) => item.itemId) } } } })
      // Obtener el ticket actual para calcular el totalPayment existente
      const existingTicket = await TicketModel.findOne({ ticketNumber })
      if (!existingTicket) {
        throw new Error(`Ticket not found for ticketNumber: ${ticketNumber}`)
      }
      // Calcular el totalPayment existente
      const existingTotalPayment = existingTicket.items.reduce((total, item) => total + item.itemPrice, 0)
      // Calcular el totalPayment actualizado
      const updatedTotalPayment = existingTotalPayment + itemsToUpdate.reduce((total, item) => total + item.itemPrice, 0)
      // Actualizar el ticket con los nuevos elementos y el totalPayment actualizado
      const result = await TicketModel.updateOne(
        { ticketNumber },
        {
          $set: {
            ticketNumber,
            purchaseDate: updatedData.purchaseDate,
            customerId: updatedData.customerId,
            employeeId: updatedData.employeeId,
            paymentMethod: updatedData.paymentMethod,
            totalPayment: updatedTotalPayment,
          },
          $push: { items: { $each: itemsToUpdate } },
        },
        { upsert: true }
      )
      return result
    } catch (error) {
      throw new Error(`function DAO updateTicket ${error}`)
    }
  }

  async mapItemNames(items) {
    return Promise.all(
      items.map(async (item) => {
        if (item.itemType === 'service') {
          const service = await ServiceModel.findById(item.itemId)
          item.itemId = service ? service._id : null
          item.name = service ? service.name : null
          item.profitPercentage = service ? service.profitPercentage : null
        } else {
          const product = await ProductModel.findById(item.itemId)
          item.itemId = product ? product._id : null
          item.name = product ? product.name : null
          item.profitPercentage = product ? product.profitPercentage : null
        }
        return item
      })
    )
  }
}
export const ticketDAO = new TicketDAO()
