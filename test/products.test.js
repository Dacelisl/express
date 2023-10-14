import chai from 'chai'
import supertest from 'supertest'
import dataConfig from '../src/config/process.config.js'
import { faker } from '@faker-js/faker'
import superagent from 'superagent'

const expect = chai.expect
const URL = `http://localhost:${dataConfig.port}`
const requester = supertest(URL)

const authSession = async (requester, mockUser) => {
  const response = await requester.post('/api/users/login').send({ email: mockUser.email, password: mockUser.password })
  const sessionCookie = response.headers['set-cookie'][0]
  const cookieName = sessionCookie.split('=')[0]
  const cookieValue = sessionCookie.split('=')[1].split(';')[0]
  const authToken = superagent.agent()
  authToken.set('Cookie', [`${cookieName}=${cookieValue}`])
  return authToken
}

describe('tests API', () => {
  let mockUser = ''
  let productMock = ''
  let productId = ''
  let newCart = ''
  let ticketId = ''
  let authenticatedAgent = ''

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
    const response = await authenticatedAgent.get(`${URL}/api/users/user/${mockUser.email}`)

    if (response.ok) {
      await authenticatedAgent.delete(`${URL}/api/products/${productId}`)
      await authenticatedAgent.delete(`${URL}/api/users/${mockUser.email}`)
    }
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
      authenticatedAgent = await authSession(requester, mockUser)
    })
    it('GET /api/users/user/:uid', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/user/${mockUser.email}`)
      expect(response.req.method).to.equal('GET')
      expect(response.headers['content-type']).to.include('text/html')
      expect(response.status).to.equal(200)
      const responseBody = response.text
      expect(responseBody.includes('<h1>Edit User</h1>')).to.be.true
    })
    it('GET /api/users/current', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/current`)
      expect(response.req.method).to.equal('GET')
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.status).to.equal(200)
      expect(response._body.email).to.be.eql(mockUser.email)
    })
    it('GET /api/users/logout', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/logout`)
      expect(response.req.method).to.equal('GET')
      expect(response.status).to.equal(200)
      expect(response.headers['content-type']).to.include('text/html')
      const responseBody = response.text
      expect(responseBody.includes('<h1>LOGIN</h1>')).to.be.true
      authenticatedAgent = await authSession(requester, mockUser)
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
      updatedUser.firstName = faker.person.firstName()
      const response = await requester.post(`/api/users/updateUser`).send(updatedUser)
      expect(response.status).to.equal(403)
      expect(response.headers['content-type']).to.include('text/html')
      const responseBody = response.text
      expect(responseBody.includes('authorization error')).to.be.true
    })
    it('DELETE fail (authorization error) /api/users/:uid  ', async () => {
      const response = await requester.delete(`/api/users/${mockUser.email}`)
      expect(response.req.method).to.equal('DELETE')
      expect(response.status).to.equal(403)
      expect(response.text).to.include('authorization error')
    })
    it('DELETE fail-(User not found) /api/users/:uid  ', async () => {
      let response = ''
      try {
        response = await authenticatedAgent.delete(`${URL}/api/users/${mockUser.firstName}`)
      } catch (error) {
        response = error.response
      }
      expect(response.status).to.equal(404)
      expect(response.req.method).to.equal('DELETE')
      expect(response.type).to.equal('application/json')
      expect(response.body.message).to.include('User not found')
    })
    it('DELETE /api/users/:uid  ', async () => {
      let newUser = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 5 }),
        age: faker.number.int(60),
        rol: 'admin',
      }
      await requester.post('/api/users/register').send(newUser)
      const response = await authenticatedAgent.delete(`${URL}/api/users/${newUser.email}`)
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
      expect(response.status).to.equal(201)
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.body.payload).to.have.property('_id')
      productId = response.body.payload._id
    })
    it('POST fail (duplicate code) /api/products', async () => {
      let response = ''
      try {
        await authenticatedAgent.post(`${URL}/api/products`).send(productMock)
      } catch (error) {
        response = error.response
      }
      expect(response.status).to.equal(500)
      expect(response.req.method).to.equal('POST')
      expect(response.type).to.equal('application/json')
      expect(response.body.message).to.include('duplicate key error')
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
      const response = await authenticatedAgent.put(`${URL}/api/products/${productId}`).send(updatedProduct)
      expect(response.status).to.equal(200)
      expect(response.req.method).to.equal('PUT')
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.text).to.include('"modifiedCount":1')
    })
    it('DELETE fail (authorization error) /api/products:pid  ', async () => {
      const response = await requester.delete(`/api/products/${productId}`)
      expect(response.status).to.equal(403)
      expect(response.headers['content-type']).to.include('text/html')
      const responseBody = response.text
      expect(responseBody.includes('authorization error')).to.be.true
    })
    it('DELETE /api/products:pid  ', async () => {
      let newProduct = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        price: faker.commerce.price({ min: 10, max: 2000, dec: 0, symbol: '$' }),
        thumbnail: faker.system.fileName(),
        code: faker.string.alphanumeric(10),
        owner: mockUser.email,
        stock: faker.number.int(100),
      }
      const productDelete = await authenticatedAgent.post(`${URL}/api/products`).send(newProduct)
      const response = await authenticatedAgent.delete(`${URL}/api/products/${productDelete.body.payload._id}`)
      expect(response.req.method).to.equal('DELETE')
      expect(response.status).to.equal(204)
      expect(response.text).to.equal('')
    })
  })

  describe('Carts test /api/carts/', () => {
    before(async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/current`)
      mockUser.cart = response._body.cart
    })

    it('GET /api/carts view fail (Authentication Error)', async () => {
      const response = await requester.get(`/api/carts/`)
      expect(response.status).to.equal(401)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('Authentication Error!')
    })
    it('GET /api/carts view ', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/carts/`)
      expect(response.status).to.equal(200)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('PRODUCT LIST FROM CART')
    })
    it('GET /:cid getCartId', async () => {
      const response = await requester.get(`/api/carts/${mockUser.cart}`)
      expect(response.status).to.equal(200)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('application/json')
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('products').that.is.an('array')
    })
    it('POST /api/carts/ createCart', async () => {
      const response = await requester.post('/api/carts')
      newCart = response.body.payload._id
      expect(response.status).to.equal(201)
      expect(response.req.method).to.equal('POST')
      expect(response.type).to.equal('application/json')
      expect(response.body.payload).to.have.property('_id')
      expect(response.body.message).to.include('cart created')
    })
    it('POST /:cid/product/:pid fail (Authentication Error)', async () => {
      const response = await requester.post(`/api/carts/${mockUser.cart}/product/${productId}`)
      expect(response.status).to.equal(401)
      expect(response.req.method).to.equal('POST')
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('Authentication Error!')
    })
    it('POST /:cid/product/:pid addProduct', async () => {
      const response = await authenticatedAgent.post(`${URL}/api/carts/${mockUser.cart}/product/${productId}`)
      expect(response.status).to.equal(201)
      expect(response.req.method).to.equal('POST')
      expect(response.body.payload).to.have.property('_id')
      expect(response.type).to.equal('application/json')
      expect(response.body.payload).to.have.property('products').that.is.an('array')
    })
    it('GET /current/cart fail (Authentication Error)', async () => {
      const response = await requester.get(`/current/cart`)
      expect(response.status).to.equal(401)
      expect(response.req.method).to.equal('GET')
      expect(response.text).to.include('Unauthorized')
    })
    it('GET /current/cart currentCart', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/carts/current/cart`)
      expect(response.status).to.equal(200)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('application/json')
      expect(response.text).to.include(mockUser.cart)
    })
    it('UPDATE /:cid/product/:pid fail (Authentication Error)', async () => {
      const response = await requester.put(`/api/carts/${mockUser.cart}/product/${productId}`).send({ quantity: 5 })
      expect(response.status).to.equal(403)
      expect(response.req.method).to.equal('PUT')
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('authorization error')
    })
    it('UPDATE /:cid/product/:pid updateAddToCart', async () => {
      const response = await authenticatedAgent.put(`${URL}/api/carts/${mockUser.cart}/product/${productId}`).send({ quantity: 5 })
      expect(response.status).to.equal(201)
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('_id')
      expect(response.body.payload).to.have.property('products').that.is.an('array')
    })
    it('DELETE /:cid/product/:pid fail (Authentication Error)', async () => {
      const response = await requester.delete(`/${mockUser.cart}/product/${productId}`)
      expect(response.status).to.equal(401)
      expect(response.req.method).to.equal('DELETE')
      expect(response.text).to.include('Unauthorized')
    })
    it('DELETE /:cid/product/:pid deletedProduct', async () => {
      const response = await authenticatedAgent.delete(`${URL}/api/carts/${mockUser.cart}/product/${productId}`)
      expect(response.status).to.equal(204)
      expect(response.req.method).to.equal('DELETE')
      expect(response.text).to.equal('')
    })
    it('DELETE /api/carts/:cid fail (Authentication Error) ', async () => {
      const response = await requester.delete(`/api/carts/${newCart}`)
      expect(response.status).to.equal(403)
      expect(response.req.method).to.equal('DELETE')
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('authorization error')
    })
    it('DELETE /api/carts/:cid deleteCart', async () => {
      const response = await authenticatedAgent.delete(`${URL}/api/carts/${newCart}`)
      expect(response.status).to.equal(204)
      expect(response.req.method).to.equal('DELETE')
      expect(response.text).to.equal('')
    })
  })
  describe('Tickets test /api/tickets/', () => {
    it('UPDATE /:cid/purchase purchaseCart', async () => {
      const response = await authenticatedAgent.put(`${URL}/api/tickets/${mockUser.cart}/purchase`)
      expect(response.status).to.equal(200)
      expect(response.req.method).to.equal('PUT')
      expect(response.type).to.equal('application/json')
      expect(response.body.message).to.include('Ticket created successfully')
      expect(response.body.payload.purchaser).to.include(mockUser.email)
      expect(response.body.payload).to.have.property('products').that.is.an('array')
      mockUser.ticket = response.body.payload.code
    })
    it('GET fail /purchase/code/:cid', async () => {
      let response = ''
      try {
        response = await authenticatedAgent.get(`${URL}/api/tickets/purchase/code/${mockUser.cart}`)
      } catch (error) {
        response = error
      }
      expect(response.status).to.equal(404)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('application/json')
      expect(response.body.message).to.include('Ticket does not exist')
    })
    it('GET /purchase/code/:cid getTicketByCode', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/tickets/purchase/code/${mockUser.ticket}`)
      expect(response.status).to.equal(200)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('application/json')
      expect(response.body.message).to.include('Ticket retrieved successfully')
      expect(response.body.payload.purchaser).to.include(mockUser.email)
      expect(response.body.payload).to.have.property('products').that.is.an('array')
    })
    it('DELETE /api/tickets/:cid deleteTicket', async () => {
      const response = await authenticatedAgent.delete(`${URL}/api/tickets/${mockUser.ticket}`)
      console.log('ticket', response);
      /* expect(response.status).to.equal(204)
      expect(response.req.method).to.equal('DELETE')
      expect(response.text).to.equal('') */
    })
  })
})
