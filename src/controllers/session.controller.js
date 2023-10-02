import passport from 'passport'
import userDTO from '../DAO/DTO/user.DTO.js'
import { userFactory } from '../DAO/factory.js'
import { uploader } from '../utils/utils.js'

class SessionController {
  getRegister(req, res) {
    try {
      const message = req.flash('info')
      return res.render('register', { message })
    } catch (error) {
      req.logger.error('something went wrong getRegister', error)
    }
  }
  createRegister(req, res, next) {
    passport.authenticate('register', { failureRedirect: '/api/sessions/register', failureFlash: true }, (err, user, info) => {
      if (err) {
        req.logger.error('something went wrong createRegister', err)
        return next(err)
      }
      req.flash('info', info.message)
      if (!user) {
        return res.redirect('/api/sessions/register')
      }
      return res.redirect('/api/sessions/login')
    })(req, res, next)
  }
  getLogin(req, res) {
    const message = req.flash('info')
    return res.render('login', { message })
  }
  createLogin(req, res, next) {
    passport.authenticate('login', { failureRedirect: '/api/sessions/login', failureFlash: true }, (err, user, info) => {
      if (err) {
        req.logger.error('something went wrong createLogin', err)
        return next(err)
      }
      if (!user) {
        req.flash('info', info.message)
        return res.redirect('/api/sessions/login')
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
      return res.redirect('/api/sessions/login')
    })
  }
  async deleteUser(req, res) {
    try {
      const userMail = req.params.uid
      const user = await userFactory.getUserByEmail(userMail)
      const resDelete = await userFactory.deletedOne(user._id)
      return res.status(204).json({
        status: 'success',
        code: 204,
        message: 'user deleted',
        payload: resDelete,
      })
    } catch (e) {
      req.logger.error('something went wrong deleteUser', e)
      return res.status(500).json({
        status: 'error',
        code: 500,
        message: 'something went wrong :(',
        payload: {},
      })
    }
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
  async createDocument(req, res) {
    try {
      const uid = req.params.uid
      const type = req.body.imageType
      const reference = req.file.path
      const name = req.file.filename

      const nuevoDocumento = {
        name,
        type,
        reference,
      }
      await userFactory.updateUser({ _id: uid }, { documents: nuevoDocumento })
      return res.status(201).json({
        status: 'success',
        code: 201,
        payload: {},
      })
    } catch (error) {
      req.logger.warning('Error uploading file, createDocument', error)
      return res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Error uploading file',
      })
    }
  }
  async switchRol(req, res) {
    try {
      const uid = req.params.uid
      let user = await userFactory.getUserByID(uid)
      const userUpdate = await userFactory.updateUser(uid, { rol: user.rol === 'user' ? 'premium' : 'user' })
      if (userUpdate.acknowledged) {
        user = await userFactory.getUserByID(uid)
      }
      return res.status(200).json(user)
    } catch (error) {
      req.logger.warning('failed to change roles, switchRol', error)
      return res.json({
        status: 'error',
        code: 500,
        message: 'failed to change roles,',
        payload: null,
      })
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
        payload: null,
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
export const sessionController = new SessionController()
