import { employeePerformanceFactory } from '../DAO/factory.js'
import { isValid } from '../utils/utils.js'

class EmployeePerformanceServices {
  async getAllEmployeePerformances() {
    try { 
      const employeePerformances = await employeePerformanceFactory.getAllEmployeePerformances()
      if (!employeePerformances) {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, getAllEmployeePerformances not found getAllEmployeePerformances`,
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'all employeePerformances',
        payload: employeePerformances,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: `error getting all employeePerformances : getEmployeePerformances ${error}`,
        payload: {},
      }
    }
  }
  async getEmployeePerformanceById(uid) {
    try {
      isValid(uid)
      const employeePerformanceFound = await employeePerformanceFactory.getEmployeePerformanceById(uid)
      if (!employeePerformanceFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'EmployeePerformance not exist getEmployeePerformanceById',
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'employeePerformance found',
        payload: employeePerformanceFound,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error getEmployeePerformanceById ${error}`,
        payload: {},
      }
    }
  }
  async getEmployeePerformanceByEmployeePerformanceNumber(employeePerformanceNumber) {
    try {
      const employeePerformanceFound = await employeePerformanceFactory.getEmployeePerformanceByEmployeePerformanceNumber(employeePerformanceNumber)
      if (!employeePerformanceFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'EmployeePerformance not exist getEmployeePerformanceByEmployeePerformanceNumber',
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'employeePerformance found',
        payload: employeePerformanceFound,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error getEmployeePerformanceByEmail ${error}`,
        payload: {},
      }
    }
  }
  async getEmployeePerformancesByCustomerDNI(customerId) {
    try {
      const employeePerformanceFound = await employeePerformanceFactory.getEmployeePerformancesByCustomerDNI(customerId)
      if (!employeePerformanceFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'EmployeePerformance not exist getEmployeePerformancesByCustomerDNI',
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'employeePerformance found',
        payload: employeePerformanceFound,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error getEmployeePerformancesByCustomerDNI ${error}`,
        payload: {},
      }
    }
  }
  async getEmployeePerformancesByEmployeeDNI(employeeId) {
    try {
      const employeePerformanceFound = await employeePerformanceFactory.getEmployeePerformancesByEmployeeDNI(employeeId)
      if (!employeePerformanceFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'EmployeePerformance not exist getEmployeePerformancesByEmployeeDNI',
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'employeePerformance found',
        payload: employeePerformanceFound,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error getEmployeePerformancesByEmployeeDNI ${error}`,
        payload: {},
      }
    }
  }
  async updateEmployeePerformance(employeePerformance) {
    try {
      const employeePerformanceFound = await employeePerformanceFactory.getEmployeePerformanceByEmployeePerformanceNumber(employeePerformance.employeePerformanceNumber)
      if (!employeePerformanceFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'EmployeePerformance not exist : updateEmployeePerformance',
          payload: {},
        }
      }
      const employeePerformanceUpdate = await employeePerformanceFactory.updateEmployeePerformance(employeePerformance)
      if (employeePerformanceUpdate.modifiedCount > 0) {
        const responseUpdate = await employeePerformanceFactory.getEmployeePerformanceByEmployeePerformanceNumber(employeePerformance.employeePerformanceNumber)
        return {
          status: 'success',
          code: 200,
          message: 'employeePerformance update successfully',
          payload: responseUpdate,
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error updateEmployeePerformance`,
          payload: employeePerformanceUpdate,
        }
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error updateEmployeePerformance : ${error}`,
        payload: {},
      }
    }
  }
  async deleteEmployeePerformance(id) {
    try {
      const employeePerformance = await employeePerformanceFactory.getEmployeePerformanceById(id)
      if (!employeePerformance) {
        return {
          status: 'error',
          code: 404,
          message: 'EmployeePerformance not found',
          payload: {},
        }
      }
      const result = await employeePerformanceFactory.deleteEmployeePerformance(id)
      if (result.deletedCount > 0) {
        return {
          status: 'Success',
          code: 204,
          message: 'employeePerformance deleted successfully',
          payload: {},
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, employeePerformance not found deleteEmployeePerformance`,
          payload: {},
        }
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: `Something went wrong deleteEmployeePerformance: ${error}`,
        payload: {},
      }
    }
  }
}
export const employeePerformanceService = new EmployeePerformanceServices()
