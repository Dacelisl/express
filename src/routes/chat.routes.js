import express from 'express'
import { chatController } from '../controllers/chat.controller.js'
import { adminAccess, registeredUser } from '../middleware/auth.js'

export const chatRoutes = express.Router()

chatRoutes.get('/', registeredUser, chatController.getAllMessages)
chatRoutes.post('/', registeredUser, chatController.addMessage)
chatRoutes.delete('/', adminAccess, chatController.deleteAllMessage)
