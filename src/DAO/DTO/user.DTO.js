import { formatDate } from '../../utils/utils.js'

class UserDTO {
  constructor(user) {
    this.id = user._id
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.dni = user.dni
    this.phone = `+${user.phone.toString().slice(0, 2)} ${user.phone.toString().slice(2)}`
    this.address = user.address
    this.email = user.email
    this.dateBirthday = formatDate(user.dateBirthday)
    this.photo = user.photo
    this.serviceHistory = this.mapServiceHistory(user.serviceHistory)
    this.shopping = this.mapShopping(user.shopping)
  }

  mapServiceHistory(serviceHistory) {
    return Array.isArray(serviceHistory)
      ? serviceHistory.map((entry) => ({
          stylist: this.mapEmployee(entry.stylist),
          service: this.mapService(entry.service),
          price: entry.price,
          dateService: formatDate(entry.dateService),
          observations: entry.observations,
        }))
      : []
  }

  mapShopping(shopping) {
    return Array.isArray(shopping)
      ? shopping.map((entry) => ({
          products: this.mapProducts(entry.products),
          dateShopping: formatDate(entry.dateShopping),
          employee: this.mapEmployee(entry.employee),
          observations: entry.observations,
        }))
      : []
  }

  mapProducts(products) {
    return Array.isArray(products)
      ? products.map((productEntry) => ({
          product: this.mapProduct(productEntry.product),
          quantity: productEntry.quantity,
        }))
      : []
  }

  mapEmployee(employee) {
    return {
      firstName: employee.firstName,
      lastName: employee.lastName,
    }
  }

  mapService(service) {
    return {
      name: service.name,
      description: service.description,
    }
  }

  mapProduct(product) {
    return {
      name: product.name,
      price: product.price,
    }
  }
}

export { UserDTO }
