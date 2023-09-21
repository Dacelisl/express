import { mailServices } from '../services/mail.services.js'

class MailController {
  async sendMail(req, res) {
    try {
      const code = req.params.code
      const dataUser = req.session.user
      const mail = await mailServices.sendMail(code, dataUser)
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'email Send',
        payload: mail,
      })
    } catch (e) {
      req.logger.error('something went wrong sendMail, MailController', e)
      return res.status(500).json({
        status: 'error',
        code: 500,
        message: `something went wrong sendMail, MailController ${e}`,
        payload: {},
      })
    }
  }
}
export const mailController = new MailController()
