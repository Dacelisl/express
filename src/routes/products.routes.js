import express from 'express'
import { productController } from '../controllers/product.controller.js'
import { handleProductCreationError } from '../services/error.services.js'
import { adminAccess } from '../middleware/auth.js'

export const ProductRoutes = express.Router()

ProductRoutes.get('/', productController.getAllProducts)
ProductRoutes.get('/:pid', productController.getProductId)
ProductRoutes.get('/code/:code', productController.getProductCode)
ProductRoutes.post('/', adminAccess, handleProductCreationError, productController.createProduct)
ProductRoutes.put('/:pid', adminAccess, productController.updateProduct)
ProductRoutes.delete('/:pid', adminAccess, productController.deleteProduct)
