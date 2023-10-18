let currentCart = ''
const title = document.getElementById('title_cart')
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
  const tableBody = document.querySelector('#productTable tbody')
  tableBody.innerHTML = ''
  response.payload.products.forEach((item) => {
    const productData = item.productId
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
      <td>${productData.code}</td>
      <td>${productData.title}</td>
      <td>${productData.category}</td>
      <td>${productData.price}</td>
      <td>${item.quantity}</td>
      <td>
        <button class='delete-button delete-product ' id='product-button' data-id='${productData._id}'>Delete</button>
      </td>
    `
    tableBody.appendChild(newRow)
  })
  assingDeleteProduct()
}
function assingDeleteProduct() {
  const deleteButtons = document.querySelectorAll('.delete-product')
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-id')
      deleteProductInCart(currentCart, productId)
    })
  })
}
async function deleteProductInCart(cartId, productId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to create a new cart')
    }
    const newCart = await response.json()
    searchCart(newCart.payload._id)
  } catch (error) {
    throw new Error('Something went wrong!', error)
  }
}
async function searchCart(cart) {
  try {
    const response = await fetch(`/api/carts/${cart}`)
    if (!response.ok) throw new Error('Something went wrong!')
    const cartProducts = await response.json()
    if (cartProducts.payload.products.length > 0) {
      updateCart(cartProducts)
    }
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
async function purchase() {
  const ticket = document.querySelector('.purchase')
  try {
    if (ticket) {
      ticket.addEventListener('click', async (e) => {
        const response = await fetch(`/api/tickets/${currentCart}/purchase`, {
          method: 'PUT',
        })
        const dataPurchase = await response.json()
        sendMail(dataPurchase.payload.code)
        cartAfterPurchase()
      })
    }
  } catch (error) {
    throw new Error('Failed to purchase', error)
  }
}
async function sendMail(code) {
  try {
    const res = await fetch(`/mail/send/${code}`, {
      method: 'POST',
    })
    if (res.ok) {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'confirmation message has been sent',
        showConfirmButton: false,
        timer: 2000,
      })
    }
  } catch (error) {
    throw new Error('Failed to sendMail', error)
  }
}
async function cartAfterPurchase() {
  try {
    const cartData = await fetch(`/api/carts/${currentCart}`)
    const cartUpdate = await cartData.json()
    updateCart(cartUpdate)
  } catch (error) {
    throw new Error('Failed to purchase', error)
  }
}
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(`/api/carts/current/cart`)
    currentCart = await response.json()
    title.innerHTML = 'PRODUCT LIST FROM CART : ' + currentCart
    searchCart(currentCart)
    formCart()
    purchase()
  } catch (error) {
    throw new Error('Something went wrong! cart Server', error)
  }
})
