import express from 'express'
import { productsRouter } from './routers/router.products.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/products/', productsRouter)

app.listen(port, () => {
  console.log(`listen on http://localhost:${port}`)
})

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'Not Found',
    data: {},
  })
})


