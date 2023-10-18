import { connect } from 'mongoose'
import dataConfig from '../config/process.config.js'
import { logger } from './logger.js'

let mongoConnectionInstance = null

export const connectMongo = async () => {
  if (!mongoConnectionInstance) {
    try {
      const dbConnection = await connect(`mongodb+srv://${dataConfig.userName}:${dataConfig.secretKey}@backendcoder.tu6mnjp.mongodb.net/${dataConfig.databaseName}?retryWrites=true&w=majority`)
      logger.info('Connected to MongoDB!')
      mongoConnectionInstance = dbConnection
      await dbConnection.syncIndexes()
    } catch (e) {
      throw new Error('Can not connect to MongoDB', e)
    }
  }
  return mongoConnectionInstance
}
