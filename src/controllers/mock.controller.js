import { mockServices } from '../services/mock.services.js'

class MockController {
  getProductsMock = (req, res) => {
    const response = mockServices.getAllProducts()
    return res.status(response.code).json(response)
  }
}
export const mockController = new MockController()
