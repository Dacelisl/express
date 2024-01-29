import { employeeFactory } from '../DAO/factory.js'
import { isValid } from '../utils/utils.js'
import dataConfig from '../config/process.config.js'

class EmployeeServices {
  validateEmployee(dataEmployee) {
    const requiredProperties = ['firstName', 'lastName', 'dni', 'password', 'phone', 'address', 'email', 'dateBirthday', 'role']
    const missingProperties = requiredProperties.filter((property) => {
      return !(property in dataEmployee) || dataEmployee[property] === undefined
    })
    if (missingProperties.length > 0) {
      throw new Error(`Validation error: Missing or undefined properties ${missingProperties}`)
    }
    return true
  }
  async getAllEmployees() {
    try {
      const employees = await employeeFactory.getAllEmployees()
      if (!employees) {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, Employees not found getAllEmployees`,
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'all employees',
        payload: employees,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: `Error getAllEmployees: ${error}`,
        payload: {},
      }
    }
  }
  async getEmployeeById(uid) {
    try {
      isValid(uid)
      const employeeFound = await employeeFactory.getEmployeeById(uid)
      if (!employeeFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'Employee not exist getEmployeeById',
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'employee found',
        payload: employeeFound,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error getEmployeeById: ${error}`,
        payload: {},
      }
    }
  }
  async getEmployeeByEmail(mail) {
    try {
      const employeeFound = await employeeFactory.getEmployeeByEmail(mail)
      if (!employeeFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'Employee not exist getEmployeeByEmail',
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'employee found',
        payload: employeeFound,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error getEmployeeById ${error}`,
        payload: {},
      }
    }
  }
  async saveEmployee(employee) {
    try {
      this.validateEmployee(employee)
      const newEmployee = await employeeFactory.saveEmployee(employee)
      if (!newEmployee) {
        return {
          status: 'Fail',
          code: 400,
          message: 'employee created properties are missing or undefined',
          payload: {},
        }
      }
      return {
        status: 'Success',
        code: 201,
        message: 'employee created',
        payload: newEmployee,
      }
    } catch (error) {
      return {
        code: 500,
        status: 'error',
        message: `Error to saveEmployee: ${error}`,
        payload: {},
      }
    }
  }
  async updateEmployee(employee) {
    try {
      const employeeFound = await employeeFactory.getEmployeeByEmail(employee.email)
      if (!employeeFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'Employee not exist : updateEmployee',
          payload: {},
        }
      }
      const employeeUpdate = await employeeFactory.updateEmployee(employee)
      if (employeeUpdate.modifiedCount > 0) {
        const employee = await employeeFactory.getEmployeeByEmail(employee.email)
        return {
          status: 'success',
          code: 200,
          message: 'employee update successfully',
          payload: employee,
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error updateEmployee`,
          payload: employeeUpdate,
        }
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error updateEmployee : ${error}`,
        payload: {},
      }
    }
  }
  async deleteEmployee(employeeMail) {
    try {
      const employee = await employeeFactory.getEmployeeByEmail(employeeMail)
      if (!employee) {
        return {
          status: 'error',
          code: 404,
          message: 'Employee not found',
          payload: {},
        }
      }
      const result = await employeeFactory.deleteEmployee(employee.email)
      if (result.deletedCount > 0) {
        return {
          status: 'Success',
          code: 204,
          message: 'employee deleted successfully',
          payload: result,
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, employee not found deleteEmployee`,
          payload: {},
        }
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: `Something went wrong deleteEmployee: ${error}`,
        payload: {},
      }
    }
  }

  /* async createDocument(file, imageType, uid) {
    const esEmail = /\S+@\S+\.\S+/.test(uid)
    let employee = uid
    try {
      if (esEmail) {
        const employeeRes = await employeeFactory.getEmployeeByEmail(uid)
        employee = employeeRes._id
      }
      const reference = file.path
      const base = reference.match(/\\image\\(.*)/)
      const path = `http://localhost:${dataConfig.port}${base[0]}`
      const nuevoDocumento = {
        name: file.filename,
        type: imageType,
        reference: path,
      }
      await employeeFactory.loadDocument({ _id: employee }, { documents: nuevoDocumento })
      return {
        status: 'success',
        code: 201,
        message: 'uploading file',
        payload: nuevoDocumento,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        payload: {},
        message: `Error createDocument`,
      }
    }
  }
  async switchEmployeeRole(employee) {
    const documentosUsuario = employee.documents.map((documento) => documento.type)
    const tiposDocumentosRequeridos = ['DNI', 'proofAddress', 'accountStatus']
    const tieneTodosLosDocumentos = tiposDocumentosRequeridos.every((tipo) => documentosUsuario.includes(tipo))

    if (tieneTodosLosDocumentos) {
      const updatedEmployee = await employeeFactory.updateEmployee(employee._id, {
        rol: employee.rol === 'employee' ? 'premium' : 'employee',
      })
      if (updatedEmployee.acknowledged) {
        const employeeUpdate = await this.getEmployeeById(employee._id)
        return {
          status: 'success',
          code: 200,
          message: 'update employee role',
          payload: employeeUpdate,
        }
      } else {
        return {
          status: 'error',
          code: 500,
          message: 'Failed to update employee role',
          payload: {},
        }
      }
    } else {
      return {
        status: 'error',
        code: 400,
        message: 'The employee does not have all the specified document types',
        payload: {},
      }
    }
  } */
}
export const employeeService = new EmployeeServices()
