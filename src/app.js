import express from 'express'
import { productsRouter } from './routers/router.products.js'
import { CartsRouter } from './routers/router.cart.js'

const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/products', productsRouter)
app.use('/api/carts', CartsRouter)

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
