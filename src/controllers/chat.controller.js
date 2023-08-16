import { chatService } from '../services/chat.services.js'

class ChatController {
  async getAllMessages(req, res) {
    try {
      const messages = await chatService.getAllMessages()
      res.render('test-chat', { messages })
    } catch (error) {
      req.logger.error('something went wrong getAllMessages', error)
    }
  }
  async addMessage(req, res) {
    try {
      const newMessage = req.body
      const addMsg = await chatService.addMessage(newMessage)
      return res.status(201).json(addMsg)
    } catch (error) {
      req.logger.error('something went wrong addMessage', error)
      return res.status(500).json({ error: `Error ${error}` })
    }
  }
}
export const chatController = new ChatController()
