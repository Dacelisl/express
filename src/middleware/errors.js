import { EErrors } from '../utils/errors/enums.js'

export const errorHandler = (error, req, res, next) => {
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res.status(400).send({
        status: 'error',
        message: EErrors.INVALID_TYPES_ERROR.message,
        cause: EErrors.INVALID_TYPES_ERROR.cause,
        handleError: error.message,
      })
      break
    case EErrors.DATABASES_ERROR:
      res.status(500).send({
        status: 'error',
        message: EErrors.DATABASES_ERROR.message,
        cause: EErrors.DATABASES_ERROR.cause,
        handleError: error.message,
      })
      break

    case EErrors.USER_CREATION:
      res.status(500).send({
        status: 'error',
        message: EErrors.USER_CREATION.message,
        cause: EErrors.USER_CREATION.cause,
        handleError: error.message,
      })
      break
    case EErrors.PRODUCT_CREATION:
      res.status(500).send({
        status: 'error',
        message: EErrors.PRODUCT_CREATION.message,
        cause: EErrors.PRODUCT_CREATION.cause,
        handleError: error.message,
      })
      break
    case EErrors.ROUTING_ERROR:
      res.status(404).send({
        status: 'error',
        message: EErrors.ROUTING_ERROR.message,
        cause: EErrors.ROUTING_ERROR.cause,
        handleError: error.message,
      })
      break
    case EErrors.NETWORK_ERROR:
      res.status(504).send({
        status: 'error',
        message: EErrors.NETWORK_ERROR.message,
        cause: EErrors.NETWORK_ERROR.cause,
        handleError: error.message,
      })
      break
    default:
      res.send({ status: 'error', message: 'Unhandled error' })
      break
  }
}
