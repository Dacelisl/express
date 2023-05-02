const fs = require('fs')

  class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title
    this.description = description
    this.price = price
    this.thumbnail = thumbnail
    this.code = code
    this.stock = stock
  }
}

 class ProductManager {
  constructor(path) {
    this.path = path
    this.products = []
    fs.writeFileSync(this.path, JSON.stringify(this.products))
  }
  addProduct(product) {
    if (this.codeFind(product.code)) return 'El codigo no puede ser Repetido'
    if (
      product.title &&
      product.description &&
      product.price &&
      product.thumbnail &&
      product.code &&
      product.stock
    ) {
      this.products.push({
        id: this.idIncrement(),
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
        code: product.code,
        stock: product.stock,
      })
      fs.writeFileSync(this.path, JSON.stringify(this.products))
      return 'Agregado con exito'
    } else {
      return 'Los campos son obligatorios; '
    }
  }
  codeFind(codeProduct) {
    return this.products.some(
      (itemProducts) => itemProducts.code === codeProduct
    )
  }
  idIncrement() {
    if (this.products.length === 0) return 1
    const id = this.products.sort((a, b) => a.id < b.id)
    return id[id.length - 1].id + 1
  }

  getProducts() {
    const res = fs.readFileSync(this.path, 'utf-8')
    if (res) this.products = JSON.parse(res)
    return this.products
  }

  getProductById(idProduct) {
    const productList = this.getProducts()
    const productFind = productList.filter(
      (product) => product.id === idProduct
    )
    if (productFind.length > 0) return productFind
    return 'Not found '
  }

  updateProduct(idProduct, product) {
    if (this.codeFind(product.code)) return 'El codigo no puede ser Repetido'
    const productFind = this.getProductById(idProduct)
    if (productFind.toString() !== 'Not found ') {
      const update = {
        id: productFind[0].id,
        title: product.title || productFind[0].title,
        description: product.description || productFind[0].description,
        price: product.price || productFind[0].price,
        thumbnail: product.thumbnail || productFind[0].thumbnail,
        code: product.code || productFind[0].code,
        stock: product.stock || productFind[0].stock,
      }
      this.products.splice(this.products.indexOf(productFind[0]), 1, update)
      fs.writeFileSync(this.path, JSON.stringify(this.products))
    } else {
      return 'Code Not found '
    }
  }

  deleteProduct(idProduct) {
    const productFind = this.getProductById(idProduct)
    if (productFind.toString() !== 'Not found ') {
      this.products.splice(this.products.indexOf(productFind[0]), 1)
      fs.writeFileSync(this.path, JSON.stringify(this.products))
    } else {
      return 'Not found '
    }
  }
}

/* -------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------TEST--------------------------------------------------------- */

const testProducts = new ProductManager('productos.json')
  const testProduct = new Product(
    'pera',
    'fruta',
    100,
    'ruta de foto',
    'abc123',
    6
  )
  testProducts.addProduct(testProduct)
    testProducts.addProduct({
      title: 'Manzana',
      description: 'fruta',
      price: 300,
      thumbnail: 'ruta de foto',
      code: 'agdgdsg',
      stock: 16,
    })
    testProducts.addProduct({
      title: 'Fresa',
      description: 'fruta',
      price: 150,
      thumbnail: 'ruta de foto',
      code: 'a29837gdsg',
      stock: 16,
    })
    testProducts.addProduct({
      title: 'mora',
      description: 'fruta',
      price: 140,
      thumbnail: 'ruta de foto',
      code: 'sdmo',
      stock: 9,
    })
