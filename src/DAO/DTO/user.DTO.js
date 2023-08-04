class UserDTO {
  constructor(dataUser) {
    this.email = dataUser.email
    this.firstName = dataUser.firstName
    this.lastName = dataUser.lastName
    this.rol = dataUser.rol
    this.password = dataUser.password
    this.age = dataUser.age
    this.cart = dataUser.cart
  }
}
export default UserDTO
