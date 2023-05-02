const express = require('express')
const  ProductManager = require('./ProductManager')
const productos = require('../productos.json')

const app = express()
const port = 3000

app.use((req, res, next) => {
  ProductManager
  next()
})

app.listen(port, () => {
  console.log('example port', port)
})
app.get('/products', (req, res) => {
  let limit = req.query.limit
  if (limit) {
    const resultado = productos.slice(0, limit)
    res.json(resultado)
  } else {
    res.json(productos)
  }
})

app.get('/products/:qid', (req, res) => {
  const productId = req.params.qid
  console.log('id', productId)
  const productFind = productos.find((product) => product.id == productId)
  if (productFind) {
    res.json(productFind)
  } else {
    res.json({ error: `product not found ${productId}` })
  }
})
