const socket = io()

const cartLocal = localStorage.getItem('idCart')

// addProduct
function formProduct() {
  const path = window.location.pathname
  if (path !== '/realTimeProducts/') return
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
}
formProduct()

//Add Product to Cart
function productToCart() {
  const addButtons = document.querySelectorAll('.addCart-button')
  addButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-id')
      socket.emit('productToCart',cartLocal, productId)
    })
  })
}
productToCart()

socket.on('updateProducts', (response) => {
  const container = document.getElementById('product-container')
  container.innerHTML = ''
  response.forEach((item) => {
    const newData = `<ul class='product-list'>
    <li class='product-item'>id: ${item._id}</li>
<li class='product-item'>title: ${item.title}</li>
<li class='product-item'>description: ${item.description}</li>
<li class='product-item'>price: ${item.price}</li>
<li class='product-item'>status: ${item.status}</li>
<li class='product-item'>thumbnail: ${item.thumbnail}</li>
<li class='product-item'>code: ${item.code}</li>
<li class='product-item'>stock: ${item.stock}</li>
<li class='button-item'>
        <button class='delete-button' id='product-button' data-id='${item._id}'>Delete</button>
      <button class='addCart-button' id='product-button' data-id='${item._id}'>Add To Cart</button>
      </li>
</ul>`
    const tempContainer = document.createElement('div')
    tempContainer.innerHTML = newData
    container.append(tempContainer.firstChild)
  })
  AssingDeleteEvent()
  productToCart()
})
socket.on('loadProduct', (response) => {
  const container = document.getElementById('product-container')
  container.innerHTML = ''
  const newData = `<ul class='product-list'>
    <li class='product-item'>id: ${response._id}</li>
<li class='product-item'>title: ${response.title}</li>
<li class='product-item'>description: ${response.description}</li>
<li class='product-item'>price: ${response.price}</li>
<li class='product-item'>status: ${response.status}</li>
<li class='product-item'>thumbnail: ${response.thumbnail}</li>
<li class='product-item'>code: ${response.code}</li>
<li class='product-item'>stock: ${response.stock}</li>
<li class='button-item'>
        <button class='delete-button' id='product-button' data-id='${response._id}'>Delete</button>
      <button class='addCart-button' id='product-button' data-id='${response._id}'>Add To Cart</button>
      </li>
</ul>`
  const tempContainer = document.createElement('div')
  tempContainer.innerHTML = newData
  container.append(tempContainer.firstChild)

  AssingDeleteEvent()
  productToCart()
})

socket.on('updateFooter', (response) => {
  const path = window.location.pathname
  const urlNext = response.nextLink
  const urlPrev = response.prevLink
  const container = document.querySelector('.footer')
  container.innerHTML = ''
  const newData = `
    <footer class='footer'>
      <ul class='pagination'>
        ${response.hasPrevPage ? `<li><a href='${urlPrev.replace('undefined', path)}'>Anterior</a></li>` : ''}
        <li><a>Page: ${response.page} of ${response.totalPages}</a></li>
        ${response.hasNextPage ? `<li><a href='${urlNext.replace('undefined', path)}'>Siguiente</a></li>` : ''}
      </ul>
    </footer>`
  container.innerHTML = newData
})

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

function searchProductByCategory() {
  const search = document.querySelector('.input-search')
  const buttonSearch = document.querySelector('.button-search')
  buttonSearch.addEventListener('click', (e) => {
    const category = search.value.charAt(0).toUpperCase() + search.value.slice(1)
    socket.emit('searchProductByCategory', category)
    search.value = ''
  })
}
searchProductByCategory()
