import { existsSync, writeFileSync, readFileSync, promises } from 'fs'
export class CartManager {
  constructor(path) {
    this.path = path
    if (!existsSync(this.path)) {
      writeFileSync(this.path, '[]')
    }
    this.carts = JSON.parse(readFileSync(this.path, 'utf-8'))
  }

  async createCart() {
    try {
      this.carts.push({
        id: this.idIncrement(),
        products: [],
      })
      await promises.writeFile(this.path, JSON.stringify(this.carts))
      return {
        status: 'success',
        code: 201,
        msg: 'cart created',
      }
    } catch (error) {
      return {
        status: 'fail',
        code: 401,
        msg: `Error ${error}`,
      }
    }
  }
  async addProductsToCart(pId, cId) {
    try {
      if (!this.codeExist(cId))
        return {
          status: 'fail',
          code: 404,
          msg: 'code does not exist',
        }
      const cartIndex = this.carts.findIndex((cart) => cart.id === cId)
      if (this.productExist(cartIndex, pId)) {
        const productIndex = this.carts[cartIndex].products.findIndex(
          (product) => product.pId === pId
        )
        this.carts[cartIndex].products[productIndex].quantity += 1
      } else {
        this.carts[cartIndex].products.push({
          pId: pId,
          quantity: 1,
        })
      }
      await promises.writeFile(this.path, JSON.stringify(this.carts))
      return {
        status: 'success',
        code: 201,
        msg: 'product added successfully',
      }
    } catch (error) {
      return {
        status: 'fail',
        code: 400,
        msg: `Error ${error}`,
      }
    }
  }

  async getCarts() {
    try {
      const res = await promises.readFile(this.path, 'utf-8')
      if (res) this.carts = JSON.parse(res)
      return this.carts
    } catch (error) {
      return {
        status: 'fail',
        code: 400,
        msg: `Error ${error}`,
      }
    }
  }
  codeExist(codeCart) {
    return this.carts.some((item) => codeCart === item.id)
  }
  productExist(cartIndex, id) {
    return this.carts[cartIndex].products.some((item) => item.pId === id)
  }
  idIncrement() {
    const min = 100000
    const max = 999999
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  async getCartById(idCart) {
    const cartsCopy = await this.getCarts().then((response) => {
      return response
    })
    const cartFind = cartsCopy.filter((cart) => cart.id === idCart)
    if (cartFind.length > 0) return cartFind
    return {
      status: 'fail',
      code: 400,
      msg: `Error IdCart not found `,
    }
  }

  async updateProduct(idProduct, product) {
    if (this.codeExist(product.code)) return 'El codigo no puede ser Repetido'
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

export const productsExect = () => {}