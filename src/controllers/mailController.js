/* import { mailServices } from '../services/mail.services.js'
import { sendErrorResponse, sendSuccessResponse } from '../utils/utils.js'

class MailController {
  async sendMail(req, res) {
    try {
      const code = req.params.code
      const dataUser = req.session.user
      const mail = await mailServices.sendMail(code, dataUser)
      return sendSuccessResponse(res, mail)
    } catch (error) {
      req.logger.error('something went wrong sendMail, MailController', error)
      return sendErrorResponse(res, error)
    }
  }
}
export const mailController = new MailController()
 */