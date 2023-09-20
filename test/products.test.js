import chai from 'chai'
import supertest from 'supertest'
import dataConfig from '../src/config/process.config.js'
import { faker } from '@faker-js/faker'

const expect = chai.expect
const requester = supertest(`http://localhost:${dataConfig.port}`)

describe('Session test', () => {
  let cookieName = ''
  let cookieValue = ''
  const mockUser = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 5 }),
    age: faker.number.int(60),
    rol: 'admin',
  }
  it('GET /api/sessions/register user', async () => {
    const response = await requester.get('/api/sessions/register')
    expect(response.req.method).to.equal('GET')
    expect(response.status).to.equal(200)
    expect(response.headers['content-type']).to.include('text/html')
    const responseBody = response.text
    expect(responseBody.includes('<h1>REGISTER')).to.be.true
  })
  it('POST /api/sessions/register user', async () => {
    const response = await requester.post('/api/sessions/register').send(mockUser)
    expect(response.req.method).to.equal('POST')
    expect(response.status).to.equal(302)
    expect(response.header.location).to.equal('/api/sessions/login')
  })
  it('POST Fail /api/sessions/register user', async () => {
    const response = await requester.post('/api/sessions/register').send(mockUser)
    expect(response.req.method).to.equal('POST')
    expect(response.status).to.equal(302)
    expect(response.header.location).to.equal('/api/sessions/register')
  })
  it('GET /api/sessions/login user', async () => {
    const response = await requester.get('/api/sessions/login')
    expect(response.req.method).to.equal('GET')
    expect(response.status).to.equal(200)
    expect(response.headers['content-type']).to.include('text/html')
    const responseBody = response.text
    expect(responseBody.includes('<h1>LOGIN')).to.be.true
  })
  it('POST fail /api/sessions/login user', async () => {
    const response = await requester.post('/api/sessions/login').send({ username: mockUser.email, password: mockUser.firstName })
    expect(response.req.method).to.equal('POST')
    expect(response.headers['content-type']).to.include('text/plain')
    expect(response.status).to.equal(302)
    expect(response.header.location).to.equal('/api/sessions/login')
  })
  it('POST /api/sessions/login user', async () => {
    const response = await requester.post('/api/sessions/login').send(mockUser)
    expect(response.req.method).to.equal('POST')
    expect(response.headers['content-type']).to.include('text/plain')
    expect(response.status).to.equal(302)
    expect(response.header.location).to.equal('/api/products')
    const sessionCookie = response.headers['set-cookie'][0]
    cookieName = sessionCookie.split('=')[0]
    const cookieRest = sessionCookie.split('=')[1]
    cookieValue = cookieRest.split(';')[0]
  })
  it('GET /api/sessions/current user', async () => {
    const response = await requester.get('/api/sessions/current').set('Cookie', [`${cookieName}=${cookieValue}`])
    expect(response.req.method).to.equal('GET')
    expect(response.headers['content-type']).to.include('application/json')
    expect(response.status).to.equal(200)
    expect(response._body.email).to.be.eql(mockUser.email)
  })
  it('GET /api/sessions/logout user', async () => {
    const response = await requester.get('/api/sessions/logout')
    expect(response.req.method).to.equal('GET')
    expect(response.status).to.equal(302)
    expect(response.headers['content-type']).to.include('text/plain')
    expect(response.header.location).to.equal('/api/sessions/login')
  })
  it('DELETE /api/sessions/ delete user ', async () => {
    const response = await requester.delete(`/api/sessions/${mockUser.email}`)
    expect(response.req.method).to.equal('DELETE')
    expect(response.status).to.equal(204)
    expect(response.text).to.equal('')
  })
})
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
  it('DELETE /api/products delete product by ID   ', async () => {
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
    const response = await requester.put(`/api/carts/${cartId}/product/${productId}`).send({ quantity: 5 })
    expect(response.status).to.equal(201)
    expect(response.headers['content-type']).to.include('application/json')
    expect(response.body).to.have.property('data')
    expect(response.body.data).to.have.property('_id')
    expect(response.body.data).to.have.property('products').that.is.an('array')
  })
  it('DELETE /api/carts update product by ID   ', async () => {
    const response = await requester.delete(`/api/carts/${cartId}`)
    expect(response.status).to.equal(204)
    expect(response.text).to.equal('')
  })
})
