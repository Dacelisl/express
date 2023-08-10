import { EErrors } from '../services/errors/enums.js'

export default (error, req, res, next) => {
  switch (error.code) {
    case EErrors.PRODUCT_ALREADY_EXISTS:
      break
    case EErrors.INVALID_TYPES_ERROR:
      res.status(400).send({ status: 'error', error: error.name, cause: error.cause })
      break
    case EErrors.INVALID_REQUEST:
      break

    default:
      res.send({ status: 'error', error: 'Unhandled error' })
      break
  }
}
