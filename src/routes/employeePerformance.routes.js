import express from 'express'
import { employeePerformanceController } from '../controllers/employeePerformance.controller.js'
export const EmployeePerformanceRoutes = express.Router()

EmployeePerformanceRoutes.get('/', employeePerformanceController.getAllEmployeePerformances)
EmployeePerformanceRoutes.get('/:tid', employeePerformanceController.getEmployeePerformanceById)
EmployeePerformanceRoutes.get('/employeePerformance/:tnum', employeePerformanceController.getEmployeePerformanceByEmployeePerformanceNumber)
EmployeePerformanceRoutes.get('/customer/:cid', employeePerformanceController.getEmployeePerformancesByCustomerDNI)
EmployeePerformanceRoutes.get('/employee/:eid', employeePerformanceController.getEmployeePerformancesByEmployeeDNI)
/* EmployeePerformanceRoutes.post('/', employeePerformanceController.createEmployeePerformance) */
EmployeePerformanceRoutes.put('/:tid', employeePerformanceController.updateEmployeePerformance)
EmployeePerformanceRoutes.delete('/:tid', employeePerformanceController.deleteEmployeePerformance)
