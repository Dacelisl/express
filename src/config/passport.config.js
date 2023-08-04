import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github'
import { createHash, isValidPassword } from '../utils/utils.js'
import { userFactory, cartFactory } from '../DAO/factory.js'
import userDTO from '../DAO/DTO/user.DTO.js'
import fetch from 'node-fetch'
import dataConfig from './process.config.js'
const LocalStrategy = local.Strategy

export function initPassport() {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await userFactory.getUserByEmail(username)
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
          let user = await userFactory.getUserByEmail(username)
          if (user) {
            return done(null, false, { message: 'User already exists' })
          }
          let cart = await cartFactory.createEmptyCart()
          const newUser = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            rol: 'user',
            password: createHash(password),
            age: Number(age),
            cart: cart._id,
          }
          const userDto = new userDTO(newUser)
          let userCreated = await userFactory.saveUser(userDto)
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
          let cart = await cartFactory.createEmptyCart()

          let user = await userFactory.getUserByEmail(profile.email)
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
            const userDto = new userDTO(newUser)
            let userCreated = await userFactory.saveUser(userDto)
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
    let user = await User.getUserByID(id)
    done(null, user)
  })
}
