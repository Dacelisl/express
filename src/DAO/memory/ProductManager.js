import { existsSync, writeFileSync, readFileSync, promises } from 'fs'

class Product {
  constructor(title, description, price, thumbnail, code, stock, owner) {
    this.title = title
    this.description = description
    this.price = price
    this.thumbnail = thumbnail
    this.code = code
    this.owner = owner
    this.stock = stock
  }
}

export class ProductManager {
  constructor(path) {
    this.path = path
    if (!existsSync(this.path)) {
      writeFileSync(this.path, '[]')
    } else {
      try {
        this.products = JSON.parse(readFileSync(this.path, 'utf-8'))
      } catch (error) {
        throw new Error('Error parsing JSON:', error)
        this.products = []
      }
    }
  }
  async saveProduct(product) {
    try {
      if (this.codeFind(product.code))
        return {
          status: 'fail',
          code: 404,
          message: 'The code cannot be repeated',
        }
      if (product.title && product.description && product.price && product.thumbnail && product.code && product.owner && product.stock) {
        this.products.push({
          id: this.idIncrement(),
          title: product.title,
          description: product.description,
          price: product.price,
          status: true,
          thumbnail: product.thumbnail,
          code: product.code,
          owner: product.owner,
          stock: product.stock,
        })
        await promises.writeFile(this.path, JSON.stringify(this.products))
        return {
          status: 'success',
          code: 201,
          message: 'product added successfully',
        }
      } else {
        return {
          status: 'fail',
          code: 404,
          message: 'Fields are required',
        }
      }
    } catch (error) {
      return {
        status: 'fail',
        code: 400,
        message: `Error ${error}`,
      }
    }
  }
  codeFind(codeProduct) {
    return this.products.some((itemProducts) => itemProducts.code === codeProduct)
  }
  idIncrement() {
    if (this.products.length === 0) return 1
    const id = this.products.sort((a, b) => a.id < b.id)
    return id[id.length - 1].id + 1
  }
  async getProducts(limit) {
    try {
      const res = await promises.readFile(this.path, 'utf-8')
      if (res) this.products = JSON.parse(res)
      if (limit > 0) this.products = this.products.slice(0, limit)

      return {
        status: 'success',
        code: 200,
        message: 'product list ',
        payload: this.products,
      }
    } catch (error) {
      return {
        status: 'fail',
        code: 404,
        message: `Error ${error}`,
        payload: {},
      }
    }
  }
  async getProductById(idProduct) {
    const productList = await this.getProducts().then((prod) => {
      const productFind = prod.payload.filter((product) => product.id === idProduct)
      return productFind
    })
    return {
      status: productList.length > 0 ? 'Success' : 'fail',
      code: productList.length > 0 ? 201 : 404,
      message: productList.length > 0 ? 'product found' : 'Code Not Found',
      payload: productList,
    }
  }
  async updateProduct(idProduct, product) {
    if (this.codeFind(product.code))
      return {
        status: 'fail',
        code: 404,
        message: 'the code cannot be repeated',
      }
    const productFind = await this.getProductById(idProduct)
    if (productFind.code !== 404) {
      const update = {
        id: productFind.payload[0].id,
        title: product.title || productFind.payload[0].title,
        description: product.description || productFind.payload[0].description,
        price: product.price || productFind.payload[0].price,
        status: true,
        thumbnail: product.thumbnail || productFind.payload[0].thumbnail,
        code: product.code || productFind.payload[0].code,
        owner: product.owner || productFind.payload[0].owner,
        stock: product.stock || productFind.payload[0].stock,
      }
      this.products.splice(this.products.indexOf(productFind.payload[0]), 1, update)
      try {
        await promises.writeFile(this.path, JSON.stringify(this.products))
        return {
          status: 'success',
          code: 200,
          message: 'product updated',
        }
      } catch (error) {
        return {
          status: 'fail',
          code: 404,
          message: `Error ${error}`,
        }
      }
    } else {
      return productFind
    }
  }
  async deleteProduct(idProduct) {
    const productFind = await this.getProductById(idProduct)
    if (productFind.code !== 404) {
      this.products.splice(this.products.indexOf(productFind.payload[0]), 1)
      try {
        await promises.writeFile(this.path, JSON.stringify(this.products))
        return {
          status: 'success',
          code: 200,
          message: 'removed product',
        }
      } catch (error) {
        return {
          status: 'fail',
          code: 404,
          message: `Error ${error}`,
        }
      }
    } else {
      return productFind
    }
  }
}

/* -------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------TEST--------------------------------------------------------- */

export const productsExect = () => {
  const testProducts = new ProductManager('productos.json')
  const testProduct = new Product('pera', 'fruta', 100, 'ruta de foto', 'abc123', 6)
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
    title: 'piña',
    description: 'fruta',
    price: 3450,
    thumbnail: 'ruta de foto',
    code: 'apiasg',
    stock: 36,
  })
  testProducts.addProduct({
    title: 'sandia',
    description: 'fruta',
    price: 600,
    thumbnail: 'ruta de foto',
    code: 'tresan',
    stock: 10,
  })
  testProducts.addProduct({
    title: 'Fresa',
    description: 'fruta',
    price: 150,
    thumbnail: 'ruta de foto',
    code: 'a29837gdsg',
    stock: 16,
  })
}
