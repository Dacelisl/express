import express from 'express'
import { isAdmin, isUser } from '../middleware/auth.js'
import passport from 'passport'

export const authRouter = express.Router()
authRouter.get('/register', (req, res) => {
  const message = req.flash('info')
  return res.render('register', { message })
})
authRouter.post('/register', (req, res, next) => {
  passport.authenticate('register', { failureRedirect: '/auth/register', failureFlash: true }, (err, user, info) => {
    if (err) return next(err)
    req.flash('info', info.message)
    if (!user) {
      return res.redirect('/auth/register')
    }
    return res.redirect('/auth/login')
  })(req, res, next)
})
authRouter.get('/login', (req, res) => {
  const message = req.flash('info')
  return res.render('login', { message })
})
authRouter.post('/login', (req, res, next) => {
  passport.authenticate('login', { failureRedirect: '/auth/login', failureFlash: true }, (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      req.flash('info', info.message)
      return res.redirect('/auth/login')
    }
    req.session.email = user.email
    req.session.isAdmin = user.isAdmin
    req.session.user = user.firstName
    req.session.message = `¡Bienvenido ${user.firstName}!. Has iniciado sesión con éxito.`
    return res.redirect('/api/products')
  })(req, res, next)
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
authRouter.get('/admin', isUser, isAdmin, (req, res) => {
  return res.render('admin')
})
