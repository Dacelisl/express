import { Schema, model } from 'mongoose'
import { CartsModel } from '../models/carts.model.js'

const schema = new Schema({
  firstName: {
    type: String,
    required: true,
    max: 100,
  },
  lastName: {
    type: String,
    required: true,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    max: 100,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    max: 100,
  },
  age: {
    type: Number,
    required: false,
  },
  rol: {
    type: String,
    required: true,
    default: 'user',
    max: 20,
  },
  cart: {
    type: String,
    required: false,
  },
})
export const UserModel = model('users', schema)
