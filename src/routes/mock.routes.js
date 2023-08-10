import express from 'express'
import { mockController } from '../controllers/mock.controller.js'

export const MockRoutes = express.Router()

MockRoutes.get('/mockingproducts', mockController.getProductsMock)
