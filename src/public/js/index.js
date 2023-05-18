const socket = io()

/* addProduct */
const formProduct = document.getElementById('form-product')
formProduct.addEventListener('submit', (event) => {
  event.preventDefault()
  const newForm = new FormData(formProduct)
  const product = {
    title: newForm.get('title'),
    description: newForm.get('description'),
    price: newForm.get('price'),
    thumbnail: newForm.get('thumbnail'),
    code: newForm.get('code'),
    stock: newForm.get('stock'),
  }
  socket.emit('addProduct', product)
})

/* deleteProduct */
function AssingDeleteEvent() {
  const deleteButtons = document.querySelectorAll('.delete-button')
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-id')
      socket.emit('deleteProduct', parseInt(productId))
    })
  })
}
AssingDeleteEvent()

socket.on('updateProducts', (response) => {
  const container = document.getElementById('product-container')
  container.innerHTML = ''
  response.forEach((item) => {
    const newData = `<ul class='product-list'>
    <li class='product-item'>id: ${item.id}</li>
<li class='product-item'>title: ${item.title}</li>
<li class='product-item'>description: ${item.description}</li>
<li class='product-item'>price: ${item.price}</li>
<li class='product-item'>status: ${item.status}</li>
<li class='product-item'>thumbnail: ${item.thumbnail}</li>
<li class='product-item'>code: ${item.code}</li>
<li class='product-item'>stock: ${item.stock}</li>
<li class='button-item'>
<button class='delete-button' data-id='${item.id}'>Delete</button>
</li>
</ul>`
    const tempContainer = document.createElement('div')
    tempContainer.innerHTML = newData
    container.append(tempContainer.firstChild)
  })
  AssingDeleteEvent()
})
