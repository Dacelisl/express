import express from 'express'
import { mailController } from '../controllers/mailController.js'

export const MailRoutes = express.Router()

/* MailRoutes.get('/', mailController.getMail) */
MailRoutes.post('/send/:code', mailController.sendMail)
