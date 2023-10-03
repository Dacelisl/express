import { userFactory } from '../DAO/factory.js'
import dataConfig from '../config/process.config.js'

class UserServices {
  async getUserByID(uid) {
    return await userFactory.getUserByID(uid)
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
          payload: userUpdate,
          message: 'update user role',
        }
      } else {
        return {
          status: 'error',
          code: 500,
          payload: {},
          message: 'Failed to update user role',
        }
      }
    } else {
      return {
        status: 'error',
        code: 400,
        payload: {},
        message: 'The user does not have all the specified document types',
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
          payload: {},
          message: 'User not found',
        }
      }
      const result = await userFactory.deletedOne(user._id)
      return {
        status: 'Success',
        code: 204,
        payload: result,
        message: 'user deleted successfully',
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        payload: {},
        message: 'Something went wrong :(',
      }
    }
  }
}
export const userService = new UserServices()
