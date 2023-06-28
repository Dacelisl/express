import passport from 'passport'
import local from 'passport-local'
import { createHash, isValidPassword } from '../utils/utils.js'
import { UserModel } from '../DAO/models/user.model.js'
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
          const { email, firstName, lastName } = req.body
          let user = await UserModel.findOne({ email: username })
          if (user) {
            return done(null, false, { message: 'User already exists' })
          }
          let userCreated = await UserModel.create({ email: email, password: createHash(password), firstName: firstName, lastName: lastName, isAdmin: false })
          return done(null, userCreated, { message: 'User Registration succesful' })
        } catch (e) {
          return done(e, { message: 'Error in register' })
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
