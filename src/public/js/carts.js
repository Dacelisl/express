let cartLocal = ''
if (!cartLocal) {
  cartLocal = localStorage.getItem('idCart')
}
const title = document.getElementById('title_cart')
const container = document.getElementById('product-container')

function resetData() {
  title.innerHTML = ' '
  container.innerHTML = ''
}
function cartInUse() {
  if (cartLocal === null) return (cartLocal = '')
  if (cartLocal !== null) searchCart(cartLocal)
  title.innerHTML += cartLocal
}
async function searchCart(cart) {
  try {
    const response = await fetch(`http://localhost:8080/api/carts/${cart}`)
    if (!response.ok) {
      throw new Error('Something went wrong!')
    }
    const cartProducts = await response.json()
    updateCart(cartProducts)
  } catch (error) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Something went wrong, car not found!',
      showConfirmButton: false,
      timer: 1500,
    })
  }
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
    searchCart(cart._id)
  })
}
formCart()
function updateCart(response) {
  if (response.code !== 200) {
    return Swal.fire({
      position: 'center',
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
<li class='product-item'>category: ${item.productId.category}</li>
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
}

function assingCart() {
  const assigCart = document.querySelector('.assingCart')
  assigCart.addEventListener('click', (e) => {
    localStorage.removeItem('idCart')
    createNewCart()
  })
}
assingCart()

function assingDeleteProduct() {
  const deleteButtons = document.querySelectorAll('.delete-product')
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-id')
      deleteProductInCart(cartLocal, productId)
    })
  })
}

async function deleteProductInCart(cartLocal, productId) {
  try {
    const response = await fetch(`http://localhost:8080/api/carts/${cartLocal}/products/${productId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to create a new cart')
    }
    const newCart = await response.json()
    searchCart(newCart.data._id)
  } catch (error) {
    throw new Error('Something went wrong!', error)
  }
}
async function createNewCart() {
  try {
    const response = await fetch(`http://localhost:8080/api/carts/`, {
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Failed to create a new cart')
    }
    const newCart = await response.json()
    cartCreated(newCart.data)
  } catch (error) {
    throw new Error('Something went wrong!', error)
  }
}

function cartCreated(cartId) {
  localStorage.setItem('idCart', cartId._id)
  resetData()
  title.innerHTML = 'PRODUCT LIST FROM CART : ' + cartId._id
}

function deleteCart() {
  const deleteCart = document.querySelector('.deleteCart')
  deleteCart.addEventListener('click', (e) => {
    cartDeleted(cartLocal)
    localStorage.removeItem('idCart')
  })
}
deleteCart()

async function cartDeleted(cart) {
  try {
    const response = await fetch(`http://localhost:8080/api/carts/${cart}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to create a new cart')
    }
    updateDeleteCart()
  } catch (error) {
    throw new Error('Something went wrong!', error)
  }
}

function updateDeleteCart() {
  resetData()
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Car deleted successfully!',
    showConfirmButton: false,
    timer: 1500,
  })
}
