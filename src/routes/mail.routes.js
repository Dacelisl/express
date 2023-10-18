import express from 'express'
import { mailController } from '../controllers/mailController.js'
import { adminAccess } from '../middleware/auth.js'

export const MailRoutes = express.Router()

MailRoutes.post('/send/:code', mailController.sendMail)
