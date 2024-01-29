import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github'
import { createHash, isValidPassword } from '../utils/utils.js'
import { userService } from '../services/user.services.js'

import fetch from 'node-fetch'
import dataConfig from './process.config.js'
const LocalStrategy = local.Strategy

export function initPassport() {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await userService.getUserByEmail(username)
        if (user.code === 404) {
          return done(null, false, { message: 'The Email Does Not Exist ' + username })
        }
        if (!isValidPassword(password, user.payload.password)) {
          return done(null, false, { message: 'Invalid Password' })
        } else {
          const currentDate = new Date()
          const formattedDate = currentDate.toLocaleString()
          await userService.updateUser(user.payload._id, { lastConnection: formattedDate })
        }
        return done(null, user.payload)
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
          const { email, firstName, lastName, age, rol } = req.body
          let user = await userService.getUserByEmail(email)
          if (user.code === 201) {
            return done(null, false, { message: 'User already exists' })
          }

          const newUser = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            rol: rol || 'user',
            password: createHash(password),
            age: Number(age),
            documents: [],
            lastConnection: '',
          }
          let userCreated = await userService.saveUser(newUser)
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
          const emailDetail = emails.find((email) => email.verified === true)

          if (!emailDetail) {
            return done(null, { message: 'cannot get a valid email for this user' })
          }
          profile.email = emailDetail.email

          let user = await userService.getUserByEmail(profile.email)
          if (!user) {
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              rol: 'user',
              password: 'nopass',
              age: 0,
              documents: [],
              lastConnection: '',
            }
            let userCreated = await userService.saveUser(newUser)
            return done(null, userCreated, { message: 'User Registration succesful' })
          } else {
            return done(null, user.payload, { message: 'User already exists' })
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
    let userFound = await user.getUserById(id)
    done(null, userFound)
  })
}
