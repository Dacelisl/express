import express from 'express'
import { ticketController } from '../controllers/ticket.controller.js'
export const TicketRoutes = express.Router()

TicketRoutes.get('/', ticketController.getTickets)
TicketRoutes.get('/:tid', ticketController.getTicketById)
TicketRoutes.get('/ticket/:tnum', ticketController.getTicketByTicketNumber)
TicketRoutes.get('/customer/:cid', ticketController.getTicketsByCustomerDNI)
TicketRoutes.get('/employee/:eid', ticketController.getTicketsByEmployeeDNI)
TicketRoutes.post('/', ticketController.createTicket)
TicketRoutes.put('/:tid', ticketController.updateTicket)
TicketRoutes.delete('/:tid', ticketController.deleteTicket)
