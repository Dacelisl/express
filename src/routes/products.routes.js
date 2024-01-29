import express from 'express'
import { productController } from '../controllers/product.controller.js'
export const ProductRoutes = express.Router()

ProductRoutes.get('/', productController.getAllProducts)
ProductRoutes.get('/filter/', productController.getProductsFilter)
ProductRoutes.get('/:pid', productController.getProductId)
ProductRoutes.get('/code/:code', productController.getProductCode)
ProductRoutes.post('/', productController.createProduct)
ProductRoutes.put('/:pid', productController.updateProduct)
ProductRoutes.delete('/:pid', productController.deleteProduct)
