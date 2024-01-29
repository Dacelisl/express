import { Schema, model } from 'mongoose'

const EmployeePerformanceSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'employee', required: true },
  date: { type: Date, required: true, default: Date.now },
  earningsDetails: [
    {
      ticketNumber: { type: Number, required: true, unique: true },
      customerId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
      serviceOrProduct: { type: String, required: true },
      itemType: { type: String, required: true, enum: ['service', 'product'] },
      quantity: { type: Number, required: true },
      itemPrice: { type: Number, required: true },
      totalCost: { type: Number, required: true },
      employeeEarnings: { type: Number, required: true },
    },
  ],
})

export const EmployeePerformanceModel = model('employeePerformance', EmployeePerformanceSchema)
