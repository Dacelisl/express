import { roleFactory } from '../DAO/factory.js'
import { isValid } from '../utils/utils.js'

class RoleServices {
  async getAllRoles() {
    try {
      const payload = await roleFactory.getAllRoles()
      if (!payload) {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, role not found getAllRoles`,
          payload: {},
        }
      }
      return {
        status: 'Success',
        code: 200,
        message: 'role found getAllRoles',
        payload: payload,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Internal Server Error getAllRoles`,
        payload: {},
      }
    }
  }
  async getRoleByID(_id) {
    try {
      isValid(_id)
      const payload = await roleFactory.getRoleByID(_id)
      if (payload) {
        return {
          status: 'Success',
          code: 200,
          message: 'role found',
          payload: payload,
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, role not found getRoleByID`,
          payload: {},
        }
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Internal Server Error getRoleByID`,
        payload: {},
      }
    }
  }
  async createRole(name, permissions) {
    try {
      const newRole = await roleFactory.createRole(name, permissions)
      if (!newRole) {
        return {
          status: 'Fail',
          code: 400,
          message: 'Role created properties are missing or undefined',
          payload: {},
        }
      }
      return {
        status: 'Success',
        code: 200,
        message: 'Role created',
        payload: newRole,
      }
    } catch (error) {
      return {
        code: 500,
        status: 'error',
        message: `Error to save createRole: ${error.message}`,
        payload: {},
      }
    }
  }
  async updateRole(roleId, updatedData) {
    try {
      const roleFound = await roleFactory.getRoleByID(roleId)
      if (!roleFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'role not exist updateRole',
          payload: {},
        }
      }
      const updateRole = await roleFactory.updateRole(roleId, updatedData)
      if (updateRole) {
        return {
          status: 'Success',
          code: 200,
          message: 'role update successfully',
          payload: updateRole,
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error updateRole`,
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
  async deleteRole(roleId) {
    try {
      const roleFound = await roleFactory.getRoleByID(roleId)
      if (!roleFound) {
        return {
          status: 'error',
          code: 404,
          message: 'role not found',
          payload: {},
        }
      }
      const deleted = await roleFactory.deleteRole(roleId)
      if (deleted.deletedCount > 0) {
        return {
          status: 'Success',
          code: 204,
          message: 'removed role',
          payload: {},
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, role not found deleteRole`,
          payload: {},
        }
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: `Something went wrong deleteRole:( ${error}`,
        payload: {},
      }
    }
  }
}
export const roleService = new RoleServices()
