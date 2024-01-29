import { ServiceModel } from '../models/service.model.js'
import { ServiceDTO } from '../../DTO/service.dto.js'

class ServiceDAO {
  async getServiceByID(id) {
    try {
      const service = await ServiceModel.findById(id)
      return service ? new ServiceDTO(service) : null
    } catch (error) {
      throw new Error(`function DAO getserviceByID  ${error}`)
    }
  }
  async getAllServices() {
    try {
      const services = await ServiceModel.find().lean()
      const formattedServices = services.map((service) => (service ? new ServiceDTO(service) : null))
      return formattedServices
    } catch (error) {
      throw new Error(`function DAO getAllservices  ${error}`)
    }
  }
  async createService(dataService) {
    try {
      const result = await ServiceModel.create(dataService)
      return result
    } catch (error) {
      throw new Error(`function DAO createservice ${error}`)
    }
  }
  async deleteService(objectId) {
    try {
      const result = await ServiceModel.deleteOne({ _id: objectId })
      return result
    } catch (error) {
      throw new Error(`function DAO deleteservice ${error}`)
    }
  }
  async updateService(serviceId, dataService) {
    try {
      const result = await ServiceModel.updateOne({ _id: serviceId }, dataService)
      return result
    } catch (error) {
      throw new Error(`function DAO updateService: ${error}`)
    }
  }
}

export const serviceDAO = new ServiceDAO()
