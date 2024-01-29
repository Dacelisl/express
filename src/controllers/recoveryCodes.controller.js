/* import { mailServices } from '../services/mail.services.js'
import { recoveryCodeFactory, userFactory } from '../DAO/factory.js'
import { createHash, isValidPassword, sendErrorResponse } from '../utils/utils.js'

class RecoveryCodesController {
  async getRecovery(req, res) {
    res.render('recoverEmail')
  }
  async getRecoverToken(req, res) {
    try {
      const uid = req.params.uid
      const response = await recoveryCodeFactory.findLastToken(uid)
      return res.status(200).json({
        status: 'Success',
        code: 200,
        message: 'token found',
        payload: response,
      })
    } catch (error) {
      req.logger.error('something went wrong getRecoverToken', error)
      return sendErrorResponse(res, error)
    }
  }
  async createMailRecover(req, res) {
    try {
      const email = req.body.email
      const basePath = req.protocol + '://' + req.get('host')
      const user = await userFactory.getUserByEmail(email)
      if (!user) {
        req.flash('registerMessage', 'Unregistered user.')
        return res.redirect('/api/users/register')
      }
      const token = Math.random().toString(36).substring(2)
      const expire = Date.now() + 3600000
      await recoveryCodeFactory.add({
        email,
        token,
        expire,
      })
      await mailServices.recoveryMail(email, token, basePath)
      req.flash('loginMessage', 'We have sent an email to your address. Please check your inbox to continue.')
      return res.redirect('/api/users/login')
    } catch (error) {
      req.logger.error('something went wrong createMailRecover', e)
      return sendErrorResponse(res, error)
    }
  }
  async getRecoveryPass(req, res) {
    try {
      const { token, email } = req.query
      const response = await recoveryCodeFactory.findToken(token, email)
      const foundToken = response[0]
      if (!foundToken) {
        return res.render('error', { error: `are you lost ?`, code: 404 })
      }
      if (foundToken.expire > Date.now() && foundToken.active) {
        const message = req.flash('recoverMessage')
        res.render('recoverPass', { token, email, message })
      } else {
        res.render('error', { error: 'token expired or invalid token!', code: 403 })
      }
    } catch (error) {
      req.logger.error('something went wrong getRecoveryPass', error)
      return sendErrorResponse(res, error)
    }
  }
  async recoveryPass(req, res) {
    try {
      let { token, email, password } = req.body
      const response = await recoveryCodeFactory.findToken(token, email)
      const foundToken = response[0]
      if (!foundToken) {
        return res.render('error', { error: `are you lost ?`, code: 404 })
      }
      if (foundToken.expire > Date.now() && foundToken.active && password) {
        const passHash = createHash(password)
        const user = await userFactory.getUserByEmail(email)
        if (!isValidPassword(password, user.password)) {
          await recoveryCodeFactory.updateState(foundToken._id)
          await userFactory.updateUser(user._id, { password: passHash })
          req.flash('loginMessage', 'You have successfully changed the password.')
          return res.redirect('/api/users/login')
        }
        req.flash('recoverMessage', `you can't use the same password`)
        return res.redirect(req.headers.referer)
      } else {
        return res.render('error', { error: 'token expired or invalid token!', code: 403 })
      }
    } catch (error) {
      req.logger.error('something went wrong recoveryPass', error)
      return sendErrorResponse(res, error)
    }
  }
}
export const recoveryCodesController = new RecoveryCodesController()
 */