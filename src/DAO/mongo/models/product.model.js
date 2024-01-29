import { Schema, model } from 'mongoose'

const categoryEnum = ['cleaning', 'sale', 'inUse', 'inventory']

const schema = new Schema({
  name: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  category: { type: String, required: true, enum: categoryEnum },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true, max: 100 },
  code: { type: String, unique: true, required: true, max: 30 },
  provider: { type: String, required: false, max: 30 },
  stock: { type: Number, required: true, max: 110 },
  dateCreation: { type: Date, default: Date.now },
  profitPercentage: { type: Number, required: true },
})

export const ProductModel = model('product', schema)
