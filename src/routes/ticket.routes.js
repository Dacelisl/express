import express from 'express'
import { ticketController } from '../controllers/ticket.controller.js'
import { registeredUser, adminAccess } from '../middleware/auth.js'
export const TicketsRoutes = express.Router()

TicketsRoutes.put('/:cid/purchase', registeredUser, ticketController.purchaseCart)
TicketsRoutes.get('/purchase/:cid', adminAccess, ticketController.getTicketById)
TicketsRoutes.get('/purchase/code/:cid', registeredUser, ticketController.getTicketByCode)
TicketsRoutes.delete('/:cid', adminAccess, ticketController.deleteTicket)
