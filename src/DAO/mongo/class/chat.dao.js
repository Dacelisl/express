import { ChatModel } from '../models/chat.model.js'

class Chat {
  addMessage = async (msg) => {
    const result = await ChatModel.create(msg)
    return result
  }
  getMessage = async () => {
    const msg = await ChatModel.find({})
    return msg
  }
  deleteAllMessage = async () => {
    const msg = await ChatModel.deleteMany({})
    return msg
  }
}
export const chatDAO = new Chat()
