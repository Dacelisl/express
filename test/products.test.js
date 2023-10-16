import chai from 'chai'
import supertest from 'supertest'
import dataConfig from '../src/config/process.config.js'
import { faker } from '@faker-js/faker'
import { __dirname } from '../src/utils/utils.js'
import superagent from 'superagent'

const expect = chai.expect
const URL = `http://localhost:${dataConfig.port}`
const requester = supertest(URL)

const authSession = async (requester, mockAdmin) => {
  const response = await requester.post('/api/users/login').send({ email: mockAdmin.email, password: mockAdmin.password })
  const sessionCookie = response.headers['set-cookie'][0]
  const cookieName = sessionCookie.split('=')[0]
  const cookieValue = sessionCookie.split('=')[1].split(';')[0]
  const authToken = superagent.agent()
  authToken.set('Cookie', [`${cookieName}=${cookieValue}`])
  return authToken
}
const createUser = (type) => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 5 }),
    age: faker.number.int(60),
    rol: type,
  }
}
const routesDelete = (user) => {
  console.log('en route delete ', user);
  const rutas = user.documents.map((documento) => {
    const referenceParts = documento.reference.split('image')
    if (referenceParts.length > 1) {
      return `${__dirname}/public/image` + referenceParts[1]
    }
  })
  mockUser.rutas = rutas
}

describe('tests API', () => {
  let mockAdmin = ''
  let mockUser = ''
  let productMock = ''
  let newCart = ''
  let authenticatedAgent = ''

  before(async () => {
    mockAdmin = createUser('admin')
  })
  after(async () => {
    const response = await authenticatedAgent.get(`${URL}/api/users/user/${mockAdmin.email}`)
    if (response.ok) {
      await authenticatedAgent.delete(`${URL}/api/products/${productMock.id}`)
      await authenticatedAgent.delete(`${URL}/api/users/${mockAdmin.email}`)
    }
  })

  describe('Session test', () => {
    it('GET view /api/users/register getRegister', async () => {
      const response = await requester.get('/api/users/register')
      expect(response.req.method).to.equal('GET')
      expect(response.status).to.equal(200)
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('<h1>REGISTER')
    })
    it('POST /api/users/register createRegister `admin`', async () => {
      const response = await requester.post('/api/users/register').send(mockAdmin)
      expect(response.req.method).to.equal('POST')
      expect(response.status).to.equal(302)
      expect(response.header.location).to.equal('/api/users/login')
    })
    it('POST /api/users/register createRegister `user`', async () => {
      mockUser = createUser('user')
      mockUser.email = dataConfig.emailTest
      const response = await requester.post('/api/users/register').send(mockUser)
      expect(response.req.method).to.equal('POST')
      expect(response.status).to.equal(302)
      expect(response.header.location).to.equal('/api/users/login')
    })
    it('POST Fail-(email exist) /api/users/register', async () => {
      const response = await requester.post('/api/users/register').send(mockAdmin)
      expect(response.req.method).to.equal('POST')
      expect(response.status).to.equal(302)
      expect(response.header.location).to.equal('/api/users/register')
    })
    it('GET view /api/users/login getLogin', async () => {
      const response = await requester.get('/api/users/login')
      expect(response.req.method).to.equal('GET')
      expect(response.status).to.equal(200)
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('<h1>LOGIN')
    })
    it('POST fail-(wrong password) /api/users/login', async () => {
      const response = await requester.post('/api/users/login').send({ username: mockAdmin.email, password: mockAdmin.firstName })
      expect(response.req.method).to.equal('POST')
      expect(response.headers['content-type']).to.include('text/plain')
      expect(response.status).to.equal(302)
      expect(response.header.location).to.equal('/api/users/login')
    })
    it('POST /api/users/login createLogin', async () => {
      const response = await requester.post('/api/users/login').send({ email: mockAdmin.email, password: mockAdmin.password })
      expect(response.req.method).to.equal('POST')
      expect(response.headers['content-type']).to.include('text/plain')
      expect(response.status).to.equal(302)
      expect(response.header.location).to.equal('/api/products')
      authenticatedAgent = await authSession(requester, mockAdmin)
    })
    it('GET /api/users/user/:uid getUser', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/user/${mockAdmin.email}`)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('text/html')
      expect(response.status).to.equal(200)
      expect(response.text).to.include('<h1>Edit User</h1>')
    })
    it('GET fail (Authentication Error) /api/users/profile', async () => {
      const response = await requester.get(`/api/users/profile`)
      expect(response.status).to.equal(401)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('Authentication Error')
    })
    it('GET /api/users/profile getProfile', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/profile`)
      expect(response.status).to.equal(200)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include(mockAdmin.email)
    })
    it('GET view /api/users/admin getAdmin', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/admin`)
      expect(response.req.method).to.equal('GET')
      expect(response.status).to.equal(200)
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('Delete User')
    })
    it('GET /api/users/current getCurrent', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/current`)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('application/json')
      expect(response.status).to.equal(200)
      expect(response._body.email).to.be.eql(mockAdmin.email)
    })
    it('GET view /api/users/uploads uploadDocuments', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/uploads`)
      expect(response.status).to.equal(200)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('Upload Files')
    })
    it('POST /api/users/:uid/documents createDocument `accountStatus`', async () => {
      const filePath = `${__dirname}/public/banner_shop.png`
      const tipoArchivo = 'accountStatus'
      const response = await authenticatedAgent.post(`${URL}/api/users/${mockUser.email}/documents`).set('x-tipo-archivo', tipoArchivo).attach('file', filePath)
      expect(response.status).to.equal(201)
      expect(response.req.method).to.equal('POST')
      expect(response.type).to.equal('application/json')
      expect(response.text).to.include(mockUser.email)
      expect(response.text).to.include(tipoArchivo)
    })
    it('POST /api/users/:uid/documents createDocument `DNI`', async () => {
      const filePath = `${__dirname}/public/banner_shop.png`
      const tipoArchivo = 'DNI'
      const response = await authenticatedAgent.post(`${URL}/api/users/${mockUser.email}/documents`).set('x-tipo-archivo', tipoArchivo).attach('file', filePath)
      expect(response.status).to.equal(201)
      expect(response.req.method).to.equal('POST')
      expect(response.type).to.equal('application/json')
      expect(response.text).to.include(mockUser.email)
      expect(response.text).to.include(tipoArchivo)
    })
    it('POST /api/users/:uid/documents createDocument `proofAddress`', async () => {
      const filePath = `${__dirname}/public/banner_shop.png`
      const tipoArchivo = 'proofAddress'
      const response = await authenticatedAgent.post(`${URL}/api/users/${mockUser.email}/documents`).set('x-tipo-archivo', tipoArchivo).attach('file', filePath)
      expect(response.status).to.equal(201)
      expect(response.req.method).to.equal('POST')
      expect(response.type).to.equal('application/json')
      expect(response.text).to.include(mockUser.email)
      expect(response.text).to.include(tipoArchivo)
    })
    it('GET /api/users/premium/:uid switchRol', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/premium/${mockUser.email}`)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('application/json')
      expect(response.status).to.equal(201)
      expect(response._body.payload.email).to.be.eql(mockUser.email)
      expect(response._body.payload.rol).to.be.eql('premium')
    })
    it('GET /api/users/logout logout', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/users/logout`)
      expect(response.req.method).to.equal('GET')
      expect(response.status).to.equal(200)
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('<h1>LOGIN</h1>')
      authenticatedAgent = await authSession(requester, mockAdmin)
    })
    it('PUT  /api/users/updateUser updateUser', async () => {
      const updatedUser = mockUser
      updatedUser.firstName = faker.person.firstName()
      const response = await authenticatedAgent.post(`${URL}/api/users/updateUser`).send(updatedUser)
      expect(response.status).to.equal(200)
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('Information was successfully updated')
    })
    it('PUT fail (authorization error) /api/users/updateUser', async () => {
      const updatedUser = mockAdmin
      updatedUser.firstName = faker.person.firstName()
      const response = await requester.post(`/api/users/updateUser`).send(updatedUser)
      expect(response.status).to.equal(403)
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('authorization error')
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
    it('DELETE /api/users/:uid deleteUser', async () => {
      const responseUser = await authenticatedAgent.get(`${URL}/api/users/user/${mockUser.email}`)
      console.log('RES', responseUser.body.payload)
      routesDelete(responseUser)
      console.log('data User', mockUser)
      const response = await authenticatedAgent.delete(`${URL}/api/users/${mockUser.email}`)
      expect(response.req.method).to.equal('DELETE')
      expect(response.status).to.equal(204)
      expect(response.text).to.equal('')
    })
  })
  /* describe('Products test', () => {
    before(async () => {
      productMock = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        price: faker.commerce.price({ min: 10, max: 2000, dec: 0, symbol: '$' }),
        thumbnail: faker.system.fileName(),
        code: faker.string.alphanumeric(10),
        owner: mockAdmin.email,
        stock: faker.number.int(100),
      }
    })
    it('POST /api/products createProduct', async () => {
      const response = await authenticatedAgent.post(`${URL}/api/products`).send(productMock)
      expect(response.status).to.equal(201)
      expect(response.type).to.equal('application/json')
      expect(response.body.payload).to.have.property('_id')
      productMock.id = response.body.payload._id
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
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('authorization error')
    })
    it('GET /api/products getAllProducts', async () => {
      const response = await requester.get('/api/products')

      expect(response.status).to.equal(200)
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include(`<h1 class='title'>`)
      const responseBody = response.text
      const productPattern = /<ul class='product-list'>/
      const productMatches = responseBody.match(productPattern)
      expect(productMatches.length).to.be.greaterThan(0)
    })
    it('GET /api/products/:pid getProductId', async () => {
      const response = await requester.get(`/api/products/${productMock.id}`)
      expect(response.status).to.equal(200)
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include(`<h1 class='title'>`)
      const responseBody = response.text
      const productPattern = /<ul class='product-single'>/
      const productMatches = responseBody.match(productPattern)
      expect(productMatches.length).to.be.greaterThan(0)
    })
    it('PUT  /api/products/:pid updateProduct', async () => {
      const updatedProduct = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        price: faker.commerce.price({ min: 10, max: 2000, dec: 0, symbol: '$' }),
        thumbnail: faker.system.fileName(),
        stock: faker.number.int(100),
      }

      const response = await authenticatedAgent.put(`${URL}/api/products/${productMock.id}`).send(updatedProduct)

      expect(response.status).to.equal(201)
      expect(response.req.method).to.equal('PUT')
      expect(response.type).to.equal('application/json')
      expect(response.text).to.include('"modifiedCount":1')
    })
    it('DELETE fail (authorization error) /api/products:pid  ', async () => {
      const response = await requester.delete(`/api/products/${productMock.id}`)
      expect(response.status).to.equal(403)
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('authorization error')
    })
    it('DELETE /api/products:pid deleteProduct', async () => {
      let newProduct = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        price: faker.commerce.price({ min: 10, max: 2000, dec: 0, symbol: '$' }),
        thumbnail: faker.system.fileName(),
        code: faker.string.alphanumeric(10),
        owner: mockAdmin.email,
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
      mockAdmin.cart = response._body.cart
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
      const response = await requester.get(`/api/carts/${mockAdmin.cart}`)
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
      const response = await requester.post(`/api/carts/${mockAdmin.cart}/product/${productMock.id}`)
      expect(response.status).to.equal(401)
      expect(response.req.method).to.equal('POST')
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('Authentication Error!')
    })
    it('POST /:cid/product/:pid addProduct', async () => {
      const response = await authenticatedAgent.post(`${URL}/api/carts/${mockAdmin.cart}/product/${productMock.id}`)
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
      expect(response.text).to.include(mockAdmin.cart)
    })
    it('PUT /:cid/product/:pid fail (Authentication Error)', async () => {
      const response = await requester.put(`/api/carts/${mockAdmin.cart}/product/${productMock.id}`).send({ quantity: 5 })
      expect(response.status).to.equal(403)
      expect(response.req.method).to.equal('PUT')
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('authorization error')
    })
    it('PUT /:cid/product/:pid updateAddToCart', async () => {
      const response = await authenticatedAgent.put(`${URL}/api/carts/${mockAdmin.cart}/product/${productMock.id}`).send({ quantity: 5 })
      expect(response.status).to.equal(201)
      expect(response.type).to.equal('application/json')
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('_id')
      expect(response.body.message).to.include('product added successfully')
      expect(response.body.payload).to.have.property('products').that.is.an('array')
    })
    it('DELETE /:cid/product/:pid fail (Authentication Error)', async () => {
      const response = await requester.delete(`/${mockAdmin.cart}/product/${productMock.id}`)
      expect(response.status).to.equal(401)
      expect(response.req.method).to.equal('DELETE')
      expect(response.text).to.include('Unauthorized')
    })
    it('DELETE /:cid/product/:pid deletedProduct', async () => {
      const response = await authenticatedAgent.delete(`${URL}/api/carts/${mockAdmin.cart}/product/${productMock.id}`)
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
    it('PUT /:cid/purchase purchaseCart', async () => {
      const response = await authenticatedAgent.put(`${URL}/api/tickets/${mockAdmin.cart}/purchase`)
      expect(response.status).to.equal(200)
      expect(response.req.method).to.equal('PUT')
      expect(response.type).to.equal('application/json')
      expect(response.body.message).to.include('Ticket created successfully')
      expect(response.body.payload.purchaser).to.include(mockAdmin.email)
      expect(response.body.payload).to.have.property('products').that.is.an('array')
      mockAdmin.ticket = response.body.payload.code
    })
    it('GET fail /purchase/code/:cid', async () => {
      let response = ''
      try {
        response = await authenticatedAgent.get(`${URL}/api/tickets/purchase/code/${mockAdmin.cart}`)
      } catch (error) {
        response = error.response
      }
      expect(response.status).to.equal(404)
      expect(response.req.method).to.equal('GET')
      expect(response.ok).to.equal(false)
      expect(response.type).to.equal('application/json')
      expect(response.body.message).to.include('Ticket does not exist')
    })
    it('GET /purchase/code/:cid getTicketByCode', async () => {
      const response = await authenticatedAgent.get(`${URL}/api/tickets/purchase/code/${mockAdmin.ticket}`)
      expect(response.status).to.equal(200)
      expect(response.req.method).to.equal('GET')
      expect(response.type).to.equal('application/json')
      expect(response.body.message).to.include('Ticket retrieved successfully')
      expect(response.body.payload.purchaser).to.include(mockAdmin.email)
      expect(response.body.payload).to.have.property('products').that.is.an('array')
    })
    it('DELETE /api/tickets/:cid fail (Authentication Error) ', async () => {
      const response = await requester.delete(`/api/tickets/${mockAdmin.ticket}`)
      expect(response.status).to.equal(403)
      expect(response.req.method).to.equal('DELETE')
      expect(response.type).to.equal('text/html')
      expect(response.text).to.include('authorization error')
    })
    it('DELETE /api/tickets/:cid deleteTicket', async () => {
      const response = await authenticatedAgent.delete(`${URL}/api/tickets/${mockAdmin.ticket}`)
      expect(response.status).to.equal(204)
      expect(response.req.method).to.equal('DELETE')
      expect(response.text).to.equal('')
    })
  }) */
})
