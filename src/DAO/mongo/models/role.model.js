import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    message: 'The name is not unique',
  },
  permissions: [
    {
      module: { type: String, required: true },
      actions: [String],
    },
  ],
})

export const RoleModel = model('role', schema)
