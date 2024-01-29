import dataConfig from '../config/process.config.js'
import { connectMongo } from '../utils/connectMongo.js'

export let employeeFactory, productFactory, employeePerformanceFactory, userFactory, expenseFactory, chatFactory, serviceFactory, roleFactory, ticketFactory, recoveryCodeFactory

switch (dataConfig.persistence) {
  case 'mongo':
    connectMongo()
    const { employeeDAO } = await import('./mongo/class/employee.dao.js')
    employeeFactory = employeeDAO
    const { employeePerformanceDAO } = await import('./mongo/class/employeePerformance.dao.js')
    employeePerformanceFactory = employeePerformanceDAO
    const { expenseDAO } = await import('./mongo/class/expense.dao.js')
    expenseFactory = expenseDAO
    const { productDAO } = await import('./mongo/class/product.dao.js')
    productFactory = productDAO
    const { roleDAO } = await import('./mongo/class/role.dao.js')
    roleFactory = roleDAO
    const { userDAO } = await import('./mongo/class/user.dao.js')
    userFactory = userDAO
    const { serviceDAO } = await import('./mongo/class/service.dao.js')
    serviceFactory = serviceDAO
    const { chatDAO } = await import('./mongo/class/chat.dao.js')
    chatFactory = chatDAO
    const { ticketDAO } = await import('./mongo/class/ticket.dao.js')
    ticketFactory = ticketDAO
    const { RecoveryCodesDAO } = await import('./mongo/class/recoveryCodes.dao.js')
    recoveryCodeFactory = RecoveryCodesDAO
    break
  default:
    break
}
