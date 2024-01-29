import { formatDate, formatPercentage, formatCurrency } from '../../utils/utils.js'
export class ProductDTO {
  constructor(product) {
    this.id = product._id
    this.name = product.name
    this.description = product.description
    this.category = product.category
    this.price = formatCurrency(product.price)
    this.thumbnail = product.thumbnail
    this.code = product.code
    this.provider = product.provider
    this.stock = product.stock
    this.dateCreation = formatDate(product.dateCreation)
    this.profitPercentage = formatPercentage(product.profitPercentage)
  }
}
