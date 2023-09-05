import CustomError from '../utils/errors/custom.error.js'
import { EErrors } from '../utils/errors/enums.js'
import { generateProductErrorInfo, generateUserErrorInfo } from '../utils/errors/info.error.js'

export function handleUserCreationError(req, res, next) {
  const data = req.body
  if (!data.firstName || !data.lastName || !data.email || !data.age || !data.password) {
    req.logger.error('something went wrong UserCreation')
    next(new CustomError(EErrors.USER_CREATION, generateUserErrorInfo(data)))
  } else {
    next()
  }
}
export function handleProductCreationError(req, res, next) {
  const data = req.body
  const dataProduct = {
    title: data.title,
    description: data.description,
    category: data.category,
    price: data.price,
    thumbnail: data.thumbnail,
    code: data.code,
    owner: data.owner,
    stock: data.stock,
  }
  const requiredProperties = ['title', 'description', 'category', 'price', 'thumbnail', 'code', 'owner', 'stock']
  const missingProperties = requiredProperties.filter((property) => !dataProduct.hasOwnProperty(property) || dataProduct[property] === undefined)
  if (missingProperties.length > 0) {
    req.logger.error('something went wrong generateProduct')
    next(new CustomError(EErrors.PRODUCT_CREATION, generateProductErrorInfo(data)))
  } else {
    next()
  }
}
