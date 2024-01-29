import { Schema, model } from 'mongoose'

const paymentMethodsEnum = ['cash', 'creditCard', 'debitCard', 'bankTransfer', 'nequi', 'daviplata']
const categoryEnum = ['paysheet', 'marketing', 'suppliers', 'operational', 'technology', 'Training', 'recreation']

const expenseSchema = new Schema({
  description: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  category: { type: String, required: true, enum: categoryEnum },
  categoryDetail: { type: String },
  paymentMethod: { type: String, required: true, enum: paymentMethodsEnum },
  employeeId: { type: Schema.Types.ObjectId, ref: 'employees' },
  supplierId: { type: Schema.Types.ObjectId, ref: 'suppliers' },
})

export const ExpenseModel = model('expense', expenseSchema)
