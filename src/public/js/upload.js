document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('upload-form')
  const fileInput = document.getElementById('file-input')
  const imageTypeSelect = document.getElementById('image-type')

  async function uploadFile(file, imageType) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('imageType', imageType)
    const headers = new Headers()
    headers.append('X-Tipo-Archivo', imageType)
    try {
      const session = await fetch(`/api/users/current`)
      const userLocal = await session.json()
      const response = await fetch(`/api/users/${userLocal._id}/documents`, {
        method: 'POST',
        body: formData,
        headers: headers,
      })
      return response
    } catch (error) {
      throw new Error('Failed to uploadFile', error)
    }
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const file = fileInput.files[0]
    const imageType = imageTypeSelect.value
    if (file) {
      uploadFile(file, imageType).then((message) => {
        if (message.ok) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'The image was uploaded successfully',
            showConfirmButton: false,
            timer: 1500,
          })
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Something went wrong!',
            showConfirmButton: false,
            timer: 1500,
          })
        }
      })
    }
  })
})
