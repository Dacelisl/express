import { productService } from '../services/product.services.js'
import ProductDTO from '../DAO/DTO/product.dto.js'

class ProductController {
  async getAllProducts(req, res) {
    const { limit, page, sort, query } = req.query
    const opcionesConsulta = {
      limit: parseInt(limit),
      page,
      sort,
      query,
      baseUrl: req.baseUrl,
      isUpdating: !!req.query.isUpdating,
    }
    try {
      const data = await productService.getAll(opcionesConsulta)
      if (data.status === 'Success') {
        if (req.session.user) {
          data.session = { email: req.session.user.email, isAdmin: req.session.user.rol === 'admin', user: req.session.user.firstName, message: req.flash('info') }
          req.session.user.message = null
        }
        if (opcionesConsulta.isUpdating) {
          return res.status(200).json(data)
        } else {
          res.render('home', data)
        }
      } else {
        return res.status(500).json({
          status: 'error',
          msg: 'something went wrong :(',
          data: {},
        })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error getting the products' })
    }
  }
  async getProductId(req, res) {
    const productId = req.params.pid
    const data = await productService.findById(productId)
    res.render('home', { data })
  }
  async createProduct(req, res) {
    try {
      const data = req.body
      const dataProduct = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        thumbnail: data.thumbnail,
        code: data.code,
        stock: data.stock,
      }
      const createProduct = await productService.createOne(dataProduct)
      return res.status(201).json({
        status: 'success',
        msg: 'product created',
        payload: createProduct,
      })
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        payload: {},
      })
    }
  }
  async updateProduct(req, res) {
    try {
      const data = req.body
      const dataProduct = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        thumbnail: data.thumbnail,
        code: data.code,
        stock: data.stock,
      }
      dataProduct.id = req.params.pid
      const resUpdate = await productService.updateOne(dataProduct)
      return res.status(201).json({
        status: 'success',
        msg: 'product uptaded',
        data: resUpdate,
      })
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      })
    }
  }
  async deleteProduct(req, res) {
    try {
      const productId = req.params.pid
      const resDelete = await productService.deletedOne(productId)
      return res.status(200).json({
        status: 'success',
        msg: 'product deleted',
        data: resDelete,
      })
    } catch (e) {
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        e,
        data: {},
      })
    }
  }
}
export const productController = new ProductController()
