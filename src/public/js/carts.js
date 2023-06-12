const socket = io()

const cartLocal = localStorage.getItem('idCart')
const title = document.getElementById('title_cart')
const container = document.getElementById('product-container')

function resetData() {
  title.innerHTML = ' '
  container.innerHTML = ''
}
function cartInUse() {
  title.innerHTML += cartLocal
}
cartInUse()
function formCart() {
  const formCart = document.getElementById('form-cart')
  formCart.addEventListener('submit', (event) => {
    event.preventDefault()
    const newForm = new FormData(formCart)
    const cart = {
      _id: newForm.get('cart'),
    }
    socket.emit('searchCart', cart)
  })
}
formCart()
socket.on('cartFound', (response) => {
  if (response.code !== 200) {
    return Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Something went wrong!',
      showConfirmButton: false,
      timer: 1500,
    })
  }
  localStorage.setItem('idCart', response.data._id)
  title.innerHTML = 'PRODUCT LIST FROM CART : ' + response.data._id
  container.innerHTML = ''
  response.data.products.forEach((item) => {
    const newData = `<ul class='product-list'>
    <li class='product-item'>id: ${item.productId._id}</li>
<li class='product-item'>title: ${item.productId.title}</li>
<li class='product-item'>description: ${item.productId.description}</li>
<li class='product-item'>price: ${item.productId.price}</li>
<li class='product-item'>status: ${item.productId.status}</li>
<li class='product-item'>thumbnail: ${item.productId.thumbnail}</li>
<li class='product-item'>code: ${item.productId.code}</li>
<li class='product-item'>stock: ${item.productId.stock}</li>
<li class='button-item'>
<button class='delete-product' id='product-button' data-id='${item.productId._id}'>Delete</button>
<span class='addCart-button' id='product-button' >Quantity: ${item.quantity}</span>
</li>
</ul>`
    const tempContainer = document.createElement('div')
    tempContainer.innerHTML = newData
    container.append(tempContainer.firstChild)
  })
  assingDeleteProduct()
})
function assingCart() {
  const assigCart = document.querySelector('.assingCart')
  assigCart.addEventListener('click', (e) => {
    localStorage.removeItem('idCart')
    socket.emit('createNewCart')
  })
}
assingCart()

function assingDeleteProduct() {
  const deleteButtons = document.querySelectorAll('.delete-product')
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-id')
      socket.emit('deleteProductInCart', cartLocal, productId)
    })
  })
}

socket.on('cartCreated', (response) => {
  localStorage.setItem('idCart', response.data._id)
  resetData()
  title.innerHTML = 'PRODUCT LIST FROM CART : ' + response.data._id
})
function deleteCart() {
  const deleteCart = document.querySelector('.deleteCart')
  deleteCart.addEventListener('click', (e) => {
    socket.emit('deleteCart', cartLocal)
    localStorage.removeItem('idCart')
  })
}
deleteCart()
socket.on('updateDeleteCart', () => {
  resetData()
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Car deleted successfully!',
    showConfirmButton: false,
    timer: 1500,
  })
})
