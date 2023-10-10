import express from 'express'
import { productController } from '../controllers/product.controller.js'
import { handleProductCreationError } from '../services/error.services.js'
import { isAdmin } from '../middleware/auth.js'

export const ProductRoutes = express.Router()

ProductRoutes.get('/', productController.getAllProducts)
ProductRoutes.get('/:pid', productController.getProductId)
ProductRoutes.get('/code/:code', productController.getProductCode)
ProductRoutes.post('/', isAdmin, handleProductCreationError, productController.createProduct)
/* ProductRoutes.post('/', productController.createProduct) */
ProductRoutes.put('/:pid', productController.updateProduct)
ProductRoutes.delete('/:pid', productController.deleteProduct)
