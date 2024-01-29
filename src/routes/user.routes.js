import express from 'express'
import { userController } from '../controllers/user.controller.js'

export const UserRoutes = express.Router()

UserRoutes.get('/', userController.getAllUsers)
UserRoutes.get('/:id', userController.getUserById)
UserRoutes.get('/email/:email', userController.getUserByEmail)
UserRoutes.post('/', userController.saveUser)
UserRoutes.put('/:id', userController.updateUser)
UserRoutes.delete('/:email', userController.deleteUser)
