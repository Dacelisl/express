import express from 'express'
import { viewController } from '../controllers/views.controller.js'

export const ViewRoutes = express.Router()

ViewRoutes.get('/', viewController.getAllProducts)
ViewRoutes.get('/addProduct', viewController.addProduct)
ViewRoutes.post('/add', viewController.createProduct)
