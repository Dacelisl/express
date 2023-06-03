import { connect, Schema, model } from 'mongoose'
import { ProductsModel } from '../DAO/models/products.model.js'
import { CartsModel } from '../DAO/models/carts.model.js'
import { faker } from '@faker-js/faker'

export const connectMongo = async () => {
  try {
    await connect('mongodb+srv://hero055:v1jGGXbhtPoSKple@backendcoder.tu6mnjp.mongodb.net/?retryWrites=true&w=majority')

    console.log('plug to MONGODB!')
    /* insert Data */
    /* let products = await ProductsModel.find({})
    console.log(JSON.stringify(products, null, 2))
     let products = await ProductsModel.findOne({ _id: '6477bde9d7627dafa9ea28b2' }); .populate('courses.course');
    console.log(JSON.stringify(products, null, 2)); */

    /* let student = await ProductsModel.findOne({ _id: '6477be0ac11ecddd0d42aa51' });
    student.courses.push({ course: '6477c6d4c8f14bc83cca80f1' });
    let res = await ProductsModel.updateOne({ _id: '6477be0ac11ecddd0d42aa51' }, student);
    console.log(res); */

    /* const created = ProductsModel.create({
       title: 'Mango'  ,
  description: 'Fruta'  ,
  price: '200' ,
  thumbnail: 'ruta de la imagen'  ,
  code: 'M4760' ,
  stock: '20' ,
    }); */

    /* const created = CartsModel.create({
      products: [],
    }); */

    /* let res = await ProductsModel.find({ title: 'mango' }).explain('executionStats');
    console.log(res); */

    /* async function poblar() {
      const products = []
      for (let i = 0; i < 3000; i++) {
        products.push({
          title: faker.commerce.product(),
          description: faker.commerce.productDescription(),
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

    /* END */
  } catch (e) {
    console.log('Error', e)
    throw new Error('Can not connected')
  }
}
