import { Schema, model } from 'mongoose'

const employeeSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dni: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    validate: {
      validator: async function (value) {
        return /^\d{12}$/.test(value.toString())
      },
      message: 'The phone number is not valid',
    },
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
      },
      message: 'The email format is not valid',
    },
  },
  dateBirthday: { type: Date, required: true },
  password: {
    type: String,
    required: true,
    max: 100,
  },
  role: { type: Schema.Types.ObjectId, ref: 'role', required: true },
  documents: [
    {
      name: { type: String, required: false },
      type: { type: String, required: false },
      reference: { type: String, required: false },
    },
  ],
  lastConnection: {
    type: Date,
    required: false,
  },
})
export const EmployeeModel = model('employee', employeeSchema)
