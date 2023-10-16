import { faker } from '@faker-js/faker'

class MockServices {
  getAllProducts() {
    try {
      const products = Array.from({ length: 100 }, () => this.generateProduct())
      return {
        code: 200,
        status: 'success',
        message: 'data created',
        payload: products,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 500,
        payload: {},
        message: `Internal Server Error, ${error}`,
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
      thumbnail: faker.system.fileName(),
      code: faker.string.alphanumeric(10),
      owner: faker.internet.email(),
      stock: faker.number.int({ max: 100 }),
    }
  }
}

export const mockServices = new MockServices()
