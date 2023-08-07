import express from 'express'
import { chatController } from '../controllers/chat.controller.js'
import { isUser, registeredUser } from '../middleware/auth.js'

export const chatRoutes = express.Router()

chatRoutes.get('/', registeredUser, isUser, chatController.getAllMessages)
chatRoutes.post('/', registeredUser, isUser, chatController.addMessage)
