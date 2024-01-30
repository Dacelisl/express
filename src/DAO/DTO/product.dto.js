class ProductDTO {
  constructor({dataProduct}) {
    this.title = dataProduct.title
    this.description = dataProduct.description
    this.category = dataProduct.category
    this.price = dataProduct.price
    this.thumbnail = dataProduct.thumbnail
    this.code = dataProduct.code
    this.stock = dataProduct.stock
    this.owner = dataProduct.owner
  }
}
export default ProductDTO
