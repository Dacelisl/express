import chai from 'chai'
import supertest from 'supertest'
import dataConfig from '../src/config/process.config.js'
import { faker } from '@faker-js/faker'

const expect = chai.expect
const requester = supertest(`http://localhost:${dataConfig.port}`)

describe('Products test', () => {
  let productId = ''
  before(async () => {
    const product = {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      price: faker.commerce.price({ min: 10, max: 2000, dec: 0, symbol: '$' }),
      thumbnail: faker.system.fileName(),
      code: faker.string.alphanumeric(10),
      owner: 'fakeMail@mail.com',
      stock: faker.number.int(100),
    }
    const response = await requester.post('/api/products').send(product)
    productId = response.body.payload._id
  })
  after(async () => {
    if (productId) {
      await requester.delete(`/api/products/${productId}`).expect(204)
    }
  })
  it('POST /api/products product register  ', async () => {
    const productMock = {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      price: faker.commerce.price({ min: 10, max: 2000, dec: 0, symbol: '$' }),
      thumbnail: faker.system.fileName(),
      code: faker.string.alphanumeric(10),
      owner: 'fakeMail@mail.com',
      stock: faker.number.int(100),
    }
    const response = await requester.post('/api/products').send(productMock)
    expect(response.status).to.equal(201)
    expect(response.body.payload).to.have.property('_id')
    expect(response.headers['content-type']).to.include('application/json')
  })
  it('GET /api/products get all products   ', async () => {
    const response = await requester.get('/api/products')
    expect(response.status).to.equal(200)
    expect(response.headers['content-type']).to.include('text/html')
    const responseBody = response.text
    expect(responseBody.includes("<h1 class='title'>")).to.be.true
    const productPattern = /<ul class='product-list'>/g
    const productMatches = responseBody.match(productPattern)
    expect(productMatches.length).to.be.greaterThan(3)
  })
  it('GET /api/products get products by ID   ', async () => {
    const response = await requester.get('/api/products/64e394a9e1a8b022934165ba')
    expect(response.status).to.equal(200)
    expect(response.headers['content-type']).to.include('text/html')
    const responseBody = response.text
    expect(responseBody.includes("<h1 class='title'>")).to.be.true
    const productPattern = /<ul class='product-single'>/g
    const productMatches = responseBody.match(productPattern)
    expect(productMatches.length).to.be.greaterThan(0)
  })
  it('UPDATE  /api/products get products by ID   ', async () => {
    const updatedProduct = {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      price: faker.commerce.price({ min: 10, max: 2000, dec: 0, symbol: '$' }),
      thumbnail: faker.system.fileName(),
      code: faker.string.alphanumeric(10),
      owner: 'fakeMail@mail.com',
      stock: faker.number.int(100),
    }
    const response = await requester.put(`/api/products/${productId}`).send(updatedProduct)
    expect(response.status).to.equal(200)
    expect(response.headers['content-type']).to.include('application/json')
  })
  it('DELETE /api/products update product by ID   ', async () => {
    const response = await requester.delete(`/api/products/${productId}`)
    expect(response.status).to.equal(204)
    expect(response.text).to.equal('')
  })
})
describe('Carts test', () => {
  let cartId = ''
  let productId = ''

  before(async () => {
    const product = {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      price: faker.commerce.price({ min: 10, max: 2000, dec: 0, symbol: '$' }),
      thumbnail: faker.system.fileName(),
      code: faker.string.alphanumeric(10),
      owner: 'fakeMail@mail.com',
      stock: faker.number.int(100),
    }
    const response = await requester.post('/api/products').send(product)
    productId = response.body.payload._id
  })

  after(async () => {
    if (cartId) {
      await requester.delete(`/api/carts/${cartId}`).expect(204)
    }
    if (productId) {
      await requester.delete(`/api/products/${productId}`).expect(204)
    }
  })
  it('POST /api/carts create cart ', async () => {
    const response = await requester.post('/api/carts')
    cartId = response.body.data._id
    expect(response.status).to.equal(201)
    expect(response.body.data).to.have.property('_id')
    expect(response.body.msg).to.include('cart created')
    expect(response.headers['content-type']).to.include('application/json')
  })
  it('GET /api/carts get cart by ID', async () => {
    const response = await requester.get(`/api/carts/${cartId}`)
    expect(response.status).to.equal(200)
    expect(response.headers['content-type']).to.include('application/json')
    expect(response.body).to.have.property('data')
    expect(response.body.data).to.have.property('products').that.is.an('array')
  })
  it('POST /api/carts addProduct to cart', async () => {
    const response = await requester.post(`/api/carts/${cartId}/product/${productId}`)
    expect(response.status).to.equal(201)
    expect(response.body.data).to.have.property('_id')
    expect(response.headers['content-type']).to.include('application/json')
    expect(response.body.data).to.have.property('products').that.is.an('array')
  })
  it('GET /api/carts get cart with all products', async () => {
    const response = await requester.get(`/api/carts/${cartId}`)
    expect(response.status).to.equal(200)
    expect(response.headers['content-type']).to.include('application/json')
    expect(response.body).to.have.property('data')
    expect(response.body.data).to.have.property('products').that.is.an('array')
    expect(response.body.data.products).to.have.lengthOf.at.least(1)
  })
  it('UPDATE  /api/carts update product in cart', async () => {
    const updatedProduct = {
      quantity: 5,
    }
    const response = await requester.put(`/api/carts/${cartId}/product/${productId}`).send(updatedProduct)
    console.log('res', response);
    expect(response.status).to.equal(200)
    expect(response.headers['content-type']).to.include('application/json')
  })
  /* 
  it('DELETE /api/carts update product by ID   ', async () => {
    const response = await requester.delete(`/api/carts/${productId}`)
    expect(response.status).to.equal(204)
    expect(response.text).to.equal('')
  }) */
})
