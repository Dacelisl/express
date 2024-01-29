import { serviceServices } from '../services/service.services.js'
import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'

class ServiceController {
  async getAllServices(req, res) {
    try {
      const services = await serviceServices.getAllServices()
      return sendSuccessResponse(res, services)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getServiceId(req, res) {
    const serviceId = req.params.sid
    try {
      const serviceFound = await serviceServices.getServiceByID(serviceId)
      return sendSuccessResponse(res, serviceFound)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async createService(req, res) {
    const newService = req.body
    try {
      const response = await serviceServices.createService(newService)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async updateService(req, res) {
    const serviceId = req.params.sid
    const data = req.body
    try {
      const resUpdate = await serviceServices.updateService(serviceId, data)
      return sendSuccessResponse(res, resUpdate)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async deleteService(req, res) {
    const serviceId = req.params.sid
    try {
      const resDelete = await serviceServices.deleteService(serviceId)
      return sendSuccessResponse(res, resDelete)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
}
export const serviceController = new ServiceController()
