import { userModel } from '../models/user.model.js'
import { UserDTO } from '../../DTO/user.dto.js'

class UserDAO {
  async getAllUsers() {
    try {
      const users = await userModel
        .find()
        .populate('serviceHistory.stylist', 'firstName lastName')
        .populate('serviceHistory.service', 'name description')
        .populate('shopping.employee', 'firstName lastName')
        .populate('shopping.products.product', 'name price')
        .lean()
      const formattedUsers = users.map((user) => (user ? new UserDTO(user) : null))
      return formattedUsers
    } catch (error) {
      throw new Error(`function DAO getAllUsers: ${error}`)
    }
  }
  async getUserById(id) {
    try {
      const user = await userModel
        .findById(id)
        .populate('serviceHistory.stylist', 'firstName lastName')
        .populate('serviceHistory.service', 'name description')
        .populate('shopping.employee', 'firstName lastName')
        .populate('shopping.products.product', 'name price')
        .lean()

      return user ? new UserDTO(user) : null
    } catch (error) {
      throw new Error(`function DAO getUserById: ${error}`)
    }
  }
  async getUserByEmail(email) {
    try {
      const user = await userModel.findOne({ email }).populate('serviceHistory.stylist').populate('serviceHistory.service').populate('shopping.employee').populate('shopping.products.product').lean()
      return user ? new UserDTO(user) : null
    } catch (error) {
      throw new Error(`function DAO getUserByEmail: ${error}`)
    }
  }
  async saveUser(userData) {
    try {
      const result = await userModel.create(userData)
      return result
    } catch (error) {
      throw new Error(`function DAO saveUser: ${error}`)
    }
  }
  async deleteUser(email) {
    try {
      const result = await userModel.deleteOne({ email: email })
      return result
    } catch (error) {
      throw new Error(`function DAO deleteUser: ${error}`)
    }
  }
  async updateUser(updatedData) {
    try {
      const user = await userModel.updateOne(
        { email: updatedData.email },
        {
          $set: {
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            dni: updatedData.dni,
            phone: updatedData.phone,
            address: updatedData.address,
            dateBirthday: updatedData.dateBirthday,
            photo: updatedData.photo,
          },
          $push: {
            serviceHistory: { $each: updatedData.serviceHistory || [] },
            shopping: { $each: updatedData.shopping || [] },
          },
        }
      )

      return user
    } catch (error) {
      throw new Error(`function DAO updateUser: ${error}`)
    }
  }
}
export const userDAO = new UserDAO()
