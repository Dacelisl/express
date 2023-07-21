import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github'
import { createHash, isValidPassword } from '../utils/utils.js'
import { UserModel } from '../DAO/models/user.model.js'
import fetch from 'node-fetch'
import { CartsModel } from '../DAO/models/carts.model.js'
import dataConfig from './process.config.js'
const LocalStrategy = local.Strategy

export function initPassport() {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await UserModel.findOne({ email: username })
        if (!user) {
          return done(null, false, { message: 'The Email Does Not Exist ' + username })
        }
        if (!isValidPassword(password, user.password)) {
          return done(null, false, { message: 'Invalid Password' })
        }
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    })
  )
  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age } = req.body
          let user = await UserModel.findOne({ email: username })
          if (user) {
            return done(null, false, { message: 'User already exists' })
          }
          let cart = await CartsModel.create({})
          let userCreated = await UserModel.create({ email: email, password: createHash(password), firstName: firstName, lastName: lastName, rol: 'user', age: Number(age), cart: cart._id })
          return done(null, userCreated, { message: 'User Registration succesful' })
        } catch (e) {
          return done(e, { message: 'Error in register' })
        }
      }
    )
  )

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: dataConfig.gitClient,
        clientSecret: dataConfig.gitSecret,
        callbackURL: dataConfig.gitCallBack,
      },
      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          })
          const emails = await res.json()
          const emailDetail = emails.find((email) => email.verified == true)

          if (!emailDetail) {
            return done(null, { message: 'cannot get a valid email for this user' })
          }
          profile.email = emailDetail.email
          let cart = await CartsModel.create({})

          let user = await UserModel.findOne({ email: profile.email })
          if (!user) {
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              rol: 'user',
              password: 'nopass',
              age: 0,
              cart: cart._id,
            }
            let userCreated = await UserModel.create(newUser)
            return done(null, userCreated, { message: 'User Registration succesful' })
          } else {
            return done(null, user, { message: 'User already exists' })
          }
        } catch (e) {
          return done(e, { message: 'Error en auth github' })
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id)
    done(null, user)
  })
}
