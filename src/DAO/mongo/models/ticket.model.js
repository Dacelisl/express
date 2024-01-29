import { Schema, model } from 'mongoose'

const paymentMethodsEnum = ['cash', 'creditCard', 'debitCard', 'bankTransfer', 'nequi', 'daviplata']

const TicketSchema = new Schema({
  ticketNumber: { type: Number, required: true, unique: true },
  purchaseDate: { type: Date, required: true, default: Date.now },
  customerId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'employee', required: true },
  items: [
    {
      itemId: { type: Schema.Types.ObjectId, required: true },
      itemType: { type: String, required: true, enum: ['service', 'product'] },
      quantity: { type: Number, required: true },
      itemPrice: { type: Number, required: true },
    },
  ],
  paymentMethod: { type: String, required: true, enum: paymentMethodsEnum },
  totalPayment: { type: Number, required: true },
})
export const TicketModel = model('ticket', TicketSchema)
