import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'
import { userService } from '../services/user.services.js'

class UserController {
  async getAllUsers(req, res) {
    try {
      const response = await userService.getAllUsers()
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getUserById(req, res) {
    const userId = req.params.id
    try {
      const user = await userService.getUserById(userId)
      return sendSuccessResponse(res, user)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async getUserByEmail(req, res) {
    const userEmail = req.params.email
    try {
      const user = await userService.getUserByEmail(userEmail)
      return sendSuccessResponse(res, user)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async saveUser(req, res) {
    const userData = req.body
    try {
      const result = await userService.saveUser(userData)
      return sendSuccessResponse(res, result)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async updateUser(req, res) {
    const userData = req.body
    try {
      const result = await userService.updateUser(userData)
      return sendSuccessResponse(res, result)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
  async deleteUser(req, res) {
    const userMail = req.params.email
    try {
      const response = await userService.deleteUser(userMail)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error(error)
      return sendErrorResponse(res, error)
    }
  }
}
export const userController = new UserController()
