import { Schema, model } from 'mongoose'

const ProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'products', required: true },
  quantity: { type: Number, required: true, default: 0 },
})

const TicketSchema = new Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: Date, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  products: { type: [ProductSchema], required: true, default: [] },
})
export const TicketModel = model('ticket', TicketSchema)
