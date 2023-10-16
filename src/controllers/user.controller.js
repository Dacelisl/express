import passport from 'passport'
import userDTO from '../DAO/DTO/user.DTO.js'
import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'
import { userService } from '../services/user.services.js'

class UserController {
  async getUser(req, res) {
    const uid = req.query.uid ? req.query.uid : req.params.uid
    const esEmail = /\S+@\S+\.\S+/.test(uid)
    let user = ''
    try {
      if (esEmail) {
        user = await userService.getUserByEmail(uid)
      } else {
        user = await userService.getUserByID(uid)
      }
      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        rol: user.rol,
      }
      return res.render('editUser', { userData })
    } catch (error) {
      req.logger.warning('Error get User, getUser', error)
      return sendErrorResponse(res, error)
    }
  }
  async getAllUsers(req, res) {
    try {
      const response = await userService.getAllUsers()
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.warning('Error uploading file, createDocument', error)
      return sendErrorResponse(res, error)
    }
  }
  async deleteInactiveUsers(req, res) {
    try {
      const response = await userService.deleteInactiveUsers()
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error('something went wrong getRegister', error)
      return sendErrorResponse(res, error)
    }
  }
  getRegister(req, res) {
    try {
      const message = req.flash('info')
      return res.render('register', { message })
    } catch (error) {
      req.logger.error('something went wrong getRegister', error)
      return sendErrorResponse(res, error)
    }
  }
  createRegister(req, res, next) {
    passport.authenticate('register', { failureRedirect: '/api/Users/register', failureFlash: true }, (err, user, info) => {
      if (err) {
        req.logger.error('something went wrong createRegister', err)
        return next(err)
      }
      req.flash('info', info.message)
      if (!user) {
        return res.redirect('/api/users/register')
      }
      return res.redirect('/api/users/login')
    })(req, res, next)
  }
  getLogin(req, res) {
    const message = req.flash('info')
    return res.render('login', { message })
  }
  createLogin(req, res, next) {
    passport.authenticate('login', { failureRedirect: '/api/users/login', failureFlash: true }, (err, user, info) => {
      if (err) {
        req.logger.error('something went wrong createLogin', err)
        return next(err)
      }
      if (!user) {
        req.flash('info', info.message)
        return res.redirect('/api/users/login')
      }
      req.session.user = user
      if (user.rol === 'admin') {
        req.flash('info', `Welcome ${user.firstName}!. login as a user to buy!.`)
      } else {
        req.flash('info', `¡Bienvenido ${user.firstName}!. Has iniciado sesión con éxito.`)
      }
      return res.redirect('/api/products')
    })(req, res, next)
  }
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        req.logger.error('something went wrong logout', err)
        return res.status(500).render('error', { error: 'session could not be closed', code: 500 })
      }
      return res.redirect('/api/users/login')
    })
  }
  getProfile(req, res) {
    const user = { email: req.session.user.email, isAdmin: req.session.user.rol === 'admin', user: req.session.user.firstName }
    return res.render('profile', user)
  }
  getAdmin(req, res) {
    return res.render('admin')
  }
  getDocuments(req, res) {
    return res.render('upload')
  }
  getEditUser(req, res) {
    const successMessages = req.flash('success')
    return res.render('editUser', { successMessages })
  }
  getDeleteUser(req, res) {
    return res.render('deleteUser')
  }
  async updateUser(req, res) {
    try {
      const dataUser = req.body
      const userUpdate = {
        firstName: dataUser.firstName,
        lastName: dataUser.lastName,
        email: dataUser.email,
        age: dataUser.age,
        rol: dataUser.rol,
      }
      const userId = await userService.getUserByEmail(userUpdate.email)
      if (!userId) {
        return {
          status: 'error',
          code: 404,
          message: 'User not found',
          payload: {},
        }
      }
      const result = await userService.updateUser(userId._id, userUpdate)
      if (result.code === 201) {
        req.flash('success', 'Information was successfully updated.')
      } else {
        req.flash('info', 'The information could not be updated.')
      }
      req.session.user.message = null
      return res.redirect('/api/users/editUser')
    } catch (error) {
      req.logger.error('something went wrong updateUser', e)
      return sendErrorResponse(res, error)
    }
  }
  async deleteUser(req, res) {
    try {
      const userMail = req.params.uid
      const response = await userService.deleteUserByEmail(userMail)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error('something went wrong deleteUser', e)
      return sendErrorResponse(res, error)
    }
  }
  async createDocument(req, res) {
    try {
      const uid = req.params.uid
      /* const type = req.body.imageType */
      const type = req.headers['x-tipo-archivo']
      const response = await userService.createDocument(req.file, type, uid)
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.warning('Error uploading file, createDocument', error)
      return sendErrorResponse(res, error)
    }
  }
  async switchRol(req, res) {
    try {
      const uid = req.params.uid
      const esEmail = /\S+@\S+\.\S+/.test(uid)
      let user = ''
      if (esEmail) {
        user = await userService.getUserByEmail(uid)
      } else {
        user = await userService.getUserByID(uid)
      }
      if (user) {
        const response = await userService.switchUserRole(user)
        return sendSuccessResponse(res, response)
      } else {
        return res.json({
          status: 'error',
          code: 404,
          message: 'User not found',
          payload: {},
        })
      }
    } catch (error) {
      req.logger.warning('failed to change roles, switchRol', error)
      return sendErrorResponse(res, error)
    }
  }
  getCurrent(req, res) {
    const dataUser = req.session.user
    if (dataUser === undefined) {
      req.logger.warning('No user data found in session, getCurrent')
      return res.json({
        status: 'error',
        code: 500,
        message: 'No user data found in session',
        payload: {},
      })
    }
    const userDto = new userDTO(dataUser)
    return res.status(200).json(userDto)
  }
  loginGit(req, res) {
    req.session.user = req.user
    req.flash('info', `${req.user.firstName} Logged in with GitHub successfully`)
    res.redirect('/api/products')
  }
}
export const userController = new UserController()
