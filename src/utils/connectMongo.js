import { connect, Schema, model } from 'mongoose'
import { ProductsModel } from '../DAO/models/products.model.js'
import { CartsModel } from '../DAO/models/carts.model.js'
import { faker } from '@faker-js/faker'

export const connectMongo = async () => {
  try {
    await connect('mongodb+srv://hero055:v1jGGXbhtPoSKple@backendcoder.tu6mnjp.mongodb.net/ecommerce?retryWrites=true&w=majority')
    console.log('plug to MONGODB!')

    /* async function poblar() {
      const products = []
      for (let i = 0; i < 3000; i++) {
        products.push({
          title: faker.commerce.product(),
          category: faker.commerce.department(),
          description: faker.commerce.productDescription(),
          category:faker.commerce.department(),
          price: faker.commerce.price({ min: 10, max: 2000, dec: 0, symbol: '$' }),
          thumbnail: faker.system.fileName(),
          code: faker.string.alphanumeric(10),
          stock: faker.number.int(100),
        })
      }
      try {
        await ProductsModel.insertMany(products)
        console.log('Inserted', products.length, 'products')
      } catch (error) {
        console.error('Error en insert many:', error)
      }
    }
    poblar() */

  } catch (e) {
    throw new Error('Can not connected')
  }
}
