import { userFactory } from '../DAO/factory.js'
import { isValid } from '../utils/utils.js'

class UserServices {
  validateUser(dataUser) {
    const requiredProperties = ['firstName', 'lastName', 'dni', 'phone', 'address', 'email', 'dateBirthday']
    const missingProperties = requiredProperties.filter((property) => {
      return !(property in dataUser) || dataUser[property] === undefined
    })
    if (missingProperties.length > 0) {
      throw new Error(`Validation error: Missing or undefined properties ${missingProperties}`)
    }
    return true
  }
  async getAllUsers() {
    try {
      const users = await userFactory.getAllUsers()
      if (!users) {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, Users not found getAllUsers`,
          payload: {},
        }
      }
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
        message: 'error getting all users : getAllUsers',
        payload: {},
      }
    }
  }
  async getUserById(uid) {
    try {
      isValid(uid)
      const userFound = await userFactory.getUserById(uid)
      if (!userFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'User not exist getUserById',
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'user found',
        payload: userFound,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error getUserById ${error}`,
        payload: {},
      }
    }
  }
  async getUserByEmail(mail) {
    try {
      const userFound = await userFactory.getUserByEmail(mail)
      if (!userFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'User not exist getUserByEmail',
          payload: {},
        }
      }
      return {
        status: 'success',
        code: 200,
        message: 'user found',
        payload: userFound,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error getUserByEmail ${error}`,
        payload: {},
      }
    }
  }
  async saveUser(user) {
    try {
      this.validateUser(user)
      const newUser = await userFactory.saveUser(user)
      if (!newUser) {
        return {
          status: 'Fail',
          code: 400,
          message: 'user created properties are missing or undefined',
          payload: {},
        }
      }
      return {
        status: 'Success',
        code: 201,
        message: 'user created',
        payload: newUser,
      }
    } catch (error) {
      return {
        code: 500,
        status: 'error',
        message: `Error to saveUser: ${error}`,
        payload: {},
      }
    }
  }
  async updateUser(user) {
    try {
      const userFound = await userFactory.getUserByEmail(user.email)
      if (!userFound) {
        return {
          status: 'Fail',
          code: 404,
          message: 'User not exist : updateUser',
          payload: {},
        }
      }
      const userUpdate = await userFactory.updateUser(user)
      if (userUpdate.modifiedCount > 0) {
        const responseUpdate = await userFactory.getUserByEmail(user.email)
        return {
          status: 'success',
          code: 200,
          message: 'user update successfully',
          payload: responseUpdate,
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error updateUser`,
          payload: userUpdate,
        }
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 400,
        message: `Error updateUser : ${error}`,
        payload: {},
      }
    }
  }
  async deleteUser(userMail) {
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
      const result = await userFactory.deleteUser(user.email)
      if (result.deletedCount > 0) {
        return {
          status: 'Success',
          code: 204,
          message: 'user deleted successfully',
          payload: {},
        }
      } else {
        return {
          status: 'Fail',
          code: 404,
          message: `Error, user not found deleteUser`,
          payload: {},
        }
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: `Something went wrong deleteUser: ${error}`,
        payload: {},
      }
    }
  }
}
export const userService = new UserServices()
