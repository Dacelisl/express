import { mailServices } from '../services/mail.services.js'
import { recoveryCodeFactory, userFactory } from '../DAO/factory.js'
import { createHash, isValidPassword } from '../utils/utils.js'

class RecoveryCodesController {
  async getRecovery(req, res) {
    res.render('recoverEmail')
  }
  async createMailRecover(req, res) {
    try {
      const email = req.body.email
      const basePath = req.protocol + '://' + req.get('host')
      const user = await userFactory.getUserByEmail(email)
      if (!user) {
        return {
          status: 'Fail',
          code: 401,
          payload: {},
          message: `The Email Does Not Exist`,
        }
      }
      const token = Math.random().toString(36).substring(2)
      const expire = Date.now() + 3600000
      await recoveryCodeFactory.add({
        email,
        token,
        expire,
      })
      await mailServices.recoveryMail(email, token, basePath)
      req.flash('info', 'We have sent an email to your address. Please check your inbox to continue.')
      return res.redirect('/api/users/login')
    } catch (e) {
      req.logger.error('something went wrong createMailRecover', e)
      return res.status(500).json({
        status: 'error',
        code: 500,
        message: 'something went wrong :( createMailRecover',
        payload: {},
      })
    }
  }
  async getRecoveryPass(req, res) {
    try {
      const { token, email } = req.query
      const response = await recoveryCodeFactory.findToken(token, email)
      const foundToken = response[0]
      if (foundToken.expire > Date.now() && foundToken.active) {
        res.render('recoverPass', { token, email })
      } else {
        res.render('error', { error: 'token expired or invalid token!', code: 403 })
      }
    } catch (e) {
      req.logger.error('something went wrong getRecoveryPass', e)
      return res.status(500).json({
        status: 'error',
        code: 500,
        message: 'something went wrong :( getRecoveryPass',
        payload: {},
      })
    }
  }

  async recoveryPass(req, res) {
    try {
      let { token, email, password } = req.body
      const response = await recoveryCodeFactory.findToken(token, email)
      const foundToken = response[0]
      if (foundToken.expire > Date.now() && foundToken.active && password) {
        const passHash = createHash(password)
        const user = await userFactory.getUserByEmail(email)
        if (!isValidPassword(password, user.password)) {
          await recoveryCodeFactory.updateState(foundToken._id)
          await userFactory.updateUser(user._id, { password: passHash })
          req.flash('info', 'You have successfully changed the password.')
          return res.redirect('/api/users/login')
        }
        req.flash('info', `you can't use the same password`)
        return res.redirect(req.headers.referer)
      } else {
        return res.render('error', { error: 'token expired or invalid token!', code: 403 })
      }
    } catch (e) {
      req.logger.error('something went wrong recoveryPass', e)
      return res.status(500).json({
        status: 'error',
        code: 500,
        message: `something went wrong :( recoveryPass`,
        payload: {},
      })
    }
  }
}
export const recoveryCodesController = new RecoveryCodesController()
