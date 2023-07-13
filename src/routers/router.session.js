import express from 'express'
import { isAdmin, isUser } from '../middleware/auth.js'
import passport from 'passport'

export const sessionRouter = express.Router()
sessionRouter.get('/register', (req, res) => {
  const message = req.flash('info')
  return res.render('register', { message })
})
sessionRouter.post('/register', (req, res, next) => {
  passport.authenticate('register', { failureRedirect: '/api/sessions/register', failureFlash: true }, (err, user, info) => {
    if (err) return next(err)
    req.flash('info', info.message)
    if (!user) {
      return res.redirect('/api/sessions/register')
    }
    return res.redirect('/api/sessions/login')
  })(req, res, next)
})
sessionRouter.get('/login', (req, res) => {
  const message = req.flash('info')
  return res.render('login', { message })
})
sessionRouter.post('/login', (req, res, next) => {
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
})
sessionRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: 'session could not be closed', code: 500 })
    }
    return res.redirect('/api/sessions/login')
  })
})
sessionRouter.get('/profile', isUser, (req, res) => {
  const user = { email: req.session.user.email, isAdmin: req.session.user.rol === 'admin' ? true : false, user: req.session.user.firstName }
  return res.render('profile', user)
})
sessionRouter.get('/admin', isUser, isAdmin, (req, res) => {
  return res.render('admin')
})
sessionRouter.get('/current', (req, res) => {
  console.log(req.session)
  return res.status(200).json({ user: req.session.user })
})

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
  req.session.user = req.user
  req.flash('info', `${req.user.firstName} Logged in with GitHub successfully`)
  res.redirect('/api/products')
})
