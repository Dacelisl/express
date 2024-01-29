import { formatDate, formatCurrency } from '../../utils/utils.js'
class TicketDTO {
  constructor(ticket) {
    this.ticketNumber = ticket.ticketNumber
    this.purchaseDate = formatDate(ticket.purchaseDate)
    this.customer = this.mapCustomer(ticket.customerId)
    this.employee = this.mapEmployee(ticket.employeeId)
    this.items = ticket.items.map((item) => new ItemDetailDTO(item))
    this.paymentMethod = ticket.paymentMethod
    this.totalPayment = formatCurrency(ticket.totalPayment)
  }

  mapEmployee(employee) {
    return {
      firstName: employee.firstName,
      lastName: employee.lastName,
    }
  }
  mapCustomer(customer) {
    return {
      firstName: customer.firstName,
      lastName: customer.lastName,
    }
  }
}

class ItemDetailDTO {
  constructor(itemDetail) {
    this.itemId = itemDetail.itemId
    this.name = itemDetail.name
    this.itemType = itemDetail.itemType
    this.quantity = itemDetail.quantity
    this.itemPrice = formatCurrency(itemDetail.itemPrice)
    this.profitPercentage = itemDetail.profitPercentage
  }
}

export { TicketDTO, ItemDetailDTO }
