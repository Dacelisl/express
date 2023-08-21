import { ticketFactory, cartFactory, productFactory } from '../DAO/factory.js'
import { isValid, randomCode, convertCurrencyToNumber } from '../utils/utils.js'

class TicketServices {
  async purchaseCart(id, dataUser) {
    try {
      if (id !== dataUser.cart)
        return {
          status: 'Fail',
          code: 404,
          data: {},
          msg: 'the cart does not belong to the user',
        }
      const cartFilter = await cartFactory.getCartWithProducts(dataUser.cart)
      const productsNotPurchased = []
      const productsToRemove = []
      let totalCost = 0
      const updatedProducts = await Promise.all(
        cartFilter.products.map(async (product) => {
          const productFiltered = await productFactory.getProductByID(product.productId._id)

          if (productFiltered.stock >= product.quantity) {
            productFiltered.stock -= product.quantity
            await productFiltered.save()
            productsToRemove.push(productFiltered)
            totalCost += convertCurrencyToNumber(productFiltered.price) * product.quantity
            return {
              purchasedProduct: productFiltered,
              purchasedQuantity: product.quantity,
            }
          } else if (productFiltered.stock > 0) {
            const remainingQuantity = productFiltered.stock
            productFiltered.stock = 0
            await productFiltered.save()
            totalCost += convertCurrencyToNumber(productFiltered.price) * remainingQuantity
            productsNotPurchased.push({
              product: productFiltered,
              remainingQuantity: product.quantity - remainingQuantity,
            })
            return {
              purchasedProduct: productFiltered,
              purchasedQuantity: remainingQuantity,
            }
          } else {
            productsNotPurchased.push({
              product: productFiltered,
              remainingQuantity: 0,
            })
            return null
          }
        })
      )
      productsToRemove.forEach(async (product) => {
        const resRemove = await cartFactory.removeProductsFromCart(dataUser.cart, product._id)
      })

      const cartUpdate = await cartFactory.getCartWithProducts(dataUser.cart)
      cartUpdate.products.forEach((product) => {
        productsNotPurchased.forEach((outStock) => {
          if (product.productId._id.toString() === outStock.product._id.toString()) {
            const newQuantity = outStock.remainingQuantity > 0 ? outStock.remainingQuantity : product.quantity
            product.quantity = newQuantity
          }
        })
      })
      await cartUpdate.save()
      const currentDate = new Date()
      const formattedDate = currentDate.toLocaleString()

      const newOrder = {
        code: randomCode(10),
        purchase_datetime: formattedDate,
        amount: totalCost,
        purchaser: dataUser.email,
        products: updatedProducts
          .filter((product) => product !== null)
          .map((product) => ({
            productId: product.purchasedProduct._id,
            quantity: product.purchasedQuantity,
          })),
      }
      await ticketFactory.addOrder(newOrder)

      return {
        status: 'Success',
        code: 200,
        data: newOrder,
        msg: 'Ticket created successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        data: {},
        msg: 'Internal Server Error',
        error,
      }
    }
  }

  async getTicketById(id) {
    try {
      const ticket = await ticketFactory.getOrderByCode(id)
      if (!ticket) {
        return {
          status: 'Fail',
          code: 404,
          data: {},
          msg: 'Ticket does not exist',
        }
      }
      return {
        status: 'Success',
        code: 200,
        data: ticket,
        msg: 'Ticket retrieved successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        data: {},
        msg: `Error: getTicketById ${error}`,
      }
    }
  }
}
export const ticketServices = new TicketServices()
