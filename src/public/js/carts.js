const socket = io()
const formCart = document.getElementById('form-cart')
formCart.addEventListener('submit', (event) => {
  event.preventDefault()
  const newForm = new FormData(formCart)
  const cart = {
    _id: newForm.get('cart'),
  }
  socket.emit('searchCart', cart)
})
socket.on('cartFound', (response) => {
  const container = document.getElementById('product-container')
  container.innerHTML = ''
  response.forEach((item) => {
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
<span class='delete-button' id='product-button' >Quantity: ${item.quantity}</span>
</li>
</ul>`
    const tempContainer = document.createElement('div')
    tempContainer.innerHTML = newData
    container.append(tempContainer.firstChild)
  })
})