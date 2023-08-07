import { ticketFactory, cartFactory, productFactory } from '../DAO/factory'
import { isValid } from '../utils/utils.js'

class TicketServices {
  async purchaseCart(cartId, cartList, userMail, userCartId) {
    try {
      isValid(cartId)

      const cartFiltered = await cartFactory.getCartWithProducts(cartId)

      const productsNotPurchased = []

      const products = await Promise.all(
        cartList.map(async (product) => {
          const productFiltered = await productFactory.getById(product.id)
          // console.log('FLAG: Product filtered: ', productFiltered);

          if (!productFiltered) {
            return {
              status: 400,
              result: {
                status: 'error',
                error: `🛑 Product not found.`,
              },
            }
          }

          if (productFiltered.stock >= product.quantity) {
            productFiltered.stock -= product.quantity
            await productFiltered.save()
            return productFiltered
          } else {
            productsNotPurchased.push(product) // Agrega el producto a la lista de productos no comprados
            return null
          }
        })
      )

      // Filtra los productos que no se compraron
      const productsFiltered = products.filter((product) => product !== null)

      if (productsFiltered.length === 0) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `🛑 No products available.`,
          },
        }
      }

      // Calcula el total de la compra
      const totalAmount = cartList.reduce((acc, product) => {
        const productFiltered = productsFiltered.find((p) => p._id.equals(product.id))
        if (productFiltered) {
          acc += productFiltered.price * product.quantity
        }
        return acc
      }, 0)

      // console.log('FLAG Total amount: ', totalAmount);

      // Crea la orden
      const newOrder = {
        code: Math.floor(Math.random() * 1000000),
        purchase_datetime: new Date(),
        amount: +totalAmount,
        purchaser: userMail,
        products: productsFiltered.map((product) => ({
          id: product._id,
          quantity: cartList.find((p) => p.id === product._id.toString()).quantity,
        })),
      }

      const orderCreated = await ticketFactory.add(newOrder) // dao listo PASAR

      // Borra los productos comprados del carrito
      if (productsFiltered.length > 0) {
        await Services.deleteProduct(
          cartId,
          productsFiltered.map((product) => product._id)
        )
        // console.log('FLAG Productos comprados: ', productsFiltered);
        //Limpia carrito cuando se compra
        await Services.deleteCart(cartId)
      }
      // Agrega los productos no comprados al carrito
      if (productsNotPurchased.length > 0) {
        await Services.updateCart(cartId, productsNotPurchased)
        // console.log('FLAG Productos no comprados: ', productsNotPurchased);
      }

      return {
        status: 200,
        result: { status: 'success', payload: orderCreated },
      }
    } catch (err) {
      console.log(err)
      return {
        status: 500,
        result: { status: 'error', msg: 'Internal Server Error', payload: {} },
      }
    }
  }

  async getTicketById(id) {
    try {
      isValid(id)
      const ticket = await ticketFactory.getById(id)
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
      console.log(err)
      return {
        status: 'Fail',
        code: 500,
        data: {},
        msg: `Error: ${error}`,
      }
    }
  }
}
export const ticketServices = new TicketServices()
