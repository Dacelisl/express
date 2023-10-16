import { mockServices } from '../services/mock.services.js'
import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'

class MockController {
  getProductsMock = (req, res) => {
    try {
      const response = mockServices.getAllProducts()
      return sendSuccessResponse(res, response)
    } catch (error) {
      req.logger.error('something went wrong getProductsMock', error)
      return sendErrorResponse(res, error)
    }
  }
}
export const mockController = new MockController()
