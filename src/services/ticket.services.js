import { ticketFactory, cartFactory, productFactory } from '../DAO/factory.js'
import { randomCode, convertCurrencyToNumber } from '../utils/utils.js'

class TicketServices {
  async purchaseCart(id, dataUser) {
    try {
      if (id !== dataUser.cart)
        return {
          status: 'Fail',
          code: 404,
          payload: {},
          message: 'the cart does not belong to the user',
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
        await cartFactory.removeProductsFromCart(dataUser.cart, product._id)
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
        message: 'Ticket created successfully',
        payload: newOrder,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Internal Server Error ${error}`,
        payload: {},
      }
    }
  }

  async getTicketByCode(code) {
    try {
      const ticket = await ticketFactory.getOrderByCode(code)
      if (!ticket) {
        return {
          status: 'Fail',
          code: 404,
          message: 'Ticket does not exist',
          payload: {},
        }
      }
      return {
        status: 'Success',
        code: 200,
        message: 'Ticket retrieved successfully',
        payload: ticket,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Error: getTicketById ${error}`,
        payload: {},
      }
    }
  }
  async getTicketById(id) {
    try {
      const ticket = await ticketFactory.getOrderById(id)
      if (!ticket) {
        return {
          status: 'Fail',
          code: 404,
          message: 'Ticket does not exist',
          payload: {},
        }
      }
      return {
        status: 'Success',
        code: 200,
        message: 'Ticket retrieved successfully',
        payload: ticket,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        message: `Error: getTicketById ${error}`,
        payload: {},
      }
    }
  }
  async deleteTicket(code) {
    try {
      const result = await ticketFactory.deleteTicket(code)
      if (!result) {
        return {
          status: 'Fail',
          code: 404,
          payload: result,
          message: 'The ticket does not exist',
        }
      }
      return {
        status: 'Success',
        code: 204,
        payload: result,
        message: 'Ticket deleted successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        payload: {},
        message: `Error deleteTicket: ${error}`,
      }
    }
  }
}
export const ticketServices = new TicketServices()
