import express from 'express'
import { productController } from '../controllers/product.controller.js'

export const ProductRoutes = express.Router()

ProductRoutes.get('/', productController.getAllProducts)
ProductRoutes.get('/:pid', productController.getProductId)
ProductRoutes.post('/', productController.createProduct)
ProductRoutes.put('/:pid', productController.updateProduct)
ProductRoutes.delete('/:pid', productController.deleteProduct)
