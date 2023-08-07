import express from 'express'
import { isAdmin, registeredUser } from '../middleware/auth.js'
import { sessionController } from '../controllers/session.controller.js'
import passport from 'passport'

export const SessionRoutes = express.Router()

SessionRoutes.get('/register', sessionController.getRegister)
SessionRoutes.post('/register', sessionController.createRegister)
SessionRoutes.get('/login', sessionController.getLogin)
SessionRoutes.post('/login', sessionController.createLogin)
SessionRoutes.get('/logout', sessionController.logout)
SessionRoutes.get('/profile', registeredUser, sessionController.getProfile)
SessionRoutes.get('/admin', registeredUser, isAdmin, sessionController.getAdmin)
SessionRoutes.get('/current', sessionController.getCurrent)

SessionRoutes.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
SessionRoutes.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login', failureFlash: true }), sessionController.loginGit)
