import express from 'express'
import { roleController } from '../controllers/role.controller.js'

export const RoleRoutes = express.Router()

RoleRoutes.get('/', roleController.getAllRoles)
RoleRoutes.get('/:rid', roleController.getRoleId)
RoleRoutes.post('/', roleController.createRole)
RoleRoutes.put('/:rid', roleController.updateRole)
RoleRoutes.delete('/:rid', roleController.deleteRole)
