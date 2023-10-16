import { chatService } from '../services/chat.services.js'
import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'

class ChatController {
  async getAllMessages(req, res) {
    try {
      const messages = await chatService.getAllMessages()
      res.render('test-chat', { messages })
    } catch (error) {
      req.logger.error('something went wrong getAllMessages', error)
      return sendErrorResponse(res, error)
    }
  }
  async addMessage(req, res) {
    try {
      const newMessage = req.body
      const addMsg = await chatService.addMessage(newMessage)
      return sendSuccessResponse(res, addMsg)
    } catch (error) {
      req.logger.error('something went wrong addMessage', error)
      return sendErrorResponse(res, error)
    }
  }
}
export const chatController = new ChatController()
