import { Types } from 'mongoose'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import bcryptjs from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.resolve(__filename, '../../')

const getDestination = (req, file, cb) => {
  const imageType = req.body.imageType
  console.log('datos en el multer', req.body)
  let uploadFolder = 'public/image'
  if (imageType === 'profile') {
    uploadFolder += '/profile'
  } else if (imageType === 'product') {
    uploadFolder += '/product'
  } else if (imageType === 'document') {
    uploadFolder += '/document'
  }
  cb(null, path.join(__dirname, uploadFolder))
}
const storage = multer.diskStorage({
  destination: getDestination,
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

/* const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('data body', req.body)
    cb(null, path.join(__dirname, 'public'))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
}) */

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
      payload: {},
      message: 'invalid format, must be ObjectId',
    }
  }
}
function randomCode(length) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * caracteres.length)
    code += caracteres.charAt(index)
  }
  return code
}
function convertCurrencyToNumber(currencyString) {
  const numericValue = parseFloat(currencyString.replace('$', '').trim())
  return isNaN(numericValue) ? 0 : numericValue
}

export const createHash = (password) => bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))
export const isValidPassword = (password, hashPassword) => bcryptjs.compareSync(password, hashPassword)
export const uploader = multer({ storage })
export { __filename, __dirname, parsedQuery, isValid, randomCode, convertCurrencyToNumber }
