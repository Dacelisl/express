import { userFactory } from '../DAO/factory.js'
import { timeDifference } from '../utils/utils.js'
import { mailServices } from './mail.services.js'
import dataConfig from '../config/process.config.js'

class UserServices {
  async saveUser(user) {
    return await userFactory.saveUser(user)
  }
  async deleteInactiveUsers() {
    const users = []
    try {
      const usersList = await userFactory.getUsers()
      usersList.forEach((user) => {
        const userData = {
          name: user.firstName,
          email: user.email,
          delete: timeDifference(user.lastConnection, 2),
        }
        users.push(userData)
      })
      users.forEach(async (user) => {
        if (user.delete) {
          await mailServices.deleteInactiveUsersMail(user.email, user.name)
          await this.deleteUserByEmail(user.email)
        }
      })
      return {
        status: 'success',
        code: 201,
        message: 'all users Inactive deleted',
        payload: users,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'error getting all users :(',
        payload: {},
      }
    }
  }
  async getAllUsers() {
    const users = []
    try {
      const usersList = await userFactory.getUsers()
      usersList.forEach((user) => {
        const userData = {
          name: user.firstName,
          email: user.email,
          rol: user.rol,
        }
        users.push(userData)
      })
      return {
        status: 'success',
        code: 201,
        message: 'all users',
        payload: users,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'error getting all users :(',
        payload: {},
      }
    }
  }
  async getUserByID(uid) {
    return await userFactory.getUserByID(uid)
  }
  async getUserByEmail(mail) {
    return await userFactory.getUserByEmail(mail)
  }
  async updateUser(id, user) {
    try {
      const userFound = await userFactory.getUserByID(id)
      if (!userFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'User not exist',
          payload: {},
        }
      }
      const userUpdate = await userFactory.updateUser(id, user)
      return {
        status: 'success',
        code: 201,
        message: 'user update successfully',
        payload: userUpdate,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error updateUser`,
        payload: {},
      }
    }
  }
  async createDocument(file, imageType, uid) {
    const reference = file.path
    const base = reference.match(/\\image\\(.*)/)
    const path = `http://localhost:${dataConfig.port}${base[0]}`
    const nuevoDocumento = {
      name: file.filename,
      type: imageType,
      reference: path,
    }
    await userFactory.loadDocument({ _id: uid }, { documents: nuevoDocumento })
    return nuevoDocumento
  }
  async switchUserRole(user) {
    const documentosUsuario = user.documents.map((documento) => documento.type)
    const tiposDocumentosRequeridos = ['DNI', 'proofAddress', 'accountStatus']
    const tieneTodosLosDocumentos = tiposDocumentosRequeridos.every((tipo) => documentosUsuario.includes(tipo))

    if (tieneTodosLosDocumentos) {
      const updatedUser = await userFactory.updateUser(user._id, {
        rol: user.rol === 'user' ? 'premium' : 'user',
      })
      if (updatedUser.acknowledged) {
        const userUpdate = await this.getUserByID(user._id)
        return {
          status: 'success',
          code: 201,
          message: 'update user role',
          payload: userUpdate,
        }
      } else {
        return {
          status: 'error',
          code: 500,
          message: 'Failed to update user role',
          payload: {},
        }
      }
    } else {
      return {
        status: 'error',
        code: 400,
        message: 'The user does not have all the specified document types',
        payload: {},
      }
    }
  }
  async deleteUserByEmail(userMail) {
    try {
      const user = await userFactory.getUserByEmail(userMail)
      if (!user) {
        return {
          status: 'error',
          code: 404,
          message: 'User not found',
          payload: {},
        }
      }
      const result = await userFactory.deletedOne(user._id)
      return {
        status: 'Success',
        code: 204,
        message: 'user deleted successfully',
        payload: result,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Something went wrong :(',
        payload: {},
      }
    }
  }
}
export const userService = new UserServices()
