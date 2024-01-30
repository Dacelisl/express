import express from 'express'
import { adminAccess, registeredUser } from '../middleware/auth.js'
import { userController } from '../controllers/user.controller.js'
import { handleUserCreationError } from '../services/error.services.js'
import { uploader } from '../utils/utils.js'
import passport from 'passport'

export const UserRoutes = express.Router()

UserRoutes.get('/', userController.getAllUsers)
UserRoutes.get('/user/:uid', userController.getUser)
UserRoutes.get('/register', userController.getRegister)
UserRoutes.post('/register', handleUserCreationError, userController.createRegister)
UserRoutes.get('/login', userController.getLogin)
UserRoutes.post('/login', userController.createLogin)
UserRoutes.post('/updateUser', adminAccess, userController.updateUser)
UserRoutes.get('/logout', userController.logout)
UserRoutes.get('/profile', registeredUser, userController.getProfile)
UserRoutes.get('/admin', registeredUser, adminAccess, userController.getAdmin)
UserRoutes.get('/current', registeredUser, userController.getCurrent)
UserRoutes.get('/premium/:uid', userController.switchRol)
UserRoutes.get('/uploads', userController.uploadDocuments)
UserRoutes.get('/documents/:uid', userController.getDocuments)
UserRoutes.post('/:uid/documents', uploader.single('file'), userController.createDocument)
UserRoutes.get('/deleteUser', userController.getDeleteUser)
UserRoutes.get('/editUser', userController.getEditUser)
UserRoutes.delete('/:uid',adminAccess, userController.deleteUser)
UserRoutes.delete('/', adminAccess, userController.deleteInactiveUsers)

UserRoutes.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
UserRoutes.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login', failureFlash: true }), userController.loginGit)
