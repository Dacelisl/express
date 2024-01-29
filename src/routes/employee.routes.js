import express from 'express'
import { employeeController } from '../controllers/employee.controller.js'

export const EmployeeRoutes = express.Router()

EmployeeRoutes.get('/', employeeController.getAllEmployees)
EmployeeRoutes.get('/:id', employeeController.getEmployeeById)
EmployeeRoutes.get('/email/:email', employeeController.getEmployeeByEmail)
EmployeeRoutes.get('/doc/:email', employeeController.getDocuments)
EmployeeRoutes.post('/', employeeController.saveEmployee)
EmployeeRoutes.post('/upload/', employeeController.createDocument)
EmployeeRoutes.put('/:id', employeeController.updateEmployee)
EmployeeRoutes.delete('/:email', employeeController.deleteEmployee)
