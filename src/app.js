const express = require('express')
const { ProductManager, productsExect } = require('./ProductManager')
const productos = new ProductManager('productos.json')
productsExect()

const app = express()
const port = 3000

app.listen(port, () => {
  console.log('example port', port)
})
app.get('/products', async (req, res) => {
  let limit = req.query.limit
  const data = await productos.getProducts()
  if (limit) {
    const resultado = data.slice(0, limit)
    res.json(resultado)
  } else {
    res.json(productos)
  }
})

app.get('/products/:qid', async (req, res) => {
  const productId = parseInt(req.params.qid)
  const data = await productos.getProducts()
  const productFind = data.find((product) => product.id == productId)
  if (productFind) {
    res.json(productFind)
  } else {
    res.json({ error: `product not found ${productId}` })
  }
})
