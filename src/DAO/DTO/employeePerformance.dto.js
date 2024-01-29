import { formatDate, formatCurrency } from '../../utils/utils.js'

class EmployeePerformanceDTO {
  constructor(employeePerformance) {
    this.employee = this.mapEmployee(employeePerformance.employeeId)
    this.date = formatDate(employeePerformance.date)
    this.totalEarnings = formatCurrency(this.calculateTotalExpectedEarnings(employeePerformance.earningsDetails))
    this.earningsDetails = employeePerformance.earningsDetails.map((detail) => new EarningsDetailDTO(detail))
  }
  mapEmployee(employee) {
    return {
      firstName: employee.firstName,
      lastName: employee.lastName,
    }
  }
  calculateTotalExpectedEarnings(items) {
    return items.reduce((total, detail) => {
      const detailDTO = detail.employeeEarnings
      return total + detailDTO
    }, 0)
  }
}

class EarningsDetailDTO {
  constructor(earningsDetail) {
    this.ticketNumber = earningsDetail.ticketNumber
    this.customer = this.mapCustomer(earningsDetail.customerId)
    this.serviceOrProduct = earningsDetail.serviceOrProduct.name
    this.itemType = earningsDetail.itemType
    this.quantity = earningsDetail.quantity
    this.itemPrice = formatCurrency(earningsDetail.itemPrice)
    this.totalCost = formatCurrency(earningsDetail.totalCost)
    this.employeeEarnings = formatCurrency(earningsDetail.employeeEarnings)
  }
  mapCustomer(customer) {
    return {
      firstName: customer.firstName,
      lastName: customer.lastName,
    }
  }

  /* mapTicket(ticket) {
    return Array.isArray(ticket)
      ? ticket.map((entry) => ({
          ticketNumber: entry.ticketNumber,
          purchaseDate: formatDate(entry.purchaseDate),
          totalPayment: formatCurrency(entry.totalPayment),
        }))
      : []
  } */
  mapServiceOrProduct(sale) {
    return Array.isArray(sale)
      ? sale.map((entry) => ({
          name: entry.name,
          description: entry.description,
        }))
      : {
          name: sale.name,
        }
  }
}

export { EmployeePerformanceDTO, EarningsDetailDTO }
