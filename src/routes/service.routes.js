import express from 'express'
import { serviceController } from '../controllers/service.controller.js'

export const ServiceRoutes = express.Router()

ServiceRoutes.get('/', serviceController.getAllServices)
ServiceRoutes.get('/:sid', serviceController.getServiceId)
ServiceRoutes.post('/', serviceController.createService)
ServiceRoutes.put('/:sid', serviceController.updateService)
ServiceRoutes.delete('/:sid', serviceController.deleteService)
