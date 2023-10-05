import { Types } from 'mongoose'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import bcryptjs from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.resolve(__filename, '../../')

const getDestination = (req, file, cb) => {
  const tipoArchivo = req.headers['x-tipo-archivo']
  let uploadFolder = 'public/image/'
  if (tipoArchivo === 'profile') {
    uploadFolder += `${tipoArchivo}`
  } else if (tipoArchivo === 'product') {
    uploadFolder += `${tipoArchivo}`
  } else {
    uploadFolder += `document/${tipoArchivo}`
  }
  cb(null, path.join(__dirname, uploadFolder))
}
const storage = multer.diskStorage({
  destination: getDestination,
  filename: (req, file, cb) => {
    const uid = req.params.uid
    const tipoArchivo = req.headers['x-tipo-archivo']
    const ext = path.extname(file.originalname)
    const newName = uid + '_' + tipoArchivo + ext
    cb(null, newName)
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
      payload: {},
      message: 'invalid format, must be ObjectId',
    }
  }
}
function timeDifference(connectionTime, timeMinutes) {
  const lastConnectionTime = new Date(connectionTime)
  const currentTime = new Date()
  const timeDifference = currentTime - lastConnectionTime
  const hoursDifference = timeDifference / (1000 * 60)
  return hoursDifference > timeMinutes
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
export { __filename, __dirname, parsedQuery, isValid, randomCode, convertCurrencyToNumber, timeDifference }
