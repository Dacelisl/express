import { Command } from 'commander'
import dotenv from 'dotenv'

const program = new Command()
program.option('--mode <mode>', 'modo de trabajo', 'development')

program.parse()
const mode = program.opts()
dotenv.config({
  path: program.opts().mode == 'development' ? './.env.development' : './.env.production',
})

const dataConfig = {
  mode: mode.mode,
  persistence: process.env.PERSISTENCE,
  port: process.env.PORT,
  userName: process.env.USER_NAME,
  secretKey: process.env.SECRET_ACCESS_KEY,
  databaseName: process.env.DATABASE_NAME,
  gitClient: process.env.GIT_CLIENT_ID,
  gitSecret: process.env.GIT_CLIENT_SECRET,
  gitCallBack: process.env.GIT_CALLBACKURL,
  url_mongo: process.env.URL_MONGO,
  ttl: process.env.TTL,
  emailTest: process.env.EMAIL_TEST,
  secret: process.env.SECRET,
  email_google: process.env.EMAIL,
  key_email_google: process.env.KEY_GOOGLE,
}
export default dataConfig
