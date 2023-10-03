import { UserModel } from '../models/users.model.js'

class User {
  getUsers = async () => {
    const users = await UserModel.find()
    return users
  }
  getUserByEmail = async (mail) => {
    const user = await UserModel.findOne({ email: mail })
    return user
  }
  getUserByID = async (id) => {
    const user = await UserModel.findOne({ _id: id })
    return user
  }
  saveUser = async (user) => {
    const result = await UserModel.create(user)
    return result
  }
  deletedOne = async (userID) => {
    const result = await UserModel.deleteOne({ _id: userID })
    return result
  }
  loadDocument = async (id, user) => {
    const result = await UserModel.updateOne({ _id: id }, { $push: user })
    return result
  }
  updateUser = async (id, user) => {
    const result = await UserModel.updateOne({ _id: id }, { $set: user })
    return result
  }
}
export const userDAO = new User()
