import { RecoveryCodesModel } from '../models/recoveryCodes.model.js'

class RecoveryCodes {
  add = async ({ email, token, expire }) => {
    const result = await RecoveryCodesModel.create({
      email,
      token,
      expire,
    })
    return result
  }
  find = async (email) => {
    const msg = await RecoveryCodesModel.find({ email: email })
    return msg
  }
  findToken = async (token, email) => {
    const msg = await RecoveryCodesModel.find({email:email, token:token})
    return msg
  }
}
export const RecoveryCodesDAO = new RecoveryCodes()
