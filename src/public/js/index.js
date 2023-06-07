const socket = io()

// addProduct
const formProduct = document.getElementById('form-product')
formProduct.addEventListener('submit', (event) => {
  event.preventDefault()
  const newForm = new FormData(formProduct)
  const product = {
    title: newForm.get('title'),
    description: newForm.get('description'),
    price: parseInt(newForm.get('price')),
    thumbnail: newForm.get('thumbnail'),
    code: newForm.get('code'),
    stock: newForm.get('stock'),
  }
  socket.emit('addProduct', product)
})
//Add Product to Cart
function productToCart() {
  const addButtons = document.querySelectorAll('.addCart-button')
  addButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-id')
      socket.emit('productToCart', productId)
    })
  })
}
productToCart()
socket.on('updateCart', () => {
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Your product has been added to the cart',
    showConfirmButton: false,
    timer: 1500,
  })
  AssingDeleteEvent()
})
//deleteProduct
function AssingDeleteEvent() {
  const deleteButtons = document.querySelectorAll('.delete-button')
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-id')
      socket.emit('deleteProduct', productId)
    })
  })
}
AssingDeleteEvent()