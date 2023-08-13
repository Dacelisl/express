export const EErrors = {
  ROUTING_ERROR: {
    message: 'Routing Error',
    cause: 'The requested route is not valid.',
  },
  INVALID_TYPES_ERROR: {
    message: 'Invalid Types Error',
    cause: 'Some of the provided data has incorrect types.',
  },
  DATABASES_ERROR: {
    message: 'Database Error',
    cause: 'There was an issue with the database operation.',
  },
  AUTHENTICATION_ERROR: {
    message: 'Authentication Error',
    cause: 'Authentication failed or user is not authorized.',
  },
  PERMISSION_ERROR: {
    message: 'Permission Error',
    cause: 'The user does not have the necessary permissions.',
  },
  NETWORK_ERROR: {
    message: 'Network Error',
    cause: 'There was an issue with the network connection.',
  },
  PRODUCT_ALREADY_EXISTS: {
    message: 'Product Already Exists',
    cause: 'A product with the same information already exists.',
  },
  USER_CREATION: {
    message: 'User Creation Error',
    cause: 'There was an error while creating a user.',
  },
  PRODUCT_CREATION: {
    message: 'Product Creation Error',
    cause: 'There was an error while creating a product.',
  },
}
