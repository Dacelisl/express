import {faker} from '@faker-js/faker'

class MockServices {
  getAllProducts() {
    try {
      const products = Array.from({ length: 100 }, () => this.generateProduct())
      return {
        code: 200,
        status: 'success',
        data: products,
      }
    } catch (error) {
      return {
        code: 500,
        status: 'Fail',
        message: `Internal Server Error, ${error}`,
        data: {},
      }
    }
  }

  generateProduct() {
    return {
      _id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      price: faker.commerce.price({ min: 10, max: 2000, dec: 0, symbol: '$' }),
      thumbnails: faker.system.fileName(),
      code: faker.string.alphanumeric(10),
      stock: faker.number.int({ max: 100 }),
    }
  }
}

export const mockServices = new MockServices()
