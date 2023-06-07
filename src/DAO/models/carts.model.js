import { Schema, model } from 'mongoose'

const cartProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'products', required: true },
  quantity: { type: Number, required: true },
})

const cartSchema = new Schema({
  products: { type: [cartProductSchema], required: true, default: [] },
})

export const CartsModel = model('carts', cartSchema)
