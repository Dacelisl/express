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
  mode:mode.mode,
  port: process.env.PORT,
  userName: process.env.USER_NAME,
  secretKey: process.env.SECRET_ACCESS_KEY,
  databaseName: process.env.DATABASE_NAME,
  gitClient: process.env.GIT_CLIENT_ID,
  gitSecret: process.env.GIT_CLIENT_SECRET,
  gitCallBack: process.env.GIT_CALLBACKURL,
}
export default dataConfig
