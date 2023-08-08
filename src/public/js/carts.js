const port = 8080
let cartLocal = ''

const title = document.getElementById('title_cart')
const container = document.getElementById('product-container')

async function cartInUse() {
  try {
    const response = await fetch(`http://localhost:${port}/api/carts/current/cart`)
    cartLocal = await response.json()
    title.innerHTML = 'PRODUCT LIST FROM CART : ' + cartLocal
    searchCart(cartLocal)
  } catch (error) {
    throw new Error('Something went wrong!', error)
  }
}
cartInUse()

async function searchCart(cart) {
  try {
    const response = await fetch(`http://localhost:${port}/api/carts/${cart}`, {
      method: 'GET',
    })
    if (!response.ok) {
      throw new Error('Something went wrong!')
    }
    const cartProducts = await response.json()
    updateCart(cartProducts)
  } catch (error) {
    console.log('error', error)
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Something went wrong, car not found!',
      showConfirmButton: false,
      timer: 1500,
    })
  }
}

function formCart() {
  const formCart = document.getElementById('form-cart')
  if (formCart) {
    formCart.addEventListener('submit', (event) => {
      event.preventDefault()
      const newForm = new FormData(formCart)
      const cart = {
        _id: newForm.get('cart'),
      }
      searchCart(cart._id)
    })
  }
}
formCart()

async function purchase() {
  const ticket = document.querySelector('.purchase')
  try {
    if (ticket) {
      const userData = await fetch(`http://localhost:${port}/api/sessions/current`)
      const userSession = await userData.json()
      /* const cartToPurchase = await fetch(`http://localhost:${port}/api/carts/${userSession.cart}/purchase`, {
        method: 'PUT',
      }) */
      const cartToPurchase = await fetch(`http://localhost:8080/api/carts/64d133a9d80ee1946b5c62fc/purchase/`, {
        method: 'PUT',
      })
    

      ticket.addEventListener('click', (e) => {
        console.log('data de cart to purchase', cartToPurchase)
      })
    }
  } catch (error) {
    console.log('error en el purchase', error)
  }
}
purchase()

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
  if (assigCart) {
    assigCart.addEventListener('click', (e) => {
      createNewCart()
    })
  }
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
    const response = await fetch(`http://localhost:${port}/api/carts/${cartLocal}/products/${productId}`, {
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
    const response = await fetch(`http://localhost:${port}/api/carts/?updateCart=true'`, {
      method: 'GET',
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
  let cartLocal = cartId._id
  resetData()
  title.innerHTML = 'PRODUCT LIST FROM CART : ' + cartId._id
}
function deleteCart() {
  const deleteCart = document.querySelector('.deleteCart')
  if (deleteCart) {
    deleteCart.addEventListener('click', (e) => {
      cartDeleted(cartLocal)
      localStorage.removeItem('idCart')
    })
  }
}
deleteCart()
async function cartDeleted(cart) {
  try {
    const response = await fetch(`http://localhost:${port}/api/carts/${cart}`, {
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
function resetData() {
  title.innerHTML = ' '
  container.innerHTML = ''
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
