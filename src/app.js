
import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { __dirname } from "./utils.js";
import { productsRouter } from './routers/router.products.js'
import { CartsRouter } from './routers/router.cart.js'

const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "views");
app.set("view engine", "handlebars");

/* app.use(express.static('public')) */
app.use(express.static(path.join(__dirname, "public")));

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
