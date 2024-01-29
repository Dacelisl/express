class EmployeePerformanceSaveDTO {
  constructor(employeePerformance) {
    this.employeeId = employeePerformance.employeeId
    this.earningsDetails = employeePerformance.items.map((detail) => new EarningsDetailSaveDTO(detail, employeePerformance.ticketNumber, employeePerformance.customerId))
  }
}
class EarningsDetailSaveDTO {
  constructor(earningsDetail, ticketNumber, customerId) {
    this.ticketNumber = ticketNumber
    this.customerId = customerId
    this.serviceOrProduct = earningsDetail.name
    this.itemType = earningsDetail.itemType
    this.quantity = earningsDetail.quantity
    this.itemPrice = earningsDetail.itemPrice
    this.totalCost = earningsDetail.itemPrice * earningsDetail.quantity
    this.employeeEarnings = this.employeeEarning(earningsDetail)
  }
  employeeEarning(sale) {
    let total = sale.itemPrice * sale.quantity
    let employeeTotal = total * (sale.profitPercentage / 100)
    return employeeTotal
  }
}

export { EmployeePerformanceSaveDTO, EarningsDetailSaveDTO }
