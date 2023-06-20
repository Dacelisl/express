let cartLocal = localStorage.getItem('idCart')

function message() {
  document.addEventListener('DOMContentLoaded', () => {
    const alertElement = document.querySelector('.alert')
    if (alertElement) {
      setTimeout(() => {
        alertElement.remove()
      }, 3000)
    }
  })
}
message()

// addProduct
function formProduct() {
  const path = window.location.pathname
  if (path !== '/realTimeProducts/') return
  const formProduct = document.getElementById('form-product')
  formProduct.addEventListener('submit', async (event) => {
    event.preventDefault()
    const newForm = new FormData(formProduct)
    const product = {
      title: newForm.get('title'),
      description: newForm.get('description'),
      category: newForm.get('category'),
      price: parseInt(newForm.get('price')),
      thumbnail: newForm.get('thumbnail'),
      code: newForm.get('code'),
      stock: newForm.get('stock'),
    }
    try {
      const response = await fetch('http://localhost:8080/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
      const newProduct = await response.json()
      loadProduct(newProduct.data)
    } catch (error) {
      throw new Error('Failed', error)
    }
  })
}
formProduct()

async function productToCart() {
  const addButtons = document.querySelectorAll('.addCart-button')
  addButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const productId = event.target.getAttribute('data-id')
      try {
        const response = await fetch(`http://localhost:8080/api/carts/${cartLocal}/product/${productId}`, {
          method: 'POST',
        })
        if (response.ok) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your product has been added to the cart',
            showConfirmButton: false,
            timer: 1500,
          })
          AssingDeleteEvent()
        } else {
          throw new Error('Failed', response.status)
        }
      } catch (error) {
        throw new Error('Failed', error)
      }
    })
  })
}
productToCart()

function loadProduct(response) {
  const container = document.getElementById('product-container')
  container.innerHTML = ''
  response.forEach((item) => {
    const newData = `<ul class='product-list'>
    <li class='product-item'>id: ${item._id}</li>
<li class='product-item'>title: ${item.title}</li>
<li class='product-item'>description: ${item.description}</li>
<li class='product-item'>category: ${item.category}</li>
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
}
function updateFooter(response) {
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
}
function AssingDeleteEvent() {
  const deleteButtons = document.querySelectorAll('.delete-button')
  deleteButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const productId = event.target.getAttribute('data-id')
      await deleteProduct(productId)
    })
  })
}
AssingDeleteEvent()
async function deleteProduct(productId) {
  try {
    const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete product')
    }
    updateProducts()
  } catch (error) {
    throw new Error('Failed', error)
  }
}
async function updateProducts() {
  try {
    const response = await fetch('http://localhost:8080/api/products/?limit=10&isUpdating=true')
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    const data = await response.json()
    loadProduct(data.payload)
  } catch (error) {
    throw new Error('Failed to update product', error)
  }
}

function searchProductByCategory() {
  const path = window.location.pathname
  const search = document.querySelector('.input-search')
  const buttonSearch = document.querySelector('.button-search')
  if (path !== '/realTimeProducts/') return
  buttonSearch.addEventListener('click', async (e) => {
    const category = search.value.charAt(0).toUpperCase() + search.value.slice(1)
    try {
      const productsByCategory = await searchProductByCategoryAPI(category)
      loadProduct(productsByCategory.payload)
      updateFooter(productsByCategory)
    } catch (error) {
      throw new Error('Error searching products by category:', error)
    }
    search.value = ''
  })
}
searchProductByCategory()
async function searchProductByCategoryAPI(category) {
  const query = 'category:' + category
  const response = await fetch(`http://localhost:8080/api/products?query=${query}&isUpdating=true`)
  if (!response.ok) {
    throw new Error('Failed to search products by category')
  }
  const data = await response.json()
  return data
}