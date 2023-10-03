import express from 'express'
import { isAdmin, registeredUser } from '../middleware/auth.js'
import { userController } from '../controllers/user.controller.js'
import { handleUserCreationError } from '../services/error.services.js'
import { uploader } from '../utils/utils.js'
import passport from 'passport'

export const UserRoutes = express.Router()

UserRoutes.get('/register', userController.getRegister)
UserRoutes.post('/register', handleUserCreationError, userController.createRegister)
UserRoutes.get('/login', userController.getLogin)
UserRoutes.post('/login', userController.createLogin)
UserRoutes.get('/logout', userController.logout)
UserRoutes.get('/profile', registeredUser, userController.getProfile)
UserRoutes.get('/admin', registeredUser, isAdmin, userController.getAdmin)
UserRoutes.get('/current', userController.getCurrent)
UserRoutes.get('/premium/:uid', userController.switchRol)
UserRoutes.get('/documents', userController.getDocuments)
UserRoutes.post('/:uid/documents', uploader.single('file'), userController.createDocument)
UserRoutes.delete('/:uid', userController.deleteUser)

UserRoutes.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
UserRoutes.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login', failureFlash: true }), userController.loginGit)
