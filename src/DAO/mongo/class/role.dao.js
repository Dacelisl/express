import { RoleModel } from '../models/role.model.js'
class RoleDAO { 
  async getAllRoles() {
    try {
      return await RoleModel.find().lean()
    } catch (error) {
      throw new Error(`function DAO getAllRoles  ${error}`)
    }
  }
  async createRole(name, permissions) {
    try {
      const role = await RoleModel.create({
        name,
        permissions,
      })
      return role
    } catch (error) {
      throw new Error(`function DAO createRole ${error}`)
    }
  }
  async getRoleByID(id) {
    try {
      const role = await RoleModel.findById(id)
      return role
    } catch (error) {
      throw new Error(`function DAO getRoleByID  ${error}`)
    }
  }
  async updateRole(roleId, updatedData) {
    try {
      const existingRole = await RoleModel.findById(roleId)
      const existingModulesSet = new Set(existingRole.permissions.map((permission) => permission.module))
      const newPermissions = updatedData.permissions || []
      for (const permission of newPermissions) {
        if (existingModulesSet.has(permission.module)) {
          const existingPermission = existingRole.permissions.find((p) => p.module === permission.module)
          existingPermission.actions = permission.actions
        } else {
          existingRole.permissions.push(permission)
          existingModulesSet.add(permission.module)
        }
      }
      const role = await existingRole.save()
      return role
    } catch (error) {
      throw new Error(`Function DAO updateRole: ${error.message}`)
    }
  }
  async deleteRole(roleId) {
    try {
      return await RoleModel.deleteOne({ _id: roleId })
    } catch (error) {
      throw new Error(`function DAO deleteRole ${error}`)
    }
  }
}
export const roleDAO = new RoleDAO()
