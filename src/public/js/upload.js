document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('upload-form')
  const fileInput = document.getElementById('file-input')
  const imageTypeSelect = document.getElementById('image-type')

  async function uploadFile(file, imageType) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('imageType', imageType)
    try {
      const session = await fetch(`/api/sessions/current`)
      const userLocal = await session.json()
      console.log('datos del form', formData.get('file'));
      console.log('datos del form', formData.get('imageType'));
      const response = await fetch(`/api/session/${userLocal._id}/documents`, {
        method: 'POST',
        body: formData,
      })
      console.log('data en server', response)
    } catch (error) {
      console.log('errores', error)
    }
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const file = fileInput.files[0]
    const imageType = imageTypeSelect.value
    if (file) {
      uploadFile(file, imageType).then((message) => {
        console.log('res del server ', message)
      })
    }
  })
})
