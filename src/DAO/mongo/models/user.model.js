import { Schema, model } from 'mongoose'

const ProductSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
  quantity: { type: Number, required: true },
})

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dni: { type: Number, required: true, unique: true },
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
      validator: async function (value) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
      },
      message: 'The email format is not valid',
    },
  },
  dateBirthday: {
    type: Date,
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  serviceHistory: [
    {
      stylist: { type: Schema.Types.ObjectId, ref: 'employee', required: true },
      service: { type: Schema.Types.ObjectId, ref: 'service', required: true },
      price: { type: Number },
      dateService: { type: Date, default: Date.now },
      observations: { type: String, required: false },
    },
  ],
  shopping: [
    {
      products: { type: [ProductSchema], required: false, default: [] },
      dateShopping: { type: Date, default: Date.now },
      employee: { type: Schema.Types.ObjectId, ref: 'employee', required: true },
      observations: { type: String, required: false },
    },
  ],
})
export const userModel = model('user', schema)
