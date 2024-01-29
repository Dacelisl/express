import { roleService } from '../services/role.services.js'
import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'

class RoleController {
  async getAllRoles(req, res) {
    try {
      const roles = await roleService.getAllRoles()
      return sendSuccessResponse(res, roles)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getRoleId(req, res) {
    const roleId = req.params.rid
    try {
      const roleFound = await roleService.getRoleByID(roleId)
      return sendSuccessResponse(res, roleFound)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async createRole(req, res) {
    const { name, permissions } = req.body
    try {
      const response = await roleService.createRole(name, permissions)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async updateRole(req, res) {
    const roleId = req.params.rid
    const data = req.body
    try {
      const resUpdate = await roleService.updateRole(roleId, data)
      return sendSuccessResponse(res, resUpdate)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async deleteRole(req, res) {
    const roleId = req.params.rid
    try {
      const resDelete = await roleService.deleteRole(roleId)
      return sendSuccessResponse(res, resDelete)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
}
export const roleController = new RoleController()
