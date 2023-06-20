import { Types } from 'mongoose'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.resolve(__filename, '../../')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public'))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

function parsedQuery(query) {
  const response = {}
  const keyValuePairs = query.split('&')
  keyValuePairs.forEach((keyValuePair) => {
    const [key, value] = keyValuePair.split(':')
    response[key] = value
  })
  return response
}
function isValid(id) {
  if (!Types.ObjectId.isValid(id)) {
    return {
      status: 'Fail',
      code: 400,
      data: {},
      msg: 'invalid format, must be ObjectId',
    }
  }
}

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);
export const uploader = multer({ storage })
export { __filename, __dirname, parsedQuery, isValid }
