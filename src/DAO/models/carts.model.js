import { Schema, model } from 'mongoose'

const schema = new Schema({
  products: { type: Array, required: true },
})

export const CartsModel = model('carts', schema)
