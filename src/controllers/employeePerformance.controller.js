import { employeePerformanceService } from '../services/employeePerformance.services.js'

import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'

class EmployeePerformanceController {
  async getAllEmployeePerformances(req, res) {
    try {
      const employeePerformances = await employeePerformanceService.getAllEmployeePerformances()
      return sendSuccessResponse(res, employeePerformances)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getEmployeePerformanceById(req, res) {
    const employeePerformanceId = req.params.tid
    try {
      const response = await employeePerformanceService.getemployeePerformanceById(employeePerformanceId)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getEmployeePerformanceByEmployeePerformanceNumber(req, res) {
    const employeePerformanceNum = req.params.tnum
    try {
      const response = await employeePerformanceService.getemployeePerformanceByemployeePerformanceNumber(parseInt(employeePerformanceNum))
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getEmployeePerformancesByCustomerDNI(req, res) {
    const employeePerformanceCustomer = req.params.cid
    try {
      const response = await employeePerformanceService.getemployeePerformancesByCustomerDNI(employeePerformanceCustomer)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getEmployeePerformancesByEmployeeDNI(req, res) {
    const employeePerformanceEmployee = req.params.eid
    try {
      const response = await employeePerformanceService.getemployeePerformancesByEmployeeDNI(employeePerformanceEmployee)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async updateEmployeePerformance(req, res) {
    const data = req.body
    try {
      const resUpdate = await employeePerformanceService.updateEmployeePerformance(data)
      return sendSuccessResponse(res, resUpdate)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async deleteEmployeePerformance(req, res) {
    try {
      const employeePerformanceId = req.params.tid
      const response = await employeePerformanceService.deleteemployeePerformance(employeePerformanceId)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
}
export const employeePerformanceController = new EmployeePerformanceController()
