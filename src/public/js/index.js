const port = 8080

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

async function productToCart() {
  const addButtons = document.querySelectorAll('.addCart-button')
  try {
    const response = await fetch(`http://localhost:${port}/api/sessions/current`)
    const userLocal = await response.json()
    if (userLocal.rol === 'admin') {
      return Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'login as a user to buy!',
        showConfirmButton: true,
        timer: 4000,
      })
    }
    addButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        try {
          const productId = event.target.getAttribute('data-id')
          const response = await fetch(`http://localhost:${port}/api/carts/${userLocal.cart}/product/${productId}`, {
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
  } catch (error) {
    throw new Error('server error', error)
  }
}
productToCart()

function loadProduct(response) {
  const container = document.getElementById('product-container')
  container.innerHTML = ''
  response.payload.forEach((item) => {
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
        ${
          response.session.isAdmin
            ? `<button class='delete-button' id='product-button' data-id='${item._id}'>Delete</button> 
        <button class='update-button' id='product-button' data-id='${item._id}'>Update</button>`
            : `<button class='addCart-button' id='product-button' data-id='${item._id}'>Add To Cart</button>`
        }
      
      </li>
</ul>`
    const tempContainer = document.createElement('div')
    tempContainer.innerHTML = newData
    container.append(tempContainer.firstChild)
  })
  AssingDeleteEvent()
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
    const response = await fetch(`http://localhost:${port}/api/products/${productId}`, {
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
    const response = await fetch(`http://localhost:${port}/api/products/?limit=10&isUpdating=true`)
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    const data = await response.json()
    loadProduct(data)
  } catch (error) {
    throw new Error('Failed to update product', error)
  }
}

function searchProductByCategory() {
  const search = document.querySelector('.input-search')
  const buttonSearch = document.querySelector('.button-search')
  if (search && buttonSearch) {
    buttonSearch.addEventListener('click', async (e) => {
      const category = search.value.charAt(0).toUpperCase() + search.value.slice(1)
      try {
        const productsByCategory = await searchProductByCategoryAPI(category)
        loadProduct(productsByCategory)
        updateFooter(productsByCategory)
      } catch (error) {
        throw new Error('Error searching products by category:', error)
      }
      search.value = ''
    })
  }
}
searchProductByCategory()
async function searchProductByCategoryAPI(category) {
  const query = 'category:' + category
  const response = await fetch(`http://localhost:${port}/api/products?query=${query}&isUpdating=true`)
  if (!response.ok) {
    throw new Error('Failed to search products by category')
  }
  const data = await response.json()
  return data
}
