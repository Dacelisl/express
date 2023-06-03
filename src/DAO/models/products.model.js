import { Schema, model } from 'mongoose'

const schema = new Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  price: { type: String, required: true, max: 2100 },
  thumbnail: { type: String, required: true, max: 100 },
  code: { type: String, required: true, max: 30 },
  stock: { type: Number, required: true, max: 110 },
})

export const ProductsModel = model('products', schema)
