import { existsSync, writeFileSync, readFileSync, promises } from 'fs'

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

 export class ProductManager {
  constructor(path) {
    this.path = path
    if (!existsSync(this.path)) {
      writeFileSync(this.path, '[]')
    }
    this.products = JSON.parse(readFileSync(this.path, 'utf-8'))
  }
  async addProduct(product) {
    try {
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
        await promises.writeFile(this.path, JSON.stringify(this.products))
        return 'Agregado con exito'
      } else {
        return 'Los campos son obligatorios'
      }
    } catch (error) {
      throw new Error('Error al agregar producto')
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

  async getProducts() {
    try {
      const res = await promises.readFile(this.path, 'utf-8')
      if (res) this.products = JSON.parse(res)
      return this.products
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error}`)
    }
  }

  async getProductById(idProduct) {
    const productList = await this.getProducts().then((prod) => {
      const productFind = prod.filter((product) => product.id === idProduct)
      return productFind
    })
    if (productList.length > 0) return productList
    return 'Not found '
  }

  async updateProduct(idProduct, product) {
    if (this.codeFind(product.code)) return 'El codigo no puede ser Repetido'
    const productFind = await this.getProductById(idProduct)
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
      try {
        await promises.writeFile(this.path, JSON.stringify(this.products))
        return 'Actualizado con exito'
      } catch (error) {
        throw new Error(`Error al actualizar el archivo: ${error}`)
      }
    } else {
      return 'Code Not found '
    }
  }

  async deleteProduct(idProduct) {
    const productFind = await this.getProductById(idProduct)
    if (productFind.toString() !== 'Not found ') {
      this.products.splice(this.products.indexOf(productFind[0]), 1)
      try {
        await promises.writeFile(this.path, JSON.stringify(this.products))
        return 'Eliminado con exito'
      } catch (error) {
        throw new Error(`Error al eliminar el archivo:  ${error}`)
      }
    } else {
      return 'Code Not found '
    }
  }
}

/* -------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------TEST--------------------------------------------------------- */

 export const productsExect = () => {
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