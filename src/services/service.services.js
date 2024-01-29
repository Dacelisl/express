import { serviceFactory } from '../DAO/factory.js'
import { isValid } from '../utils/utils.js'

class ServiceServices {
  async getAllServices() {
    try {
      const payload = await serviceFactory.getAllServices()
      if (!payload) {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, service not found getAllServices`,
          payload: {},
        }
      }
      return {
        status: 'Success',
        code: 200,
        message: 'service found getAllServices',
        payload: payload,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Internal Server Error getAllServices ${error}`,
        payload: {},
      }
    }
  }
  async getServiceByID(_id) {
    try {
      isValid(_id)
      const payload = await serviceFactory.getServiceByID(_id)
      if (payload) {
        return {
          status: 'Success',
          code: 200,
          message: 'service found',
          payload: payload,
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, service not found getServiceByID`,
          payload: {},
        }
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Internal Server Error getServiceByID ${error}`,
        payload: {},
      }
    }
  }
  async createService(dataService) {
    try {
      const newService = await serviceFactory.createService(dataService)
      if (!newService) {
        return {
          status: 'Fail',
          code: 400,
          message: 'Service created properties are missing or undefined',
          payload: {},
        }
      }
      return {
        status: 'Success',
        code: 201,
        message: 'Service created',
        payload: newService,
      }
    } catch (error) {
      return {
        code: 500,
        status: 'error',
        message: `Error to save createService: ${error.message}`,
        payload: {},
      }
    }
  }
  async updateService(serviceId, updatedData) {
    try {
      const serviceFound = await serviceFactory.getServiceByID(serviceId)
      if (!serviceFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'service not exist updateService',
          payload: {},
        }
      }
      const updateService = await serviceFactory.updateService(serviceId, updatedData)
      if (updateService.modifiedCount >0) {
        const serviceUpdate = await serviceFactory.getServiceByID(serviceId)
        return {
          status: 'Success',
          code: 200,
          message: 'service update successfully',
          payload: serviceUpdate,
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error updateService`,
          payload: {},
        }
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Something went wrong :( ${error}`,
        payload: {},
      }
    }
  }
  async deleteService(serviceId) {
    try {
      const serviceFound = await serviceFactory.getServiceByID(serviceId)
      if (!serviceFound) {
        return {
          status: 'error',
          code: 404,
          message: 'service not found',
          payload: {},
        }
      }
      const deleted = await serviceFactory.deleteService(serviceId)
      if (deleted.deletedCount > 0) {
        return {
          status: 'Success',
          code: 204,
          message: 'removed service',
          payload: {},
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, service not found deleteService`,
          payload: {},
        }
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: `Something went wrong deleteService:( ${error}`,
        payload: {},
      }
    }
  }
}
export const serviceServices = new ServiceServices()
