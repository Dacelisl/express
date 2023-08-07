import { chatFactory } from '../DAO/factory.js'
class ChatServices {
  async getAllMessages() {
    try {
      const messages = await chatFactory.getMessage()
      const allMessages = messages.map((message) => {
        return {
          id: message._id,
          user: message.user,
          message: message.message,
        }
      })
      return {
        status: 'Success',
        code: 201,
        data: allMessages,
        msg: 'get data',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        msg: `Error ${error}`,
      }
    }
  }
  async addMessage(msg) {
    try {
      const newMessage = await chatFactory.addMessage(msg)
      return {
        status: 'Success',
        code: 200,
        data: newMessage,
        msg: 'Message added',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        msg: `Error ${error}`,
      }
    }
  }
}
export const chatService = new ChatServices()
