import express from 'express'
import { productController } from '../controllers/product.controller.js'
import { handleProductCreationError } from '../services/error.services.js'

export const ProductRoutes = express.Router()

ProductRoutes.get('/', productController.getAllProducts)
ProductRoutes.get('/:pid', productController.getProductId)
ProductRoutes.post('/', handleProductCreationError, productController.createProduct)
ProductRoutes.put('/:pid', productController.updateProduct)
ProductRoutes.delete('/:pid', productController.deleteProduct)
