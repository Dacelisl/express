import { Schema, model } from 'mongoose'

const schema = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expire: { type: Number, required: true },
  active: { type: Boolean, required: true, default: true },
})

export const RecoveryCodesModel = model('recoveryCodes', schema)
