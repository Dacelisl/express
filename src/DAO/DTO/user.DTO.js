class UserDTO {
  constructor(dataUser) {
    this._id = dataUser._id
    this.email = dataUser.email
    this.firstName = dataUser.firstName
    this.lastName = dataUser.lastName
    this.rol = dataUser.rol
    this.password = dataUser.password
    this.age = dataUser.age
    this.cart = dataUser.cart
    this.documents = dataUser.documents
    this.lastConnection = dataUser.lastConnection
  }
}
export default UserDTO
