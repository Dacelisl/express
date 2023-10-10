import { connect, Schema, model } from 'mongoose'
import { ProductsModel } from '../DAO/mongo/models/products.model.js'
import { faker } from '@faker-js/faker'
import dataConfig from '../config/process.config.js'
import { logger } from './logger.js'

let mongoConnectionInstance = null

export const connectMongo = async () => {
  if (!mongoConnectionInstance) {
    try {
      const dbConnection = await connect(`mongodb+srv://${dataConfig.userName}:${dataConfig.secretKey}@backendcoder.tu6mnjp.mongodb.net/${dataConfig.databaseName}?retryWrites=true&w=majority`)
      logger.info('Connected to MongoDB!')
      mongoConnectionInstance = dbConnection
      try {
        await dbConnection.syncIndexes()
        logger.info('Indexes synchronized successfully')
      } catch (error) {
        logger.error('Error synchronizing indexes:', error)
      }
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
        logger.info('Inserted', products.length, 'products')
      } catch (error) {
        throw new Error('Error en insert many:', error)
      }
    }
    poblar() */
    } catch (e) {
      throw new Error('Can not connect to MongoDB')
    }
  }
  return mongoConnectionInstance
}
