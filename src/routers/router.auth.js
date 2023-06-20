import express from 'express'
import { UserModel } from '../DAO/models/user.model.js'
import { isAdmin, isUser } from '../middleware/auth.js'
import { createHash, isValidPassword } from '../utils/utils.js'

export const authRouter = express.Router()
authRouter.get('/register', (req, res) => {
  return res.render('register', {})
})
authRouter.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).render('error', { error: 'all data is required', code: 400 })
  }
  try {
    await UserModel.create({ email: email, password: createHash(password), firstName: firstName, lastName: lastName, isAdmin: false })
    req.session.email = email
    req.session.isAdmin = false
    return res.redirect('/api/products')
  } catch (e) {
    return res.status(400).render('error', { error: 'User not created, Try another email' })
  }
})
authRouter.get('/login', (req, res) => {
  return res.render('login', {})
})
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).render('error', { error: 'all data is required', code: 400 })
  }
  const usarioEncontrado = await UserModel.findOne({ email: email })
  if (usarioEncontrado && isValidPassword(password, usarioEncontrado.password)) {
    req.session.email = usarioEncontrado.email
    req.session.isAdmin = usarioEncontrado.isAdmin
    req.session.user = usarioEncontrado.firstName
    req.session.message = `¡Bienvenido ${req.session.user}!. Has iniciado sesión con éxito.`
    return res.redirect('/api/products')
  } else {
    return res.status(401).render('error', { error: 'Invalid Email or password.', code: 401 })
  }
})
authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: 'session could not be closed', code: 500 })
    }
    return res.redirect('/auth/login')
  })
})
authRouter.get('/profile', isUser, (req, res) => {
  const user = { email: req.session.email, isAdmin: req.session.isAdmin, user: req.session.user }

  return res.render('profile', user)
})
authRouter.get('/administracion', isUser, isAdmin, (req, res) => {
  return res.send('datos super secretos clasificados sobre los nuevos ingresos a boca juniors')
})
