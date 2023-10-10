export const generateProductErrorInfo = (product) => {
  return `One or more properties are incomplete or invalid!!! List of mandatory properties: Title: Must be a string. (Type:${typeof product.title}). Description: Must be a string. (Type:${typeof product.description}). Category: Must be a string. (Type:${typeof product.category}). Price: Must be a string. (Type:${typeof product.price}). Thumbnail: Must be a string. (Type:${typeof product.thumbnail}). Code: Must be a string. (Type:${typeof product.code}). owner: Must be a string. (Type:${typeof product.owner}). Stock: Must be a number. (Type:${typeof product.stock})`
}
export const generateUserErrorInfo = (user) => {
  return `One or more properties are incomplete or invalid!!! List of mandatory properties: firstName: Must be a string. (Type:${typeof user.firstName}). lastName: Must be a string. (Type:${typeof user.lastName}). email: Must be a string. (Type:${typeof user.email}). password: Must be a string. (Type:${typeof user.password}). age: Must be a number. (Type:${typeof user.age}). rol: Must be a string. (Type:${typeof user.rol}). cart: Must be a string. (Type:${typeof user.cart})`
}
export const generateTicketErrorInfo = (ticket) => {
  return `One or more properties are incomplete or invalid!!! List of mandatory properties: code: Must be a string. (Type:${typeof ticket.code}). purchase_datetime: Must be of type date. (Type:${typeof ticket.purchase_datetime}). amount: Must be a number. (Type:${typeof ticket.amount}).purchaser: Must be a string. (Type:${typeof ticket.purchaser}). products: Must be of type objectId of a product. (Type:${typeof ticket.products})`
}
export const generateCartErrorInfo = (cart) => {
  return `One or more properties are incomplete or invalid!!! List of mandatory properties: productId: must be of type objectId of a product. (Type:${typeof cart.productId}). quantity: Must be a number. (Type:${typeof cart.quantity})`
}
