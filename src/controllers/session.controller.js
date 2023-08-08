import passport from 'passport'
import userDTO from '../DAO/DTO/user.DTO.js'

class SessionController {
  getRegister(req, res) {
    const message = req.flash('info')
    return res.render('register', { message })
  }
  createRegister(req, res, next) {
    passport.authenticate('register', { failureRedirect: '/api/sessions/register', failureFlash: true }, (err, user, info) => {
      if (err) return next(err)
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
      if (err) return next(err)
      if (!user) {
        req.flash('info', info.message)
        return res.redirect('/api/sessions/login')
      }
      req.session.user = user
      req.flash('info', `¡Bienvenido ${user.firstName}!. Has iniciado sesión con éxito.`)
      return res.redirect('/api/products')
    })(req, res, next)
  }
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('error', { error: 'session could not be closed', code: 500 })
      }
      return res.redirect('/api/sessions/login')
    })
  }
  getProfile(req, res) {
    const user = { email: req.session.user.email, isAdmin: req.session.user.rol === 'admin', user: req.session.user.firstName }
    return res.render('profile', user)
  }
  getAdmin(req, res) {
    return res.render('admin')
  }
  getCurrent(req, res) {
    const dataUser = req.session.user
    if (dataUser === undefined) {
      return res.json({
        status: 'error',
        msg: 'No user data found in session',
        data: null,
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
