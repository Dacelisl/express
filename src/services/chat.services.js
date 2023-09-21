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
        payload: allMessages,
        message: 'get data',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        payload:{},
        message: `Error ${error}`,
      }
    }
  }
  async addMessage(msg) {
    try {
      const newMessage = await chatFactory.addMessage(msg)
      return {
        status: 'Success',
        code: 200,
        payload: newMessage,
        message: 'Message added',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        payload:{},
        message: `Error ${error}`,
      }
    }
  }
}
export const chatService = new ChatServices()
