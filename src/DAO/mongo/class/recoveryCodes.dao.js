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
    const result = await RecoveryCodesModel.find({ email: email })
    return result
  }
  findToken = async (token, email) => {
    const result = await RecoveryCodesModel.find({ email: email, token: token })
    return result
  }

  updateState = async (id) => {
    const result = await RecoveryCodesModel.updateOne({ _id: id }, { active: false })
    return result
  }
}
export const RecoveryCodesDAO = new RecoveryCodes()
