import { mockServices } from '../services/mock.services.js'

class MockController {
  getProductsMock = (req, res) => {
    try {
      const response = mockServices.getAllProducts()
      return res.status(response.code).json(response)
    } catch (error) {
      req.logger.error('something went wrong getProductsMock', error)
    }
  }
}
export const mockController = new MockController()
