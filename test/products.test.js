import chai from 'chai'
import supertest from 'supertest'
import dataConfig from '../src/config/process.config.js'
import { faker } from '@faker-js/faker'
import superagent from 'superagent'

const expect = chai.expect
const requester = supertest(`http://localhost:${dataConfig.port}`)
const URL = `http://localhost:${dataConfig.port}`

describe('tests API', () => {
  let mockUser = ''
  let productMock = ''
  let productId = ''
  let authenticatedAgent = '' /* usar para solicitudes con privilegios */

  before(async () => {
    mockUser = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 5 }),
      age: faker.number.int(60),
      rol: 'admin',
    }
  })
  after(async () => {
    const response = await requester.get(`/api/users/user/${mockUser.email}`)
    if (response) {
      await requester.delete(`/api/users/${mockUser.email}`)
    }
    /* if (productId) {
      await requester.delete(`/api/products/${productId}`).expect(204)
    } */
  })

  describe('Session test', () => {
    it('GET view /api/users/register', async () => {
      const response = await requester.get('/api/users/register')
      expect(response.req.method).to.equal('GET')
      expect(response.status).to.equal(200)
      expect(response.headers['content-type']).to.include('text/html')
      const responseBody = response.text
      expect(responseBody.includes('<h1>REGISTER')).to.be.true
    })
    it('POST /api/users/register', async () => {
      const response = await requester.post('/api/users/register').send(mockUser)
      expect(response.req.method).to.equal('POST')
      expect(response.status).to.equal(302)
      expect(response.header.location).to.equal('/api/users/login')
    })
    it('POST Fail-(email exist) /api/users/register', async () => {
      const response = await requester.post('/api/users/register').send(mockUser)
      expect(response.req.method).to.equal('POST')
      expect(response.status).to.equal(302)
      expect(response.header.location).to.equal('/api/users/register')
    })
    it('GET /api/users/user/:uid', async () => {
      const response = await requester.get(`/api/users/user/${mockUser.email}`)
      expect(response.req.method).to.equal('GET')
      expect(response.headers['content-type']).to.include('text/html')
      expect(response.status).to.equal(200)
      const responseBody = response.text
      expect(responseBody.includes('<h1>Edit User</h1>')).to.be.true
    })
    it('GET view /api/users/login', async () => {
      const response = await requester.get('/api/users/login')
      expect(response.req.method).to.equal('GET')
      expect(response.status).to.equal(200)
      expect(response.headers['content-type']).to.include('text/html')
      const responseBody = response.text
      expect(responseBody.includes('<h1>LOGIN')).to.be.true
    })
    it('POST fail-(wrong password) /api/users/login', async () => {
      const response = await requester.post('/api/users/login').send({ username: mockUser.email, password: mockUser.firstName })
      expect(response.req.method).to.equal('POST')
      expect(response.headers['content-type']).to.include('text/plain')
      expect(response.status).to.equal(302)
      expect(response.header.location).to.equal('/api/users/login')
    })
    it('POST /api/users/login', async () => {
      const response = await requester.post('/api/users/login').send({ email: mockUser.email, password: mockUser.password })
      expect(response.req.method).to.equal('POST')
      expect(response.headers['content-type']).to.include('text/plain')
      expect(response.status).to.equal(302)
      expect(response.header.location).to.equal('/api/products')
      const sessionCookie = response.headers['set-cookie'][0]
      const cookieName = sessionCookie.split('=')[0]
      const cookieValue = sessionCookie.split('=')[1].split(';')[0]
      authenticatedAgent = superagent.agent()
      authenticatedAgent.set('Cookie', [`${cookieName}=${cookieValue}`])
    })
    it('GET /api/users/current', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/current`)
      expect(response.req.method).to.equal('GET')
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.status).to.equal(200)
      expect(response._body.email).to.be.eql(mockUser.email)
    })
    it('GET /api/users/logout', async () => {
      const response = await requester.get('/api/users/logout')
      expect(response.req.method).to.equal('GET')
      expect(response.status).to.equal(302)
      expect(response.headers['content-type']).to.include('text/plain')
      expect(response.header.location).to.equal('/api/users/login')
    })
    it('UPDATE  /api/users/updateUser update user by ID', async () => {
      const updatedUser = mockUser
      updatedUser.firstName = faker.person.firstName()
      const response = await authenticatedAgent.post(`${URL}/api/users/updateUser`).send(updatedUser)
      expect(response.status).to.equal(200)
      expect(response.headers['content-type']).to.include('text/html')
      const responseBody = response.text
      expect(responseBody.includes('Information was successfully updated')).to.be.true
    })
    it('UPDATE fail (authorization error)  /api/users/updateUser', async () => {
      const updatedUser = mockUser
      updatedUser.email = faker.internet.email()
      const response = await requester.post(`/api/users/updateUser`).send(updatedUser)
      expect(response.status).to.equal(403)
      expect(response.headers['content-type']).to.include('text/html')
      const responseBody = response.text
      expect(responseBody.includes('authorization error')).to.be.true
    })
    it('DELETE fail-(User not found) /api/users/:uid  ', async () => {
      const response = await requester.delete(`/api/users/${mockUser.firstName}`)
      expect(response.req.method).to.equal('DELETE')
      expect(response.status).to.equal(404)
      expect(response.text).to.include('User not found')
    })
    it('DELETE /api/users/:uid  ', async () => {
      let newUser = mockUser
      newUser.email = faker.internet.email()
      await requester.post('/api/users/register').send(newUser)
      const response = await requester.delete(`/api/users/${newUser.email}`)
      expect(response.req.method).to.equal('DELETE')
      expect(response.status).to.equal(204)
      expect(response.text).to.equal('')
    })
  })

  describe('Products test', () => {
    before(async () => {
      productMock = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        price: faker.commerce.price({ min: 10, max: 2000, dec: 0, symbol: '$' }),
        thumbnail: faker.system.fileName(),
        code: faker.string.alphanumeric(10),
        owner: mockUser.email,
        stock: faker.number.int(100),
      }
    })
    it('POST /api/products', async () => {
      const response = await authenticatedAgent.post(`${URL}/api/products`).send(productMock)
      productId = response.body.payload._id
      expect(response.status).to.equal(201)
      expect(response.body.payload).to.have.property('_id')
      expect(response.headers['content-type']).to.include('application/json')
    })
    it('POST fail (duplicate code) /api/products', async () => {
      const response = await authenticatedAgent.post(`${URL}/api/products`).send(productMock)
      console.log('response duplicate', response)
      expect(response.status).to.equal(500)
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.text).to.include('MongoServerError:')
      expect(response.text).to.include('duplicate key')
    })
    it('POST fail (authorization error)  /api/products', async () => {
      const response = await requester.post(`/api/products`).send(productMock)
      expect(response.status).to.equal(403)
      expect(response.headers['content-type']).to.include('text/html')
      const responseBody = response.text
      expect(responseBody.includes('authorization error')).to.be.true
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
    it('GET /api/products/:pid', async () => {
      const response = await requester.get(`/api/products/${productId}`)
      expect(response.status).to.equal(200)
      expect(response.headers['content-type']).to.include('text/html')
      const responseBody = response.text
      expect(responseBody.includes("<h1 class='title'>")).to.be.true
      const productPattern = /<ul class='product-single'>/g
      const productMatches = responseBody.match(productPattern)
      expect(productMatches.length).to.be.greaterThan(0)
    })
    it('UPDATE  /api/products/:pid update products by ID   ', async () => {
      const updatedProduct = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        price: faker.commerce.price({ min: 10, max: 2000, dec: 0, symbol: '$' }),
        thumbnail: faker.system.fileName(),
        stock: faker.number.int(100),
      }
      const response = await requester.put(`/api/products/${productId}`).send(updatedProduct)
      expect(response.status).to.equal(200)
      expect(response.headers['content-type']).to.include('application/json')
    })
    it('DELETE fail-(Product not found) /api/products:pid  ', async () => {
      const response = await requester.delete(`/api/products/${productMock.title}`)
      expect(response.req.method).to.equal('DELETE')
      expect(response.status).to.equal(500)
    })
    it('DELETE /api/products:pid  ', async () => {
      let newProduct = productMock
      newProduct.code = faker.string.alphanumeric(10)
      const productDelete = await requester.post('/api/products').send(newProduct)
      const response = await authenticatedAgent.delete(`${URL}/api/products/${productDelete.body.payload._id}`)
      expect(response.req.method).to.equal('DELETE')
      expect(response.status).to.equal(204)
      expect(response.text).to.equal('')
    })
  })
  /* describe('Carts test', () => {
    let cartId = ''
    before(async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/current`)
      mockUser.cart = response._body.cart
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
      cartId = response.body.payload._id
      expect(response.status).to.equal(201)
      expect(response.body.payload).to.have.property('_id')
      expect(response.body.message).to.include('cart created')
      expect(response.headers['content-type']).to.include('application/json')
    })
    it('GET /api/carts get cart by ID', async () => {
      const response = await requester.get(`/api/carts/${mockUser.cart}`)
      expect(response.status).to.equal(200)
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('products').that.is.an('array')
    })
    it('POST /api/carts addProduct to cart', async () => {
      const response = await requester.post(`/api/carts/${mockUser.cart}/product/${productId}`)
      expect(response.status).to.equal(201)
      expect(response.body.payload).to.have.property('_id')
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.body.payload).to.have.property('products').that.is.an('array')
    })
    it('GET /api/carts get cart with all products', async () => {
      const response = await requester.get(`/api/carts/${mockUser.cart}`)
      expect(response.status).to.equal(200)
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('products').that.is.an('array')
      expect(response.body.payload.products).to.have.lengthOf.at.least(1)
    })
    it('UPDATE  /api/carts update product in cart', async () => {
      const response = await requester.put(`/api/carts/${mockUser.cart}/product/${productId}`).send({ quantity: 5 })
      expect(response.status).to.equal(201)
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('_id')
      expect(response.body.payload).to.have.property('products').that.is.an('array')
    })
    it('DELETE /:cid/product/:pid delete product in cart', async () => {
      const response = await requester.delete(`/${mockUser.cart}/product/${productId}`)
      console.log('data product', response)
      expect(response.status).to.equal(204)
      expect(response.text).to.equal('')
    })
    it('DELETE /api/carts delete cart by ID   ', async () => {
      const response = await requester.delete(`/api/carts/${cartId}`)
      expect(response.status).to.equal(204)
      expect(response.text).to.equal('')
    })
  }) */
})
